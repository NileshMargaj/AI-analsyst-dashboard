/**
 * INTEGRATION EXAMPLE: Upload Controller using Data Processor
 * 
 * This shows how to integrate the dataProcessor with the upload workflow
 * in your Express backend.
 */

import {
    getColumns,
    getRows,
    getSchema,
    filterData,
    groupBy,
    sortData,
    analyzeData,
    processQuery,
    summarize
} from './dataProcessor.js';

// ============================================================================
// EXAMPLE 1: POST-CSV-UPLOAD ANALYSIS ENDPOINT
// ============================================================================

/**
 * Controller: Analyze uploaded CSV data
 * 
 * Endpoint: POST /api/uploads/analyze
 * Request body: { data: Array<Object>, analysisType: 'summary'|'detailed' }
 */
const analyzeUploadedData = async (req, res, next) => {
    try {
        const { data, analysisType = 'summary' } = req.body;

        // Validate input
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({
                error: 'Invalid or empty data',
                success: false
            });
        }

        // Extract metadata about the data
        const columns = getColumns(data);
        const rowCount = getRows(data).length;
        const schema = getSchema(data);

        // Basic response structure
        const analysis = {
            success: true,
            metadata: {
                totalRows: rowCount,
                columns: columns,
                columnCount: columns.length,
                schema: schema
            }
        };

        // Detailed analysis
        if (analysisType === 'detailed') {
            analysis.columnDetails = columns.reduce((details, col) => {
                details[col] = summarize(data, col);
                return details;
            }, {});
        }

        return res.status(200).json(analysis);

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXAMPLE 2: DYNAMIC QUERY ENDPOINT
// ============================================================================

/**
 * Controller: Execute complex queries on uploaded dataset
 * 
 * Endpoint: POST /api/uploads/:uploadId/query
 * Request body: {
 *   query: {
 *     filter?: {...},
 *     groupBy?: string,
 *     metric?: {...},
 *     sort?: [{...}],
 *     limit?: number,
 *     offset?: number
 *   }
 * }
 */
const executeDataQuery = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        const { query } = req.body;

        // TODO: Fetch actual dataset from database
        // const upload = await Dataset.findById(uploadId);
        // const data = upload.parsedData;

        // Mock data for example
        const data = [
            { id: 1, name: 'Alice', department: 'IT', salary: 50000 },
            { id: 2, name: 'Bob', department: 'HR', salary: 40000 },
            { id: 3, name: 'Charlie', department: 'IT', salary: 55000 }
        ];

        // Validate query object
        if (!query || typeof query !== 'object') {
            return res.status(400).json({
                error: 'Invalid query object',
                success: false
            });
        }

        // Execute the query
        const result = processQuery(data, query);

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXAMPLE 3: DYNAMIC REPORT BUILDER
// ============================================================================

/**
 * Controller: Build custom reports from uploaded data
 * 
 * Endpoint: POST /api/uploads/:uploadId/report
 * Request body: {
 *   reportType: 'summary'|'grouped'|'filtered',
 *   config: {...}
 * }
 */
const generateReport = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        const { reportType, config = {} } = req.body;

        // Mock data
        const data = [
            { department: 'IT', salary: 50000, status: 'active' },
            { department: 'HR', salary: 40000, status: 'active' },
            { department: 'IT', salary: 55000, status: 'inactive' }
        ];

        let reportData;

        switch (reportType) {
            case 'summary':
                // Summary report for all numeric columns
                reportData = {
                    type: 'summary',
                    data: getColumns(data).reduce((acc, col) => {
                        if (getSchema(data)[col] === 'number') {
                            acc[col] = summarize(data, col);
                        }
                        return acc;
                    }, {})
                };
                break;

            case 'grouped':
                // Grouped report (e.g., by department)
                const groupField = config.groupBy || getColumns(data)[0];
                const metricField = config.metric || getColumns(data)[1];
                reportData = {
                    type: 'grouped',
                    groupBy: groupField,
                    data: analyzeData(data, groupField, metricField)
                };
                break;

            case 'filtered':
                // Filtered and sorted report
                let filteredData = data;
                
                if (config.filters && Array.isArray(config.filters)) {
                    for (const filter of config.filters) {
                        filteredData = filterData(
                            filteredData,
                            filter.field,
                            filter.operator,
                            filter.value
                        );
                    }
                }

                if (config.sortBy) {
                    filteredData = sortData(
                        filteredData,
                        config.sortBy.field,
                        config.sortBy.order
                    );
                }

                reportData = {
                    type: 'filtered',
                    rowsReturned: filteredData.length,
                    data: filteredData
                };
                break;

            default:
                return res.status(400).json({
                    error: 'Invalid report type',
                    success: false
                });
        }

        return res.status(200).json({
            success: true,
            report: reportData
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXAMPLE 4: COLUMN STATISTICS ENDPOINT
// ============================================================================

/**
 * Controller: Get detailed statistics for a specific column
 * 
 * Endpoint: GET /api/uploads/:uploadId/column/:columnName/stats
 */
const getColumnStatistics = async (req, res, next) => {
    try {
        const { uploadId, columnName } = req.params;

        // Mock data
        const data = [
            { salary: 50000 },
            { salary: 40000 },
            { salary: 55000 },
            { salary: 45000 }
        ];

        // Validate column exists
        const columns = getColumns(data);
        if (!columns.includes(columnName)) {
            return res.status(404).json({
                error: `Column "${columnName}" not found`,
                success: false,
                availableColumns: columns
            });
        }

        // Get comprehensive statistics
        const stats = summarize(data, columnName);

        return res.status(200).json({
            success: true,
            column: columnName,
            statistics: stats
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXAMPLE 5: EXPORT DATA WITH FILTERS
// ============================================================================

/**
 * Controller: Export filtered/transformed data
 * 
 * Endpoint: POST /api/uploads/:uploadId/export
 * Request body: {
 *   format: 'json'|'csv',
 *   filters?: [...],
 *   sortBy?: {...},
 *   limit?: number
 * }
 */
const exportData = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        const { format = 'json', filters = [], sortBy = null, limit = null } = req.body;

        // Mock data
        const data = [
            { id: 1, name: 'Alice', department: 'IT', salary: 50000 },
            { id: 2, name: 'Bob', department: 'HR', salary: 40000 },
            { id: 3, name: 'Charlie', department: 'IT', salary: 55000 }
        ];

        // Apply filters
        let exportData = data;
        if (filters.length > 0) {
            for (const filter of filters) {
                exportData = filterData(
                    exportData,
                    filter.field,
                    filter.operator,
                    filter.value
                );
            }
        }

        // Apply sorting
        if (sortBy) {
            exportData = sortData(exportData, sortBy.field, sortBy.order || 'asc');
        }

        // Apply limit
        if (limit) {
            exportData = exportData.slice(0, limit);
        }

        // Format output
        if (format === 'csv') {
            // Simple CSV conversion
            const columns = getColumns(exportData);
            const csvRows = exportData.map(row =>
                columns.map(col => JSON.stringify(row[col])).join(',')
            );
            const csvContent = [columns.join(','), ...csvRows].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="export_${Date.now()}.csv"`);
            return res.send(csvContent);
        }

        // JSON format (default)
        return res.status(200).json({
            success: true,
            format: 'json',
            rowsExported: exportData.length,
            data: exportData
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXAMPLE 6: AGGREGATED DASHBOARD DATA
// ============================================================================

/**
 * Controller: Get dashboard metrics in one request
 * 
 * Endpoint: GET /api/uploads/:uploadId/dashboard
 * Response: Comprehensive dashboard metrics
 */
const getDashboardMetrics = async (req, res, next) => {
    try {
        const { uploadId } = req.params;

        // Mock data
        const data = [
            { department: 'IT', salary: 50000, status: 'active' },
            { department: 'HR', salary: 40000, status: 'active' },
            { department: 'IT', salary: 55000, status: 'inactive' },
            { department: 'Sales', salary: 45000, status: 'active' }
        ];

        const columns = getColumns(data);
        const schema = getSchema(data);
        const numericCols = columns.filter(col => schema[col] === 'number');

        const dashboard = {
            success: true,
            overview: {
                totalRecords: data.length,
                columnCount: columns.length,
                columns: columns
            },
            metrics: {},
            analysis: {}
        };

        // Add summary metrics for numeric columns
        numericCols.forEach(col => {
            dashboard.metrics[col] = summarize(data, col);
        });

        // Add grouped analysis for first column
        if (columns.length > 0 && numericCols.length > 0) {
            dashboard.analysis = analyzeData(data, columns[0], numericCols[0]);
        }

        return res.status(200).json(dashboard);

    } catch (error) {
        next(error);
    }
};

// ============================================================================
// EXPRESS ROUTE SETUP
// ============================================================================

/*
// In your routes/upload.routes.js

import express from 'express';
import {
    analyzeUploadedData,
    executeDataQuery,
    generateReport,
    getColumnStatistics,
    exportData,
    getDashboardMetrics
} from '../controllers/upload.controller.js';

const router = express.Router();

// Analysis endpoints
router.post('/analyze', analyzeUploadedData);
router.post('/:uploadId/query', executeDataQuery);
router.post('/:uploadId/report', generateReport);
router.get('/:uploadId/column/:columnName/stats', getColumnStatistics);
router.post('/:uploadId/export', exportData);
router.get('/:uploadId/dashboard', getDashboardMetrics);

export default router;
*/

// ============================================================================
// FRONTEND INTEGRATION EXAMPLES
// ============================================================================

/*
// Frontend JavaScript - Example API calls

// 1. Analyze uploaded data
async function analyzeData() {
    const response = await fetch('/api/uploads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: parsedCsvData,
            analysisType: 'detailed'
        })
    });
    return response.json();
}

// 2. Execute complex query
async function queryData() {
    const response = await fetch('/api/uploads/123/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: {
                filter: [
                    { field: 'department', operator: '=', value: 'IT' },
                    { field: 'salary', operator: '>', value: 50000 }
                ],
                groupBy: 'status',
                metric: [
                    { type: 'count', field: 'id' },
                    { type: 'average', field: 'salary' }
                ],
                sort: [{ field: 'count_id', order: 'desc' }],
                limit: 10
            }
        })
    });
    return response.json();
}

// 3. Get dashboard metrics
async function getDashboard() {
    const response = await fetch('/api/uploads/123/dashboard');
    return response.json();
}

// 4. Export data
async function exportFiltered() {
    const response = await fetch('/api/uploads/123/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            format: 'csv',
            filters: [{ field: 'status', operator: '=', value: 'active' }],
            sortBy: { field: 'name', order: 'asc' },
            limit: 100
        })
    });
    
    // For CSV downloads
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
}
*/

// ============================================================================
// EXPORT CONTROLLERS
// ============================================================================

export {
    analyzeUploadedData,
    executeDataQuery,
    generateReport,
    getColumnStatistics,
    exportData,
    getDashboardMetrics
};
