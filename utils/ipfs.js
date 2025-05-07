//const axios = require("axios");
import axios from "axios";
//const FormData = require("form-data");
import FormData from "form-data";
//const fs = require("fs");
import dotenv from "dotenv";

import  fs from "fs";
//require("dotenv").config();
dotenv.config();


const uploadToIPFS = async (filePath) => {
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
      },
    }
  );

  return res.data.IpfsHash;
};

export default { uploadToIPFS };
