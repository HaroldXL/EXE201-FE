import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import api from "../../../config/axios";
import { message, notification } from "antd";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("User/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      message.success("Hãy kiểm tra email của bạn để xác nhận tài khoản!");
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      notification.error({
        message: "Đăng ký thất bại!",
        description: "Vui lòng thử lại sau.",
        duration: 2,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Tạo Tài Khoản</h1>
            <p className="register-subtitle">
              Hãy điền thông tin của bạn để tạo tài khoản và tận hưởng dịch vụ
              của chúng tôi.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên Tài Khoản</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Tên Tài Khoản"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

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

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-content">
                  <CircularProgress size={20} color="inherit" />
                  Đang đăng ký...
                </div>
              ) : (
                <span className="normal-content">Đăng Ký</span>
              )}
            </button>
          </form>

          <div className="login-link">
            <span>Đã có tài khoản? </span>
            <Link to={"/login"} className="login-text">
              Đăng Nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
