// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, Paper, Table, TableHead, TableRow,
//   TableCell, TableBody, CircularProgress, Button
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests.js";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useTranslation } from "react-i18next";


// const EmployeeReport = ({ employeeId, employeeName, month, year, onBack }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const api = new APIrequests();
//   const { t } = useTranslation();

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const url = `/reports/monthly-summary/employee/${employeeId}?month=${month}&year=${year}`;
//         const data = await api.getRequest(url);
//         setRows(data);
//       } catch (err) {
//         console.error("Error fetching employee report:", err);
//         setRows([]);
//       }
//       setLoading(false);
//     };
//     fetchReport();
//   }, [employeeId, month, year]);

//   const totalQuantity = rows.reduce((sum, row) => sum + Number(row.quantity), 0);
//   // const totalPayment = rows.reduce((sum, row) => sum + Number(row.total), 0);
//   const totalPayment = +rows.reduce((sum, row) => sum + Number(row.total), 0).toFixed(2);
//   const formatHours = (quantity) => {
//     const q = parseFloat(quantity);
//     if (isNaN(q)) return "";
//     const hours = Math.floor(q);
//     const minutes = Math.round((q - hours) * 60);
//     let str = "";
//     if (hours > 0) str += `${hours} שעות`;
//     if (minutes > 0) str += (hours > 0 ? " ו-" : "") + `${minutes} דקות`;
//     if (!str) str = "0 דקות";
//     return str;
//   };


//   const exportToExcel = () => {
//     const wsData = rows.map(row => ({
//       "AZ": row.book_id,
//       "שם פרויקט": row.book_name,
//       "מנהל פרויקט": row.project_manager,
//       "שעות": Math.floor(row.quantity),
//       "דקות": Math.round((row.quantity % 1) * 60),
//       //   "תעריף לשעה": row.rate,
//       "סה\"כ לתשלום": row.total
//     }));
//     wsData.push({
//       "AZ": "סה\"כ",
//       "שם פרויקט": "",
//       "מנהל פרויקט": "",
//       "שעות": Math.floor(totalQuantity),
//       "דקות": Math.round((totalQuantity % 1) * 60),
//       //   "תעריף לשעה": "",
//       "סה\"כ לתשלום": totalPayment
//     });
//     const worksheet = XLSX.utils.json_to_sheet(wsData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח חודשי");
//     const fileName = `דוח_${employeeName}_${month}_${year}.xlsx`;
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
//   };

//   return (
//     <Box maxWidth={1000} mx="auto" mt={3}>
//       <Button onClick={onBack} variant="text">⬅ חזור</Button>
//       <Typography variant="h6" gutterBottom>
//         דוח חודשי עבור {employeeName} - {month}/{year}
//       </Typography>
//       <Button onClick={exportToExcel} variant="outlined" sx={{ mb: 2 }}>
//         הורד ל-Excel
//       </Button>
//       <Paper>
//         {loading ? <CircularProgress /> : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>AZ</TableCell>
//                 <TableCell>שם פרויקט</TableCell>
//                 <TableCell>מנהל פרויקט</TableCell>
//                 <TableCell>כמות</TableCell>
//                 <TableCell>תעריף</TableCell>
//                 <TableCell>סה"כ לתשלום</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{row.AZ_book_id}</TableCell>
//                   <TableCell>{row.book_name}</TableCell>
//                   <TableCell>{row.projectManagerName}</TableCell>
//                   <TableCell align="center">
//                     {row.type === "hours"
//                       ? formatHours(row.quantity)
//                       : `${Math.floor(row.quantity)} ${row.unit}`}
//                   </TableCell>
//                   <TableCell>{row.rate}</TableCell>
//                   <TableCell>{row.total}</TableCell>
//                 </TableRow>
//               ))}
//               <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
//                 <TableCell sx={{ fontWeight: 'bold' }}>סה"כ</TableCell>
//                 <TableCell colSpan={3} />
//                 <TableCell />
//                 <TableCell sx={{ fontWeight: 'bold' }}>{totalPayment}</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default EmployeeReport;


import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button
} from "@mui/material";
import { APIrequests } from "../../APIrequests.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const EmployeeReport = ({ employeeId, employeeName, month, year, onBack }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = new APIrequests();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const url = `/reports/monthly-summary/employee/${employeeId}?month=${month}&year=${year}`;
        const data = await api.getRequest(url);
        setRows(data);
      } catch (err) {
        console.error("Error fetching employee report:", err);
        setRows([]);
      }
      setLoading(false);
    };
    fetchReport();
  }, [employeeId, month, year]);

  const totalQuantity = rows.reduce((sum, row) => sum + Number(row.quantity), 0);
  const totalPayment = +rows.reduce((sum, row) => sum + Number(row.total), 0).toFixed(2);

  const formatHours = (quantity) => {
    const q = parseFloat(quantity);
    if (isNaN(q)) return "";
    const hours = Math.floor(q);
    const minutes = Math.round((q - hours) * 60);
    let str = "";
    if (hours > 0) str += `${hours} ${t("employeeReport.hours")}`;
    if (minutes > 0) str += (hours > 0 ? ` ${t("employeeReport.and")} ` : "") + `${minutes} ${t("employeeReport.minutes")}`;
    if (!str) str = `0 ${t("employeeReport.minutes")}`;
    return str;
  };

  const exportToExcel = () => {
    const wsData = rows.map(row => ({
      [t("employeeReport.az")]: row.book_id,
      [t("employeeReport.project")]: row.book_name,
      [t("employeeReport.manager")]: row.project_manager,
      [t("employeeReport.hours")]: Math.floor(row.quantity),
      [t("employeeReport.minutes")]: Math.round((row.quantity % 1) * 60),
      [t("employeeReport.totalPay")]: row.total
    }));
    wsData.push({
      [t("employeeReport.az")]: t("employeeReport.total"),
      [t("employeeReport.project")]: "",
      [t("employeeReport.manager")]: "",
      [t("employeeReport.hours")]: Math.floor(totalQuantity),
      [t("employeeReport.minutes")]: Math.round((totalQuantity % 1) * 60),
      [t("employeeReport.totalPay")]: totalPayment
    });
    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("employeeReport.sheetName"));
    const fileName = `${t("employeeReport.fileName")}_${employeeName}_${month}_${year}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <Box maxWidth={1000} mx="auto" mt={3} dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Button onClick={onBack} variant="text">⬅ {t("employeeReport.back")}</Button>
      <Typography variant="h6" gutterBottom>
        {t("employeeReport.title", { name: employeeName, month, year })}
      </Typography>
      <Button onClick={exportToExcel} variant="outlined" sx={{ mb: 2 }}>
        {t("employeeReport.download")}
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("employeeReport.az")}</TableCell>
                <TableCell>{t("employeeReport.project")}</TableCell>
                <TableCell>{t("employeeReport.manager")}</TableCell>
                <TableCell>{t("employeeReport.amount")}</TableCell>
                <TableCell>{t("employeeReport.rate")}</TableCell>
                <TableCell>{t("employeeReport.totalPay")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.AZ_book_id}</TableCell>
                  <TableCell>{row.book_name}</TableCell>
                  <TableCell>{row.projectManagerName}</TableCell>
                  <TableCell align="center">
                    {row.type === "hours"
                      ? formatHours(row.quantity)
                      // : `${Math.floor(row.quantity)} ${row.unit}`}
                      : `${Math.floor(row.quantity)} ${t(`specialUnits.${row.unit}`, row.unit)}`}

                  </TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell>{row.total}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t("employeeReport.total")}</TableCell>
                <TableCell colSpan={3} />
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>{totalPayment}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeReport;
