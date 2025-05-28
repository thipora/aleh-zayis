import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { APIrequests } from "../../APIrequests";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(null);
  const api = new APIrequests();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.getRequest("/auth/validate-token");
        if (res.valid && res.user) {
          setUser(res.user);
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

  if (valid === null) return null;

  if (!valid) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.account_type)) {
    return <div style={{ textAlign: "center", paddingTop: "5rem", color: "darkred" }}>
      Access Denied
    </div>;
  }

  return children;
};

export default PrivateRoute;
