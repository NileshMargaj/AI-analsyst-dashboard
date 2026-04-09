import { parseCSV } from "../services/csv.service.js";
import { Dataset } from "../models/dataset.model.js";
import fs from "fs";
import {
  getColumns,
  getSchema,
  filterData,
  groupBy,
  sortData,
  analyzeData,
  processQuery,
  summarize,
  paginate,
  getUnique,
  countDistinct
} from "../utils/dataProcessor.js";

//! Convert MongoDB Map objects to plain objects
const convertRecordsToPlainObjects = (records) => {
  if (!Array.isArray(records)) return [];
  
  return records.map(record => {
    if (record && typeof record === 'object') {
      // If it's a Map, convert to object
      if (record instanceof Map) {
        return Object.fromEntries(record);
      }
      // If it's already an object with a toObject method (Mongoose), use it
      if (record.toObject && typeof record.toObject === 'function') {
        const obj = record.toObject();
        // Remove MongoDB internal fields
        delete obj.__v;
        return obj;
      }
      // Otherwise, return as-is but clean MongoDB fields
      const cleaned = { ...record };
      delete cleaned.__v;
      delete cleaned._id;
      return cleaned;
    }
    return record;
  });
};

//! Upload and parse CSV
export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', success: false });
    }
    const filePath = req.file.path;

    const rows = await parseCSV(filePath);
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid', success: false });
    }

    // Extract columns using dataProcessor
    const columns = getColumns(rows);
    const schema = getSchema(rows);

    if (columns.length === 0) {
      return res.status(400).json({ error: 'No columns found in CSV', success: false });
    }

    // Cleanup temp file after parsing
    fs.unlinkSync(filePath);

    // Store dataset with enhanced metadata
    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      columns,
      schema,
      rowCount: rows.length,
      records: rows
    });

    if (!dataset.records || dataset.records.length === 0) {
      throw new Error('Failed to save records to database');
    }

    res.status(201).json({
      message: "Upload successful",
      success: true,
      dataset: {
        id: dataset._id,
        fileName: dataset.fileName,
        rowCount: dataset.rowCount,
        columns: columns,
        schema: schema
      }
    });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

//! Analyze dataset metadata and schema
export const analyzeDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);
    const schema = getSchema(records);

    // Generate detailed analysis for each column
    const columnAnalysis = columns.reduce((acc, col) => {
      acc[col] = summarize(records, col);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      dataset: {
        id: dataset._id,
        fileName: dataset.fileName,
        rowCount: records.length,
        columns: columns,
        columnCount: columns.length,
        schema: schema
      },
      analysis: columnAnalysis
    });

  } catch (err) {
    console.error('❌ Analysis error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Execute complex query on dataset
export const queryDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { query } = req.body;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    if (!query || typeof query !== 'object') {
      return res.status(400).json({ error: 'Invalid query object', success: false });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const result = processQuery(records, query);

    res.status(200).json({
      success: true,
      datasetId: dataset._id,
      fileName: dataset.fileName,
      ...result
    });

  } catch (err) {
    console.error('❌ Query error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Get column-specific statistics
export const getColumnStats = async (req, res) => {
  try {
    const { datasetId, columnName } = req.params;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);

    if (!columns.includes(columnName)) {
      return res.status(404).json({ 
        error: `Column "${columnName}" not found`, 
        success: false,
        availableColumns: columns 
      });
    }

    const stats = summarize(records, columnName);
    const uniqueValues = getUnique(records, columnName);
    const distinctCount = countDistinct(records, columnName);

    res.status(200).json({
      success: true,
      column: columnName,
      statistics: stats,
      distinctValues: distinctCount,
      sampleValues: uniqueValues.slice(0, 10) // Show first 10 unique values
    });

  } catch (err) {
    console.error('❌ Column stats error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Group and analyze data
export const groupAndAnalyze = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { groupBy: groupField, metric: metricField } = req.body;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    if (!groupField || !metricField) {
      return res.status(400).json({ 
        error: 'groupBy and metric fields are required', 
        success: false 
      });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);

    if (!columns.includes(groupField)) {
      return res.status(400).json({ error: `Field "${groupField}" not found`, success: false });
    }

    if (!columns.includes(metricField)) {
      return res.status(400).json({ error: `Field "${metricField}" not found`, success: false });
    }

    const analysis = analyzeData(records, groupField, metricField);

    res.status(200).json({
      success: true,
      groupBy: groupField,
      metric: metricField,
      analysis: analysis,
      groupCount: Object.keys(analysis).length
    });

  } catch (err) {
    console.error('❌ Group analysis error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Filter and export data
export const filterAndExport = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { filters, sortBy, limit, offset, format = 'json' } = req.body;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    let records = convertRecordsToPlainObjects(dataset.records);

    // Apply filters if provided
    if (filters && Array.isArray(filters) && filters.length > 0) {
      for (const filter of filters) {
        records = filterData(records, filter.field, filter.operator, filter.value);
      }
    }

    // Apply sorting if provided
    if (sortBy) {
      records = sortData(records, sortBy.field, sortBy.order || 'asc');
    }

    // Apply pagination
    const pageSize = limit || 100;
    const pageOffset = offset || 0;
    const pageNumber = Math.floor(pageOffset / pageSize) + 1;
    
    const { data: paginatedData, totalPages, totalItems } = paginate(
      records, 
      pageNumber, 
      pageSize
    );

    if (format === 'csv') {
      // Convert to CSV format
      const columns = getColumns(paginatedData);
      const csvRows = paginatedData.map(row =>
        columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      );
      const csvContent = [columns.join(','), ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="export_${Date.now()}.csv"`);
      return res.send(csvContent);
    }

    // JSON response
    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        total: totalItems,
        limit: pageSize,
        offset: pageOffset,
        page: pageNumber,
        pages: totalPages
      },
      rowsReturned: paginatedData.length
    });

  } catch (err) {
    console.error('❌ Export error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Get full dataset with optional pagination
export const getDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found', success: false });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const { data, totalPages, totalItems } = paginate(records, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      dataset: {
        id: dataset._id,
        fileName: dataset.fileName,
        columns: dataset.columns
      },
      data: data,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
        totalPages,
        totalItems
      }
    });

  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Get all datasets (list view)
export const getAllDatasets = async (req, res) => {
  try {
    // Exclude records field to avoid Map serialization issues
    const datasets = await Dataset.find()
      .select('_id fileName rowCount columns uploadedAt')
      .sort({ uploadedAt: -1 })
      .lean(); // Use lean() for better performance and to avoid Mongoose document issues

    res.status(200).json({
      success: true,
      datasets: datasets
    });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: err.message, success: false });
  }
};
