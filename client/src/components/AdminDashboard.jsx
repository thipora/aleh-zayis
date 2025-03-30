import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Welcome to Admin Dashboard</h2>
      <div>
        <button onClick={() => window.location.href = '/employees'}>Manage Employees</button>
        {/* <button onClick={() => window.location.href = '/settings'}>Settings</button> */}
        {/* כפתורים נוספים יכולים להיות פה */}
      </div>
    </div>
  );
};

export default AdminDashboard;
