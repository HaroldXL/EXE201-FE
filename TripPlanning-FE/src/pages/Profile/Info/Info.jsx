import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  User,
  Mail,
  Phone,
  ChevronDown,
  AtSign,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@mui/material";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./Info.css";

function Info() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [_userId, setUserId] = useState(null);

  // Skeleton Form Component
  const SkeletonForm = () => (
    <div className="wrapper-info__form">
      {/* Skeleton for form fields */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="wrapper-info__form-group">
          <Skeleton
            variant="text"
            width={120}
            height={20}
            animation="wave"
            sx={{ mb: 1 }}
          />
          <div className="wrapper-info__input-wrapper">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              animation="wave"
              sx={{ borderRadius: "12px" }}
            />
          </div>
        </div>
      ))}
      {/* Skeleton for save button */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={56}
        animation="wave"
        sx={{ borderRadius: "20px", mt: 2 }}
      />
    </div>
  );

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/User/profile");

      if (response.data) {
        const userData = response.data;
        setFormData({
          fullName: userData.fullName || "",
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          dob: userData.dob || "",
        });
        setUserId(userData.id);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
          {loading ? (
            <SkeletonForm />
          ) : (
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
                <label className="wrapper-info__label">Số điện thoại</label>
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
                <label className="wrapper-info__label">Ngày sinh</label>
                <div className="wrapper-info__input-wrapper">
                  <Calendar size={20} className="wrapper-info__input-icon" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="wrapper-info__input"
                  />
                </div>
              </div>

              <button type="submit" className="wrapper-info__save-btn">
                Lưu Thay Đổi
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Info;
