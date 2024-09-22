const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const emailjs = require('emailjs-com');
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'Clave'; // Usa la clave de entorno o un valor por defecto para token

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
//Validar Correo
function validarEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
//Validacion Contraseña
function validarPassword(password) {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
  return passwordPattern.test(password);
}

exports.postRegister = async (req, res) => {
  const { per_name, per_lastname, per_mail, per_password } = req.body;

  // Recopilación de errores
  const errores = [];

  if (!per_name) {
    errores.push('El nombre es obligatorio.');
  }
  if (!per_lastname) {
    errores.push('El apellido es obligatorio.');
  }
  if (!per_mail) {
    errores.push('El correo electrónico es obligatorio.');
  } else if (!validarEmail(per_mail)) {
    errores.push('Formato de correo electrónico no válido.');
  }
  if (!per_password) {
    errores.push('La contraseña es obligatoria.');
  } else if (!validarPassword(per_password)) {
    errores.push('La contraseña debe contener entre 8 y 15 caracteres, una letra mayúscula, un número y un carácter especial.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const existingUser = await Person.findOne({ where: { per_mail } });
    if (existingUser) {
      return res.status(400).json({ errores: ['El correo electrónico ya está registrado.'] });
    }

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
    res.status(500).send('Error al registrar el usuario');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { per_mail, per_password } = req.body;

  // Recopilación de errores
  const errores = [];

  if (!per_mail) {
    errores.push('El correo electrónico es obligatorio.');
  } else if (!validarEmail(per_mail)) {
    errores.push('Formato de correo electrónico no válido.');
  }
  if (!per_password) {
    errores.push('La contraseña es obligatoria.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const person = await Person.findOne({ where: { per_mail } });
    if (person && (await bcrypt.compare(per_password, person.per_password))) {
      const token = asignarToken(person);
      res.status(201).json({ message: 'Login exitoso', token });
    } else {
      res.status(401).json({ errores: ['Credenciales incorrectas'] });
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

