import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/index.css";
import instruction1 from "../src/assets/spanish-latte.jpg";
import instruction2 from "../src/assets/food.jpg";
import aboutUsImg from "../src/assets/aboutUsImg.jpeg";
import logo from "../src/assets/agapeDark.png";

const supabase = createClient(
  "https://fyzooojdcaytzchmtvmu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5em9vb2pkY2F5dHpjaG10dm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzA5NTQsImV4cCI6MjA1OTgwNjk1NH0.gl5i4Y7EfblgCmZRzt4J6QGKBPquJwatvuxze9E0XOs"
);

function UploadForm() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleProductNameChange = (e) => setProductName(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select an image file.");

    setIsLoading(true);
    try {
      const filename = productName
        ? `${productName.replace(/\s+/g, "-")}-${Date.now()}${file.name.slice(
            file.name.lastIndexOf(".")
          )}`
        : `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("agapecapstoneprojectproductuploader")
        .upload(`images/${filename}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.success("Image uploaded successfully!");
        setFile(null);
        setProductName("");
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <img src={logo} alt="Agape Cafe: Coffee | Kitchen" />
      <h2>A capstone Project</h2>
      <p>
        <span>Instruction:</span> Kindly take a photo of the product that you
        order like this image below:
      </p>
      <div className="instructionImg">
        <img src={instruction1} alt="instruction1" />
        <img src={instruction2} alt="instruction2" />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={handleProductNameChange}
          placeholder="Ex. Spanish Latte"
          required
        />

        <label htmlFor="file">Product Image:</label>
        <div className="showPreview">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                marginTop: "10px",
                width: "auto",
                borderRadius: "10px",
              }}
            />
          )}
        </div>

        <button type="submit">Upload</button>
      </form>
      <p
        style={{
          margin: 0,
          fontSize: 10,
          textAlign: "justify",
          padding: 10,
          color: "#ff0000",
        }}>
        <span style={{ fontWeight: 900 }}>Note:</span> This website is
        "optional" but we appreciate you to fill out the forms. Also this
        website doesn't track your location or take your data, it only collects
        the following user inputs (Product Name, Product Image).
      </p>
      <ToastContainer />

      <div className="aboutUs">
        <h1>About us</h1>
        <img src={aboutUsImg} alt="aboutUsImage" />
        <p>
          We are BSIT students of PUP Sta Maria Bulacan. Our course required us
          to do capstone project for this semester and as a students who
          struggle financially we are here asking all
          <span style={{ margin: 0 }}> agape cafe </span>customer for help.
          Thank you and may God Bless.
        </p>
      </div>
    </div>
  );
}

export default UploadForm;
