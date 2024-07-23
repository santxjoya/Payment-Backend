const express = require('express');
const sequelize = require('./config/database');
const userRouter = require('./routes/users');

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

// Usa las rutas de usuarios
app.use('/api', userRouter);

const port = process.env.PORT || 800;

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos', err);
});
