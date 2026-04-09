import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema({
  fileName: String,

  columns: [String],

  // Data type schema for each column (e.g., { name: 'string', salary: 'number' })
  schema: {
    type: Map,
    of: String,
    default: {}
  },

  // Total row count for quick reference
  rowCount: {
    type: Number,
    default: 0
  },

  records: [
    {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  ],

  uploadedAt: {
    type: Date,
    default: Date.now
  }
},{
    timestamps: true
});

export const Dataset = mongoose.model("Dataset", datasetSchema);