const Attachment = require('../models/Attachment');
const upload = require('../config/upload'); // Importa la configuración de multer desde upload.js

exports.uploadAttachment = (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Datos del archivo
        const { originalname, filename } = req.file;
        const fileUrl = `/uploads/${filename}`;
        const { sol_id } = req.body; // Asegúrate de que el ID de la solicitud venga en el body

        try {
            // Crea un nuevo registro en la base de datos
            const attachment = await Attachment.create({
                att_name: originalname,
                att_url: fileUrl,
                sol_id: sol_id
            });

            // Respuesta exitosa
            res.status(200).json({ message: 'File uploaded successfully', attachment });
        } catch (error) {
            // Manejo de errores
            res.status(500).json({ error: error.message });
        }
    });
};
