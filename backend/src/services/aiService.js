import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory rate limiter: userId → {count, resetTime}
const rateLimitMap = new Map();

// Rate limit: 5 calls/min per user
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 5;

export const analyzeQuery = async (userId, query, sampleData = []) => {
  const startTime = Date.now();
  
  // Rate limiting
  const now = Date.now();
  const userKey = `ai:${userId}`;
  let userRate = rateLimitMap.get(userKey) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userRate.resetTime) {
    userRate.count = 0;
    userRate.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userRate.count >= RATE_LIMIT_MAX) {
    console.log(`⏱️ Rate limit exceeded for user ${userId}`);
    throw new Error('Rate limit: 5 AI queries/minute. Try again soon.');
  }
  
  userRate.count += 1;
  rateLimitMap.set(userKey, userRate);
  
  console.log(`🤖 AI Query #${userRate.count}/${RATE_LIMIT_MAX} for user ${userId}: "${query}"`);
  
  try {
    // Single comprehensive prompt
    const systemPrompt = `You are a data analyst AI. Analyze CSV data and respond with EXACT JSON.

MANDATORY JSON FORMAT (no other text):
{
  "query": {
    "operation": "top|trend|sum|average|compare",
    "column": "field_name",
    "metric": "sales|revenue|profit|count", 
    "limit": 5,
    "groupBy": "optional"
  },
  "insight": "1-sentence insight with numbers (max 100 chars)"
}

SUPPORTED OPERATIONS:
- top: Top N by metric
- trend: Time series by month/week  
- sum: Total by category
- average: AVG by group
- compare: Group comparison

Infer from sample data columns: ${JSON.stringify(Object.keys(sampleData[0] || {}))}
Common fields: product, region, date, sales, revenue, profit, quantity

EXAMPLES:
User: "top products" 
→ {"query":{"operation":"top","column":"product","metric":"sales","limit":5},"insight":"Top 5 products account for 78% of total sales"}

User: "sales trend"  
→ {"query":{"operation":"trend","groupBy":"month","metric":"sales"},"insight":"Sales peaked in Q4 with 35% growth"}

User query: "${query}"

Sample data (first row): ${JSON.stringify(sampleData[0] || {})}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Query: "${query}"\nSample data available.` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 200,
    });

    const jsonStr = completion.choices[0].message.content.trim();
    const response = JSON.parse(jsonStr);

    // Validate structure
    if (!response.query?.operation || !response.query?.column || !response.insight) {
      throw new Error('Invalid AI response structure');
    }

    const duration = Date.now() - startTime;
    console.log(`✅ AI success (${duration}ms): ${response.insight.substring(0, 50)}...`);

    return {
      success: true,
      aiResponse: response,
      usedAI: true,
      duration
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ AI failed (${duration}ms):`, error.code || error.message);
    
    if (error.code === 'insufficient_quota' || error.status === 429) {
      console.log('🔄 Using quota fallback');
    }

    // Graceful fallback
    const fallback = await generateFallbackAnalysis(query, sampleData);
    
    return {
      success: true,
      aiResponse: fallback,
      usedAI: false,
      error: error.message,
      duration,
      fallbackUsed: true
    };
  }
};

/**
 * Rule-based fallback when AI quota exceeded
 */
const generateFallbackAnalysis = async (query, sampleData) => {
  const lowerQuery = query.toLowerCase().trim();
  const columns = sampleData.length > 0 ? Object.keys(sampleData[0]) : [];
  
  console.log('🔄 Fallback analysis for:', lowerQuery);
  
  let structuredQuery;
  
  // Pattern matching
  if (lowerQuery.includes('top') || lowerQuery.includes('best') || lowerQuery.includes('highest')) {
    const metricCol = inferMetric(lowerQuery, columns) || 'sales';
    structuredQuery = {
      operation: 'top',
      column: inferColumn(lowerQuery, columns) || columns[0] || 'name',
      metric: metricCol,
      limit: 5
    };
  } else if (lowerQuery.includes('trend') || lowerQuery.includes('time') || lowerQuery.includes('month')) {
    structuredQuery = {
      operation: 'trend',
      groupBy: 'month',
      metric: 'sales'
    };
  } else if (lowerQuery.includes('sum') || lowerQuery.includes('total')) {
    structuredQuery = {
      operation: 'sum',
      column: columns[1] || 'category',
      metric: columns[2] || 'revenue'
    };
  } else {
    // Default
    structuredQuery = {
      operation: 'top',
      column: columns[0] || 'product',
      metric: 'sales',
      limit: 5
    };
  }
  
  const insight = generateFallbackInsight(structuredQuery, columns);
  
  console.log('✅ Fallback generated:', insight.substring(0, 50) + '...');
  
  return {
    query: structuredQuery,
    insight
  };
};

const inferColumn = (query, columns) => {
  const patterns = {
    product: ['product', 'item', 'name', 'sku'],
    region: ['region', 'store', 'location', 'city'],
    time: ['date', 'month', 'year']
  };
  
  for (const [type, cands] of Object.entries(patterns)) {
    for (const cand of cands) {
      if (query.includes(cand)) return cand;
    }
  }
  
  return columns[0];
};

const inferMetric = (query, columns) => {
  const patterns = ['sales', 'revenue', 'profit', 'amount', 'price'];
  for (const pattern of patterns) {
    if (query.includes(pattern)) return pattern;
  }
  return columns.find(col => ['sales', 'revenue', 'profit'].some(p => col.toLowerCase().includes(p))) || 'sales';
};

const generateFallbackInsight = (query, columns) => {
  const { operation, column, metric } = query;
  
  const insights = {
    top: `Top 5 ${column}s by ${metric} performance.`,
    trend: `Trend analysis by ${metric} over time.`,
    sum: `Total ${metric} summary by ${column}.`,
    average: `Average ${metric} analysis by ${column}.`
  };
  
  return insights[operation] || `Analysis of ${column} and ${metric}.`;
};

console.log('🤖 Production AI Service ready (quota-safe, rate-limited)');

