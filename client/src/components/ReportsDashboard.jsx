// import React, { useState } from "react";
// import EditorsSummaryTable from "./EditorsSummaryTable";
// import BooksSummaryTable from "./BooksSummaryTable";
// import EditorDetailReport from "./EditorDetailReport";
// import BookDetailReport from "./BookDetailReport";
// import { Box, Tabs, Tab } from "@mui/material";

// const ReportsDashboard = () => {
//   const [tab, setTab] = useState(0);
//   const [selectedEditor, setSelectedEditor] = useState(null);
//   const [selectedBook, setSelectedBook] = useState(null);

//   // reset detail on tab switch
//   const handleChangeTab = (event, newValue) => {
//     setTab(newValue);
//     setSelectedEditor(null);
//     setSelectedBook(null);
//   };

//   return (
//     <Box p={2} maxWidth={900} mx="auto" dir="rtl">
//       <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 2 }}>
//         <Tab label="סיכום לפי עורכים" />
//         <Tab label="סיכום לפי ספרים" />
//       </Tabs>

//       {tab === 0 && (
//         <>
//           <EditorsSummaryTable onSelect={setSelectedEditor} />
//           {selectedEditor && (
//             <EditorDetailReport editorId={selectedEditor} onBack={() => setSelectedEditor(null)} />
//           )}
//         </>
//       )}

//       {tab === 1 && (
//         <>
//           <BooksSummaryTable onSelect={setSelectedBook} />
//           {selectedBook && (
//             <BookDetailReport bookId={selectedBook} onBack={() => setSelectedBook(null)} />
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default ReportsDashboard;


import React, { useState } from "react";
import EditorsSummaryTable from "./EditorsSummaryTable";
import BooksSummaryTable from "./BooksSummaryTable";
import EditorDetailDialog from "./EditorDetailDialog";
// אם יש לך דיאלוג פירוט גם לספרים, תייבאי כאן: import BookDetailDialog from "./BookDetailDialog";
import { Box, Tabs, Tab } from "@mui/material";

const ReportsDashboard = () => {
  const [tab, setTab] = useState(0);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [openEditorDialog, setOpenEditorDialog] = useState(false);

  // טאבים: 0=עורכים, 1=ספרים
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setSelectedEditor(null);
    setOpenEditorDialog(false);
  };

  // פתיחת דיאלוג עורך
  const handleOpenEditorDialog = (editorId, editorName) => {
    setSelectedEditor({ id: editorId, name: editorName });
    setOpenEditorDialog(true);
  };

  // סגירת דיאלוג עורך
  const handleCloseEditorDialog = () => {
    setOpenEditorDialog(false);
    setSelectedEditor(null);
  };

  return (
    <Box p={2} maxWidth={900} mx="auto" dir="rtl">
      <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 2 }}>
        <Tab label="סיכום לפי עורכים" />
        <Tab label="סיכום לפי ספרים" />
      </Tabs>

      {tab === 0 && (
        <>
          <EditorsSummaryTable onSelect={handleOpenEditorDialog} />
          <EditorDetailDialog
            open={openEditorDialog}
            editorId={selectedEditor?.id}
            editorName={selectedEditor?.name}
            onClose={handleCloseEditorDialog}
          />
        </>
      )}

      {tab === 1 && (
        <>
          <BooksSummaryTable /* onSelect={...} */ />
          {/* להוסיף כאן BookDetailDialog אם יש לך דיאלוג פירוט לספר */}
        </>
      )}
    </Box>
  );
};

export default ReportsDashboard;
