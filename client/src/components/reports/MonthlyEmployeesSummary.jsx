// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, Paper, Table, TableHead, TableRow,
//   TableCell, TableBody, CircularProgress, Button, IconButton
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import EmployeeMonthlyReport from "./EmployeeMonthlyReport";

// const monthNames = [
//   "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
//   "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
// ];

// const MonthlyEmployeesSummary = () => {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [summary, setSummary] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const api = new APIrequests();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const url = `/reports/monthly-summary/employees?month=${month}&year=${year}`;
//         const data = await api.getRequest(url);
//         setSummary(data);
//       } catch (error) {
//         console.error("שגיאה בטעינת הדוח:", error);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, [month, year]);

//   const exportToExcel = () => {
//     const wsData = summary.map(emp => ({
//       "שם עובד": emp.employee_name,
//       "תעריף (₪)": emp.rate,
//       "סה\"כ יחידות": parseFloat(emp.total_quantity).toFixed(2),
//       "סה\"כ תשלום (₪)": parseFloat(emp.total_payment).toFixed(2),
//     }));
//     const totalRow = {
//       "שם עובד": "סה\"כ",
//       "תעריף (₪)": "",
//       "סה\"כ יחידות": summary.reduce((sum, e) => sum + Number(e.total_quantity), 0).toFixed(2),
//       "סה\"כ תשלום (₪)": summary.reduce((sum, e) => sum + Number(e.total_payment), 0).toFixed(2),
//     };
//     wsData.push(totalRow);

//     const worksheet = XLSX.utils.json_to_sheet(wsData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח עובדים");

//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const fileName = `סיכום_עובדים_${monthNames[month - 1]}_${year}.xlsx`;
//     saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
//   };

//   if (selectedEmployee) {
//     return (
//       <EmployeeMonthlyReport
//         employeeId={selectedEmployee.employee_id}
//         employeeName={selectedEmployee.employee_name}
//         month={month}
//         year={year}
//         onBack={() => setSelectedEmployee(null)}
//       />
//     );
//   }

//   return (
//     <Box mt={3} maxWidth={900} mx="auto">
//       <Paper elevation={2} sx={{ p: 2 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h6">
//             סיכום חודשי לעובדים – {monthNames[month - 1]} {year}
//           </Typography>
//           <Box display="flex" gap={1}>
//             <Button onClick={() => setMonth(month === 1 ? 12 : month - 1)}>&lt;</Button>
//             <Button onClick={() => setMonth(month === 12 ? 1 : month + 1)}>&gt;</Button>
//             <Button onClick={exportToExcel} variant="outlined" size="small">
//               הורד ל-Excel
//             </Button>
//           </Box>
//         </Box>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>שם עובד</TableCell>
//                 <TableCell align="center">תעריף (₪)</TableCell>
//                 <TableCell align="center">סה"כ יחידות</TableCell>
//                 <TableCell align="center">סה"כ תשלום (₪)</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {summary.map((emp, i) => (
//                 <TableRow
//                   key={i}
//                   hover
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => setSelectedEmployee(emp)}
//                 >
//                   <TableCell>{emp.employee_name}</TableCell>
//                   <TableCell align="center">{emp.rate}</TableCell>
//                   <TableCell align="center">{parseFloat(emp.total_quantity).toFixed(2)}</TableCell>
//                   <TableCell align="center">{parseFloat(emp.total_payment).toFixed(2)}</TableCell>
//                 </TableRow>
//               ))}
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell sx={{ fontWeight: "bold" }} align="center">סה"כ</TableCell>
//                 <TableCell />
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                   {summary.reduce((sum, e) => sum + Number(e.total_quantity), 0).toFixed(2)}
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                   {summary.reduce((sum, e) => sum + Number(e.total_payment), 0).toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default MonthlyEmployeesSummary;
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button, IconButton
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EmployeeMonthlyReport from "./EmployeeMonthlyReport";

const monthNames = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

const MonthlyEmployeesSummary = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const api = new APIrequests();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/reports/monthly-summary/employees?month=${month}&year=${year}`;
        const data = await api.getRequest(url);
        setSummary(data);
      } catch (error) {
        console.error("שגיאה בטעינת הדוח:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [month, year]);

  const exportToExcel = () => {
    const wsData = summary.map(emp => ({
      "שם עובד": emp.employee_name,
      "תעריף (₪)": emp.rate,
      "סה\"כ יחידות": parseFloat(emp.total_quantity).toFixed(2),
      "סה\"כ תשלום (₪)": parseFloat(emp.total_payment).toFixed(2),
    }));
    const totalRow = {
      "שם עובד": "סה\"כ",
      "תעריף (₪)": "",
      "סה\"כ יחידות": summary.reduce((sum, e) => sum + Number(e.total_quantity), 0).toFixed(2),
      "סה\"כ תשלום (₪)": summary.reduce((sum, e) => sum + Number(e.total_payment), 0).toFixed(2),
    };
    wsData.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "דוח עובדים");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `סיכום_עובדים_${monthNames[month - 1]}_${year}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  if (selectedEmployee) {
    return (
      <EmployeeMonthlyReport
        employeeId={selectedEmployee.id_employee}
        employeeName={selectedEmployee.employee_name}
        month={month}
        year={year}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  return (
    <Box mt={3} maxWidth={900} mx="auto">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            סיכום חודשי לעובדים – {monthNames[month - 1]} {year}
          </Typography>
          <Box display="flex" gap={1}>
            <Button onClick={() => setMonth(month === 1 ? 12 : month - 1)}>&lt;</Button>
            <Button onClick={() => setMonth(month === 12 ? 1 : month + 1)}>&gt;</Button>
            <Button onClick={exportToExcel} variant="outlined" size="small">
              הורד ל-Excel
            </Button>
          </Box>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם עובד</TableCell>
                <TableCell align="center">תעריף (₪)</TableCell>
                <TableCell align="center">סה"כ יחידות</TableCell>
                <TableCell align="center">סה"כ תשלום (₪)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((emp, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    '&:hover': { backgroundColor: '#1976d2', color: '#fff' },
                    '&:hover td': { color: '#1976d2' }
                  }}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <TableCell>{emp.employee_name}</TableCell>
                  <TableCell align="center">{emp.rate}</TableCell>
                  <TableCell align="center">{parseFloat(emp.total_quantity).toFixed(2)}</TableCell>
                  <TableCell align="center">{parseFloat(emp.total_payment).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }} align="center">סה"כ</TableCell>
                <TableCell />
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {summary.reduce((sum, e) => sum + Number(e.total_quantity), 0).toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {summary.reduce((sum, e) => sum + Number(e.total_payment), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default MonthlyEmployeesSummary;
