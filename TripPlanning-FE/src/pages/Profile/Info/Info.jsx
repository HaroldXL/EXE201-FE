import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
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
import { message } from "antd";

function Info() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [originalData, setOriginalData] = useState({
    username: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [_userId, setUserId] = useState(null);

  // Skeleton Form Component
  const SkeletonForm = () => (
    <div className="wrapper-info__form">
      {/* Skeleton for form fields */}
      {Array.from({ length: 4 }).map((_, index) => (
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
        const profileData = {
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          dob: userData.dob || "",
        };
        setFormData(profileData);
        setOriginalData(profileData);
        setUserId(userData.id);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if form data has changed
  const hasChanges = () => {
    return (
      formData.username !== originalData.username ||
      formData.phone !== originalData.phone ||
      formData.dob !== originalData.dob
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges()) {
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API - wrap in editProfileDto object
      const requestData = {
        editProfileDto: {
          username: formData.username,
          phone: formData.phone,
          dob: formData.dob,
        },
      };

      const response = await api.patch("/User/edit-profile", requestData);

      if (response.status === 200) {
        // Update original data to reflect saved changes
        setOriginalData(formData);
        message.success("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        message.error(`Có lỗi xảy ra: ${errorMessages.join(", ")}`);
      } else {
        message.error(
          "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại."
        );
      }
    } finally {
      setSaving(false);
    }
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
                    className="wrapper-info__input wrapper-info__input--disabled"
                    disabled
                    readOnly
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

              <button
                type="submit"
                className={`wrapper-info__save-btn ${
                  !hasChanges() ? "wrapper-info__save-btn--disabled" : ""
                }`}
                disabled={!hasChanges() || saving}
              >
                {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
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
