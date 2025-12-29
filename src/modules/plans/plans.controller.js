const supabase = require('../../config/supabase');

exports.getPlansByGym = async (req, res) => {
  const { gymId } = req.params;
  const { data, error } = await supabase.from('plans').select('*').eq('gymid', gymId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};