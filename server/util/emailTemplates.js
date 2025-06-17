export const welcomeEmailTemplate = (name, password) => `
  <h2>Welcome to Aleh Zayis, ${name}!</h2>
  <p>Your account has been successfully created.</p>
  <p><strong>Password:</strong> ${password}</p>
  <p>You can now log in using your email and this password.</p>
`;

export const resetPasswordEmailTemplate = (password) => `
  <h2>Password Reset - Aleh Zayis</h2>
  <p>Your password has been successfully reset.</p>
  <p><strong>New Password:</strong> ${password}</p>
`;

export const monthlyReportEmailTemplate = (name, month, year) => `
  <p>Hello ${name},</p>
  <p>Your monthly report for ${month}/${year} is attached.</p>
  <p>Thank you!</p>
`;
