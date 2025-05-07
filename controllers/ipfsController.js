import fs from "fs";
import path from "path";
import ipfsUtils from "../utils/ipfs.js";

export const uploadFileToIPFS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.join(req.file.path);
    const ipfsHash = await ipfsUtils.uploadToIPFS(filePath);

    // Clean up: delete file from local after upload
    fs.unlinkSync(filePath);

    res.status(200).json({ ipfsHash, cid: ipfsHash }); // Pinata returns CID as ipfsHash
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    res.status(500).json({ message: "IPFS upload failed." });
  }
};
