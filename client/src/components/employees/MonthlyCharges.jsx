import { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Table, TableHead, TableBody, TableRow, TableCell, Snackbar, Alert } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";


const MonthlyCharges = ({ employeeId }) => {
  const [charges, setCharges] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCharge, setNewCharge] = useState({ charge_name: "", amount: "", notes: "" });
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const { t } = useTranslation();

  const api = new APIrequests();

  const fetchCharges = async () => {
    try {
      const data = await api.getRequest(`/monthly-charges/${employeeId}`);
      setCharges(data);
    } catch (error) {
      console.error("Failed to fetch charges", error);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCharge((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.postRequest("/monthly-charges", {
        employee_id: employeeId,
        ...newCharge
      });
      setOpen(false);
      setNewCharge({ charge_name: "", amount: "", notes: "" });
      fetchCharges();
      setSuccessMessageOpen(true);
    } catch (error) {
      console.error("שגיאה בהוספה", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("האם את/ה בטוח/ה שברצונך למחוק את התשלום?")) return;
    try {
      await api.deleteRequest(`/monthly-charges/${id}`);
      fetchCharges();
      setSuccessMessageOpen(true);
    } catch (error) {
      console.error("שגיאה במחיקה", error);
    }
  };

  return (
  <Box sx={{ mt: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("monthlyCharges.name")}</TableCell>
          <TableCell>{t("monthlyCharges.amount")}</TableCell>
          <TableCell>{t("monthlyCharges.notes")}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {charges.map((charge) => (
          <TableRow key={charge.id_monthly_charges}>
            <TableCell>{charge.charge_name}</TableCell>
            <TableCell>{charge.amount} ₪</TableCell>
            <TableCell>{charge.notes}</TableCell>
            <TableCell>
              <Button color="error" onClick={() => handleDelete(charge.id_monthly_charges)}>
                {t("monthlyCharges.delete")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
      {t("monthlyCharges.add")}
    </Button>

    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{t("monthlyCharges.dialogTitle")}</DialogTitle>
      <DialogContent>
        <TextField
          label={t("monthlyCharges.name")}
          name="charge_name"
          fullWidth
          value={newCharge.charge_name}
          onChange={handleChange}
          sx={{ my: 1 }}
        />
        <TextField
          label={t("monthlyCharges.amount")}
          name="amount"
          type="number"
          fullWidth
          value={newCharge.amount}
          onChange={handleChange}
          sx={{ my: 1 }}
        />
        <TextField
          label={t("monthlyCharges.notes")}
          name="notes"
          multiline
          rows={3}
          fullWidth
          value={newCharge.notes}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t("monthlyCharges.save")}</Button>
        <Button onClick={() => setOpen(false)}>{t("monthlyCharges.cancel")}</Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={successMessageOpen}
      autoHideDuration={3000}
      onClose={() => setSuccessMessageOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={() => setSuccessMessageOpen(false)} severity="success" sx={{ width: '100%' }}>
        {t("monthlyCharges.success")}
      </Alert>
    </Snackbar>
  </Box>
);

};

export default MonthlyCharges;
