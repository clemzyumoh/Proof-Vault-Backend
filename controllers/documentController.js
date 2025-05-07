

import axios from "axios";
import FormData from "form-data";
import Document from "../models/Document.js";
import dotenv from "dotenv";
import mongoose from "mongoose"

dotenv.config();



const uploadDocument = async (req, res) => {
  try {
    const { userId, fileName, cid, ipfsHash, type = "Other", size } = req.body;

    const walletAddressRaw = req.headers["x-wallet-address"];
    console.log("Received data:", req.headers.walletAddress);

    let walletAddress = walletAddressRaw;

    // If walletAddress is an object, extract the address field
    if (typeof walletAddress === "object") {
      walletAddress = walletAddress.address; // Assuming the wallet address is inside the 'address' field
    } else if (typeof walletAddress === "string") {
      // If it's already a string, nothing needs to be done
      walletAddress = walletAddress.trim();
    }

    console.log("Final walletAddress:", walletAddress);

    if (!walletAddress || !cid || !fileName || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDoc = await Document.create({
      walletAddress,
      fileName,
      cid,
      ipfsHash,
      userId,
      type,
      size,
    });

    res.status(201).json({ message: "Document uploaded", document: newDoc });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};
const getUserDocuments = async (req, res) => {
  try {
    const walletAddressRaw = req.headers["x-wallet-address"];
    let walletAddress = walletAddressRaw;

    try {
      // Handle if mistakenly passed as object
      walletAddress = JSON.parse(walletAddressRaw).address || walletAddressRaw;
    } catch (err) {
      // It's fine if already a string
    }

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address missing" });
    }

    const documents = await Document.find({ walletAddress });
    res.status(200).json(documents); // ✅ Plain array
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};


// const getUserDocuments = async (req, res) => {
//   try {
//     //const { walletAddress } = req.body; // Get wallet address for fetching user docs
//     //const walletAddress = req.headers["X-Wallet-Address"];
//    const walletAddressRaw = req.headers["X-Wallet-Address"];
//    let walletAddress = walletAddressRaw;

//    try {
//      // Parse the wallet address if it's a stringified object
//      walletAddress = JSON.parse(walletAddressRaw).address || walletAddressRaw;
//    } catch (err) {
//      // If it's already a string, do nothing
//      console.error("Parsing wallet address failed:", err);
//     }
    
//     const documents = await Document.find({ walletAddress });
//     res.status(200).json({ documents });
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     res.status(500).json({ error: "Failed to fetch documents" });
//   }
// };
// const getDocumentById = async (req, res) => {
//   const { id } = req.params;
//   // Check if the id is valid
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "Invalid ID format" });
//   }
//   try {
//     const document = await Document.findById(id);

//     if (!document) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     res.status(200).json({ document });
//   } catch (error) {
//     console.error("Error fetching document:", error);
//     res.status(500).json({ error: "Failed to fetch document" });
//   }
// };
// Your function to retrieve the document
const getDocumentById = (req, res) => {
  const { id } = req.params;
  
  // Assuming you have a function to fetch the document by ID
  Document.findById(id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({ message: 'Document not found' });
      }
      res.status(200).json(document);
    })
    .catch((err) => res.status(500).send({ message: 'Server Error', error: err }));
};

// const deleteDocument = async (req, res) => {
//   const { id } = req.params; // Get the document ID from the URL
//   //const walletAddress = req.headers["X-Wallet-Address"]; // Get wallet address from header
//   const walletAddressRaw = req.headers["x-wallet-address"];
//   let walletAddress = walletAddressRaw;

//   try {
//     // Handle if mistakenly passed as object
//     walletAddress = JSON.parse(walletAddressRaw).address || walletAddressRaw;
//   } catch (err) {
//     // It's fine if already a string
//   }
//   try {
//     const document = await Document.findById(id);
//     if (!document) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     // Check if the user is the owner of the document
//     if (document.walletAddress !== walletAddress) {
//       return res
//         .status(403)
//         .json({ error: "You don't have permission to delete this document" });
//     }

//     await document.remove(); // Delete the document from the database
//     res.status(200).json({ message: "Document deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting document:", err);
//     res.status(500).json({ error: "Failed to delete document" });
//   }
// };

const deleteDocument = async (req, res) => {
  const { id } = req.params;
  //const walletAddress = req.headers["x-wallet-address"]; // lowercase header key just in case
const walletAddressRaw = req.headers["x-wallet-address"];
let walletAddress = walletAddressRaw;

try {
  // Handle if mistakenly passed as object
  walletAddress = JSON.parse(walletAddressRaw).address || walletAddressRaw;
} catch (err) {
  // It's fine if already a string
}
  console.log("Delete request for ID:", id);
  console.log("Wallet address from header:", walletAddress);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  try {
    const document = await Document.findById(id);
    if (!document) {
      console.log("Document not found in DB.");
      return res.status(404).json({ error: "Document not found" });
    }

    console.log("Found document wallet:", document.walletAddress);

    if (document.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized: Wallet mismatch" });
    }

    //await document.remove();
    await document.deleteOne(); // ✅ This works

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};


export { uploadDocument, getUserDocuments, getDocumentById, deleteDocument };
