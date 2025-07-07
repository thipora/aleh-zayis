import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Stack, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

const TIMER_KEY = "activeTimerData";

const TimerCircle = ({ onFinish, disableTabs, setTimerFinished, setIsTimerRunning }) => {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(TIMER_KEY));
    if (saved && saved.startTime) {
      setIsRunning(saved.isRunning);
      setIsPaused(saved.isPaused);
      setStartTime(saved.startTime);
      setElapsed(saved.elapsed);
      setIsFinished(!saved.isRunning && !saved.isPaused);

      if ((saved.isRunning || saved.isPaused)) {
        if (setIsTimerRunning) setIsTimerRunning(saved.isRunning);
        if (disableTabs) disableTabs(true);
      }
    }
  }, []);


  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const newElapsed = Date.now() - startTime;
        setElapsed(newElapsed);
        localStorage.setItem(TIMER_KEY, JSON.stringify({
          isRunning: true,
          isPaused: false,
          startTime,
          elapsed: newElapsed
        }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, startTime]);

  const formatElapsed = () => {
    const totalSec = Math.floor(elapsed / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    const now = Date.now();
    setIsRunning(true);
    setIsPaused(false);
    setIsFinished(false);
    setStartTime(now - elapsed);
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      isRunning: true,
      isPaused: false,
      startTime: now - elapsed,
      elapsed
    }));
    if (disableTabs) disableTabs(true);
    if (setTimerFinished) setTimerFinished(false);
    if (setIsTimerRunning) setIsTimerRunning(true);

  };

  const handlePause = () => {
    setIsPaused(true);
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      isRunning: true,
      isPaused: true,
      startTime,
      elapsed
    }));
  };

  const handleResume = () => {
    const now = Date.now();
    setIsPaused(false);
    setStartTime(now - elapsed);
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      isRunning: true,
      isPaused: false,
      startTime: now - elapsed,
      elapsed
    }));
  };

  const handleReset = () => {
    setConfirmReset(false);
    setIsRunning(false);
    setIsPaused(false);
    setElapsed(0);
    setStartTime(null);
    setIsFinished(false);
    localStorage.removeItem(TIMER_KEY);
    if (setIsTimerRunning) setIsTimerRunning(false);
    if (disableTabs) disableTabs(false);
  };

  const handleFinish = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(true);
    clearInterval(intervalRef.current);
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      isRunning: false,
      isPaused: false,
      startTime,
      elapsed
    }));
    if (onFinish) onFinish(elapsed);
    if (setIsTimerRunning) setIsTimerRunning(false);
  };

  return (
    <Box textAlign="center" mt={2}>
      <Box
        sx={{
          width: 220,
          height: 80,
          backgroundColor: isPaused ? "#fff3e0" : isFinished ? "#ffebee" : "#e8f5e9",
          border: "2px solid",
          borderColor: isPaused ? "#ff9800" : isFinished ? "#f44336" : "#4caf50",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          mb: 2,
        }}
      >
        <Typography variant="h4">{formatElapsed()}</Typography>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center">
        {isFinished ? (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setIsFinished(false);
                setIsRunning(true);
                setIsPaused(false);
                setStartTime(Date.now() - elapsed);
                if (setTimerFinished) setTimerFinished(false);
              }}
            >
              {t("AddWorkDialog.continue")}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setConfirmReset(true)}
            >
              {t("AddWorkDialog.reset")}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={isRunning ? () => setConfirmReset(true) : handleStart}
            >
              {isRunning ? t("AddWorkDialog.reset") : t("AddWorkDialog.start")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleFinish}
              disabled={!isRunning}
            >
              {t("AddWorkDialog.finish")}
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#f57c00", '&:hover': { backgroundColor: "#ef6c00" } }}
              onClick={isPaused ? handleResume : handlePause}
              disabled={!isRunning}
            >
              {isPaused ? t("AddWorkDialog.resume") : t("AddWorkDialog.pause")}
            </Button>
          </>
        )}
      </Stack>

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}>
        <DialogTitle>{t("AddWorkDialog.confirmReset")}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmReset(false)}>{t("AddWorkDialog.cancel")}</Button>
          <Button onClick={handleReset} color="error" variant="contained">
            {t("AddWorkDialog.reset")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimerCircle;
