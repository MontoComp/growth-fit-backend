const supabase = require('../../config/supabase');

exports.getClientsByGym = async (req, res) => {
  console.log('Fetching clients for gym:', req.params.gymId);
  const { gymId } = req.params;
  const { data, error } = await supabase.from('clients').select('*').eq('gymid', gymId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createClient = async (req, res) => {
  const { gymid, name, email, phone } = req.body;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('clients')
    .insert([{ gymid, name, email, phone, created_at: timestamp }])
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, status } = req.body;
  const { data, error } = await supabase
    .from('clients')
    .update({ name, email, phone, status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('clients').delete().eq('id', id).select('*').single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Client deleted', client: data[0] });
};
