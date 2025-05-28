import React, { useState, useEffect } from "react";
import { MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, TextField, Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../workEntries/WorkEntries.jsx";
import ErrorNotification from "../common/ErrorNotification";
import AddWorkDialog from "../workEntries/AddWorkDialog";
import AssignedBooksList from "./AssignedBooksList.jsx"
import EmployeeReport from "../reports/EmployeeReport";
import AddBookDialog from "./AddBookDialog.jsx";
import ChangePassword from "../auth/ChangePassword.jsx";
import MonthlyCharges from "./MonthlyCharges.jsx";
import { useTranslation } from "react-i18next";



const EmployeeDashboard = () => {
  const [workEntries, setWorkEntries] = useState([]);
  const [newWorkEntrie, setNewWork] = useState({
    book_id: "",
    quantity: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openMonthSummary, setOpenMonthSummary] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthSummary, setMonthSummary] = useState([]);
  const [months, setMonths] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [role, setRole] = useState(null);
  const [openAddBook, setOpenAddBook] = useState(false);
  const [bookId, setBookId] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [openAssignedBooksDialog, setOpenAssignedBooksDialog] = useState(false);
  const [showEmployeeReport, setShowEmployeeReport] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [openMonthlyChargesDialog, setOpenMonthlyChargesDialog] = useState(false);
  const { t } = useTranslation();
  const now = new Date();




  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const employeeId = user.employee_id;


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.availability_status) {
        setAvailabilityStatus(user.availability_status);
      }
    }
  }, []);

  const apiRequests = new APIrequests();


  const handleAvailabilityChange = async (newStatus) => {
    setAvailabilityStatus(newStatus);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.availability_status = newStatus;
    localStorage.setItem("user", JSON.stringify(user));

    const employeeId = user?.employee_id;
    if (!employeeId) return alert("לא נמצאה מזהה עובד");

    try {
      await apiRequests.putRequest(`/employees/${employeeId}/availability`, {
        availability_status: newStatus
      });
      console.log("Availability status updated");
    } catch (err) {
      alert("שגיאה בעדכון הסטטוס");
    }
  };



  const handleOpenAddWork = async () => {
    setLoadingBooks(true);
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);

      const booksData = await apiRequests.getRequest(`/books/${user.employee_id}`);
      setBooks(booksData);

      const ids = user.roles.join(',');
      const roleData = await apiRequests.getRequest(`/roles?ids=${ids}`);

      setRole(roleData);

      setOpen(true);

    } catch (err) {
      setBooks([]);
      setError("Failed to load data.");
    }
    setLoadingBooks(false);
  };


  const handleAddWork = async (newWorkData) => {
    try {
      const { book_id, book_name, quantity, description, notes, is_special_work, date, start_time, end_time } = newWorkData;
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const employeeId = user?.employee_id;
      const roleId = user?.roles[0];
      const currentDate = new Date().toISOString().split('T')[0];

      await apiRequests.postRequest(`/workEntries/${employeeId}`, {
        roleId,
        book_id,
        book_name,
        quantity,
        description,
        notes,
        date,
        is_special_work,
        start_time,
        end_time
      });

      setWorkEntries((prevWorkEntries) => [...prevWorkEntries, { ...newWorkData, is_special_work }]);
      setNewWork({ book_id: "", quantity: "", description: "", notes: "", is_special_work: false, date: currentDate });
      setOpen(false);
      fetchWorkEntries();
    } catch (err) {
      setError("Failed to add work log");
    }
  };

  const handleUpdateWork = async (updatedWork) => {
    try {
      await apiRequests.putRequest(`/workEntries/${updatedWork.id_work_entries}`, updatedWork);
      fetchWorkEntries();
    } catch (err) {
      setError("Failed to update work log");
    }
  };

  const extractMonths = (entries) => {
    const uniqueMonths = [...new Set(entries.map(e => e.date.substring(0, 7)))];
    return uniqueMonths.sort().reverse();
  };

  const fetchWorkEntries = async () => {
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const data = await apiRequests.getRequest(`/workEntries/${user.employee_id}`);
      setWorkEntries(data);
      setMonths(extractMonths(data));
      if (!books.length) {
        const booksData = await apiRequests.getRequest(`/books/${user.employee_id}`);
        setBooks(booksData);
      }
    } catch (err) {
      setError("Failed to fetch work logs");
    }
  };

  const handleOpenMonthSummary = () => setShowEmployeeReport(true);

  const handleCloseMonthSummary = () => setOpenMonthSummary(false);

  const handleFetchMonthSummary = async () => {
    if (!selectedMonth) return;
    setLoadingSummary(true);
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const url = `/summary/byMonth/${user.employee_id}?month=${selectedMonth}`;
      const summary = await apiRequests.getRequest(url);
      setMonthSummary(summary);
    } catch {
      setError("Failed to load summary");
    }
    setLoadingSummary(false);
  };

  const handleAddBook = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = user?.employee_id;
    const bookClickUpId = bookId;

    const selectedRoleIds = availableRoles.length === 1
      ? [availableRoles[0].id_role]
      : selectedRoles;

    if (!bookId) return alert("אנא הזן Book ID");
    if (selectedRoleIds.length === 0) return alert("בחר לפחות תפקיד אחד");

    try {
      await apiRequests.postRequest(`/book-assignments`, {
        bookClickUpId,
        employeeId,
        selectedRoleIds
      });

      setOpenAddBook(false);
      setSelectedRoles([]);
      setBookId("");
    } catch (err) {
      alert("שגיאה בהוספת הספר");
    }
  };

  const handleOpenAssignedBooksDialog = async () => {
    await handleOpenAddBookDialog();
    setOpenAssignedBooksDialog(true);
  };


  const handleOpenAddBookDialog = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const roleIds = user.roles || [];

    setBookId("");
    setSelectedRoles([]);
    setAvailableRoles([]);

    if (roleIds.length > 1) {
      try {
        const response = await apiRequests.getRequest(`/roles?ids=${roleIds.join(',')}`);
        setAvailableRoles(response);
      } catch (err) {
        console.error("Failed to fetch role names", err);
      }
    } else if (roleIds.length === 1) {
      setAvailableRoles([{ id_role: roleIds[0], role_name: "תפקיד יחיד" }]);
    }

    setOpenAddBook(true);
  };

  useEffect(() => {
    fetchWorkEntries();
  }, []);


  return (
    <Container>
      <Typography variant="h4">{t("EmployeeDashboard.title")}</Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="flex-start"
        gap={2}
        mt={2}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="availability-status-label" shrink>
            {t("availability.availabilityStatus")}
          </InputLabel>
          <Select
            labelId="availability-status-label"
            value={availabilityStatus}
            label={t("availability.availabilityStatus")}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            size="small"
          >
            <MenuItem value="available">{t("availability.available")}</MenuItem>
            <MenuItem value="not_available">{t("availability.notAvailable")}</MenuItem>
            <MenuItem value="partial">{t("availability.partial")}</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => setOpenAssignedBooksDialog(true)}>
          {t("EmployeeDashboard.viewAssignedBooks")}
        </Button>

        <Button variant="outlined" color="secondary" onClick={handleOpenMonthSummary}>
          {t("EmployeeDashboard.monthlySummary")}
        </Button>

        <Button variant="outlined" onClick={() => setOpenMonthlyChargesDialog(true)}>
          {t("EmployeeDashboard.monthlyCharges")}
        </Button>

        <Button variant="outlined" onClick={() => setOpenChangePasswordDialog(true)}>
          {t("EmployeeDashboard.changePassword")}
        </Button>

        <Button variant="contained" color="primary" onClick={handleOpenAddWork}>
          {t("EmployeeDashboard.addNew")}
        </Button>
      </Box>

      <ErrorNotification error={error} />
      <WorkEntries workEntries={workEntries} onUpdate={handleUpdateWork} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("EmployeeDashboard.addNew")}</DialogTitle>
        <DialogContent>
          {loadingBooks ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <AddWorkDialog
              open={open}
              onClose={() => setOpen(false)}
              onAdd={handleAddWork}
              books={books}
              role={role}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">{t("EmployeeDashboard.cancel")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignedBooksDialog} onClose={() => setOpenAssignedBooksDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("EmployeeDashboard.viewAssignedBooks")}</DialogTitle>
        <DialogContent>
          <AssignedBooksList employeeId={employeeId} initialBooks={books} dense />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignedBooksDialog(false)}>{t("EmployeeDashboard.close")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEmployeeReport} onClose={() => setShowEmployeeReport(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t("EmployeeDashboard.monthlySummary")}</DialogTitle>
        <DialogContent>
          <EmployeeReport
            employeeId={employeeId}
            employeeName={user.name}
            month={String(now.getMonth() + 1).padStart(2, '0')}
            year={String(now.getFullYear())}
            onBack={() => setShowEmployeeReport(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmployeeReport(false)} color="primary">{t("EmployeeDashboard.close")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <ChangePassword onClose={() => setOpenChangePasswordDialog(false)} />
      </Dialog>

      <Dialog
        open={openMonthlyChargesDialog}
        onClose={() => setOpenMonthlyChargesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("EmployeeDashboard.monthlyCharges")}</DialogTitle>
        <DialogContent>
          <MonthlyCharges employeeId={employeeId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMonthlyChargesDialog(false)}>{t("EmployeeDashboard.close")}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeDashboard;