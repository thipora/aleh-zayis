export const welcomeEmailTemplate = (name, password, language = 'en') => {
  if (language === 'he') {
    return `
      <h2>ברוך הבא לעלי זית, ${name}!</h2>
      <p>החשבון שלך נוצר בהצלחה.</p>
      <p><strong>סיסמה:</strong> ${password}</p>
      <p>באפשרותך להתחבר כעת באמצעות כתובת האימייל והסיסמה הזו.</p>
    `;
  }
  return `
    <h2>Welcome to Aleh Zayis, ${name}!</h2>
    <p>Your account has been successfully created.</p>
    <p><strong>Password:</strong> ${password}</p>
    <p>You can now log in using your email and this password.</p>
  `;
};

export const resetPasswordEmailTemplate = (password, language = 'en') => {
  if (language === 'he') {
    return `
      <h2>איפוס סיסמה - עלי זית</h2>
      <p>הסיסמה שלך אופסה בהצלחה.</p>
      <p><strong>סיסמה חדשה:</strong> ${password}</p>
    `;
  }
  return `
    <h2>Password Reset - Aleh Zayis</h2>
    <p>Your password has been successfully reset.</p>
    <p><strong>New Password:</strong> ${password}</p>
  `;
};

export const monthlyReportEmailTemplate = (name, month, year, language = 'en') => {
  if (language === 'he') {
    return `
      <p>שלום ${name},</p>
      <p>מצורף הדוח החודשי שלך לחודש ${month}/${year}.</p>
      <p>תודה!</p>
    `;
  }
  return `
    <p>Hello ${name},</p>
    <p>Your monthly report for ${month}/${year} is attached.</p>
    <p>Thank you!</p>
  `;
};
