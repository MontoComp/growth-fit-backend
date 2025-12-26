const supabase = require("../../config/supabase");

const getGenericsRoles = async (req, res) => {
  try {
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("*");

    if (rolesError) throw rolesError;

    res.json({
      roles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando dashboard" });
  }
};

module.exports = { getGenericsRoles };
