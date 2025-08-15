import fs from 'fs';
import mammoth from 'mammoth';
import pdfjsLib from 'pdfjs-dist';
import { formatCvWithGemini } from '../services/geminiService.js';

export const getUploadPage = (req, res) => {
    res.render('upload', { 
        title: 'Upload CV',
        success: req.query.success,
        error: req.query.error,
    });
};

// Safe PDF text extraction using pdfjs-dist
const extractTextFromPdf = async (filePath) => {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
};

// Handle file upload and formatting
export const handleUploadAndFormat = async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect('/upload?error=No file selected!');
        }

        const filePath = req.file.path;
        let rawText = '';

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            rawText = await extractTextFromPdf(filePath);
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: filePath });
            rawText = result.value;
        } else {
            throw new Error('File type not supported for text extraction.');
        }

        // Delete the uploaded file after extracting
        fs.unlinkSync(filePath);

        if (!rawText.trim()) {
            throw new Error('Could not extract any text from the document.');
        }

        // Get formatted text from Gemini
        const formattedCvText = await formatCvWithGemini(rawText);

        // Display Gemini's response in the browser
        res.send(`
            <h1>Parsed CV Output</h1>
            <pre style="white-space: pre-wrap; font-family: Arial;">${formattedCvText}</pre>
            <br>
            <a href="/upload">Upload Another CV</a>
        `);

    } catch (error) {
        console.error("Processing Error:", error);
        res.status(500).send(`<h1>Error Processing CV</h1><p>${error.message}</p><a href="/upload">Try Again</a>`);
    }
};
