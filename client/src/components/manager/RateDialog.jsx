import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, Box, CircularProgress
} from "@mui/material";
import { APIrequests } from "../../APIrequests";

const RateDialog = ({ open, onClose, employeeId, employeeName }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const api = new APIrequests();

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
        } catch (err) {
            console.error("Failed to fetch rates", err);
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
        } catch (err) {
            console.error("Error updating rates:", err);
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
            <DialogTitle>Update Rates – {employeeName}</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : roles.length === 0 ? (
                    <Typography>No roles found for this employee.</Typography>
                ) : (
                    roles.map((role, index) => (
                        <Box key={role.id_employee_role} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">{role.role_name}</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <TextField
                                    label="Hourly Rate"
                                    type="number"
                                    value={cleanNumber(role.hourly_rate)}
                                    onChange={(e) => handleChange(index, "hourly_rate", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label={role.special_unit ? `${role.special_unit} Rate` : "Special Rate"}
                                    type="number"
                                    value={cleanNumber(role.special_rate)}
                                    onChange={(e) => handleChange(index, "special_rate", e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RateDialog;
