const Person = require('../models/Person');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const {  per_name, per_lastname, per_mail, per_password } = req.body;
  const ProteccionPassword = await bcrypt.hash(per_password, 10);
  try {
    await Person.create({
      per_name,
      per_lastname,
      per_mail,
      per_password: ProteccionPassword,
      per_status: 1, // Asignar estado activo por defecto
      rol_id: 1 // Asignar rol de Usuario por defecto (2: Usuario)
    });
    res.status(200).send('Se registro correctamente');
   // res.redirect('/login');
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
      res.status(201).send('Login exitoso');
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al autenticar');
  }
};