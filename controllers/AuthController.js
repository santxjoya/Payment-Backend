const Person = require('../models/Person');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
 
    const{ Name, lastName, email ,password ,rol ,area } = req.boody;
try{

    const person = await Person.create ({ Name, lastName, email ,password});
    const token = jwt.sign({ id: person._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
    res.status(201).json({ token });
} catch (err) {
  res.status(400).json({ error: err.message });
}
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
  
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };