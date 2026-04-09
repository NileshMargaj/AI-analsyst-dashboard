/**
 * DATA PROCESSOR API DOCUMENTATION
 * 
 * Complete guide to using the dataProcessor utility module
 */

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================
/*
 * 1. Overview & Features
 * 2. Setup & Installation
 * 3. Core Functions Reference
 *    - Type Detection
 *    - Column & Row Extraction
 *    - Filtering
 *    - Grouping
 *    - Sorting
 *    - Metrics
 *    - Advanced Analysis
 *    - Query Processing
 *    - Utilities
 * 4. Integration Patterns
 * 5. Error Handling
 * 6. Performance Tips
 * 7. Common Use Cases
 */

// ============================================================================
// 1. OVERVIEW & FEATURES
// ============================================================================

/*
DATA PROCESSOR UTILITY - Overview

The dataProcessor module is a production-grade utility for CSV data analysis
with ZERO external dependencies.

Key Features:
✓ Fully dynamic - works with ANY CSV structure (no hard-coded columns)
✓ Automatic type detection (number, string, date, boolean)
✓ Safe null/undefined handling
✓ Composable functions for building complex queries
✓ ES6+ with arrow functions
✓ Optimized array processing
✓ 20+ utility functions covering all analytics needs

Supported Operations:
- Data extraction (columns, rows, schema)
- Filtering (single & multiple with 8+ operators)
- Grouping (single & multiple-level)
- Sorting (ascending/descending, multi-field)
- Aggregation (sum, avg, min, max, count, distinct)
- Analysis (grouped statistics, custom metrics)
- Complex queries (combined operations)
- Pagination & utilities (summarize, fill missing, get unique)
*/

// ============================================================================
// 2. SETUP & INSTALLATION
// ============================================================================

/*
SETUP INSTRUCTIONS

1. File Location:
   Place dataProcessor.js in: backend/src/utils/

2. Import the module:
   
   import {
       getColumns,
       filterData,
       analyzeData,
       processQuery
   } from '../utils/dataProcessor.js';

3. Prepare your CSV data:
   Parse CSV first using a CSV library, then pass the array of objects:
   
   [
       { name: "Alice", department: "IT", salary: 50000 },
       { name: "Bob", department: "HR", salary: 40000 }
   ]

4. Start using:
   
   const columns = getColumns(data);
   const filtered = filterData(data, 'department', '=', 'IT');
   const analysis = analyzeData(data, 'department', 'salary');
*/

// ============================================================================
// 3. CORE FUNCTIONS REFERENCE
// ============================================================================

// ============================================================================
// 3.1 TYPE DETECTION FUNCTIONS
// ============================================================================

/*
detectType(value)
├─ Purpose: Automatically detect the data type of a value
├─ Input: Any value
├─ Returns: 'number' | 'string' | 'date' | 'boolean'
├─ Features:
│  • Auto-converts strings that look like numbers
│  • Recognizes date formats (YYYY-MM-DD, MM/DD/YYYY)
│  • Handles null/undefined gracefully
└─ Example:
   detectType('50000')        // 'number'
   detectType('2023-01-15')   // 'date'
   detectType('hello')        // 'string'

convertToType(value)
├─ Purpose: Convert value to its detected type
├─ Input: Any value
├─ Returns: Converted value in appropriate type
├─ Example:
   convertToType('50000')  // 50000 (number)
   convertToType('true')   // true (boolean)

isValidValue(value)
├─ Purpose: Check if a value is valid (not null/undefined/empty)
├─ Input: Any value
├─ Returns: boolean
├─ Example:
   isValidValue(null)      // false
   isValidValue('')        // false
   isValidValue(0)         // true (0 is valid)

getSchema(data)
├─ Purpose: Get data schema with detected types for all columns
├─ Input: Array of objects
├─ Returns: Object mapping { column: type, ... }
├─ Example:
   getSchema([{id: 1, name: 'John', salary: 50000}])
   // Returns: { id: 'number', name: 'string', salary: 'number' }
*/

// ============================================================================
// 3.2 COLUMN & ROW EXTRACTION
// ============================================================================

/*
getColumns(data)
├─ Purpose: Extract all column names from dataset
├─ Input: Array of objects
├─ Returns: Array of column names
├─ Key Feature: Handles sparse data (columns only in some rows)
├─ Example:
   const cols = getColumns([
       { id: 1, name: 'Alice', salary: 50000 },
       { id: 2, email: 'bob@example.com' }
   ]);
   // Returns: ['id', 'name', 'salary', 'email']

getRows(data)
├─ Purpose: Extract valid rows (filter out non-objects)
├─ Input: Array of objects
├─ Returns: Array of valid row objects
├─ Example:
   const rows = getRows([{id: 1}, null, {id: 2}, 'invalid']);
   // Returns: [{id: 1}, {id: 2}]
*/

// ============================================================================
// 3.3 FILTERING
// ============================================================================

/*
filterData(data, field, operator, value)
├─ Purpose: Filter rows based on field comparison
├─ Input:
│  • data: Array of objects
│  • field: Column name (string)
│  • operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'starts_with' | 'ends_with'
│  • value: Comparison value
├─ Returns: Filtered array
├─ Operators Details:
│  • '=': Exact match (loose comparison)
│  • '!=': Not equal
│  • '>': Greater than (numeric)
│  • '<': Less than (numeric)
│  • 'contains': Case-insensitive substring match
│  • 'starts_with': Case-insensitive prefix match
│  • 'ends_with': Case-insensitive suffix match
├─ Examples:
   filterData(data, 'salary', '>', 50000)
   filterData(data, 'status', '=', 'active')
   filterData(data, 'email', 'contains', '@gmail.com')

applyMultipleFilters(data, filters)
├─ Purpose: Apply multiple filters AND them together
├─ Input:
│  • data: Array of objects
│  • filters: Array of { field, operator, value }
├─ Returns: Filtered array
├─ Example:
   applyMultipleFilters(data, [
       { field: 'department', operator: '=', value: 'IT' },
       { field: 'salary', operator: '>', value: 50000 },
       { field: 'status', operator: '=', value: 'active' }
   ])
*/

// ============================================================================
// 3.4 GROUPING
// ============================================================================

/*
groupBy(data, field)
├─ Purpose: Group rows by a specific field value
├─ Input:
│  • data: Array of objects
│  • field: Column to group by
├─ Returns: Object { groupValue: [rows], groupValue2: [rows], ... }
├─ Example:
   groupBy(employees, 'department')
   // Returns: {
   //   IT: [alice, charlie, eve],
   //   HR: [bob, frank],
   //   Sales: [diana, grace]
   // }

groupByMultiple(data, fields)
├─ Purpose: Group by multiple fields (creates nested structure)
├─ Input:
│  • data: Array of objects
│  • fields: Array of column names
├─ Returns: Nested object structure
├─ Example:
   groupByMultiple(employees, ['department', 'status'])
   // Returns: {
   //   IT: {
   //     active: [rows],
   //     inactive: [rows]
   //   },
   //   HR: { ... }
   // }
*/

// ============================================================================
// 3.5 SORTING
// ============================================================================

/*
sortData(data, field, order = 'asc')
├─ Purpose: Sort data by a field
├─ Input:
│  • data: Array of objects
│  • field: Column to sort by
│  • order: 'asc' | 'desc' (default: 'asc')
├─ Returns: New sorted array (original unchanged)
├─ Features:
│  • Smart sorting (numbers, strings, dates)
│  • Null/undefined values sorted to end
│  • Case-insensitive string sorting
├─ Examples:
   sortData(employees, 'salary', 'desc')
   sortData(employees, 'name', 'asc')

sortByMultiple(data, sortFields)
├─ Purpose: Sort by multiple fields with independent orders
├─ Input:
│  • data: Array of objects
│  • sortFields: Array of { field: string, order: 'asc'|'desc' }
├─ Returns: New sorted array
├─ Example:
   sortByMultiple(employees, [
       { field: 'department', order: 'asc' },
       { field: 'salary', order: 'desc' }
   ])
*/

// ============================================================================
// 3.6 METRICS & AGGREGATIONS
// ============================================================================

/*
sum(data, field)
├─ Purpose: Calculate sum of a numeric field
├─ Returns: number
├─ Example: sum(employees, 'salary') // 340000

average(data, field)
├─ Purpose: Calculate average of a numeric field
├─ Returns: number
├─ Example: average(employees, 'salary') // 42500

min(data, field)
├─ Purpose: Find minimum value in a field
├─ Returns: The minimum value
├─ Example: min(employees, 'salary') // 40000

max(data, field)
├─ Purpose: Find maximum value in a field
├─ Returns: The maximum value
├─ Example: max(employees, 'salary') // 60000

count(data)
├─ Purpose: Count total rows
├─ Returns: number
├─ Example: count(employees) // 8

countDistinct(data, field)
├─ Purpose: Count unique values in a field
├─ Returns: number
├─ Example: countDistinct(employees, 'department') // 3
*/

// ============================================================================
// 3.7 ADVANCED ANALYSIS
// ============================================================================

/*
analyzeData(data, groupField, metricField)
├─ Purpose: Group data and calculate metrics for each group
├─ Input:
│  • groupField: Column to group by
│  • metricField: Column to calculate metrics on
├─ Returns: {
│    groupValue: {
│      count: number,
│      sum: number,
│      average: number,
│      min: value,
│      max: value
│    }
│  }
├─ Example:
   analyzeData(employees, 'department', 'salary')
   // Returns: {
   //   IT: { count: 4, sum: 225000, average: 56250, min: 50000, max: 60000 },
   //   HR: { count: 2, sum: 82000, average: 41000, min: 40000, max: 42000 },
   //   Sales: { count: 2, sum: 93000, average: 46500, min: 45000, max: 48000 }
   // }

analyzeDataAdvanced(data, groupField, metrics)
├─ Purpose: Group data with custom metrics
├─ Input:
│  • groupField: Column to group by
│  • metrics: Array of { type: 'sum'|'avg'|'min'|'max'|'count', field: string }
├─ Returns: Grouped object with calculated metrics
├─ Example:
   analyzeDataAdvanced(employees, 'department', [
       { type: 'count', field: 'id' },
       { type: 'sum', field: 'salary' },
       { type: 'average', field: 'salary' }
   ])
*/

// ============================================================================
// 3.8 QUERY PROCESSING (BONUS FEATURE)
// ============================================================================

/*
processQuery(data, queryObject)
├─ Purpose: Execute complex queries combining multiple operations
├─ Input:
│  • data: Array of objects
│  • queryObject: {
│      filter?: { field, operator, value } | Array of filters,
│      groupBy?: string,
│      metric?: { type, field } | Array of metrics,
│      sort?: Array of { field, order },
│      limit?: number,
│      offset?: number
│    }
├─ Returns: {
│    success: boolean,
│    data: ... (results),
│    metadata: { originalCount, appliedOperations, ... }
│  }
├─ Operation Order:
│  1. Filter
│  2. Group & calculate metrics
│  3. Sort
│  4. Limit/offset (pagination)
├─ Examples:

  // Example 1: Simple group with metrics
  processQuery(data, {
      groupBy: 'department',
      metric: { type: 'average', field: 'salary' }
  })

  // Example 2: Filter, then group and analyze
  processQuery(data, {
      filter: { field: 'status', operator: '=', value: 'active' },
      groupBy: 'department',
      metric: [
          { type: 'count', field: 'id' },
          { type: 'average', field: 'salary' }
      ]
  })

  // Example 3: Complex query with all options
  processQuery(data, {
      filter: [
          { field: 'salary', operator: '>', value: 40000 },
          { field: 'status', operator: '=', value: 'active' }
      ],
      groupBy: 'department',
      metric: [
          { type: 'count', field: 'id' },
          { type: 'sum', field: 'salary' },
          { type: 'average', field: 'salary' }
      ],
      sort: [{ field: 'sum_salary', order: 'desc' }],
      limit: 10,
      offset: 0
  })
*/

// ============================================================================
// 3.9 UTILITY FUNCTIONS
// ============================================================================

/*
summarize(data, field)
├─ Purpose: Get comprehensive summary stats for a field
├─ Returns: {
│    field: string,
│    type: string,
│    count: number,
│    total: number,
│    missing: number,
│    sum?: number (for numeric),
│    average?: number (for numeric),
│    min?: value,
│    max?: value,
│    distinct?: number
│  }
├─ Example:
   summarize(employees, 'salary')

paginate(data, page = 1, pageSize = 10)
├─ Purpose: Paginate results
├─ Returns: {
│    data: Array (page items),
│    currentPage: number,
│    pageSize: number,
│    totalPages: number,
│    totalItems: number
│  }
├─ Example:
   paginate(employees, 2, 5)  // Get page 2, 5 items per page

getUnique(data, field)
├─ Purpose: Get unique values in a field
├─ Returns: Array of unique values
├─ Example:
   getUnique(employees, 'department') // ['IT', 'HR', 'Sales']

fillMissing(data, field, replacementValue)
├─ Purpose: Replace null/undefined values with a default
├─ Returns: New array with filled values
├─ Example:
   fillMissing(employees, 'salary', 50000)  // Fill missing salaries
*/

// ============================================================================
// 4. INTEGRATION PATTERNS
// ============================================================================

/*
PATTERN 1: Building APIs with Data Processor

import { processQuery } from '../utils/dataProcessor.js';

app.post('/api/analytics', (req, res) => {
    const csvData = req.body.data; // Parsed CSV array
    const query = req.body.query;  // From frontend
    
    const result = processQuery(csvData, query);
    res.json(result);
});

PATTERN 2: Dashboard Statistics

import { getColumns, analyzeData, summarize } from '../utils/dataProcessor.js';

const getDashboardStats = (data) => {
    const columns = getColumns(data);
    const numericColumns = columns.filter(col => 
        detectType(data[0][col]) === 'number'
    );
    
    return {
        totalRows: count(data),
        columns: columns,
        metrics: numericColumns.map(col => ({
            field: col,
            summary: summarize(data, col)
        }))
    };
};

PATTERN 3: Dynamic Export Builder

const buildDynamicReport = (data, config) => {
    let result = data;
    
    if (config.filters) {
        result = applyMultipleFilters(result, config.filters);
    }
    
    if (config.sortBy) {
        result = sortByMultiple(result, config.sortBy);
    }
    
    if (config.groupBy) {
        result = groupBy(result, config.groupBy);
    }
    
    return result;
};

PATTERN 4: Data Validation Pipeline

const validateAndClean = (data) => {
    const schema = getSchema(data);
    return data.map(row => {
        const cleaned = {};
        Object.entries(schema).forEach(([field, type]) => {
            cleaned[field] = convertToType(row[field]);
        });
        return cleaned;
    });
};
*/

// ============================================================================
// 5. ERROR HANDLING
// ============================================================================

/*
The dataProcessor uses defensive programming:
- Invalid inputs return empty arrays/objects
- Null/undefined values skip silently
- Type errors are handled gracefully
- No exceptions thrown (production-safe)

Best Practices:
1. Always validate CSV data before processing
2. Check getSchema() to understand data types
3. Verify field names exist with getColumns()
4. Test filters with small datasets first
5. Always check metadata in processQuery() results

Example Error Handling:

import { getColumns, filterData } from '../utils/dataProcessor.js';

const safeFilter = (data, fieldName, operator, value) => {
    const columns = getColumns(data);
    
    if (!columns.includes(fieldName)) {
        throw new Error(`Field "${fieldName}" not found`);
    }
    
    return filterData(data, fieldName, operator, value);
};
*/

// ============================================================================
// 6. PERFORMANCE TIPS
// ============================================================================

/*
1. MINIMIZE ARRAY ITERATIONS:
   ✓ Bad:  filterData(...), then sortData(...), then groupBy(...)
   ✗ Good: Use processQuery() instead (single pass operations)

2. FILTER EARLY:
   ✓ Apply filters first to reduce data size for subsequent operations
   ✓ applyMultipleFilters() is optimized for multiple conditions

3. CACHE SCHEMA DETECTION:
   const schema = getSchema(data);
   // Reuse schema for multiple operations

4. PAGINATION FOR LARGE RESULTS:
   // Don't load all 1M rows, use paginate()
   const page = paginate(filtered, 1, 100);

5. REUSE SORTED RESULTS:
   const sorted = sortData(data, 'salary', 'desc');
   // Can use this for multiple subsequent operations

6. BATCH OPERATIONS:
   // Group once, reuse for multiple metric calculations
   const grouped = groupBy(data, 'department');
   const analysis = analyzeData(grouped, 'salary');
*/

// ============================================================================
// 7. COMMON USE CASES
// ============================================================================

/*
USE CASE 1: Sales Performance Dashboard

const salesData = [...]; // Imported CSV

const result = processQuery(salesData, {
    filter: { field: 'date', operator: '>', value: '2024-01-01' },
    groupBy: 'region',
    metric: [
        { type: 'sum', field: 'revenue' },
        { type: 'average', field: 'revenue' },
        { type: 'count', field: 'id' }
    ],
    sort: [{ field: 'sum_revenue', order: 'desc' }]
});

// Returns: top-performing regions by revenue

-----

USE CASE 2: Employee Analytics

const employees = [...];

// Find high-earning teams
const highEarningTeams = processQuery(employees, {
    filter: { field: 'salary', operator: '>', value: 50000 },
    groupBy: 'team',
    metric: [
        { type: 'average', field: 'salary' },
        { type: 'count', field: 'id' }
    ],
    sort: [{ field: 'average_salary', order: 'desc' }],
    limit: 5
});

-----

USE CASE 3: Data Quality Report

const data = [...];
const columns = getColumns(data);

const qualityReport = columns.reduce((report, col) => ({
    ...report,
    [col]: {
        ...summarize(data, col),
        uniqueValues: countDistinct(data, col)
    }
}), {});

-----

USE CASE 4: Filtered Export

const exportData = processQuery(data, {
    filter: [
        { field: 'status', operator: '=', value: 'active' },
        { field: 'approved', operator: '=', value: true }
    ],
    sort: [{ field: 'date', order: 'desc' }]
});

// exportData.data can be written to CSV/JSON
*/

export default {
    Documentation: 'See comments above'
};
