import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema({
  fileName: String,

  columns: [String],

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