const supabase = require("../../config/supabase");

exports.getClientsByGym = async (req, res) => {
  const { gymId } = req.params;
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("gymid", gymId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createClient = async (req, res) => {
  const { gymid, name, email, phone } = req.body;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("clients")
    .insert([
      { gymid, name, email, phone, created_at: timestamp, status: "INACTIVE" },
    ])
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { data, error } = await supabase
    .from("clients")
    .update({ name, email, phone })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Client deleted", client: data[0] });
};

exports.getClientsWithStatus = async (req, res) => {
  const { gymId } = req.params;
  
  const { data: clients } = await supabase.from("clients").select(`
      id, name, email, phone,
      payments (
        paid_until
      )
    `).eq("gymid", gymId);;

  const result = clients.map((client) => {
    const lastPayment = client.payments?.[0];
    const status = getClientStatus(lastPayment);

    return {
      ...client,
      status,
      paid_until: lastPayment?.paid_until || null,
    };
  });

  res.json(result);
};

function getClientStatus(payment) {
  if (!payment) return "EXPIRED";

  const today = new Date();
  const paidUntil = new Date(payment.paid_until);

  const diffDays = Math.ceil((paidUntil - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "EXPIRED";
  if (diffDays <= 5) return "WARNING";

  return "ACTIVE";
}
