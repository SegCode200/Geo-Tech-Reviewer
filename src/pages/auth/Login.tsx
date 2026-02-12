import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useLoginStore from "../../store/useLoginStore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { login } from "../../global/authActions";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setIsloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { email, password, setEmail, setPassword, validateForm, resetForm } =
    useLoginStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const validationError = showValidation
    ? validateForm()
    : { isValid: true, error: null };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsloading(true);
    e.preventDefault();
    setShowValidation(true);
    const validation = validateForm();
    if (!validation.isValid) {
      setIsloading(false);
      return;
    }
    try {
      await dispatch(login(email, password));
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have been logged in successfully.",
      }).then(() => {
        setIsloading(false);
        navigate("/dashboard");
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err || "An error occurred during login.",
      });
      setIsloading(false);
    }
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-gov shadow-gov-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 sm:px-8 py-8 sm:py-12 text-white text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-white/20 p-3 sm:p-4 rounded-full">
                <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Government Portal</h1>
            <p className="text-xs sm:text-sm opacity-90">Certificate of Occupancy System</p>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <p className="text-center text-gov-text-light mb-6 sm:mb-8 text-xs sm:text-sm">
              Enter your credentials to access
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="gov-label text-xs sm:text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gov.ng"
                  className="gov-input text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="gov-label text-xs sm:text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="gov-input text-sm sm:text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gov-text-light hover:text-primary transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Validation Error */}
              {!validationError?.isValid && validationError?.error && (
                <div className="bg-red-50 border border-red-200 rounded-gov px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-xs sm:text-sm text-red-700">{validationError.error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full gov-button font-semibold text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded gov" />
                  <span className="text-gov-text-light">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-secondary font-medium">
                  Forgot?
                </a>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gov-border text-center text-xs text-gov-text-light">
              <p className="mb-1">Authorized Use Only</p>
              <p>© 2025 Government of Nigeria.</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-md rounded-gov p-3 sm:p-4 border border-white/20 text-white text-center text-xs">
          <p>This is a secure government system.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
