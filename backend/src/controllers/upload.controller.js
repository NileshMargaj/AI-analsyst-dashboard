import { parseCSV } from "../services/csv.service.js";
import { Dataset } from "../models/dataset.model.js";
import fs from "fs";
import {
  getColumns,
  getSchema,
  filterData,
  sortData,
  analyzeData,
  processQuery,
  summarize,
  paginate,
  getUnique,
  countDistinct, // ✅ FIXED
} from "../utils/dataProcessor.js";

// ✅ Convert records safely
const convertRecordsToPlainObjects = (records) => {
  if (!Array.isArray(records)) return [];

  return records.reduce((acc, record) => {
    try {
      let obj;

      if (record instanceof Map) {
        obj = Object.fromEntries(record);
      } else if (record?.toObject) {
        obj = record.toObject();
      } else {
        obj = { ...record };
      }

      delete obj._id;
      delete obj.__v;

      if (Object.keys(obj).length) acc.push(obj);
    } catch (e) {
      console.error("Conversion error:", e.message);
    }

    return acc;
  }, []);
};



// ================= UPLOAD CSV =================
export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded", success: false });
    }

    const filePath = req.file.path;
    const rows = await parseCSV(filePath);

    if (!rows.length) {
      return res.status(400).json({ error: "Empty CSV", success: false });
    }

    const columns = getColumns(rows);
    const schema = getSchema(rows);

    // ✅ Safe file delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      columns,
      schema,
      rowCount: rows.length,
      records: rows,
    });

    res.status(201).json({
      success: true,
      dataset: {
        id: dataset._id,
        fileName: dataset.fileName,
        rowCount: dataset.rowCount,
        columns,
        schema,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};



// ================= ANALYZE =================
export const analyzeDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found", success: false });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);
    const schema = getSchema(records);

    const analysis = {};
    for (const col of columns) {
      analysis[col] = summarize(records, col);
    }

    res.json({
      success: true,
      dataset: {
        id: dataset._id,
        fileName: dataset.fileName,
        rowCount: records.length,
        columns,
        schema,
      },
      analysis,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= QUERY =================
export const queryDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const result = processQuery(records, req.body.query || {});

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= COLUMN STATS =================
export const getColumnStats = async (req, res) => {
  try {
    const { datasetId, columnName } = req.params;

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);

    if (!columns.includes(columnName)) {
      return res.status(400).json({ error: "Invalid column" });
    }

    res.json({
      success: true,
      statistics: summarize(records, columnName),
      distinctValues: countDistinct(records, columnName),
      sampleValues: getUnique(records, columnName).slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GROUP =================
export const groupAndAnalyze = async (req, res) => {
  try {
    const { groupBy, metric } = req.body;

    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const records = convertRecordsToPlainObjects(dataset.records);
    const columns = getColumns(records);

    if (!columns.includes(groupBy) || !columns.includes(metric)) {
      return res.status(400).json({ error: "Invalid fields" });
    }

    const analysis = analyzeData(records, groupBy, metric);

    res.json({
      success: true,
      analysis,
      groupCount: Object.keys(analysis).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= FILTER =================
export const filterAndExport = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });

    let records = convertRecordsToPlainObjects(dataset.records);

    const { filters = [], sortBy, limit = 100, offset = 0 } = req.body;

    filters.forEach(f => {
      records = filterData(records, f.field, f.operator, f.value);
    });

    if (sortBy) {
      records = sortData(records, sortBy.field, sortBy.order);
    }

    const page = Math.floor(offset / limit) + 1;
    const { data, totalPages, totalItems } = paginate(records, page, limit);

    res.json({
      success: true,
      data,
      pagination: { totalItems, totalPages, page },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GET DATASET =================
export const getDataset = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });

    const records = convertRecordsToPlainObjects(dataset.records);

    const { data, totalPages, totalItems } = paginate(
      records,
      Math.max(1, parseInt(page)),
      Math.min(100, parseInt(limit))
    );

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GET ALL =================
export const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find()
      .select("_id fileName rowCount columns uploadedAt")
      .lean();

    res.json({ success: true, datasets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};