// // import React, { useState, useEffect } from "react";
// // import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Paper } from "@mui/material";
// // import MonthNavigator from "./MonthNavigator"; // בהנחה שיש לך קומפוננטה כזו! אפשר להמיר בקלות גם לחיצים
// // import { APIrequests } from "../APIrequests";


// // const blue = "#1565c0";
// // const lightBlue = "#e3f2fd";
// // const tableHeader = "#bbdefb";

// // const EditorDetailDialog = ({
// //   open,
// //   editorId,
// //   onClose,
// //   editorName // אם יש לך את השם – תעבירי אותו, אם לא – אפשר לשלוף מהשרת!
// // }) => {
// //   const now = new Date();
// //   const [year, setYear] = useState(now.getFullYear());
// //   const [month, setMonth] = useState(now.getMonth() + 1);
// //   const [rows, setRows] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //     const apiRequests = new APIrequests();

// //   const fetchDetails = async () => {
// //     setLoading(true);
// //     try {
// //       const url = `/workEntries/reports/editor/${editorId}?month=${month}&year=${year}`;

// //       // את יכולה להמיר את הבקשה לפי ה-API שלך (ולשלב fetch או axios)
// //       // const res = await fetch(url);
// //       // const data = await res.json();
// //       const summary = await apiRequests.getRequest(url);
  
// //       setRows(summary);
// //     } catch {
// //       setRows([]);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     if (open) fetchDetails();
// //     // eslint-disable-next-line
// //   }, [editorId, month, year, open]);

// //   // עדכון תאריך דרך MonthNavigator (אם יש לך קומפוננטה כזו)
// //   const handleMonthChange = (newMonth, newYear) => {
// //     setMonth(newMonth);
// //     setYear(newYear);
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle sx={{
// //         bgcolor: blue,
// //         color: "#fff",
// //         fontWeight: 700,
// //         borderTopLeftRadius: 8,
// //         borderTopRightRadius: 8
// //       }}>
// //         {editorName ? `פירוט עבודה: ${editorName}` : "פירוט עבודה של עורך"}
// //       </DialogTitle>
// //       <DialogContent sx={{ bgcolor: lightBlue }}>
// //         <Box my={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
// //           <Paper elevation={3} sx={{ p: 2, borderRadius: 3, width: "100%", bgcolor: "#fff" }}>
// //             <Box mb={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
// //               <MonthNavigator
// //                 value={`${year}-${String(month).padStart(2, "0")}`}
// //                 onChange={val => {
// //                   const [newYear, newMonth] = val.split('-');
// //                   setMonth(Number(newMonth));
// //                   setYear(Number(newYear));
// //                 }}
// //                 minYear={2022}
// //                 maxYear={now.getFullYear()}
// //               />
// //             </Box>
// //             {loading && <CircularProgress color="primary" size={32} sx={{ mt: 3 }} />}
// //             {!loading && (
// //               rows.length > 0 ? (
// //                 <Box mt={2}>
// //                   <table style={{
// //                     width: "100%",
// //                     borderCollapse: "collapse",
// //                     background: "#fff",
// //                     direction: "rtl"
// //                   }}>
// //                     <thead>
// //                       <tr>
// //                         <th style={{
// //                           borderBottom: `2px solid ${blue}`,
// //                           padding: 10,
// //                           background: tableHeader,
// //                           color: blue
// //                         }}>שם ספר</th>
// //                         <th style={{
// //                           borderBottom: `2px solid ${blue}`,
// //                           padding: 10,
// //                           background: tableHeader,
// //                           color: blue
// //                         }}>תאריך</th>
// //                         <th style={{
// //                           borderBottom: `2px solid ${blue}`,
// //                           padding: 10,
// //                           background: tableHeader,
// //                           color: blue
// //                         }}>כמות</th>
// //                         <th style={{
// //                           borderBottom: `2px solid ${blue}`,
// //                           padding: 10,
// //                           background: tableHeader,
// //                           color: blue
// //                         }}>תיאור</th>
// //                         <th style={{
// //                           borderBottom: `2px solid ${blue}`,
// //                           padding: 10,
// //                           background: tableHeader,
// //                           color: blue
// //                         }}>הערות</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {rows.map((row, idx) => (
// //                         <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#e3f2fd" }}>
// //                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.book_name}</td>
// //                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.date?.split('T')[0]}</td>
// //                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.quantity}</td>
// //                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.description}</td>
// //                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.notes}</td>
// //                         </tr>
// //                       ))}
// //                       <tr style={{ background: "#e3f2fd" }}>
// //                         <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>סה"כ</td>
// //                         <td />
// //                         <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>
// //                           {rows.reduce((sum, r) => sum + Number(r.quantity), 0)}
// //                         </td>
// //                         <td />
// //                         <td />
// //                       </tr>
// //                     </tbody>
// //                   </table>
// //                 </Box>
// //               ) : (
// //                 <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 3 }}>
// //                   אין נתונים להצגה עבור החודש הנבחר.
// //                 </Typography>
// //               )
// //             )}
// //           </Paper>
// //         </Box>
// //       </DialogContent>
// //       <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: lightBlue }}>
// //         <Button
// //           onClick={onClose}
// //           variant="outlined"
// //           sx={{
// //             fontWeight: 600,
// //             color: blue,
// //             borderColor: blue,
// //             borderRadius: 2,
// //             px: 4,
// //             bgcolor: "#fff"
// //           }}>
// //           סגור
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default EditorDetailDialog;


// import React, { useState, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Paper } from "@mui/material";
// import MonthNavigator from "./MonthNavigator";
// import { APIrequests } from "../APIrequests";

// const blue = "#1565c0";
// const lightBlue = "#e3f2fd";
// const tableHeader = "#bbdefb";

// const EditorDetailDialog = ({
//   open,
//   editorId,
//   onClose,
//   editorName
// }) => {
//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const apiRequests = new APIrequests();

//   const fetchDetails = async () => {
//     setLoading(true);
//     try {
//       const url = `/workEntries/reports/editor/${editorId}?month=${month}&year=${year}`;
//       const summary = await apiRequests.getRequest(url);
//       setRows(summary);
//     } catch {
//       setRows([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (open) fetchDetails();
//     // eslint-disable-next-line
//   }, [editorId, month, year, open]);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{
//         bgcolor: blue,
//         color: "#fff",
//         fontWeight: 700,
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8
//       }}>
//         {editorName ? `פירוט עבודה: ${editorName}` : "פירוט עבודה של עורך"}
//       </DialogTitle>
//       <DialogContent sx={{ bgcolor: lightBlue }}>
//         <Box my={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
//           <Paper elevation={3} sx={{ p: 2, borderRadius: 3, width: "100%", bgcolor: "#fff" }}>
//             <Box mb={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
//               <MonthNavigator
//                 value={`${year}-${String(month).padStart(2, "0")}`}
//                 onChange={val => {
//                   const [newYear, newMonth] = val.split('-');
//                   setMonth(Number(newMonth));
//                   setYear(Number(newYear));
//                 }}
//                 minYear={2022}
//                 maxYear={now.getFullYear()}
//               />
//             </Box>
//             {loading && <CircularProgress color="primary" size={32} sx={{ mt: 3 }} />}
//             {!loading && (
//               rows.length > 0 ? (
//                 <Box mt={2}>
//                   <table style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     background: "#fff",
//                     direction: "rtl"
//                   }}>
//                     <thead>
//                       <tr>
//                         <th style={{
//                           borderBottom: `2px solid ${blue}`,
//                           padding: 10,
//                           background: tableHeader,
//                           color: blue
//                         }}>שם ספר</th>
//                         <th style={{
//                           borderBottom: `2px solid ${blue}`,
//                           padding: 10,
//                           background: tableHeader,
//                           color: blue
//                         }}>תאריך</th>
//                         <th style={{
//                           borderBottom: `2px solid ${blue}`,
//                           padding: 10,
//                           background: tableHeader,
//                           color: blue
//                         }}>כמות</th>
//                         <th style={{
//                           borderBottom: `2px solid ${blue}`,
//                           padding: 10,
//                           background: tableHeader,
//                           color: blue
//                         }}>תיאור</th>
//                         <th style={{
//                           borderBottom: `2px solid ${blue}`,
//                           padding: 10,
//                           background: tableHeader,
//                           color: blue
//                         }}>הערות</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((row, idx) => (
//                         <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#e3f2fd" }}>
//                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>
//                             {row.book_name}{row.book_id ? ` - ${row.book_id}` : ""}
//                           </td>
//                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.date?.split('T')[0]}</td>
//                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.quantity}</td>
//                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.description}</td>
//                           <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.notes}</td>
//                         </tr>
//                       ))}
//                       <tr style={{ background: "#e3f2fd" }}>
//                         <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>סה"כ</td>
//                         <td />
//                         <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>
//                           {rows.reduce((sum, r) => sum + Number(r.quantity), 0)}
//                         </td>
//                         <td />
//                         <td />
//                       </tr>
//                     </tbody>
//                   </table>
//                 </Box>
//               ) : (
//                 <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 3 }}>
//                   אין נתונים להצגה עבור החודש הנבחר.
//                 </Typography>
//               )
//             )}
//           </Paper>
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: lightBlue }}>
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           sx={{
//             fontWeight: 600,
//             color: blue,
//             borderColor: blue,
//             borderRadius: 2,
//             px: 4,
//             bgcolor: "#fff"
//           }}>
//           סגור
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditorDetailDialog;


import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Paper } from "@mui/material";
import MonthNavigator from "./MonthNavigator";
import { APIrequests } from "../APIrequests";

const blue = "#1565c0";
const lightBlue = "#e3f2fd";
const tableHeader = "#bbdefb";

function groupByBook(rows) {
  // יוצר אובייקט שבו כל מפתח הוא book_id, והערך הוא אובייקט עם שם הספר והעבודות
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.book_id]) {
      grouped[row.book_id] = {
        book_name: row.book_name,
        book_id: row.book_id,
        entries: []
      };
    }
    grouped[row.book_id].entries.push(row);
  });
  return grouped;
}

const EditorDetailDialog = ({
  open,
  editorId,
  onClose,
  editorName
}) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiRequests = new APIrequests();

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const url = `/workEntries/reports/editor/${editorId}?month=${month}&year=${year}`;
      const summary = await apiRequests.getRequest(url);
      setRows(summary);
    } catch {
      setRows([]);
    }
    setLoading(false);
  };

  // קריאה רק בלחיצה על כפתור "הצג פירוט"
  // או על שינוי חודש/שנה
  useEffect(() => {
    if (open) fetchDetails();
    // eslint-disable-next-line
  }, [editorId, open]);

  // עיבוד קבוצות לפי ספר
  const grouped = groupByBook(rows);

  // חישוב סה"כ כמות בכל הספרים
  const totalSum = rows.reduce((sum, r) => sum + Number(r.quantity), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        bgcolor: blue,
        color: "#fff",
        fontWeight: 700,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
      }}>
        {editorName ? `פירוט עבודה: ${editorName}` : "פירוט עבודה של עורך"}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: lightBlue }}>
        <Box my={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, width: "100%", bgcolor: "#fff" }}>
            <Box mb={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
              <MonthNavigator
                value={`${year}-${String(month).padStart(2, "0")}`}
                onChange={val => {
                  const [newYear, newMonth] = val.split('-');
                  setMonth(Number(newMonth));
                  setYear(Number(newYear));
                  setRows([]); // ריקון הנתונים בזמן בחירה, כדי להבהיר שמשנה חודש
                }}
                minYear={2022}
                maxYear={now.getFullYear()}
              />
              <Button
                onClick={fetchDetails}
                disabled={loading}
                variant="contained"
                sx={{
                  bgcolor: blue,
                  color: "#fff",
                  borderRadius: 2,
                  fontWeight: 700,
                  boxShadow: "0 2px 6px #bbdefb",
                  "&:hover": { bgcolor: "#003c8f" }
                }}
              >
                הצג פירוט
              </Button>
            </Box>
            {loading && <CircularProgress color="primary" size={32} sx={{ mt: 3 }} />}
            {!loading && rows.length === 0 && (
              <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 3 }}>
                אין נתונים להצגה עבור החודש הנבחר.
              </Typography>
            )}
            {!loading && rows.length > 0 && (
              <>
                {/* עבור כל ספר מציג טבלה */}
                {Object.values(grouped).map(group => (
                  <Box key={group.book_id} mt={3} mb={2}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: blue }}>
                      {group.book_name}{" "}
                      {group.book_id && (
                        <span style={{ color: "#666", fontSize: "0.95em" }}>({group.book_id})</span>
                      )}
                    </Typography>
                    <table style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      background: "#fff",
                      direction: "rtl"
                    }}>
                      <thead>
                        <tr>
                          <th style={{
                            borderBottom: `2px solid ${blue}`,
                            padding: 10,
                            background: tableHeader,
                            color: blue
                          }}>תאריך</th>
                          <th style={{
                            borderBottom: `2px solid ${blue}`,
                            padding: 10,
                            background: tableHeader,
                            color: blue
                          }}>כמות</th>
                          <th style={{
                            borderBottom: `2px solid ${blue}`,
                            padding: 10,
                            background: tableHeader,
                            color: blue
                          }}>תיאור</th>
                          <th style={{
                            borderBottom: `2px solid ${blue}`,
                            padding: 10,
                            background: tableHeader,
                            color: blue
                          }}>הערות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.entries.map((row, idx) => (
                          <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#e3f2fd" }}>
                            <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.date?.split('T')[0]}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.quantity}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.description}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #bbdefb" }}>{row.notes}</td>
                          </tr>
                        ))}
                        <tr style={{ background: "#e3f2fd" }}>
                          <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>סה"כ</td>
                          <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: blue }}>
                            {group.entries.reduce((sum, r) => sum + Number(r.quantity), 0)}
                          </td>
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                ))}
                {/* שורת סיכום לכל הספרים */}
                <Box mt={2}>
                  <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, color: blue }}>
                    סה"כ כל הספרים: {totalSum}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: lightBlue }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontWeight: 600,
            color: blue,
            borderColor: blue,
            borderRadius: 2,
            px: 4,
            bgcolor: "#fff"
          }}>
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditorDetailDialog;
