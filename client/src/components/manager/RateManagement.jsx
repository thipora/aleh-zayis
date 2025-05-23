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
      <h2>ניהול תעריפים לפי עובד–תפקיד (EmployeeRoles)</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>שם עובד</TableCell>
            <TableCell>תפקיד</TableCell>
            <TableCell>תעריף לשעה</TableCell>
            <TableCell>תעריף ליחידה מיוחדת</TableCell>
            <TableCell>פעולה</TableCell>
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
                  ? `${role.special_rate} ₪ ל-${role.special_unit || 'יחידה'}`
                  : '-'}
              </TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleOpenDialog(role)}>ערוך</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>עדכון תעריפים</DialogTitle>
        <DialogContent>
          <TextField
            label="תעריף לשעה"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={`תעריף ל-${selectedRole?.special_unit || 'יחידה מיוחדת'}`}
            type="number"
            value={specialRate}
            onChange={(e) => setSpecialRate(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={handleUpdate} variant="contained">עדכן</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RateManagement;
