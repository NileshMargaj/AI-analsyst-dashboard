import { parseCSV } from "../services/csv.service.js";
import { Dataset } from "../models/dataset.model.js";
import fs from "fs";

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    // console.log('📁 Processing CSV:', filePath);

    const rows = await parseCSV(filePath);
    // console.log('📊 Parsed rows count:', rows?.length || 0);
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }

    const firstRow = rows[0];
    const columns = firstRow ? Object.keys(firstRow) : [];
    // console.log('🏷️  Extracted columns:', columns);

    if (columns.length === 0) {
      return res.status(400).json({ error: 'No columns found in CSV (malformed headers?)' });
    }

    // Cleanup temp file after parsing
    fs.unlinkSync(filePath);

    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      columns,
      records: rows
    });

    // Verify save
    if (!dataset.records || dataset.records.length === 0) {
      throw new Error('Failed to save records to database');
    }

    // console.log('💾 Dataset saved:', dataset._id, '- Records count:', dataset.records.length);
    res.json({
      message: "Upload successful",
      datasetId: dataset._id,
      columns: columns // TEMP: Return for verification
    });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};
