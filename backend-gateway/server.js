const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const parsePDF = require('pdf-parse'); // 🌟 Clean Node.js require syntax

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    console.log(`📦 Processing file: ${req.file ? req.file.originalname : 'No file'}`);
    
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No resume file uploaded." });
    }

    const filePath = req.file.path;

    try {
        // 1. Read file buffer
        const fileBuffer = fs.readFileSync(filePath);
        
        // 2. Parse text directly using the stable function syntax
        const pdfData = await parsePDF(fileBuffer);
        const extractedText = pdfData.text;

        if (!extractedText || !extractedText.trim()) {
            throw new Error("PDF parsing resulted in empty text content.");
        }

        // 3. Forward text payload to Python NLP service on port 8000
        const pythonResponse = await axios.post('http://127.0.0.1:8000/process-job', {
            resume_text: extractedText,
            job_description: req.body.jobDescription
        });

        // Clean up temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // 4. Send back dynamic percentage arrays
        return res.json({
            success: true,
            matchResults: pythonResponse.data
        });

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error(`❌ Cross-Service Communication Failure: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: `Gateway error: ${error.message}`
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js Gateway running smoothly on http://localhost:${PORT}`);
});