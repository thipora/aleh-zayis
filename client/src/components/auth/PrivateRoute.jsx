// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { APIrequests } from "../../APIrequests";

// const PrivateRoute = ({ children }) => {
//   const [valid, setValid] = useState(null);
//   const api = new APIrequests();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.getRequest("/auth/validate-token"); // נשלח לשרת לבדוק את הטוקן
//         if (res.valid) {
//           setValid(true);
//         } else {
//           setValid(false);
//         }
//       } catch {
//         setValid(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   if (valid === null) return null; // טוען או בודק
//   if (!valid) return <Navigate to="/login" replace />;

//   return children;
// };

// export default PrivateRoute;
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { APIrequests } from "../../APIrequests";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(null);
  const api = new APIrequests();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.getRequest("/auth/validate-token"); // בודק את הטוקן
        if (res.valid && res.user) {
          setUser(res.user); // כאן חשוב שהשרת יחזיר את כל פרטי המשתמש
          setValid(true);
        } else {
          setValid(false);
        }
      } catch {
        setValid(false);
      }
    };
    checkAuth();
  }, []);

  if (valid === null) return null; // מצב ביניים

  if (!valid) return <Navigate to="/login" replace />;

  // ✅ בדיקת הרשאות לפי account_type
  if (allowedRoles && !allowedRoles.includes(user.account_type)) {
    return <div style={{ textAlign: "center", paddingTop: "5rem", color: "darkred" }}>
      Access Denied
    </div>;
  }

  return children;
};

export default PrivateRoute;
