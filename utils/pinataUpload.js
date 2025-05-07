import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const uploadToPinata = async (filePath) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
      },
    });
    return res.data.IpfsHash; // The CID
  } catch (err) {
    console.error("Error uploading to Pinata:", err);
    throw err;
  }
};
