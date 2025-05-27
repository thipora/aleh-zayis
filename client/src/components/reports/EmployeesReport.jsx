// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Box, Paper, Table, TableHead, TableRow,
// // //   TableCell, TableBody, CircularProgress, Button,
// // //   FormControl, InputLabel, Select, MenuItem
// // // } from "@mui/material";
// // // import { APIrequests } from "../../APIrequests";
// // // import * as XLSX from "xlsx";
// // // import { saveAs } from "file-saver";
// // // import EmployeeReport from "./EmployeeReport";
// // // import MonthSelector from "../common/MonthSelector";
// // // import { useTranslation } from "react-i18next";
// // // import i18n from "i18next";

// // // const formatHours = (quantity) => {
// // //   const q = parseFloat(quantity);
// // //   if (isNaN(q)) return "";
// // //   const hours = Math.floor(q);
// // //   const minutes = Math.round((q - hours) * 60);
// // //   let str = "";
// // //   if (hours > 0) str += `${hours} ${i18n.t("specialUnits.hours")}`;
// // //   if (minutes > 0) str += (hours > 0 ? ` ${i18n.t("employeeReport.and")} ` : "") + `${minutes} ${i18n.t("specialUnits.minutes")}`;
// // //   if (!str) str = `0 ${i18n.t("specialUnits.minutes")}`;
// // //   return str;
// // // };

// // // const EmployeesReport = () => {
// // //   const now = new Date();
// // //   const [year, setYear] = useState(now.getFullYear());
// // //   const [month, setMonth] = useState(now.getMonth() + 1);
// // //   const [summary, setSummary] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// // //   const { t } = useTranslation();
// // //   const [selectedRole, setSelectedRole] = useState("");
// // //   const api = new APIrequests();

// // //   const filteredSummary = selectedRole
// // //     ? summary.filter(emp => emp.role_name === selectedRole)
// // //     : summary;

// // //   const totalPay = filteredSummary.reduce((sum, e) => sum + Number(e.total), 0).toFixed(2);

// // //   const allUnits = ["hours", "characters", "pages", "items"];
// // //   const summaryUnits = {};
// // //   filteredSummary.forEach(entry => {
// // //     const unit = entry.type === "hours" ? "hours" : entry.unit;
// // //     const quantity = parseFloat(entry.quantity);
// // //     if (!isNaN(quantity)) {
// // //       summaryUnits[unit] = (summaryUnits[unit] || 0) + quantity;
// // //     }
// // //   });

// // //   const existingUnits = allUnits.filter(unit => summaryUnits[unit]);
// // //   const unitCells = [];
// // //   for (let i = 0; i < 4; i++) {
// // //     const unit = existingUnits[existingUnits.length - 1 - i];
// // //     if (unit) {
// // //       const quantity = summaryUnits[unit];
// // //       unitCells.unshift(
// // //         <TableCell key={unit} align="center">
// // //           {unit === "hours"
// // //             ? formatHours(quantity)
// // //             : `${quantity.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
// // //         </TableCell>
// // //       );
// // //     } else {
// // //       unitCells.unshift(<TableCell key={`empty-${i}`} />);
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const url = `/reports/monthly-summary/employees?month=${month}&year=${year}`;
// // //         const data = await api.getRequest(url);
// // //         setSummary(data);
// // //       } catch (error) {
// // //         console.error("שגיאה בטעינת הדוח:", error);
// // //       }
// // //       setLoading(false);
// // //     };
// // //     fetchData();
// // //   }, [month, year]);

// // //   const exportToExcel = () => {
// // //     const wsData = summary.map(emp => ({
// // //       "שם עובד": emp.employee_name,
// // //       "ספר": emp.book_name,
// // //       "תעריף (₪)": emp.rate,
// // //       "סה\"כ עבודה": emp.type === "hours"
// // //         ? formatHours(emp.quantity)
// // //         : `${parseInt(emp.quantity)} ${emp.unit}`,
// // //       "סה\"כ תשלום (₪)": parseFloat(emp.total).toFixed(2),
// // //     }));

// // //     const totalRow = {
// // //       "שם עובד": "סה\"כ",
// // //       "ספר": "",
// // //       "תעריף (₪)": "",
// // //       "סה\"כ עבודה": "",
// // //       "סה\"כ תשלום (₪)": summary.reduce((sum, e) => sum + Number(e.total), 0).toFixed(2),
// // //     };
// // //     wsData.push(totalRow);

// // //     const worksheet = XLSX.utils.json_to_sheet(wsData);
// // //     const workbook = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח עובדים");

// // //     const fileName = `סיכום_עובדים_${month}_${year}.xlsx`;
// // //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
// // //     saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
// // //   };

// // //   if (selectedEmployee) {
// // //     return (
// // //       <EmployeeReport
// // //         employeeId={selectedEmployee.employee_id}
// // //         employeeName={selectedEmployee.employee_name}
// // //         month={month}
// // //         year={year}
// // //         onBack={() => setSelectedEmployee(null)}
// // //       />
// // //     );
// // //   }

// // //   return (
// // //     <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
// // //       <Paper elevation={2} sx={{ p: 2 }}>
// // //         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// // //           <MonthSelector
// // //             month={month}
// // //             year={year}
// // //             onChange={(newMonth, newYear) => {
// // //               setMonth(newMonth);
// // //               setYear(newYear);
// // //             }}
// // //           />
// // //           <Box display="flex" gap={1}>
// // //             <FormControl sx={{ minWidth: 160 }}>
// // //               <InputLabel>{t("employeesReport.filterRole")}</InputLabel>
// // //               <Select
// // //                 value={selectedRole}
// // //                 onChange={(e) => setSelectedRole(e.target.value)}
// // //               >
// // //                 <MenuItem value="">{t("roles.All")}</MenuItem>
// // //                 {[...new Set(summary.map(emp => emp.role_name))].map(role => (
// // //                   <MenuItem key={role} value={role}>
// // //                     {t(`roles.${role}`)}
// // //                   </MenuItem>
// // //                 ))}
// // //               </Select>
// // //             </FormControl>
// // //             <Button onClick={exportToExcel} variant="outlined" size="small">
// // //               {t("employeesReport.downloadExcel")}
// // //             </Button>
// // //           </Box>
// // //         </Box>

// // //         {loading ? (
// // //           <CircularProgress />
// // //         ) : (
// // //           <Table>
// // //             <TableHead>
// // //               <TableRow>
// // //                 <TableCell>{t("employeesReport.employeeName")}</TableCell>
// // //                 <TableCell>{t("employeesReport.employeeEmail")}</TableCell>
// // //                 <TableCell>{t("employeesReport.role")}</TableCell>
// // //                 <TableCell align="center">{t("employeesReport.rate")}</TableCell>
// // //                 <TableCell align="center">{t("employeesReport.totalWork")}</TableCell>
// // //                 <TableCell align="center">{t("employeesReport.totalPayment")}</TableCell>
// // //               </TableRow>
// // //             </TableHead>
// // //             <TableBody>
// // //               {filteredSummary.map((emp, i) => (
// // //                 <TableRow
// // //                   key={i}
// // //                   hover
// // //                   sx={{ cursor: "pointer" }}
// // //                   onClick={() => setSelectedEmployee(emp)}
// // //                 >
// // //                   <TableCell>{emp.employee_name}</TableCell>
// // //                   <TableCell>{emp.employee_email}</TableCell>
// // //                   <TableCell>{t(`roles.${emp.role_name}`)}</TableCell>
// // //                   <TableCell align="center">{emp.rate}</TableCell>
// // //                   <TableCell align="center">
// // //                     {emp.type === "hours"
// // //                       ? formatHours(emp.quantity)
// // //                       : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`, emp.unit)}`}
// // //                   </TableCell>
// // //                   <TableCell align="center">{parseFloat(emp.total).toFixed(2)}</TableCell>
// // //                 </TableRow>
// // //               ))}
// // //               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// // //                 <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.total")}</TableCell>
// // //                 {unitCells}
// // //                 <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalPay}</TableCell>
// // //               </TableRow>
// // //             </TableBody>
// // //           </Table>
// // //         )}
// // //       </Paper>
// // //     </Box>
// // //   );
// // // };

// // // export default EmployeesReport;
// // import React, { useState, useEffect } from "react";
// // import {
// //   Box, Paper, Table, TableHead, TableRow,
// //   TableCell, TableBody, CircularProgress, Button,
// //   FormControl, InputLabel, Select, MenuItem
// // } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";
// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";
// // import EmployeeReport from "./EmployeeReport";
// // import MonthSelector from "../common/MonthSelector";
// // import { useTranslation } from "react-i18next";
// // import i18n from "i18next";

// // const formatHours = (quantity) => {
// //   const q = parseFloat(quantity);
// //   if (isNaN(q)) return "";
// //   const hours = Math.floor(q);
// //   const minutes = Math.round((q - hours) * 60);
// //   let str = "";
// //   if (hours > 0) str += `${hours} ${i18n.t("specialUnits.hours")}`;
// //   if (minutes > 0) str += (hours > 0 ? ` ${i18n.t("employeeReport.and")} ` : "") + `${minutes} ${i18n.t("specialUnits.minutes")}`;
// //   if (!str) str = `0 ${i18n.t("specialUnits.minutes")}`;
// //   return str;
// // };

// // const EmployeesReport = () => {
// //   const now = new Date();
// //   const [year, setYear] = useState(now.getFullYear());
// //   const [month, setMonth] = useState(now.getMonth() + 1);
// //   const [summary, setSummary] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const { t } = useTranslation();
// //   const [selectedRole, setSelectedRole] = useState("");
// //   const api = new APIrequests();

// //   const filteredSummary = selectedRole
// //     ? summary.filter(emp => emp.role_name === selectedRole)
// //     : summary;

// //   const totalPay = filteredSummary.reduce((sum, e) => sum + Number(e.total), 0).toFixed(2);

// //   const allUnits = ["hours", "characters", "pages", "items"];
// //   const summaryUnits = {};
// //   filteredSummary.forEach(entry => {
// //     const unit = entry.type === "hours" ? "hours" : entry.unit;
// //     const quantity = parseFloat(entry.quantity);
// //     if (!isNaN(quantity)) {
// //       summaryUnits[unit] = (summaryUnits[unit] || 0) + quantity;
// //     }
// //   });

// //   const existingUnits = allUnits.filter(unit => summaryUnits[unit]);
// //   const unitCells = [];
// //   for (let i = 0; i < 4; i++) {
// //     const unit = existingUnits[existingUnits.length - 1 - i];
// //     if (unit) {
// //       const quantity = summaryUnits[unit];
// //       unitCells.unshift(
// //         <TableCell key={unit} align="center">
// //           {unit === "hours"
// //             ? formatHours(quantity)
// //             : `${quantity.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
// //         </TableCell>
// //       );
// //     } else {
// //       unitCells.unshift(<TableCell key={`empty-${i}`} />);
// //     }
// //   }

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const url = `/reports/monthly-summary/employees?month=${month}&year=${year}`;
// //         const data = await api.getRequest(url);
// //         setSummary(data);
// //       } catch (error) {
// //         console.error("שגיאה בטעינת הדוח:", error);
// //       }
// //       setLoading(false);
// //     };
// //     fetchData();
// //   }, [month, year]);

// //   const exportToExcel = () => {
// //     const wsData = filteredSummary.map(emp => {
// //       const q = parseFloat(emp.quantity);
// //       const isHours = emp.type === "hours";
// //       const hours = isHours ? Math.floor(q) : "";
// //       const minutes = isHours ? Math.round((q - hours) * 60) : "";
// //       return {
// //         "שם עובד": emp.employee_name,
// //         "מייל עובד": emp.employee_email,
// //         "תפקיד": t(`roles.${emp.role_name}`, emp.role_name),
// //         "תעריף": emp.rate,
// //         "שעות": hours,
// //         "דקות": minutes,
// //         "סה\"כ עבודה": !isHours ? `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`, emp.unit)}` : "",
// //         "סה\"כ תשלום": parseFloat(emp.total).toFixed(2),
// //       };
// //     });

// //     const summaryRow = {
// //       "שם עובד": t("employeesReport.total"),
// //       "מייל עובד": "",
// //       "תפקיד": "",
// //       "תעריף": "",
// //       "שעות": summaryUnits.hours ? Math.floor(summaryUnits.hours) : "",
// //       "דקות": summaryUnits.hours ? Math.round((summaryUnits.hours - Math.floor(summaryUnits.hours)) * 60) : "",
// //       "סה\"כ עבודה": allUnits
// //         .filter(unit => unit !== "hours" && summaryUnits[unit])
// //         .map(unit => `${summaryUnits[unit].toLocaleString()} ${t(`specialUnits.${unit}`)}`)
// //         .join(" | "),
// //       "סה\"כ תשלום": totalPay
// //     };

// //     wsData.push(summaryRow);

// //     const worksheet = XLSX.utils.json_to_sheet(wsData);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח עובדים");

// //     const fileName = `סיכום_עובדים_${month}_${year}.xlsx`;
// //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
// //     saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
// //   };

// //   if (selectedEmployee) {
// //     return (
// //       <EmployeeReport
// //         employeeId={selectedEmployee.employee_id}
// //         employeeName={selectedEmployee.employee_name}
// //         month={month}
// //         year={year}
// //         onBack={() => setSelectedEmployee(null)}
// //       />
// //     );
// //   }

// //   return (
// //     <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
// //       <Paper elevation={2} sx={{ p: 2 }}>
// //         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //           <MonthSelector
// //             month={month}
// //             year={year}
// //             onChange={(newMonth, newYear) => {
// //               setMonth(newMonth);
// //               setYear(newYear);
// //             }}
// //           />
// //           <Box display="flex" gap={1}>
// //             <FormControl sx={{ minWidth: 160 }}>
// //               <InputLabel>{t("employeesReport.filterRole")}</InputLabel>
// //               <Select
// //                 value={selectedRole}
// //                 onChange={(e) => setSelectedRole(e.target.value)}
// //               >
// //                 <MenuItem value="">{t("roles.All")}</MenuItem>
// //                 {[...new Set(summary.map(emp => emp.role_name))].map(role => (
// //                   <MenuItem key={role} value={role}>
// //                     {t(`roles.${role}`)}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //             <Button onClick={exportToExcel} variant="outlined" size="small">
// //               {t("employeesReport.downloadExcel")}
// //             </Button>
// //           </Box>
// //         </Box>

// //         {loading ? (
// //           <CircularProgress />
// //         ) : (
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>{t("employeesReport.employeeName")}</TableCell>
// //                 <TableCell>{t("employeesReport.employeeEmail")}</TableCell>
// //                 <TableCell>{t("employeesReport.role")}</TableCell>
// //                 <TableCell align="center">{t("employeesReport.rate")}</TableCell>
// //                 <TableCell align="center">{t("employeesReport.totalWork")}</TableCell>
// //                 <TableCell align="center">{t("employeesReport.totalPayment")}</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {filteredSummary.map((emp, i) => (
// //                 <TableRow
// //                   key={i}
// //                   hover
// //                   sx={{ cursor: "pointer" }}
// //                   onClick={() => setSelectedEmployee(emp)}
// //                 >
// //                   <TableCell>{emp.employee_name}</TableCell>
// //                   <TableCell>{emp.employee_email}</TableCell>
// //                   <TableCell>{t(`roles.${emp.role_name}`)}</TableCell>
// //                   <TableCell align="center">{emp.rate}</TableCell>
// //                   <TableCell align="center">
// //                     {emp.type === "hours"
// //                       ? formatHours(emp.quantity)
// //                       : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`)}`}
// //                   </TableCell>
// //                   <TableCell align="center">{parseFloat(emp.total).toFixed(2)}</TableCell>
// //                 </TableRow>
// //               ))}
// //               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// //                 <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.total")}</TableCell>
// //                 {unitCells}
// //                 <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalPay}</TableCell>
// //               </TableRow>
// //             </TableBody>
// //           </Table>
// //         )}
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default EmployeesReport;
// import React, { useState, useEffect } from "react";
// import {
//   Box, Paper, Table, TableHead, TableRow,
//   TableCell, TableBody, CircularProgress, Button,
//   FormControl, InputLabel, Select, MenuItem
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import EmployeeReport from "./EmployeeReport";
// import MonthSelector from "../common/MonthSelector";
// import { useTranslation } from "react-i18next";
// import i18n from "i18next";

// const formatHours = (quantity) => {
//   const q = parseFloat(quantity);
//   if (isNaN(q)) return "";
//   const hours = Math.floor(q);
//   const minutes = Math.round((q - hours) * 60);
//   let str = "";
//   if (hours > 0) str += `${hours} ${i18n.t("specialUnits.hours")}`;
//   if (minutes > 0) str += (hours > 0 ? ` ${i18n.t("employeeReport.and")} ` : "") + `${minutes} ${i18n.t("specialUnits.minutes")}`;
//   if (!str) str = `0 ${i18n.t("specialUnits.minutes")}`;
//   return str;
// };

// const EmployeesReport = () => {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [summary, setSummary] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { t } = useTranslation();
//   const [selectedRole, setSelectedRole] = useState("");
//   const api = new APIrequests();

//   const filteredSummary = selectedRole
//     ? summary.filter(emp => emp.role_name === selectedRole)
//     : summary;

//   const totalPay = filteredSummary.reduce((sum, e) => sum + Number(e.total), 0).toFixed(2);

//   const allUnits = ["hours", "characters", "pages", "items"];
//   const summaryUnits = {};
//   filteredSummary.forEach(entry => {
//     const unit = entry.type === "hours" ? "hours" : entry.unit;
//     const quantity = parseFloat(entry.quantity);
//     if (!isNaN(quantity)) {
//       summaryUnits[unit] = (summaryUnits[unit] || 0) + quantity;
//     }
//   });

//   const existingUnits = allUnits.filter(unit => summaryUnits[unit]);
//   const unitCells = [];
//   for (let i = 0; i < 4; i++) {
//     const unit = existingUnits[existingUnits.length - 1 - i];
//     if (unit) {
//       const quantity = summaryUnits[unit];
//       unitCells.unshift(
//         <TableCell key={unit} align="center">
//           {unit === "hours"
//             ? formatHours(quantity)
//             : `${quantity.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
//         </TableCell>
//       );
//     } else {
//       unitCells.unshift(<TableCell key={`empty-${i}`} />);
//     }
//   }

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
//     const wsData = filteredSummary.map(emp => {
//       const q = parseFloat(emp.quantity);
//       const isHours = emp.type === "hours";
//       return {
//         "שם עובד": emp.employee_name,
//         "מייל עובד": emp.employee_email,
//         "תפקיד": t(`roles.${emp.role_name}`, emp.role_name),
//         "תעריף": emp.rate,
//         "סה\"כ עבודה": isHours
//           ? formatHours(q)
//           : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`, emp.unit)}`,
//         "סה\"כ תשלום": parseFloat(emp.total).toFixed(2),
//       };
//     });

//     const summaryRow = {
//       "שם עובד": t("employeesReport.total"),
//       "מייל עובד": "",
//       "תפקיד": "",
//       "תעריף": "",
//       "סה\"כ עבודה": allUnits
//         .filter(unit => summaryUnits[unit])
//         .map(unit => unit === "hours"
//           ? formatHours(summaryUnits[unit])
//           : `${summaryUnits[unit].toLocaleString()} ${t(`specialUnits.${unit}`)}`
//         )
//         .join(" | "),
//       "סה\"כ תשלום": totalPay
//     };

//     wsData.push(summaryRow);

//     const worksheet = XLSX.utils.json_to_sheet(wsData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח עובדים");

//     const fileName = `סיכום_עובדים_${month}_${year}.xlsx`;
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
//   };

//   if (selectedEmployee) {
//     return (
//       <EmployeeReport
//         employeeId={selectedEmployee.employee_id}
//         employeeName={selectedEmployee.employee_name}
//         month={month}
//         year={year}
//         onBack={() => setSelectedEmployee(null)}
//       />
//     );
//   }

//   return (
//     <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
//       <Paper elevation={2} sx={{ p: 2 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <MonthSelector
//             month={month}
//             year={year}
//             onChange={(newMonth, newYear) => {
//               setMonth(newMonth);
//               setYear(newYear);
//             }}
//           />
//           <Box display="flex" gap={1}>
//             <FormControl sx={{ minWidth: 160 }}>
//               <InputLabel>{t("employeesReport.filterRole")}</InputLabel>
//               <Select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//               >
//                 <MenuItem value="">{t("roles.All")}</MenuItem>
//                 {[...new Set(summary.map(emp => emp.role_name))].map(role => (
//                   <MenuItem key={role} value={role}>
//                     {t(`roles.${role}`)}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button onClick={exportToExcel} variant="outlined" size="small">
//               {t("employeesReport.downloadExcel")}
//             </Button>
//           </Box>
//         </Box>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>{t("employeesReport.employeeName")}</TableCell>
//                 <TableCell>{t("employeesReport.employeeEmail")}</TableCell>
//                 <TableCell>{t("employeesReport.role")}</TableCell>
//                 <TableCell align="center">{t("employeesReport.rate")}</TableCell>
//                 <TableCell align="center">{t("employeesReport.totalWork")}</TableCell>
//                 <TableCell align="center">{t("employeesReport.totalPayment")}</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredSummary.map((emp, i) => (
//                 <TableRow
//                   key={i}
//                   hover
//                   sx={{ cursor: "pointer" }}
//                   onClick={() => setSelectedEmployee(emp)}
//                 >
//                   <TableCell>{emp.employee_name}</TableCell>
//                   <TableCell>{emp.employee_email}</TableCell>
//                   <TableCell>{t(`roles.${emp.role_name}`)}</TableCell>
//                   <TableCell align="center">{emp.rate}</TableCell>
//                   <TableCell align="center">
//                     {emp.type === "hours"
//                       ? formatHours(emp.quantity)
//                       : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`)}`}
//                   </TableCell>
//                   <TableCell align="center">{parseFloat(emp.total).toFixed(2)}</TableCell>
//                 </TableRow>
//               ))}
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.total")}</TableCell>
//                 {unitCells}
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalPay}</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default EmployeesReport;
import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EmployeeReport from "./EmployeeReport";
import MonthSelector from "../common/MonthSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const formatHours = (quantity) => {
  const q = parseFloat(quantity);
  if (isNaN(q)) return "";
  const hours = Math.floor(q);
  const minutes = Math.round((q - hours) * 60);
  let str = "";
  if (hours > 0) str += `${hours} ${i18n.t("specialUnits.hours")}`;
  if (minutes > 0) str += (hours > 0 ? ` ${i18n.t("employeeReport.and")} ` : "") + `${minutes} ${i18n.t("specialUnits.minutes")}`;
  if (!str) str = `0 ${i18n.t("specialUnits.minutes")}`;
  return str;
};

const EmployeesReport = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState("");
  const api = new APIrequests();

  const filteredSummary = selectedRole
    ? summary.filter(emp => emp.role_name === selectedRole)
    : summary;

  const totalPay = filteredSummary.reduce((sum, e) => sum + Number(e.total), 0).toFixed(2);

  const allUnits = ["hours", "characters", "pages", "items"];
  const summaryUnits = {};
  filteredSummary.forEach(entry => {
    const unit = entry.type === "hours" ? "hours" : entry.unit;
    const quantity = parseFloat(entry.quantity);
    if (!isNaN(quantity)) {
      summaryUnits[unit] = (summaryUnits[unit] || 0) + quantity;
    }
  });

  const existingUnits = allUnits.filter(unit => summaryUnits[unit]);
  const unitCells = [];
  for (let i = 0; i < 4; i++) {
    const unit = existingUnits[existingUnits.length - 1 - i];
    if (unit) {
      const quantity = summaryUnits[unit];
      unitCells.unshift(
        <TableCell key={unit} align="center">
          {unit === "hours"
            ? formatHours(quantity)
            : `${quantity.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
        </TableCell>
      );
    } else {
      unitCells.unshift(<TableCell key={`empty-${i}`} />);
    }
  }

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
    const headers = {
      name: t("employeesReport.employeeName"),
      email: t("employeesReport.employeeEmail"),
      role: t("employeesReport.role"),
      rate: t("employeesReport.rate"),
      totalWork: t("employeesReport.totalWork"),
      totalPay: t("employeesReport.totalPayment")
    };

    const wsData = filteredSummary.map(emp => {
      const q = parseFloat(emp.quantity);
      const isHours = emp.type === "hours";
      return {
        [headers.name]: emp.employee_name,
        [headers.email]: emp.employee_email,
        [headers.role]: t(`roles.${emp.role_name}`, emp.role_name),
        [headers.rate]: emp.rate,
        [headers.totalWork]: isHours
          ? formatHours(q)
          : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`, emp.unit)}`,
        [headers.totalPay]: parseFloat(emp.total).toFixed(2),
      };
    });

    const summaryRow = {
      [headers.name]: t("employeesReport.total"),
      [headers.email]: "",
      [headers.role]: "",
      [headers.rate]: "",
      [headers.totalWork]: allUnits
        .filter(unit => summaryUnits[unit])
        .map(unit => unit === "hours"
          ? formatHours(summaryUnits[unit])
          : `${summaryUnits[unit].toLocaleString()} ${t(`specialUnits.${unit}`)}`
        )
        .join(" | "),
      [headers.totalPay]: totalPay
    };

    wsData.push({});

    wsData.push(summaryRow);

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees Report");

    const fileName = `${t("employeeReport.fileName")}_${month}_${year}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  if (selectedEmployee) {
    return (
      <EmployeeReport
        employeeId={selectedEmployee.employee_id}
        employeeName={selectedEmployee.employee_name}
        month={month}
        year={year}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  return (
    <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MonthSelector
            month={month}
            year={year}
            onChange={(newMonth, newYear) => {
              setMonth(newMonth);
              setYear(newYear);
            }}
          />
          <Box display="flex" gap={1}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>{t("employeesReport.filterRole")}</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="">{t("roles.All")}</MenuItem>
                {[...new Set(summary.map(emp => emp.role_name))].map(role => (
                  <MenuItem key={role} value={role}>
                    {t(`roles.${role}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={exportToExcel} variant="outlined" size="small">
              {t("employeesReport.downloadExcel")}
            </Button>
          </Box>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("employeesReport.employeeName")}</TableCell>
                <TableCell>{t("employeesReport.employeeEmail")}</TableCell>
                <TableCell>{t("employeesReport.role")}</TableCell>
                <TableCell align="center">{t("employeesReport.rate")}</TableCell>
                <TableCell align="center">{t("employeesReport.totalWork")}</TableCell>
                <TableCell align="center">{t("employeesReport.totalPayment")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSummary.map((emp, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <TableCell>{emp.employee_name}</TableCell>
                  <TableCell>{emp.employee_email}</TableCell>
                  <TableCell>{t(`roles.${emp.role_name}`)}</TableCell>
                  <TableCell align="center">{emp.rate}</TableCell>
                  <TableCell align="center">
                    {emp.type === "hours"
                      ? formatHours(emp.quantity)
                      : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`)}`}
                  </TableCell>
                  <TableCell align="center">{parseFloat(emp.total).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.total")}</TableCell>
                {unitCells}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalPay}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeesReport;
