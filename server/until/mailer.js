import nodemailer from 'nodemailer';

// יצירת transporter לשירות שליחת המיילים
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // השתמש ב-SSL אם זה חשוב לך
    auth: {
        user: 'alehzayis03@gmail.com', // המייל שלך
        pass: 'xqky yswp epxj wmtt', 
        // הסיסמה שלך לחשבון
    },
});

export const sendMail = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: 'alehzayis03@gmail.com', // המייל שנשלח ממנו
            to: params.to,                // הכתובת אליה המייל יישלח
            subject: params.subject,      // נושא המייל
            html: params.html             // תוכן ה-HTML של המייל
        });

        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};
