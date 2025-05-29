import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, Box, CircularProgress
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";

const RateDialog = ({ open, onClose, employeeId, employeeName }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const api = new APIrequests();
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            fetchRates();
        }
    }, [open]);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const data = await api.getRequest(`/employee-roles/${employeeId}`);
            setRoles(data);
        } catch (error) {
            console.error("Failed to fetch rates", error);
        }
        setLoading(false);
    };

    const handleChange = (index, field, value) => {
        setRoles(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.postRequest(`/employee-roles`, { roles });
            onClose();
        } catch (error) {
            console.error("Error updating rates:", error);
        }
        setSaving(false);
    };

    const cleanNumber = (value) => {
        if (value === null || value === undefined || value === "") return "";
        const num = parseFloat(value);
        return Number.isInteger(num) ? num.toString() : num.toString();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {t("RateDialog.title", { name: employeeName })}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : roles.length === 0 ? (
                    <Typography>{t("RateDialog.noRoles")}</Typography>
                ) : (
                    roles.map((role, index) => (
                        <Box key={role.id_employee_role} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                                {t(`roles.${role.role_name}`, role.role_name)}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <TextField
                                    label={t("RateDialog.hourly")}
                                    type="number"
                                    value={cleanNumber(role.hourly_rate)}
                                    onChange={(e) => handleChange(index, "hourly_rate", e.target.value)}
                                    fullWidth
                                />

                                {role.uses_special_quantity === 1 && (
                                    <TextField
                                        label={t("RateDialog.special", { unit: role.special_unit || t("RateDialog.defaultUnit") })}
                                        type="number"
                                        value={cleanNumber(role.special_rate)}
                                        onChange={(e) => handleChange(index, "special_rate", e.target.value)}
                                        fullWidth
                                    />
                                )}
                            </Box>
                        </Box>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    {t("RateDialog.cancel")}
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    {saving ? t("RateDialog.saving") : t("RateDialog.save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RateDialog;
