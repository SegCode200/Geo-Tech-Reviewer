import { useEffect, useState,useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { verifyInternalUserEmail } from "../../api/authApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passwordToken, setPasswordToken] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
     if (hasRun.current) return; // <-- stops second execution
    hasRun.current = true;


    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Invalid Link",
          text: "No verification token found. Please check your email link.",
        }).then(() => {
          navigate("/");
        });
        return;
      }

      try {
        setLoading(true);

        console.log("VerifyEmail - token from url:", token);

        const response = await verifyInternalUserEmail(token);

        console.log("VerifyEmail - server response:", response);

        setPasswordToken(response.passwordToken);

        Swal.fire({
          icon: "success",
          title: "Email Verified",
          text: response.message || "Your email has been verified successfully!",
        }).then(() => {
          // Navigate to set password page with password token
          // include token in both query param (encoded) and navigation state as a fallback
          const encoded = encodeURIComponent(response.passwordToken || "");
          navigate(`/set-password?token=${encoded}`, {
            state: { token: response.passwordToken },
          });
        });
      } catch (error: any) {
        // log full error for debugging
        console.error("VerifyEmail - error:", error);
        const serverData = error.response?.data;
        const errorMessage = serverData?.message || error.message || "Email verification failed. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: errorMessage,
        }).then(() => {
          navigate("/");
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying Email
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Please wait while we verify your email address...
            </p>
          </div>
        ) : (
          <div className="text-center">
            {passwordToken ? (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  ✓ Email Verified
                </h2>
                <p className="text-gray-600">
                  Redirecting you to set your password...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  Please check your email link and try again.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
