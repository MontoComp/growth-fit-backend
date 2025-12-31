const supabase = require('../../config/supabase');

exports.getPlansByGym = async (req, res) => {
  const { gymId } = req.params;
  const { data, error } = await supabase.from('plans').select('*').eq('gymid', gymId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createPlan = async (req, res) => {
  const { gymid, name, price, duration_months } = req.body;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('plans')
    .insert([{ gymid, name, price, duration_months, created_at: timestamp }])
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, price, duration_months } = req.body;
  const { data, error } = await supabase
    .from('plans')
    .update({ name, price, duration_months })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('plans').delete().eq('id', id).select('*').single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Plan deleted', client: data[0] });
};
