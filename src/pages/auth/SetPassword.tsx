import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { setInternalUserPassword } from "../../api/authApi";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  // Prefer token from query param, fallback to navigation state (set by VerifyEmail)
  const queryToken = searchParams.get("token");
  const stateToken = (location.state as any)?.token;
  const token = queryToken ?? stateToken ?? null;

  // debug help: log tokens so we can see what's present when the page loads
  console.log("SetPassword mounted - queryToken:", queryToken, "stateToken:", stateToken, "resolved token:", token);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Token",
        text: "Password setup token is missing. Please request a new verification email.",
      });
      setLoading(false);
      return;
    }

    try {
      // Ensure token is a trimmed string
      const sendToken = (token || "").toString().trim();
      const payload = { token: sendToken, password };
      console.log("SetPassword - sending payload:", payload);

      const response = await setInternalUserPassword(payload);

      console.log("SetPassword - server response:", response);

      Swal.fire({
        icon: "success",
        title: "Password Set Successfully",
        text: response.message || "You can now log in with your new password.",
      }).then(() => {
        navigate("/");
      });
    } catch (error: any) {
      console.error("SetPassword - error:", error);
      const serverData = error.response?.data;
      const errorMessage =
        serverData?.message || error.message || "Failed to set password. Please try again.";

      // show server response details in console for debugging
      console.error("SetPassword - server error data:", serverData);

      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: errorMessage,
        footer: serverData ? JSON.stringify(serverData) : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Set Password</h1>
          <p className="text-gray-600">Create a password to complete your registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              • At least 8 characters required
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting Password...
              </div>
            ) : (
              "Set Password"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <span>Remember your password? </span>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SetPassword;
