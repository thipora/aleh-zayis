import * as employeeRolesService from '../services/employeeRolesService.js';

export const getAllEmployeeRoles = async (req, res) => {
  try {
    const roles = await employeeRolesService.getAllEmployeeRolesWithRates();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee roles' });
  }
};

export const getEmployeeRolesById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await employeeRolesService.getEmployeeRolesWithRatesById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee roles' });
  }
};

export const updateRatesForEmployeeRole = async (req, res) => {
  const { id } = req.params;
  const { hourly_rate, special_rate } = req.body;

  try {
    await employeeRolesService.updateRates(id, hourly_rate, special_rate);
    res.status(200).json({ message: 'Rates updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rates' });
  }
};

export const updateMultipleRatesForEmployeeRole = async (req, res) => {
    const { roles } = req.body;
  if (!Array.isArray(roles)) {
    return res.status(400).json({ error: "Invalid roles array" });
  }
  try {
    await employeeRolesService.updateMultipleRates(roles);
    res.status(200).json({ message: 'Rates updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rates' });
  }
};