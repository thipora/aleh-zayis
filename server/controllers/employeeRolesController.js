import * as employeeRolesService from '../services/employeeRolesService.js';

export const getAllEmployeeRoles = async (req, res) => {
  try {
    const roles = await employeeRolesService.getAllEmployeeRolesWithRates();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee roles' });
  }
};

export const updateRatesForEmployeeRole = async (req, res) => {
  const { id } = req.params;
  const { hourly_rate, special_rate } = req.body;

  try {
    await employeeRolesService.updateRates(id, hourly_rate, special_rate);
    res.status(200).json({ message: 'Rates updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rates' });
  }
};
