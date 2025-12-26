const supabase = require('../../config/supabase');

exports.getClients = async (req, res) => {
  const { gymId } = req.query;
  const { data, error } = await supabase.from('clients').select('*').eq('gymId', gymId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createClient = async (req, res) => {
  const { gymId, name, email, phone } = req.body;
  const { data, error } = await supabase
    .from('clients')
    .insert([{ gymId, name, email, phone }])
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { data, error } = await supabase
    .from('clients')
    .update({ name, email, phone })
    .eq('id', id)
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('clients').delete().eq('id', id).select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Client deleted', client: data[0] });
};
