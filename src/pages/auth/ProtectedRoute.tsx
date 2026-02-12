import type { RootState } from "../../store/store";
import { useEffect, ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { refreshSession } from "../../api/authApi";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectAdmin = ({ children }: ProtectedRouteProps): ReactNode => {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Call refresh endpoint to validate token on backend
        // The httpOnly cookie will be sent automatically
        await refreshSession();
        setIsValid(true);
        setIsValidating(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
        });
        setIsValid(false);
        setIsValidating(false);
      }
    };

    if (user) {
      validateToken();
    } else {
      setIsValidating(false);
    }
  }, [user]);

  // While validating, show nothing or a loading state
  if (isValidating) {
    return     <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
  }

  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Not Authenticated",
      text: "Please log in to access this page.",
    });
    return <Navigate to="/" replace />;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectAdmin;