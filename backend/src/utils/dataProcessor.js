/**
 * Data Processing Utility Module
 * 
 * A flexible, reusable utility for processing and analyzing CSV data dynamically.
 * Supports filtering, grouping, sorting, aggregations, and complex queries.
 * 
 * No hard-coded column names - fully dynamic for ANY CSV structure.
 */

// ============================================================================
// TYPE DETECTION & VALIDATION
// ============================================================================

/**
 * Detect the data type of a value
 * @param {*} value - The value to analyze
 * @returns {string} - Detected type: 'number', 'date', 'boolean', or 'string'
 */
const detectType = (value) => {
    // Handle null/undefined
    if (value === null || value === undefined || value === '') return 'string';

    // Check for boolean
    if (typeof value === 'boolean') return 'boolean';

    // Check for number
    if (typeof value === 'number') return 'number';

    // Check if string can be converted to number
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return 'string';
        if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) return 'number';

        // Check for date patterns (YYYY-MM-DD, MM/DD/YYYY, etc.)
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed) || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
            const date = new Date(trimmed);
            if (!isNaN(date.getTime())) return 'date';
        }
    }

    return 'string';
};

/**
 * Safely convert value to its detected type
 * @param {*} value - The value to convert
 * @returns {*} - Converted value
 */
const convertToType = (value) => {
    const type = detectType(value);

    if (type === 'number' && typeof value !== 'number') {
        return parseFloat(value);
    }
    if (type === 'date') {
        return new Date(value);
    }
    if (type === 'boolean' && typeof value !== 'boolean') {
        return value.toLowerCase() === 'true' || value === '1';
    }

    return value;
};

/**
 * Check if a value is valid (not null, undefined, or empty string)
 * @param {*} value - The value to check
 * @returns {boolean} - true if valid
 */
const isValidValue = (value) => value !== null && value !== undefined && value !== '';

// ============================================================================
// COLUMN & ROW EXTRACTION
// ============================================================================

/**
 * Extract all column names from the dataset
 * @param {Array<Object>} data - Array of objects
 * @returns {Array<string>} - Array of column names
 */
const getColumns = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // Get unique keys from all objects
    const columnsSet = new Set();
    data.forEach(row => {
        if (typeof row === 'object' && row !== null) {
            Object.keys(row).forEach(key => columnsSet.add(key));
        }
    });

    return Array.from(columnsSet);
};

/**
 * Extract all rows from the dataset
 * @param {Array<Object>} data - Array of objects
 * @returns {Array<Object>} - The rows (returns input if valid)
 */
const getRows = (data) => {
    if (!Array.isArray(data)) return [];
    return data.filter(row => typeof row === 'object' && row !== null);
};

/**
 * Get data schema with column names and their detected types
 * @param {Array<Object>} data - Array of objects
 * @returns {Object} - Schema mapping: { columnName: detectedType, ... }
 */
const getSchema = (data) => {
    const schema = {};
    const columns = getColumns(data);

    columns.forEach(column => {
        const types = new Set();
        data.forEach(row => {
            if (row.hasOwnProperty(column) && isValidValue(row[column])) {
                types.add(detectType(row[column]));
            }
        });

        // Use the most common type, default to string
        schema[column] = types.size > 0 ? Array.from(types)[0] : 'string';
    });

    return schema;
};

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Filter data based on a field, operator, and value
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column name to filter
 * @param {string} operator - Comparison operator: '=', '!=', '>', '<', '>=', '<=', 'contains'
 * @param {*} value - Value to compare with
 * @returns {Array<Object>} - Filtered data
 */
const filterData = (data, field, operator, value) => {
    if (!Array.isArray(data) || !field || !operator) return data;

    return data.filter(row => {
        if (!row.hasOwnProperty(field)) return false;

        const rowValue = row[field];

        switch (operator.toLowerCase()) {
            case '=':
            case '==':
                return rowValue == value;
            case '!=':
            case '<>':
                return rowValue != value;
            case '>':
                return Number(rowValue) > Number(value);
            case '<':
                return Number(rowValue) < Number(value);
            case '>=':
                return Number(rowValue) >= Number(value);
            case '<=':
                return Number(rowValue) <= Number(value);
            case 'contains':
                return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
            case 'starts_with':
                return String(rowValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'ends_with':
                return String(rowValue).toLowerCase().endsWith(String(value).toLowerCase());
            default:
                return true;
        }
    });
};

/**
 * Apply multiple filters to data
 * @param {Array<Object>} data - Array of objects
 * @param {Array<Object>} filters - Array of filter objects: { field, operator, value }
 * @returns {Array<Object>} - Filtered data
 */
const applyMultipleFilters = (data, filters) => {
    if (!Array.isArray(filters) || filters.length === 0) return data;

    return filters.reduce((filtered, filter) => {
        return filterData(filtered, filter.field, filter.operator, filter.value);
    }, data);
};

// ============================================================================
// GROUPING
// ============================================================================

/**
 * Group data by a specific field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to group by
 * @returns {Object} - Grouped data: { groupValue: [rows], ... }
 */
const groupBy = (data, field) => {
    if (!Array.isArray(data) || !field) return {};

    return data.reduce((grouped, row) => {
        if (!row.hasOwnProperty(field)) return grouped;

        const key = row[field];
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(row);

        return grouped;
    }, {});
};

/**
 * Group data by multiple fields
 * @param {Array<Object>} data - Array of objects
 * @param {Array<string>} fields - Columns to group by (in order)
 * @returns {Object} - Nested grouped data
 */
const groupByMultiple = (data, fields) => {
    if (!Array.isArray(data) || !Array.isArray(fields) || fields.length === 0) return {};

    return data.reduce((grouped, row) => {
        let current = grouped;

        fields.forEach((field, index) => {
            if (!row.hasOwnProperty(field)) return;

            const key = row[field];
            if (index === fields.length - 1) {
                // Last field: store rows
                if (!current[key]) current[key] = [];
                current[key].push(row);
            } else {
                // Intermediate field: create nested object
                if (!current[key]) current[key] = {};
                current = current[key];
            }
        });

        return grouped;
    }, {});
};

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort data by a field in ascending or descending order
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to sort by
 * @param {string} order - Sort order: 'asc' or 'desc' (default: 'asc')
 * @returns {Array<Object>} - Sorted data (new array)
 */
const sortData = (data, field, order = 'asc') => {
    if (!Array.isArray(data) || !field) return data;

    const sorted = [...data];
    const isAscending = order.toLowerCase() === 'asc';

    sorted.sort((a, b) => {
        if (!a.hasOwnProperty(field) || !b.hasOwnProperty(field)) return 0;

        const aVal = a[field];
        const bVal = b[field];

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return isAscending ? 1 : -1;
        if (bVal == null) return isAscending ? -1 : 1;

        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return isAscending ? aVal - bVal : bVal - aVal;
        }

        // Date comparison
        if (aVal instanceof Date && bVal instanceof Date) {
            return isAscending ? aVal - bVal : bVal - aVal;
        }

        // String comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const comparison = aStr.localeCompare(bStr);

        return isAscending ? comparison : -comparison;
    });

    return sorted;
};

/**
 * Sort data by multiple fields with independent orders
 * @param {Array<Object>} data - Array of objects
 * @param {Array<Object>} sortFields - Each: { field: string, order: 'asc'|'desc' }
 * @returns {Array<Object>} - Sorted data
 */
const sortByMultiple = (data, sortFields) => {
    if (!Array.isArray(data) || !Array.isArray(sortFields) || sortFields.length === 0) return data;

    const sorted = [...data];

    sorted.sort((a, b) => {
        for (const { field, order = 'asc' } of sortFields) {
            if (!a.hasOwnProperty(field) || !b.hasOwnProperty(field)) continue;

            const aVal = a[field];
            const bVal = b[field];

            if (aVal == null && bVal == null) continue;
            if (aVal == null) return order === 'asc' ? 1 : -1;
            if (bVal == null) return order === 'asc' ? -1 : 1;

            let comparison = 0;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else if (aVal instanceof Date && bVal instanceof Date) {
                comparison = aVal - bVal;
            } else {
                const aStr = String(aVal).toLowerCase();
                const bStr = String(bVal).toLowerCase();
                comparison = aStr.localeCompare(bStr);
            }

            if (comparison !== 0) {
                return order === 'asc' ? comparison : -comparison;
            }
        }

        return 0;
    });

    return sorted;
};

// ============================================================================
// METRICS & AGGREGATIONS
// ============================================================================

/**
 * Sum values in a numeric field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Numeric column
 * @returns {number} - Sum of values
 */
const sum = (data, field) => {
    if (!Array.isArray(data) || !field) return 0;

    return data.reduce((total, row) => {
        if (row.hasOwnProperty(field) && isValidValue(row[field])) {
            return total + Number(row[field]);
        }
        return total;
    }, 0);
};

/**
 * Calculate average of a numeric field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Numeric column
 * @returns {number} - Average value
 */
const average = (data, field) => {
    if (!Array.isArray(data) || !field) return 0;

    const validValues = data.filter(row => row.hasOwnProperty(field) && isValidValue(row[field]));
    if (validValues.length === 0) return 0;

    const total = sum(validValues, field);
    return total / validValues.length;
};

/**
 * Find minimum value in a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to analyze
 * @returns {*} - Minimum value
 */
const min = (data, field) => {
    if (!Array.isArray(data) || !field || data.length === 0) return null;

    const validValues = data
        .filter(row => row.hasOwnProperty(field) && isValidValue(row[field]))
        .map(row => Number(row[field]))
        .filter(val => !isNaN(val));

    if (validValues.length === 0) return null;

    return Math.min(...validValues);
};

/**
 * Find maximum value in a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to analyze
 * @returns {*} - Maximum value
 */
const max = (data, field) => {
    if (!Array.isArray(data) || !field || data.length === 0) return null;

    const validValues = data
        .filter(row => row.hasOwnProperty(field) && isValidValue(row[field]))
        .map(row => Number(row[field]))
        .filter(val => !isNaN(val));

    if (validValues.length === 0) return null;

    return Math.max(...validValues);
};

/**
 * Count total rows
 * @param {Array<Object>} data - Array of objects
 * @returns {number} - Total row count
 */
const count = (data) => {
    return Array.isArray(data) ? data.length : 0;
};

/**
 * Count distinct values in a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to analyze
 * @returns {number} - Count of distinct values
 */
const countDistinct = (data, field) => {
    if (!Array.isArray(data) || !field) return 0;

    const distinctValues = new Set(
        data
            .filter(row => row.hasOwnProperty(field) && isValidValue(row[field]))
            .map(row => row[field])
    );

    return distinctValues.size;
};

// ============================================================================
// ADVANCED ANALYSIS
// ============================================================================

/**
 * Analyze data by grouping and calculating metrics
 * 
 * @param {Array<Object>} data - Array of objects
 * @param {string} groupField - Field to group by
 * @param {string} metricField - Field to calculate metrics on
 * @returns {Object} - Grouped statistics: { groupValue: { count, sum, average, min, max }, ... }
 * 
 * @example
 * analyzeData(employees, 'department', 'salary')
 * // Returns: { IT: { count: 3, sum: 150000, average: 50000, min: 45000, max: 55000 } }
 */
const analyzeData = (data, groupField, metricField) => {
    if (!Array.isArray(data) || !groupField || !metricField) return {};

    const grouped = groupBy(data, groupField);
    const analysis = {};

    Object.entries(grouped).forEach(([groupKey, groupedRows]) => {
        analysis[groupKey] = {
            count: count(groupedRows),
            sum: sum(groupedRows, metricField),
            average: average(groupedRows, metricField),
            min: min(groupedRows, metricField),
            max: max(groupedRows, metricField)
        };
    });

    return analysis;
};

/**
 * Advanced: Analyze data with multiple metrics
 * 
 * @param {Array<Object>} data - Array of objects
 * @param {string} groupField - Field to group by
 * @param {Array<Object>} metrics - Array of { type: 'sum'|'avg'|'min'|'max'|'count', field: string }
 * @returns {Object} - Complex grouped statistics
 */
const analyzeDataAdvanced = (data, groupField, metrics) => {
    if (!Array.isArray(data) || !groupField || !Array.isArray(metrics)) return {};

    const grouped = groupBy(data, groupField);
    const analysis = {};

    Object.entries(grouped).forEach(([groupKey, groupedRows]) => {
        analysis[groupKey] = {};

        metrics.forEach(({ type, field }) => {
            if (!field) return;

            const metricKey = `${type}_${field}`;
            switch (type.toLowerCase()) {
                case 'sum':
                    analysis[groupKey][metricKey] = sum(groupedRows, field);
                    break;
                case 'avg':
                case 'average':
                    analysis[groupKey][metricKey] = average(groupedRows, field);
                    break;
                case 'min':
                    analysis[groupKey][metricKey] = min(groupedRows, field);
                    break;
                case 'max':
                    analysis[groupKey][metricKey] = max(groupedRows, field);
                    break;
                case 'count':
                    analysis[groupKey][metricKey] = count(groupedRows);
                    break;
                default:
                    break;
            }
        });
    });

    return analysis;
};

// ============================================================================
// QUERY PROCESSOR (BONUS: Complex Query Execution)
// ============================================================================

/**
 * Process a complex query object combining filter, grouping, and metrics
 * 
 * @param {Array<Object>} data - Array of objects
 * @param {Object} queryObject - Query configuration
 * @param {Object} queryObject.filter - Filter criteria: { field, operator, value } or array of filters
 * @param {string} queryObject.groupBy - Field to group by
 * @param {Object|Array} queryObject.metric - Metric(s): { type, field } or array of metrics
 * @param {Array<Object>} queryObject.sort - Sorting: [{ field, order: 'asc'|'desc' }, ...]
 * @param {number} queryObject.limit - Limit results (applied after grouping)
 * @param {number} queryObject.offset - Offset results (applied after grouping and sorting)
 * 
 * @returns {Object} - Processed results with applied operations
 * 
 * @example
 * processQuery(data, {
 *   filter: { field: 'department', operator: '=', value: 'IT' },
 *   groupBy: 'team',
 *   metric: { type: 'average', field: 'salary' },
 *   sort: [{ field: 'average_salary', order: 'desc' }],
 *   limit: 10
 * })
 */
const processQuery = (data, queryObject = {}) => {
    if (!Array.isArray(data)) return { error: 'Invalid data input', data: [] };

    let result = [...data];
    const metadata = {
        originalCount: result.length,
        appliedOperations: []
    };

    // Step 1: Apply filters
    if (queryObject.filter) {
        if (Array.isArray(queryObject.filter)) {
            result = applyMultipleFilters(result, queryObject.filter);
        } else {
            result = filterData(result, queryObject.filter.field, queryObject.filter.operator, queryObject.filter.value);
        }
        metadata.appliedOperations.push('filter');
        metadata.filteredCount = result.length;
    }

    // Step 2: Prepare metrics for analysis
    let metrics = [];
    if (queryObject.metric) {
        if (Array.isArray(queryObject.metric)) {
            metrics = queryObject.metric;
        } else {
            metrics = [queryObject.metric];
        }
    }

    // Step 3: Group and calculate metrics
    let processedResult = result;
    if (queryObject.groupBy && metrics.length > 0) {
        processedResult = analyzeDataAdvanced(result, queryObject.groupBy, metrics);
        metadata.appliedOperations.push('groupBy');
        metadata.groupedBy = queryObject.groupBy;
    } else if (queryObject.groupBy) {
        // Group without metrics - just group the rows
        processedResult = groupBy(result, queryObject.groupBy);
        metadata.appliedOperations.push('groupBy');
        metadata.groupedBy = queryObject.groupBy;
    }

    // Step 4: Apply sorting (convert object to array if needed)
    if (queryObject.sort && Array.isArray(queryObject.sort)) {
        if (typeof processedResult === 'object' && !Array.isArray(processedResult)) {
            // Convert grouped object to array format for sorting
            const entries = Object.entries(processedResult).map(([key, value]) => ({
                [queryObject.groupBy]: key,
                ...value
            }));
            processedResult = sortByMultiple(entries, queryObject.sort);
        } else if (Array.isArray(processedResult)) {
            processedResult = sortByMultiple(processedResult, queryObject.sort);
        }
        metadata.appliedOperations.push('sort');
    }

    // Step 5: Apply limit and offset
    if (Array.isArray(processedResult)) {
        const offset = queryObject.offset || 0;
        const limit = queryObject.limit;

        if (limit) {
            processedResult = processedResult.slice(offset, offset + limit);
            metadata.appliedOperations.push('limit/offset');
            metadata.limit = limit;
            metadata.offset = offset;
        }
    }

    return {
        success: true,
        data: processedResult,
        metadata
    };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get summary statistics for a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to summarize
 * @returns {Object} - Summary statistics
 */
const summarize = (data, field) => {
    if (!Array.isArray(data) || !field) return {};

    const schema = getSchema(data);
    const type = schema[field] || 'unknown';

    const validValues = data
        .filter(row => row.hasOwnProperty(field) && isValidValue(row[field]))
        .map(row => row[field]);

    const summary = {
        field,
        type,
        count: validValues.length,
        total: validValues.length,
        missing: count(data) - validValues.length
    };

    if (type === 'number') {
        summary.sum = sum(data, field);
        summary.average = average(data, field);
        summary.min = min(data, field);
        summary.max = max(data, field);
    }

    if (type === 'string' || type === 'number') {
        const distinct = new Set(validValues);
        summary.distinct = distinct.size;
    }

    return summary;
};

/**
 * Paginate data
 * @param {Array<Object>} data - Array of objects
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} - Paginated result: { data, currentPage, pageSize, totalPages, totalItems }
 */
const paginate = (data, page = 1, pageSize = 10) => {
    if (!Array.isArray(data) || page < 1 || pageSize < 1) {
        return { data: [], currentPage: 1, pageSize, totalPages: 0, totalItems: 0 };
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        data: data.slice(startIndex, endIndex),
        currentPage: page,
        pageSize,
        totalPages,
        totalItems
    };
};

/**
 * Get unique values in a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to extract
 * @returns {Array} - Array of unique values
 */
const getUnique = (data, field) => {
    if (!Array.isArray(data) || !field) return [];

    const uniqueValues = new Set();
    data.forEach(row => {
        if (row.hasOwnProperty(field) && isValidValue(row[field])) {
            uniqueValues.add(row[field]);
        }
    });

    return Array.from(uniqueValues);
};

/**
 * Replace null/undefined values in a field
 * @param {Array<Object>} data - Array of objects
 * @param {string} field - Column to fill
 * @param {*} replacementValue - Value to use for missing data
 * @returns {Array<Object>} - Data with filled values
 */
const fillMissing = (data, field, replacementValue) => {
    if (!Array.isArray(data) || !field) return data;

    return data.map(row => {
        if (!isValidValue(row[field])) {
            return { ...row, [field]: replacementValue };
        }
        return row;
    });
};

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export {
    // Type detection
    detectType,
    convertToType,
    isValidValue,
    getSchema,

    // Column & Row extraction
    getColumns,
    getRows,

    // Filtering
    filterData,
    applyMultipleFilters,

    // Grouping
    groupBy,
    groupByMultiple,

    // Sorting
    sortData,
    sortByMultiple,

    // Metrics
    sum,
    average,
    min,
    max,
    count,
    countDistinct,

    // Advanced analysis
    analyzeData,
    analyzeDataAdvanced,

    // Complex query processing (BONUS)
    processQuery,

    // Utility functions
    summarize,
    paginate,
    getUnique,
    fillMissing
};
