import express from 'express';
import { getUploadPage, handleUploadAndFormat } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/upload', getUploadPage);

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Multer Error:', err.message);
      return res.redirect(`/upload?error=${encodeURIComponent(err.message)}`);
    }
    if (!req.file) {
      return res.redirect('/upload?error=No file selected!');
    }
    handleUploadAndFormat(req, res);
  });
});

export default router;
