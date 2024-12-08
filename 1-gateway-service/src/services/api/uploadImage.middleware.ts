import path from 'path';
import fs from 'fs';

import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';


// Crear la carpeta "images" si no existe
const imagesDirectory = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}

// Tamaño máximo permitido: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

// Configurar almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, imagesDirectory); // Carpeta donde se guardarán las imágenes
  },
  filename: (_, file, cb) => {
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtro de archivos
const fileFilter = (_: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and GIF are allowed.'));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single('image');

export function imageUploadMiddleware(req: Request, res: Response, next: NextFunction): void {
  upload(req, res, (err) => {
    if (err instanceof MulterError) {
      // Manejo de errores específicos de multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the maximum limit of 5 MB.' });
      }
      return res.status(400).json({ error: 'An error occurred while uploading the file.' });
    } else if (err) {
      // Manejo de otros errores
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided. Please upload an image.' });
    }

    // Si todo está bien, pasa al siguiente middleware
    next();
  });
}
