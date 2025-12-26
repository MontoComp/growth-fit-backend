const supabase = require('../../config/supabase');

exports.getAllGyms = async (req, res) => {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('ownerid', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createGym = async (req, res) => {
  const { name, address } = req.body;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('gyms')
    .insert([
      {
        name,
        address,
        ownerid: req.user.id,
        created_at: timestamp,
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.updateGym = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('gyms')
    .update({
      name,
      address,
      updated_at: timestamp
    })
    .eq('id', id)
    .eq('ownerid', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

exports.deleteGym = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('gyms')
    .delete()
    .eq('id', id)
    .eq('ownerid', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: 'Gym deleted',
    gym: data
  });
};
