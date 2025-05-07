import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  userId: {
  type: String,
  ref: 'User',
  required: true
}
,
  fileName: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ID", "Certificate", "Degree", "Other"],
    default: "Other",
  },
  size: {
    type: Number,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, ensuring it only creates the model once
export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);
