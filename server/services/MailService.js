// import nodemailer from 'nodemailer';

// // יצירת transporter לשירות שליחת המיילים
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: false,
//     auth: {
//         user: 'tzipipaster@gmail.com', // השתמש במייל שלך
//         pass: 'TZ0556727951',   // השתמש בסיסמה או בקוד אימות
//     }
// });

// export const sendMail = async (params) => {
//     try {
//         // הגדרת תוכן המייל
//         let info = await transporter.sendMail({
//             from: "tzipipaster@gmail.com", // המייל שנשלח ממנו
//             to: params.to,                // הכתובת אליה המייל יישלח
//             subject: params.subject,      // נושא המייל
//             html: params.html             // תוכן ה-HTML של המייל
//         });

//         return info;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };


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
