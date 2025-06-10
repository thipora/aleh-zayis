import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const states = ["available", "partial", "not_available"];
const colors = {
    available: "#4caf50",      // ירוק
    partial: "#ff9800",        // כתום
    not_available: "#9e9e9e", // grey
};

const ThreeStateSwitch = ({ value, onChange }) => {
    const index = states.indexOf(value);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === "rtl";  // דרך תקנית לבדוק RTL

    const labels = {
        available: t("availability.available"),
        partial: t("availability.partial"),
        not_available: t("availability.notAvailable"),
    };

    const handleClick = () => {
        const nextIndex = (index + 1) % states.length;
        onChange(states[nextIndex]);
    };

    const containerWidth = 180;
    const containerHeight = 40;
    const circleSize = 30;
    const gap = (containerWidth / 3 - circleSize) / 2;

    return (
        <Box
            onClick={handleClick}
            sx={{
                width: containerWidth,
                height: containerHeight,
                borderRadius: containerHeight / 2,
                backgroundColor: colors[states[index]],
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: 1,
                userSelect: 'none',
                px: 0,
                transition: 'background-color 0.3s ease',
            }}
        >
            {states.map((state, i) => (
                <Box
                    key={state}
                    sx={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2,
                        color: 'black', // תמיד שחור
                        fontWeight: i === index ? 'bold' : 'normal',
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                        px: 0.5,
                    }}
                >
                    {labels[state]}
                </Box>
            ))}

            <Box
                sx={{
                    position: 'absolute',
                    top: (containerHeight - circleSize) / 2,
                    left: gap,
                    width: circleSize,
                    height: circleSize,
                    borderRadius: '50%',
                    backgroundColor: 'white', // העיגול תמיד לבן
                    transition: 'transform 0.3s ease',
                    transform: `translateX(${isRtl
                        ? (states.length - 1 - index) * (containerWidth / 3)
                        : index * (containerWidth / 3)}px)`,
                    boxShadow: 2,
                    zIndex: 1,
                }}
            />
        </Box>
    );
};

export default ThreeStateSwitch;
