// // // // import React, { useState, useEffect } from "react";
// // // // import { APIrequests } from "../APIrequests";
// // // // import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

// // // // const EditorsSummaryTable = ({ onSelect }) => {
// // // //   const [editors, setEditors] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState("");
// // // //   const [year, setYear] = useState(new Date().getFullYear());
// // // //   const [month, setMonth] = useState(new Date().getMonth() + 1);

// // // //   const apiRequests = new APIrequests();

// // // //   useEffect(() => {
// // // //     const fetchEditors = async () => {
// // // //       setLoading(true);
// // // //       setError("");
// // // //       try {
// // // //         const url = `/workEntries/reports/editors-summary?month=${month}&year=${year}`;
// // // //         const data = await apiRequests.getRequest(url);
// // // //         setEditors(data);
// // // //       } catch {
// // // //         setError("שגיאה בטעינת סיכום עורכים");
// // // //       }
// // // //       setLoading(false);
// // // //     };
// // // //     fetchEditors();
// // // //   }, [month, year]);

// // // //   return (
// // // //     <Box>
// // // //       <Typography variant="h6" mb={1}>סיכום שעות לפי עורכים</Typography>
// // // //       <Box mb={1}>
// // // //         <label>
// // // //           שנה:{" "}
// // // //           <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: 70 }} />
// // // //         </label>
// // // //         {" "}
// // // //         <label>
// // // //           חודש:{" "}
// // // //           <input type="number" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} style={{ width: 40 }} />
// // // //         </label>
// // // //       </Box>
// // // //       {loading && <CircularProgress />}
// // // //       {error && <Typography color="error">{error}</Typography>}
// // // //       {!loading && !error && (
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow>
// // // //               <TableCell>שם עורך</TableCell>
// // // //               <TableCell>סה"כ שעות</TableCell>
// // // //               <TableCell>פעולה</TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {editors.map((row, idx) => (
// // // //               <TableRow key={idx}>
// // // //                 <TableCell>{row.editor_name}</TableCell>
// // // //                 <TableCell>{row.total_hours}</TableCell>
// // // //                 <TableCell>
// // // //                   <Button variant="outlined" size="small" onClick={() => onSelect(row.editor_id || row.id_employee)}>
// // // //                     פירוט
// // // //                   </Button>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       )}
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default EditorsSummaryTable;


// // // import React, { useState, useEffect } from "react";
// // // import { APIrequests } from "../APIrequests";
// // // import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton } from "@mui/material";
// // // import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// // // import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// // // const monthNames = [
// // //   "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
// // //   "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
// // // ];

// // // const EditorsSummaryTable = ({ onSelect }) => {
// // //   const now = new Date();
// // //   const [editors, setEditors] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");
// // //   const [year, setYear] = useState(now.getFullYear());
// // //   const [month, setMonth] = useState(now.getMonth() + 1);

// // //   const apiRequests = new APIrequests();

// // //   useEffect(() => {
// // //     const fetchEditors = async () => {
// // //       setLoading(true);
// // //       setError("");
// // //       try {
// // //         const url = `/workEntries/reports/editors-summary?month=${month}&year=${year}`;
// // //         const data = await apiRequests.getRequest(url);
// // //         setEditors(data);
// // //       } catch {
// // //         setError("שגיאה בטעינת סיכום עורכים");
// // //       }
// // //       setLoading(false);
// // //     };
// // //     fetchEditors();
// // //   }, [month, year]);

// // //   // מעבר חודש קדימה/אחורה
// // //   const handlePrevMonth = () => {
// // //     if (month === 1) {
// // //       setMonth(12);
// // //       setYear(year - 1);
// // //     } else {
// // //       setMonth(month - 1);
// // //     }
// // //   };

// // //   const handleNextMonth = () => {
// // //     if (month === 12) {
// // //       setMonth(1);
// // //       setYear(year + 1);
// // //     } else {
// // //       setMonth(month + 1);
// // //     }
// // //   };

// // //   return (
// // //     <Box>
// // //       <Typography variant="h6" mb={1}>סיכום שעות לפי עורכים</Typography>
// // //       <Box mb={1} display="flex" alignItems="center" gap={1}>
// // //         <IconButton onClick={handlePrevMonth} size="small">
// // //           <ArrowBackIosNewIcon />
// // //         </IconButton>
// // //         <Typography>
// // //           {monthNames[month - 1]} {year}
// // //         </Typography>
// // //         <IconButton onClick={handleNextMonth} size="small">
// // //           <ArrowForwardIosIcon />
// // //         </IconButton>
// // //       </Box>
// // //       {loading && <CircularProgress />}
// // //       {error && <Typography color="error">{error}</Typography>}
// // //       {!loading && !error && (
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow>
// // //               <TableCell>שם עורך</TableCell>
// // //               <TableCell>סה"כ שעות</TableCell>
// // //               <TableCell>פעולה</TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {editors.map((row, idx) => (
// // //               <TableRow key={idx}>
// // //                 <TableCell>{row.editor_name}</TableCell>
// // //                 <TableCell>{row.total_hours}</TableCell>
// // //                 <TableCell>
// // //                   <Button variant="outlined" size="small" onClick={() => onSelect(row.editor_id || row.id_employee)}>
// // //                     פירוט
// // //                   </Button>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       )}
// // //     </Box>
// // //   );
// // // };

// // // export default EditorsSummaryTable;



// // import React, { useState, useEffect } from "react";
// // import { APIrequests } from "../APIrequests";
// // import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton } from "@mui/material";
// // import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// // import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// // const monthNames = [
// //   "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
// //   "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
// // ];

// // const EditorsSummaryTable = ({ onSelect }) => {
// //   const now = new Date();
// //   const [editors, setEditors] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [year, setYear] = useState(now.getFullYear());
// //   const [month, setMonth] = useState(now.getMonth() + 1);

// //   const apiRequests = new APIrequests();

// //   useEffect(() => {
// //     const fetchEditors = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const url = `/workEntries/reports/editors-summary?month=${month}&year=${year}`;
// //         const data = await apiRequests.getRequest(url);
// //         setEditors(data);
// //       } catch {
// //         setError("שגיאה בטעינת סיכום עורכים");
// //       }
// //       setLoading(false);
// //     };
// //     fetchEditors();
// //   }, [month, year]);

// //   // ניווט חודשי
// //   const handlePrevMonth = () => {
// //     if (month === 1) {
// //       setMonth(12);
// //       setYear(year - 1);
// //     } else {
// //       setMonth(month - 1);
// //     }
// //   };

// //   const handleNextMonth = () => {
// //     if (month === 12) {
// //       setMonth(1);
// //       setYear(year + 1);
// //     } else {
// //       setMonth(month + 1);
// //     }
// //   };

// //   return (
// //     <Box>
// //       <Typography variant="h6" mb={1}>סיכום שעות לפי עורכים</Typography>
// //       <Box mb={1} display="flex" alignItems="center" gap={1}>
// //         <IconButton onClick={handlePrevMonth} size="small">
// //           <ArrowBackIosNewIcon />
// //         </IconButton>
// //         <Typography>
// //           {monthNames[month - 1]} {year}
// //         </Typography>
// //         <IconButton onClick={handleNextMonth} size="small">
// //           <ArrowForwardIosIcon />
// //         </IconButton>
// //       </Box>
// //       {loading && <CircularProgress />}
// //       {error && <Typography color="error">{error}</Typography>}
// //       {!loading && !error && (
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>שם עורך</TableCell>
// //               <TableCell>סה"כ שעות</TableCell>
// //               <TableCell>פעולה</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {editors.map((row, idx) => (
// //               <TableRow key={idx}>
// //                 <TableCell>{row.editor_name}</TableCell>
// //                 <TableCell>{row.total_hours}</TableCell>
// //                 <TableCell>
// //                   <Button
// //                     variant="outlined"
// //                     size="small"
// //                     onClick={() => onSelect(row.editor_id || row.id_employee, row.editor_name)}
// //                   >
// //                     פירוט
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       )}
// //     </Box>
// //   );
// // };

// // export default EditorsSummaryTable;


// import React, { useState, useEffect } from "react";
// import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, CircularProgress, Paper } from "@mui/material";
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import { APIrequests } from "../APIrequests";
// import EditorWorkSummary from "./EditorWorkSummary"; // נבנה בהמשך

// const monthNames = [
//   "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
//   "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
// ];

// const EditorsSummaryTable = () => {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [editors, setEditors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedEditor, setSelectedEditor] = useState(null);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     fetchSummary();
//     // eslint-disable-next-line
//   }, [month, year]);

//   const fetchSummary = async () => {
//     setLoading(true);
//     setError("");
//     setEditors([]);
//     try {
//       const url = `/workEntries/reports/editors-summary?month=${month}&year=${year}`;
//       const data = await apiRequests.getRequest(url);
//       setEditors(data);
//     } catch {
//       setError("שגיאה בטעינת סיכום עורכים");
//     }
//     setLoading(false);
//   };

//   const handlePrevMonth = () => {
//     if (month === 1) {
//       setMonth(12);
//       setYear(year - 1);
//     } else {
//       setMonth(month - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (month === 12) {
//       setMonth(1);
//       setYear(year + 1);
//     } else {
//       setMonth(month + 1);
//     }
//   };

//   if (selectedEditor) {
//     return (
//       <EditorWorkSummary
//         editor={selectedEditor}
//         month={month}
//         year={year}
//         onBack={() => setSelectedEditor(null)}
//       />
//     );
//   }

//   return (
//     <Box mt={3} maxWidth={900} mx="auto">
//       <Paper elevation={2} sx={{ p: 2 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//           <Typography variant="h6">
//             דוח שעות עבודה לכל העורכים – {monthNames[month - 1]} {year}
//           </Typography>
//           <Box>
//             <IconButton onClick={handlePrevMonth}><ArrowBackIosNewIcon /></IconButton>
//             <IconButton onClick={handleNextMonth}><ArrowForwardIosIcon /></IconButton>
//           </Box>
//         </Box>
//         {loading && <CircularProgress />}
//         {error && <Typography color="error">{error}</Typography>}
//         {!loading && !error && (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>שם עורך</TableCell>
//                 <TableCell align="center">סה"כ שעות</TableCell>
//                 <TableCell align="center">פירוט</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {editors.map((editor) => (
//                 <TableRow key={editor.editor_id}>
//                   <TableCell>{editor.editor_name}</TableCell>
//                   <TableCell align="center">{editor.total_hours}</TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="outlined"
//                       onClick={() => setSelectedEditor(editor)}
//                       size="small"
//                     >
//                       הצג פירוט
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//         {!loading && !error && editors.length === 0 && (
//           <Typography color="textSecondary" align="center" mt={2}>
//             אין נתונים להצגה לחודש זה
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default EditorsSummaryTable;
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button,
  IconButton, CircularProgress, Paper
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { APIrequests } from "../APIrequests";
import EditorWorkSummary from "./EditorWorkSummary";

const monthNames = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

// hoursToString – אותו קוד כמו למעלה, כדאי להוציא לפייל עזר אם חוזר

function hoursToString(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h && m) return `${h} שעות ו-${m} דקות`;
  if (h) return `${h} שעות`;
  return `${m} דקות`;
}

const EditorsSummaryTable = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEditor, setSelectedEditor] = useState(null);

  const apiRequests = new APIrequests();

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, [month, year]);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    setEditors([]);
    try {
      const url = `/workEntries/reports/editors-summary?month=${month}&year=${year}`;
      const data = await apiRequests.getRequest(url);
      setEditors(data);
    } catch {
      setError("שגיאה בטעינת סיכום עורכים");
    }
    setLoading(false);
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (selectedEditor) {
    return (
      <EditorWorkSummary
        editor={selectedEditor}
        month={month}
        year={year}
        onBack={() => setSelectedEditor(null)}
      />
    );
  }

  return (
    <Box mt={3} maxWidth={900} mx="auto">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            דוח שעות עבודה לכל העורכים – {monthNames[month - 1]} {year}
          </Typography>
          <Box>
            <IconButton onClick={handlePrevMonth}><ArrowBackIosNewIcon /></IconButton>
            <IconButton onClick={handleNextMonth}><ArrowForwardIosIcon /></IconButton>
          </Box>
        </Box>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם עורך</TableCell>
                <TableCell align="center">סה"כ שעות</TableCell>
                <TableCell align="center">פירוט</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editors.map((editor) => (
                <TableRow key={editor.editor_id}>
                  <TableCell>{editor.editor_name}</TableCell>
                  <TableCell align="center">{hoursToString(editor.total_hours)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedEditor(editor)}
                      size="small"
                    >
                      הצג פירוט
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && !error && editors.length === 0 && (
          <Typography color="textSecondary" align="center" mt={2}>
            אין נתונים להצגה לחודש זה
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default EditorsSummaryTable;
