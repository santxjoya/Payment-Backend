const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Clave';

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

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { per_name, per_lastname, per_mail, per_password } = req.body;
  const ProteccionPassword = await bcrypt.hash(per_password, 10);
  try {
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

exports.authenticateToken= async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      req.user = user;
      next();
  });
};