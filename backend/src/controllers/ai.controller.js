import { analyzeQuery } from '../services/aiService.js';
import { processQuery, getColumns, formatForCharts } from '../utils/dataProcessor.js';
import { Dataset } from '../models/dataset.model.js';

/**
 * AI-Powered Natural Language Query Endpoint
 * Flow: natural text → OpenAI structured JSON → dataProcessor → insights
 */
export const queryDatasetAI = async (req, res) => {
  const startTime = Date.now();
// console.log('🚀 AI Query START:', { datasetId: req.params.datasetId, query: req.body.query?.substring(0,50), userId: req.user?.id });

  
  try {
    const { datasetId } = req.params;
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return res.status(400).json({ 
        error: 'Query must be a string with 3+ characters', 
        success: false 
      });
    }

    // 1. Fetch dataset
    // console.log('📂 Fetching dataset:', datasetId);
    const dataset = await Dataset.findById(datasetId).lean();
    // console.log('✅ Dataset found:', !!dataset, dataset?._id, 'rows:', dataset?.rowCount || 0);
    
    if (!dataset) {
      // console.error('❌ Dataset NOT found:', datasetId);
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    const records = dataset.records || [];
    // console.log('📊 Records loaded:', records.length, 'first record keys:', records[0] ? Object.keys(records[0]).slice(0,3) : 'empty');
    
    if (records.length === 0) {
      // console.warn('⚠️ Dataset empty');
      return res.status(400).json({ error: 'Dataset is empty', success: false });
    }

  // Sample data for AI context
  const sampleData = records.slice(0, 3);
  // console.log('🤖 Calling AI service with sampleData length:', sampleData.length);

  // Single AI service call (handles quota/rate-limit internally)
  const aiResult = await analyzeQuery(req.user?.id || 'anonymous', query.trim(), sampleData);
  
  // Extract structured query (always valid)
  const structuredQuery = aiResult.aiResponse.query;
  
  // Execute query
  const queryResult = processQuery(records, structuredQuery);
  
  if (!queryResult.success) {
    return res.status(200).json({
      success: true,
      datasetId: dataset._id,
      fallback: true,
      chartData: [],
      insight: 'Data processing failed. Try "top sales".',
      rawData: [],
      structuredQuery,
      metadata: { rowCount: records.length }
    });
  }

  // Format for charts
  const chartData = formatForCharts(queryResult.data, structuredQuery.operation);
  const insight = aiResult.aiResponse.insight;

  const duration = Date.now() - startTime;
  console.log(`📊 AI Query success (${duration}ms): fallback=${!aiResult.usedAI}`);

  res.status(200).json({
    success: true,
    datasetId: dataset._id,
    fileName: dataset.fileName,
    query: query.trim(),
    structuredQuery,
    chartData,
    insight,
    rawData: queryResult.data.slice(0, 50),
    usedAI: aiResult.usedAI,
    aiFallback: !aiResult.usedAI,
    metadata: {
      rowCount: records.length,
      processedRows: queryResult.data.length,
      aiDuration: aiResult.duration
    }
  });

  } catch (error) {
    console.error('💥 AI Controller CRASH DETAILS:', {
      datasetId: req.params.datasetId,
      userId: req.user?.id,
      error: error.message,
      stack: error.stack?.split('\n').slice(0,5),
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'AI processing failed', 
      details: error.message,
      success: false 
    });
  }
};

/**
 * Format data for Recharts (handles different operation types)
 */
const formatChartData = (data, structuredQuery) => {
  if (!data || data.length === 0) {
    return [];
  }

  // Handle grouped/top-N data (object → array)
  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([label, metrics]) => {
      const row = { name: label };
      
      // Extract numeric metrics for chart
      Object.entries(metrics).forEach(([metricKey, value]) => {
        if (typeof value === 'number') {
          const cleanKey = metricKey.replace(/^(sum|avg|count)_(.*)/, '$2');
          row[cleanKey] = Math.round(value * 100) / 100;  // Round to 2 decimals
        }
      });
      
      return row;
    });
  }

  // Handle flat array (trends, raw data)
  if (Array.isArray(data)) {
    return data.map(row => {
      const formatted = { name: row.name || row[Object.keys(row)[0]] || 'Unknown' };
      
      Object.entries(row).forEach(([key, value]) => {
        if (typeof value === 'number') {
          formatted[key] = Math.round(value * 100) / 100;
        }
      });
      
      return formatted;
    });
  }

  return [];
};

