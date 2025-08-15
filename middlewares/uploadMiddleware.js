import multer from 'multer';
import path from 'path';

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  allowedMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Invalid file type. Only PDF, DOCX, and XLSX are allowed.'), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter
}).single('cvFile');
