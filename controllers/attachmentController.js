const Attachment = require('../models/Attachment');
const upload = require('../config/upload');

// Función para manejar la subida de archivos adjuntos
exports.uploadAttachment = (req, res) => {
    upload.single('file')(req, res, async (err) => {
        // Manejo de errores de Multer
        if (err) {
            return res.status(500).json({ error: `Error al cargar el archivo: ${err.message}` });
        }

        // Verificación de archivo cargado
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha recibido ningún archivo.' });
        }

        const { originalname, filename } = req.file;
        const fileUrl = `/uploads/${filename}`;
        const { sol_id } = req.body;

        // Validación de sol_id
        if (!sol_id) {
            return res.status(400).json({ error: 'El ID de la solicitud (sol_id) es obligatorio.' });
        }

        try {
            // Crear el adjunto en la base de datos
            const attachment = await Attachment.create({
                att_name: originalname,
                att_url: fileUrl,
                sol_id: sol_id
            });

            // Respuesta exitosa con detalles del archivo
            res.status(201).json({
                message: 'Archivo subido exitosamente.',
                attachment: {
                    id: attachment.id,
                    name: attachment.att_name,
                    url: attachment.att_url,
                    createdAt: attachment.createdAt
                }
            });

        } catch (error) {
            console.error('Error al guardar el adjunto:', error);
            res.status(500).json({ error: 'Error al procesar el archivo. Intente de nuevo más tarde.' });
        }
    });
};
