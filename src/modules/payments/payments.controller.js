const supabase = require("../../config/supabase");

exports.getPaymentsByClient = async (req, res) => {
  const { clientId } = req.params;

  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      months,
      amount,
      paid_from,
      paid_until,
      created_at,
      plans (
        name,
        price
      )
    `)
    .eq('clientid', clientId)
    .order('paid_from', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createPayment = async (req, res) => {
  const { clientid, planid, months, paid_from } = req.body;

  if (!months || months <= 0) {
    return res.status(400).json({ error: 'Months must be greater than 0' });
  }

  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planid)
    .single();

  if (planError || !plan) {
    return res.status(400).json({ error: 'Plan no encontrado' });
  }

  const startDate = new Date(paid_from);

  const totalMonths = plan.duration_months * months;

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + totalMonths);

  const totalAmount = plan.price * months;

  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      clientid,
      planid,
      months,
      amount: totalAmount,
      paid_from: startDate.toISOString(),
      paid_until: endDate.toISOString(),
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  await supabase
    .from('clients')
    .update({ status: 'ACTIVE' })
    .eq('id', clientid);

  res.status(201).json(payment);
};

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, paid_from, paid_until, status } = req.body;

  const { data, error } = await supabase
    .from("payments")
    .update({ amount, paid_from, paid_until, status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Payment deleted", payment: data });
};
