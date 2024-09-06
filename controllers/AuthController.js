const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'Clave'; // Usa la clave de entorno o un valor por defecto

// Función para generar el token JWT
function asignarToken(person) {
  return jwt.sign(
    {
      id: person.per_id,
      email: person.per_mail,
      rol: person.rol_id
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

exports.postRegister = async (req, res) => {
  const { per_name, per_lastname, per_mail, per_password } = req.body;
  try {
    const ProteccionPassword = await bcrypt.hash(per_password, 10);
    await Person.create({
      per_name,
      per_lastname,
      per_mail,
      per_password: ProteccionPassword,
      per_status: 1,
      rol_id: 1
    });
    res.status(200).send('Se registró correctamente');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al registrar el Usuario');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { per_mail, per_password } = req.body;
  try {
    const person = await Person.findOne({ where: { per_mail } });
    if (person && (await bcrypt.compare(per_password, person.per_password))) {
      const token = asignarToken(person);
      res.status(201).json({ message: 'Login exitoso', token });
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al autenticar');
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
