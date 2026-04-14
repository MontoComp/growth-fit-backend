const supabase = require('../../config/supabase');
const moment = require("moment");

const getDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    /* ==========================
       GYMS del usuario
    ========================== */
    const { data: gyms, error: gymsError } = await supabase
      .from('gyms')
      .select('id, name')
      .eq('ownerid', userId);

    if (gymsError) throw gymsError;

    const gymIds = gyms.map(g => g.id);

    /* ==========================
       CLIENTES
    ========================== */
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .in('gymid', gymIds);

    if (clientsError) throw clientsError;

    const clientIds = clients.map(c => c.id);

    /* ==========================
       PAGOS
    ========================== */
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        id,
        clientid,
        amount,
        paid_until,
        created_at,
        clients (
          name,
          gyms ( name )
        )
      `)
      .in('clientid', clientIds)
      .order('created_at', { ascending: false });

    if (paymentsError) throw paymentsError;

    /* ==========================
       MÉTRICAS
    ========================== */
    const latestPaymentByClient = {};

    payments.forEach(p => {
      const clientId = p.clientid;

      if (!latestPaymentByClient[clientId]) {
        latestPaymentByClient[clientId] = p;
      } else {
        if (new Date(p.paid_until) > new Date(latestPaymentByClient[clientId].paid_until)) {
          latestPaymentByClient[clientId] = p;
        }
      }
    });

    const activeClientsCount = Object.values(latestPaymentByClient).filter(
      p => p.paid_until >= today
    ).length;

    const currentMonth = today.slice(0, 7);
    const revenueMonth = payments
      .filter(p => p.created_at.startsWith(currentMonth))
      .reduce((sum, p) => sum + p.amount, 0);

    /* ==========================
       INGRESOS POR MES
    ========================== */
    const revenueByMonth = {};

    payments.forEach(p => {
      const month = p.created_at.slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
    });

    const revenueChart = Object.entries(revenueByMonth)
      .slice(-6)
      .map(([month, total]) => ({ month, total }));

    /* ==========================
       ÚLTIMOS PAGOS (tabla)
    ========================== */
    const lastPayments = payments.slice(0, 5).map(p => ({
      id: p.id,
      client: p.clients?.name,
      gym: p.clients?.gyms?.name,
      amount: p.amount,
      paid_until: p.paid_until,
      status: p.paid_until < today ? 'VENCIDO' : 'PAGADO'
    }));

    res.json({
      stats: {
        totalGyms: gyms.length,
        totalClients: clients.length,
        revenueMonth,
        activeClients: activeClientsCount
      },
      revenueByMonth: revenueChart,
      lastPayments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error cargando dashboard' });
  }
};

module.exports = { getDashboardMetrics };
