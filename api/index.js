const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");

const app = express();

// Configure CORS
app.use(cors({
  origin: 'https://asi-equipment-management-system.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure body parser
app.use(bodyParser.json({ limit: "20mb" }));

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // Max file size: 20MB
});

// Database connection
mongoose
  .connect("mongodb+srv://asi-ems-admin:L8BwSiDNtXSwPXxO@asi-ems.rhqk5fi.mongodb.net/?retryWrites=true&w=majority&appName=asi-ems", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB"))
  .catch(console.error);

const Document = require("./models/Document");
const Admin = require("./models/Admin");

app.get("/", (req, res) => {
  res.send("Express");
});

app.get("/documents", async (req, res) => {
  const documents = await Document.find();
  res.json(documents);
});

app.get("/admins", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

// Handle file upload
app.post("/document/new", upload.single("documentCopy"), async (req, res) => {
  try {
    const document = new Document({
      documentType: req.body.documentType,
      documentNumber: req.body.documentNumber,
      uploaderName: req.body.uploaderName,
      description: req.body.description,
      dateAcquired: req.body.dateAcquired,
      quantity: req.body.quantity,
      documentCopy: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await document.save();
    res.status(201).json({ message: "Document added successfully" });
  } catch (error) {
    console.error("Error adding document:", error.message);
    res.status(500).json({ error: "Failed to add document" });
  }
});

app.delete("/admin/document/delete/:id", async (req, res) => {
  try {
    const result = await Document.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting document:", error.message);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

app.post('/admin/create', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

app.post("/admin/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Admin signed in successfully" });
  } catch (error) {
    console.error("Error signing in admin:", error.message);
    res.status(500).json({ error: "Failed to sign in admin" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on Port ${port}`));

module.exports = app;
