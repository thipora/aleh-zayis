export const welcomeEmailTemplate = (name, password) => `
  <h2>Welcome to Aleh Zayis, ${name}!</h2>
  <p>Your account has been successfully created.</p>
  <p><strong>Password:</strong> ${password}</p>
  <p>You can now log in using your email and this password.</p>
`;
