const express = require('express');
const sequelize = require('./config/database');
const personRouter = require('./routes/persons');
const areaRouter = require('./routes/areas');
const rolRouter = require('./routes/roles');
const AuthRouter = require('./routes/Auth');
const cors = require('cors');

const app = express();
app.use(express.json());

// Configura CORS
app.use(cors({
    origin: 'http://127.0.0.1:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permite el envío de credenciales
}));

// Middleware de registro de solicitudes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Usa las rutas
app.use('/api', personRouter);
app.use('/api', areaRouter);
app.use('/api', rolRouter);
app.use('/api', AuthRouter);

const port = process.env.PORT || 8000;

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos', err);
});
