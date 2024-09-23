const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
let recoveryCodes = {};
const CODE_EXPIRATION_TIME = 60 * 60 * 1000; 
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS  
  }
});
function generarCodigo() {
  return crypto.randomBytes(3).toString('hex');
}

async function enviarCorreo(correo, codigo) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Recuperación de Contraseña',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4CAF50;
            padding: 10px;
            text-align: center;
            color: #ffffff;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .content p {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            border: 1px dashed #4CAF50;
            display: inline-block;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 10px;
          }
        </style>
      </head>
      <body>

        <div class="email-container">
          <div class="header">
            <h1>Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Has solicitado recuperar tu contraseña. Usa el siguiente código para restablecerla:</p>
            <div class="code">${codigo}</div> <!-- Aquí se inserta el código dinámicamente -->
          </div>
          <div class="footer">
          </div>
        </div>

      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado');
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}
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
