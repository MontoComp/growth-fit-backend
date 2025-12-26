const supabase = require('../../config/supabase');

exports.getAllGyms = async (req, res) => {
  const { data, error } = await supabase.from('gyms').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createGym = async (req, res) => {
  const { name, address } = req.body;
  const { data, error } = await supabase
    .from('gyms')
    .insert([{ name, address, ownerid: req.user.id }])
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.updateGym = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const { data, error } = await supabase
    .from('gyms')
    .update({ name, address })
    .eq('id', id)
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deleteGym = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('gyms').delete().eq('id', id).select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Gym deleted', gym: data[0] });
};
