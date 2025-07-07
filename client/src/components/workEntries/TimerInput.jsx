import React from "react";
import TimerCircle from "./TimerCircle";

const TimerInput = ({ onFinish, disabled, setDisableTabs, setTimerFinished, setIsTimerRunning }) => {
    return (
        <TimerCircle
            onFinish={onFinish}
            disabled={disabled}
            disableTabs={setDisableTabs}
            setIsTimerRunning={setIsTimerRunning}
            setTimerFinished={setTimerFinished}
        />
    );
};

export default TimerInput;
