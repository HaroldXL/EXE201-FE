import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
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

        <form className="login-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="login-button">
            Đăng Nhập
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
