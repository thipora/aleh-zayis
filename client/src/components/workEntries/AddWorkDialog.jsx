import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, CircularProgress, MenuItem, Select,
  FormControl, InputLabel, FormHelperText, Tabs, Tab, Box
  // , Radio, RadioGroup, FormControlLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TimerInput from "./TimerInput";
import RangeInput from "./RangeInput";
import ManualInput from "./ManualInput";

const TIMER_CANCEL_KEY = "timerCanceled";

const AddWorkDialog = ({ open, onClose, onAdd, books }) => {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState("timer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [disableTabs, setDisableTabs] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"));
  // const isProjectManager = user?.roles?.includes(8);

  const [newWork, setNewWork] = useState({
    book_id: "",
    book_name: "",
    start_time: "00:00",
    end_time: "00:00",
    quantity: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    entry_mode: "timer",
    // rate: "0.00",
    // language: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showOtherModes, setShowOtherModes] = useState(false);

  useEffect(() => {
    const savedTimer = JSON.parse(localStorage.getItem("activeTimer"));
    const canceled = localStorage.getItem(TIMER_CANCEL_KEY) === "true";
    if (savedTimer && savedTimer.isRunning && !canceled) {
      setStartTime(savedTimer.startTime);
      setIsRunning(true);
    } else {
      localStorage.removeItem("activeTimer");
      localStorage.removeItem(TIMER_CANCEL_KEY);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleTabChange = (e, newValue) => {
    if (isRunning) return;
    setSelectedMode(newValue);
    setNewWork(prev => ({ ...prev, entry_mode: newValue }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "book_id") {
      const selectedBook = books.find(b => b.id_book === value);
      setNewWork(prev => ({
        ...prev,
        book_id: value,
        book_name: selectedBook ? selectedBook.title : ""
      }));
    } else {
      setNewWork(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityUpdate = (q, start = null, end = null) => {
    setNewWork(prev => ({
      ...prev,
      quantity: q,
      start_time: start || prev.start_time,
      end_time: end || prev.end_time
    }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!newWork.book_id) newErrors.book_id = t("AddWorkDialog.errors.book");
    if (!newWork.description) newErrors.description = t("AddWorkDialog.errors.description");
    if (!newWork.date) newErrors.date = t("AddWorkDialog.errors.date");
    if (!newWork.quantity) newErrors.quantity = t("AddWorkDialog.errors.quantity");

    newWork.quantity = parseFloat(newWork.quantity);

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await onAdd(newWork);
        handleDialogClose();
      } catch (err) {
        alert("Error adding work entry.");
      } finally {
        setDisableTabs(false);
      }
    }
  };

  const handleDialogClose = () => {
    setDisableTabs(false);
    setStartTime(null);
    setElapsed(0);
    setIsRunning(false);
    localStorage.setItem(TIMER_CANCEL_KEY, "true");
    localStorage.removeItem("activeTimer");
    localStorage.removeItem("activeTimerData");
    setTimerFinished(false);
    onClose();
  };

  return (
    <Dialog open={open} handleDialogClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("AddWorkDialog.title")}</DialogTitle>
      <DialogContent>
        {showOtherModes && (<Tabs value={selectedMode} onChange={handleTabChange} variant="fullWidth">
          <Tab label={t("AddWorkDialog.timerMode") || "Timer"} value="timer" />
          <Tab label={t("AddWorkDialog.rangeMode") || "Start-End"} value="range" disabled={disableTabs} />
          <Tab label={t("AddWorkDialog.manualMode") || "Manual"} value="manual" disabled={disableTabs} />
        </Tabs>)}

        {!showOtherModes && (
          <Box textAlign="center" mt={2}>
            <Button variant="outlined" onClick={() => setShowOtherModes(true)}>
              {t("AddWorkDialog.showMoreModes") || "אפשרויות הזנת עבודה נוספות"}
            </Button>
          </Box>
        )}

        {selectedMode === "timer" && (
          <TimerInput
            onFinish={(elapsedMs) => {
              const hours = (elapsedMs / 1000 / 60 / 60).toFixed(3);
              const now = new Date();
              const start = new Date(now.getTime() - elapsedMs);
              handleQuantityUpdate(hours, start.toTimeString().slice(0, 5), now.toTimeString().slice(0, 5));
              setTimerFinished(true);
            }}
            disabled={!newWork.book_id}
            setDisableTabs={setDisableTabs}
            setTimerFinished={setTimerFinished}
            setIsTimerRunning={setIsTimerRunning}
          />
        )}

        {selectedMode === "range" && (
          <RangeInput onQuantityUpdate={handleQuantityUpdate} />
        )}

        {selectedMode === "manual" && (
          <ManualInput onChange={(q) => setNewWork(prev => ({ ...prev, quantity: q }))} />
        )}


        <FormControl fullWidth margin="normal" error={!!errors.book_id}>
          <InputLabel>{t("AddWorkDialog.bookLabel")}</InputLabel>
          <Select name="book_id" value={newWork.book_id} onChange={handleInputChange}>
            {books.map(book => (
              <MenuItem key={book.id_book} value={book.id_book}>
                {book.AZ_book_id} - {book.title}
              </MenuItem>
            ))}
          </Select>
          {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
        </FormControl>

        <TextField label={t("AddWorkDialog.description")} name="description" value={newWork.description} onChange={handleInputChange} fullWidth margin="normal" error={!!errors.description} helperText={errors.description} />
        <TextField label={t("AddWorkDialog.notes")} name="notes" value={newWork.notes || ""} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label={t("AddWorkDialog.date")} name="date" type="date" value={newWork.date} onChange={handleInputChange} fullWidth margin="normal" error={!!errors.date} helperText={errors.date} />
        {/* <Box display="flex" justifyContent="center" mt={2}>
  <RadioGroup
    row
    name="language"
    value={newWork.language}
    onChange={handleInputChange}
  >
    <FormControlLabel
      value="he"
      control={<Radio size="small" />}
      label={t("AddWorkDialog.language.hebrew")}
    />
    <FormControlLabel
      value="en"
      control={<Radio size="small" />}
      label={t("AddWorkDialog.language.english")}
    />
    <FormControlLabel
      value="both"
      control={<Radio size="small" />}
      label={t("AddWorkDialog.language.both")}
    />
  </RadioGroup>
</Box>

        {isProjectManager && (
          <TextField
            label={t("AddWorkDialog.rate")}
            name="rate"
            value={newWork.rate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0 }}
            error={!!errors.rate}
            helperText={errors.rate}
          />
        )} */}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setConfirmCancelOpen(true)}>
          {t("AddWorkDialog.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            loading ||
            (selectedMode === "timer" && (!timerFinished || isRunning))
          }
        >
          {loading ? <CircularProgress size={24} /> : t("AddWorkDialog.save")}
        </Button>
      </DialogActions>
      <Dialog open={confirmCancelOpen} onClose={() => setConfirmCancelOpen(false)}>
        <DialogTitle>{t("AddWorkDialog.confirmCancelTitle") || "Are you sure you want to cancel?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)}>
            {t("AddWorkDialog.no") || "No"}
          </Button>
          <Button
            onClick={() => {
              setConfirmCancelOpen(false);
              handleDialogClose();
            }}
            color="error"
            variant="contained"
          >
            {t("AddWorkDialog.yes") || "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddWorkDialog;
