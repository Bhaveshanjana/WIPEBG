const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const FormData = require("form-data");
const fileUpload = require("express-fileupload");
const axios = require("axios");

app.use(fileUpload());
app.use(cors());

app.post("/api/remove-bg", async (req, res) => {
  try {
    const file = req.files.image;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const formData = new FormData();
    formData.append("image_file", file.data, {
      filename: file.name,
      contentType: file.mimetype,
    });

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

    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Background removal error:", error.message);
    res.status(500).json({ error: "Failed to remove background." });
  }
});

app.listen(3000, () => console.log("server is running on 3000"));
