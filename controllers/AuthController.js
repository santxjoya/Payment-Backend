const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const  emailjs = require('emailjs-com');
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
function validarEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
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
// Códigos de recuperación de contraseña
let recoveryCodes = {};
const CODE_EXPIRATION_TIME = 60 * 60 * 1000; 
// Generar código de recuperación
function generarCodigo() {
  return crypto.randomBytes(3).toString('hex');
}

// Enviar correo con código de recuperación usando EmailJS
async function enviarCorreo(correo, codigo) {
  const templateParams = {
    to_email: correo,
    recovery_code: codigo,
  };
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.EMAILJS_USER_ID
    );
    console.log('Correo enviado');
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

// Solicitar recuperación de contraseña
exports.postForgotPassword = async (req, res) => {
  const { per_mail } = req.body;

  try {
    const person = await Person.findOne({ where: { per_mail } });
    if (person) {
      const codigo = generarCodigo();
      recoveryCodes[per_mail] = {
        codigo: codigo,
        timestamp: Date.now(),
      };
      await enviarCorreo(per_mail, codigo);
      res.status(200).json({
        message: 'Código de recuperación enviado al correo',
        recovery_code: codigo,
      });
    } else {
      res.status(404).send('Correo no registrado');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al enviar el correo de recuperación');
  }
};

// Verificación del código de recuperación
exports.postVerifyCode = async (req, res) => {
  const { per_mail, recovery_code } = req.body;

  try {
    const recoveryData = recoveryCodes[per_mail];
    if (!recoveryData || Date.now() - recoveryData.timestamp > CODE_EXPIRATION_TIME) {
      return res.status(400).send('Código de recuperación inválido o expirado');
    }

    if (recoveryData.codigo !== recovery_code) {
      return res.status(400).send('Código de recuperación incorrecto');
    }

    res.status(200).send('Código de verificación correcto. Puedes proceder a cambiar la contraseña.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al verificar el código de recuperación');
  }
};

// Restablecer contraseña
exports.postResetPassword = async (req, res) => {
  const { per_mail, new_password } = req.body;

  const errores = [];

  if (!validarPassword(new_password)) {
    errores.push('La nueva contraseña debe cumplir con el formato requerido.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const person = await Person.findOne({ where: { per_mail } });
    if (!person) {
      return res.status(404).send('Correo no registrado');
    }

    const recoveryData = recoveryCodes[per_mail];
    if (!recoveryData) {
      return res.status(400).send('Código de recuperación no ha sido verificado');
    }

    const ProteccionPassword = await bcrypt.hash(new_password, 10);
    person.per_password = ProteccionPassword;
    await person.save();

    delete recoveryCodes[per_mail]; // Eliminar el código de recuperación después de ser usado
    res.status(200).send('Contraseña restablecida correctamente');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al restablecer la contraseña');
  }
};