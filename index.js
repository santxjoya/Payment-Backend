const express = require('express');
const sequelize = require('./config/database');
const personRouter = require('./routes/persons');
const areaRouter = require('./routes/areas');
const rolRouter = require('./routes/roles');
const AuthRouter = require('./routes/Auth');
const SuppliersRouter = require('./routes/suppliers');
const CurrencieRouter = require ('./routes/currencies');
const TypeSolicitationsRouter = require ('./routes/type_solicitations');
const SolicitationsRouter = require ('./routes/solicitations');
const { authenticateToken } = require('./controllers/AuthController');
const cors = require('cors');

const app = express();
app.use(express.json());

// Configura CORS
app.use(cors({
    origin: 'http://localhost:8080', // Especifica el origen permitido (el frontend)
    credentials: true, // Permite el envío de credenciales (cookies, auth headers, etc.)
  }));
  app.options('*', cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
// Usa las rutas
app.use('/api', AuthRouter);

app.use('/api',authenticateToken,personRouter);
app.use('/api',authenticateToken,areaRouter);
app.use('/api',authenticateToken,rolRouter);
app.use('/api',authenticateToken,SuppliersRouter);
app.use('/api',authenticateToken,CurrencieRouter);
app.use('/api',authenticateToken,TypeSolicitationsRouter);
app.use('/api',authenticateToken,SolicitationsRouter);

const port = process.env.PORT;

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos', err);
});
