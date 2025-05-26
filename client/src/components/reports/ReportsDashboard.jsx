// import React, { useState } from "react";
// import EmployeesReport from "./EmployeesReport";
// import BookPivotReport from "./BookPivotReport";
// import { Box, Button, Typography } from "@mui/material";
// import { useTranslation } from "react-i18next";

// const ReportsDashboard = () => {
//   const [report, setReport] = useState(null); // "employees" | "editors" | "books"

//   const handleBack = () => setReport(null);
//   const { t } = useTranslation();

//   return (
//     <Box p={3} maxWidth={1000} mx="auto" dir="rtl">
//       {!report && (
//         <Box display="flex" flexDirection="column" gap={2} alignItems="center">
//           <Typography variant="h5" gutterBottom>בחר דוח להצגה</Typography>
//           <Button variant="contained" onClick={() => setReport("employees")} fullWidth>
//             סיכום חודשי לפי עובדים (תשלומים)
//           </Button>
//           <Button variant="contained" onClick={() => setReport("books")} fullWidth>
//             סיכום שעות לפי ספרים
//           </Button>
//         </Box>
//       )}

//       {report === "employees" && (
//         <>
//           <Button onClick={handleBack} sx={{ mt: 2 }}>⬅ חזור</Button>
//           <EmployeesReport />
//         </>
//       )}
//       {report === "books" && (
//         <>
//           <Button onClick={handleBack} sx={{ mt: 2 }}>⬅ חזור</Button>
//           <BookPivotReport />
//         </>
//       )}
//     </Box>
//   );
// };

// export default ReportsDashboard;
import React, { useState } from "react";
import EmployeesReport from "./EmployeesReport";
import BookPivotReport from "./BookPivotReport";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const ReportsDashboard = () => {
  const [report, setReport] = useState(null); // "employees" | "books"
  const { t } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";

  const handleBack = () => setReport(null);

  return (
    <Box p={3} maxWidth={1000} mx="auto" dir={dir}>
      {!report && (
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Typography variant="h5" gutterBottom>
            {t("reportsDashboard.title")}
          </Typography>
          <Button variant="contained" onClick={() => setReport("employees")} fullWidth>
            {t("reportsDashboard.employeesSummary")}
          </Button>
          <Button variant="contained" onClick={() => setReport("books")} fullWidth>
            {t("reportsDashboard.booksSummary")}
          </Button>
        </Box>
      )}

      {report === "employees" && (
        <>
          <Button onClick={handleBack} sx={{ mt: 2 }}>
            ⬅ {t("reportsDashboard.back")}
          </Button>
          <EmployeesReport />
        </>
      )}

      {report === "books" && (
        <>
          <Button onClick={handleBack} sx={{ mt: 2 }}>
            ⬅ {t("reportsDashboard.back")}
          </Button>
          <BookPivotReport />
        </>
      )}
    </Box>
  );
};

export default ReportsDashboard;
