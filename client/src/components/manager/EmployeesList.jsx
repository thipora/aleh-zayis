import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Box, Button, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import RateDialog from "./RateDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EmployeeList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const navigate = useNavigate();
  const api = new APIrequests();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.getRequest("/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchName = emp.name.toLowerCase().includes(filterName.toLowerCase());
    const matchAvailability = filterAvailability ? emp.availability_status === filterAvailability : true;
    const matchRole = filterRole ? emp.roles.includes(filterRole) : true;
    return matchName && matchAvailability && matchRole;
  });

  const allRoles = [...new Set(employees.flatMap(emp => emp.roles))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("employeeList.title")}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label={t("employeeList.searchName")}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("availability.availability")}</InputLabel>
          <Select
            value={filterAvailability}
            label={t("availability.availability")}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <MenuItem value="">{t("availability.all")}</MenuItem>
            <MenuItem value="available">{t("availability.available")}</MenuItem>
            <MenuItem value="partial">{t("availability.partial")}</MenuItem>
            <MenuItem value="not_available">{t("availability.notAvailable")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("employeeList.role")}</InputLabel>
          <Select
            value={filterRole}
            label={t("employeeList.role")}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="">{t("employeeList.all")}</MenuItem>
            {allRoles.map((role, i) => (
              <MenuItem key={i} value={role}>{t(`roles.${role}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ mb: 4, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("employeeList.name")}</TableCell>
              <TableCell>{t("availability.availabilityStatus")}</TableCell>
              <TableCell>{t("employeeList.email")}</TableCell>
              <TableCell>{t("employeeList.roles")}</TableCell>
              <TableCell align="center">{t("employeeList.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map(emp => (
              <TableRow key={emp.id_employee}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{t(`availability.${emp.availability_status}`)}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.roles.map((role, i) => t(`roles.${role}`)).join(",  ")}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      navigate(`/manager/employee/${emp.id_employee}/work`, {
                        state: { name: emp.name },
                      })
                    }
                  >
                    {t("employeeList.viewWork")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpenRateDialog(true);
                    }}
                  >
                    {t("employeeList.editRates")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {selectedEmployee && (
        <RateDialog
          open={openRateDialog}
          onClose={() => setOpenRateDialog(false)}
          employeeId={selectedEmployee.id_employee}
          employeeName={selectedEmployee.name}
        />
      )}
    </Box>
  );
};

export default EmployeeList;
