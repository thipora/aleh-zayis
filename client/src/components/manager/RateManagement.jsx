import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TextField,
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { APIrequests } from "../../APIrequests";

const RateManagement = () => {
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [hourlyRate, setHourlyRate] = useState('');
  const [specialRate, setSpecialRate] = useState('');

  const api = new APIrequests();
  const { t } = useTranslation();



  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const data = await api.getRequest('/employee-roles');
    setRoles(data);
  };

  const handleOpenDialog = (role) => {
    setSelectedRole(role);
    setHourlyRate(role.hourly_rate || '');
    setSpecialRate(role.special_rate || '');
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    await api.putRequest(`/employee-roles/${selectedRole.id_employee_role}/rates`, {
      hourly_rate: hourlyRate,
      special_rate: specialRate
    });
    setOpenDialog(false);
    fetchRoles();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{t("RateManagement.title")}</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("RateManagement.employeeName")}</TableCell>
            <TableCell>{t("RateManagement.roleName")}</TableCell>
            <TableCell>{t("RateManagement.hourlyRate")}</TableCell>
            <TableCell>{t("RateManagement.specialRate")}</TableCell>
            <TableCell>{t("RateManagement.action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id_employee_role}>
              <TableCell>{role.employee_name}</TableCell>
              <TableCell>{role.role_name}</TableCell>
              <TableCell>{role.hourly_rate ?? '-'}</TableCell>
              <TableCell>
                {role.special_rate
                  ? `${role.special_rate} ₪ ${t("RateManagement.perUnit", { unit: role.special_unit || t("RateManagement.defaultUnit") })}`
                  : '-'}
              </TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleOpenDialog(role)}>
                  {t("RateManagement.edit")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("RateManagement.dialogTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("RateManagement.hourlyRate")}
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t("RateManagement.specialRateWithUnit", {
              unit: selectedRole?.special_unit || t("RateManagement.defaultUnit")
            })}
            type="number"
            value={specialRate}
            onChange={(e) => setSpecialRate(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t("RateManagement.cancel")}</Button>
          <Button onClick={handleUpdate} variant="contained">{t("RateManagement.update")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RateManagement;
