import multer from 'multer';

// Configuración para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFile = upload.any();
export default uploadFile;
