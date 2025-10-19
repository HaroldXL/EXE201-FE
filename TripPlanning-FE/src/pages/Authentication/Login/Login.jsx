import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import api from "../../../config/axios";
import { login } from "../../../store/redux/features/userSlice";
import { message, notification } from "antd";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("User/login", {
        email: formData.email,
        password: formData.password,
      });
      message.success("Đăng nhập thành công!");
      console.log("Login successful:", response.data);

      // Store token if provided
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
      }

      // Dispatch login action
      dispatch(login(response.data));

      // Navigate to home page

      if (response.data.user.roleName === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin.",
        placement: "topRight",
        duration: 2,
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Đăng Nhập</h1>
          <p className="login-subtitle">
            Chào mừng trở lại! Hãy đăng nhập vào tài khoản của bạn.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật Khẩu</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật Khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-content">
                <CircularProgress size={20} color="inherit" />
                Đang đăng nhập...
              </div>
            ) : (
              <span className="normal-content">Đăng Nhập</span>
            )}
          </button>

          <div className="form-footer">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="checkbox"
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Nhớ tôi
              </label>
            </div>
            <a href="#" className="forgot-password">
              Quên Mật Khẩu?
            </a>
          </div>
        </form>

        <div className="signup-link">
          <span>Chưa có tài khoản? </span>
          <Link to={"/register"} className="signup-text">
            Đăng Ký
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
