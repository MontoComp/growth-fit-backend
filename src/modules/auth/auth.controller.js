const supabase = require('../../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, dni, phone, country } = req.body;

    if (!email || !password || !dni || !phone || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (users.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hash,
          dni,
          phone,
          country,
          role: 'ROL0001' // o el nombre real
        }
      ])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.id,
        email: data.email,
        role: data.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { data: roleData, error: roleError } = await supabase.from('roles').select('*').eq('role_code', user.role).single();

    if (roleError) throw roleError;

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        role_description : roleData ? roleData.role_description : null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

