const supabase = require('../../config/supabase');

exports.getPaymentsByClient = async (req, res) => {
  const { clientId } = req.params;
  const { data, error } = await supabase.from('payments').select('*').eq('clientid', clientId).order('paid_from', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createPayment = async (req, res) => {
  const { clientid, amount, paid_from, paid_until, status } = req.body;

  const { data, error } = await supabase
    .from('payments')
    .insert([{ clientid, amount, paid_from, paid_until, status }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, paid_from, paid_until, status } = req.body;

  const { data, error } = await supabase
    .from('payments')
    .update({ amount, paid_from, paid_until, status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Payment deleted', payment: data });
};
