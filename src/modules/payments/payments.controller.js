const supabase = require("../../config/supabase");
const moment = require("moment");

exports.getPaymentsByClient = async (req, res) => {
  const { clientId } = req.params;

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      months,
      amount,
      paid_from,
      paid_until,
      created_at,
      is_active,
      plans (
        name,
        price,
        id
      )
    `
    )
    .eq("clientid", clientId)
    .order("paid_from", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createPayment = async (req, res) => {
  const { clientid, planid, months, paid_from } = req.body;

  if (!months || months <= 0) {
    return res.status(400).json({ error: "Months must be greater than 0" });
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planid)
    .single();

  if (planError || !plan) {
    return res.status(400).json({ error: "Plan no encontrado" });
  }

  const startDate = moment(paid_from, "YYYY-MM-DD");

  if (!startDate.isValid()) {
    return res.status(400).json({ error: "Fecha de inicio inválida" });
  }

  const totalMonths = plan.duration_months * months;
  const endDate = startDate.clone().add(totalMonths, "months");

  const totalAmount = plan.price * months;

  const { data: payment, error } = await supabase
    .from("payments")
    .insert([
      {
        clientid,
        planid,
        months,
        amount: totalAmount,
        paid_from: startDate.format("YYYY-MM-DD"),
        paid_until: endDate.format("YYYY-MM-DD"),
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  await supabase
    .from("clients")
    .update({ status: "ACTIVE" })
    .eq("id", clientid);

  res.status(201).json(payment);
};

exports.renewPayment = async (req, res) => {
  try {
    const { clientid, planid, months } = req.body;

    if (!clientid || !planid || !months || months <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planid)
      .single();

    if (planError || !plan) {
      return res.status(400).json({ error: "Plan no encontrado" });
    }

    const { data: lastPayment, error: lastPaymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("clientid", clientid)
      .order("paid_until", { ascending: false })
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (lastPaymentError) {
      return res.status(500).json({ error: lastPaymentError.message });
    }

    const today = moment().startOf("day");
    const totalMonths = plan.duration_months * months;
    const amountToAdd = plan.price * months;

    if (lastPayment && moment(lastPayment.paid_until).isSameOrAfter(today)) {
      const newPaidUntil = moment(lastPayment.paid_until)
        .add(totalMonths, "months")
        .format("YYYY-MM-DD");

      const { data: updatedPayment, error: updateError } = await supabase
        .from("payments")
        .update({
          months: lastPayment.months + months,
          amount: Number(lastPayment.amount) + amountToAdd,
          paid_until: newPaidUntil,
        })
        .eq("id", lastPayment.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      return res.status(200).json({
        message: "Pago actualizado correctamente",
        payment: updatedPayment,
      });
    }

    await supabase
      .from("payments")
      .update({ is_active: false })
      .eq("clientid", clientid);

    const paidFrom = today;
    const paidUntil = today.clone().add(totalMonths, "months");


    const { data: newPayment, error: insertError } = await supabase
      .from("payments")
      .insert([
        {
          clientid,
          planid,
          months,
          amount: amountToAdd,
          paid_from: paidFrom.format("YYYY-MM-DD"),
          paid_until: paidUntil.format("YYYY-MM-DD"),
          is_active: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    await supabase
      .from("clients")
      .update({ status: "ACTIVE" })
      .eq("id", clientid);

    return res.status(201).json({
      message: "Nuevo pago creado correctamente",
      payment: newPayment,
    });
  } catch (err) {
    console.error("Renew payment error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
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
