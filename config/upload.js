const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que la carpeta 'uploads/' existe
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único del archivo
    }
});

// Filtro de archivos (opcional)
const fileFilter = (req, file, cb) => {
    // Aceptar solo ciertos tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error('Tipo de archivo no permitido'), false); // Rechazar el archivo
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limitar a 5 MB
});

module.exports = upload;
