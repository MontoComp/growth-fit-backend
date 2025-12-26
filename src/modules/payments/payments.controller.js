const supabase = require('../../config/supabase');

exports.getPayments = async (req, res) => {
  const { clientId } = req.query;
  const { data, error } = await supabase.from('payments').select('*').eq('clientId', clientId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createPayment = async (req, res) => {
  const { clientId, amount, date, status } = req.body;
  const { data, error } = await supabase
    .from('payments')
    .insert([{ clientId, amount, date, status }])
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, date, status } = req.body;
  const { data, error } = await supabase
    .from('payments')
    .update({ amount, date, status })
    .eq('id', id)
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('payments').delete().eq('id', id).select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Payment deleted', payment: data[0] });
};
