const express = require('express');
const app = express();
app.use(express.json())


app.get('/', (req, res) => {
    res.json({ message: '¡Hola desde la API!' });
});

const port = process.env.port || 80;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
