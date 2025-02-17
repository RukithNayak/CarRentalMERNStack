import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the uploads directory path
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define uploads directory (parent folder)
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create the directory if it doesn't exist
}

// Define a storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Specify the folder where files should be stored
  },
  filename: (req, file, cb) => {
    // Get the file extension from the MIME type
    const ext = path.extname(file.originalname);
    // Generate a unique filename for the file with its extension
    cb(null, Date.now() + ext); // Use timestamp to avoid name collisions
  }
});

// Initialize multer with the storage engine and file filter (optional)
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow jpg, jpeg, and png files
    const filetypes = /jpg|jpeg|png|webp|avif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
    }
  }
});

export default upload;
