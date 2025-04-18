const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(fileUpload());

app.post("/api/remove-bg", async (req, res) => {
  try {
    const file = req.files.image;

    const tempPath = path.join(__dirname, "temp", file.name);
    await file.mv(tempPath); // Save file temporarily

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(tempPath));

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        responseType: "arraybuffer", // Get raw image data as binary
      }
    );

    fs.unlinkSync(tempPath); // delete img from temp

    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Background removal error:", error.message);
    res.status(500).json({ error: "Failed to remove background." });
  }
});

app.listen(3000, () => console.log("server is running on 3000"));
