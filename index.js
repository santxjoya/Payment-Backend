const express = require('express');
const sequelize = require('./config/database');
const personRouter = require('./routes/persons');
const areaRouter = require('./routes/areas');
const rolRouter = require('./routes/roles');
const AuthRouter = require('./routes/Auth');


const app = express();
app.use(express.json());

// Middleware de registro de solicitudes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({ message: '¡Hola desde la API!' });
});

// Usa las rutas
app.use('/api', personRouter);
app.use('/api', areaRouter);
app.use('/api', rolRouter);
app.use('/api', AuthRouter);

const port = process.env.PORT || 8080;

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos', err);
});
