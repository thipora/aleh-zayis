export const formatCurrency = (currency) => {
  return currency === "USD" ? "$" : "₪";
};

export const calculateTotalsByCurrency = (employees) => {
  const totals = {};
  employees.forEach(emp => {
    if (!totals[emp.currency]) {
      totals[emp.currency] = 0;
    }
    totals[emp.currency] += emp.total;
  });
  return totals;
};

export const formatHours = (quantity, t) => {
  const q = parseFloat(quantity);
  if (isNaN(q)) return "";
  const hours = Math.floor(q);
  const minutes = Math.round((q - hours) * 60);
  let str = "";
  if (hours > 0) str += `${hours} ${t("specialUnits.hours")}`;
  if (minutes > 0) str += (hours > 0 ? ` ${t("employeeReport.and")} ` : "") + `${minutes} ${t("specialUnits.minutes")}`;
  if (!str) str = `0 ${t("specialUnits.minutes")}`;
  return str;
};