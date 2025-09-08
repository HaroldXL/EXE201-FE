import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  User,
  Mail,
  Phone,
  ChevronDown,
  AtSign,
} from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./Info.css";

function Info() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Handle form submission here
  };

  return (
    <div>
      <Header />
      <div className="wrapper">
        <div className="wrapper-info">
          {/* Header Section */}
          <div className="wrapper-info__header">
            <h1 className="wrapper-info__title">Thông Tin Cá Nhân</h1>
          </div>

          {/* Profile Avatar */}
          <div className="wrapper-info__avatar-section">
            <div className="wrapper-info__avatar">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="User Avatar"
                className="wrapper-info__avatar-image"
              />
            </div>
            <button className="wrapper-info__change-avatar-btn">
              Thay đổi Avatar
            </button>
          </div>

          {/* Form Section */}
          <form className="wrapper-info__form" onSubmit={handleSubmit}>
            <div className="wrapper-info__form-group">
              <label className="wrapper-info__label">Họ và Tên</label>
              <div className="wrapper-info__input-wrapper">
                <User size={20} className="wrapper-info__input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và Tên"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="wrapper-info__input"
                />
              </div>
            </div>

            <div className="wrapper-info__form-group">
              <label className="wrapper-info__label">Tên tài khoản</label>
              <div className="wrapper-info__input-wrapper">
                <AtSign size={20} className="wrapper-info__input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Tên tài khoản"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="wrapper-info__input"
                />
              </div>
            </div>

            <div className="wrapper-info__form-group">
              <label className="wrapper-info__label">Email</label>
              <div className="wrapper-info__input-wrapper">
                <Mail size={20} className="wrapper-info__input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="wrapper-info__input"
                />
              </div>
            </div>

            <div className="wrapper-info__form-group">
              <label className="wrapper-info__label">Quốc Gia</label>
              <div className="wrapper-info__phone-wrapper">
                <div className="wrapper-info__country-code">
                  <span className="wrapper-info__flag">🇻🇳</span>
                  <span className="wrapper-info__code">+84</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="000 000 000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="wrapper-info__phone-input"
                />
              </div>
            </div>

            <div className="wrapper-info__form-group">
              <label className="wrapper-info__label">Giới Tính</label>
              <div className="wrapper-info__select-wrapper">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="wrapper-info__select"
                >
                  <option value="">Lựa chọn ...</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <ChevronDown size={20} className="wrapper-info__select-icon" />
              </div>
            </div>

            <button type="submit" className="wrapper-info__save-btn">
              Lưu Thay Đổi
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Info;
