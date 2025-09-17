import React, { use, useState } from "react";
import {
  Calendar,
  TimePicker,
  ConfigProvider,
  Modal,
  notification,
} from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  User,
  Heart,
  MapPin,
  Mountain,
  Utensils,
  Camera,
  Banknote,
  Star,
  Globe,
} from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./TripPlanning.css";
import { useSelector } from "react-redux";

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

// Welcome Screen Component
const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="trip-planning-welcome">
      <div className="welcome-content">
        <div className="welcome-illustration">
          {/* SVG Illustration placeholder - you can replace with actual SVG */}
          <div className="illustration-container">
            <div className="illustration-elements">
              <div className="element-map">
                <MapPin size={32} className="map-icon" />
              </div>
              <div className="element-checklist">
                <div className="checklist-lines">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line active"></div>
                </div>
              </div>
              <div className="element-location">
                <Globe size={24} className="location-icon" />
              </div>
              <div className="element-dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
          </div>
        </div>

        <div className="welcome-text">
          <p className="welcome-subtitle">Mọi chuyến đi của bạn ở một nơi</p>
          <h1 className="welcome-title">
            Nhấn Để Tạo Kế Hoạch Cho
            <br />
            Chuyến Đi Của Bạn
          </h1>
        </div>

        <button className="welcome-start-btn" onClick={onStart}>
          Tạo Kế Hoạch
        </button>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

// Step 0 - Date Selection
const Step0 = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(
    data.date ? dayjs(data.date) : null
  );

  const handleDateSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(date);
    onUpdate({ date: formattedDate });
  };

  const handleNext = () => {
    if (selectedDate) {
      onNext();
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current.isBefore(dayjs(), "day");
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Chuyến Đi Của Bạn Sẽ Bắt Đầu Khi Nào ?</h2>
        <p className="step-description">
          Chọn ngày cho chuyến đi của bạn. Điều này giúp chúng tôi lên kế hoạch
          hành trình hoàn hảo cho bạn
        </p>
      </div>

      <div className="calendar-container">
        <Calendar
          fullscreen={false}
          value={selectedDate}
          onSelect={handleDateSelect}
          disabledDate={disabledDate}
          className="antd-calendar"
        />
      </div>

      <button
        className={`step-next-btn ${selectedDate ? "active" : ""}`}
        onClick={handleNext}
        disabled={!selectedDate}
      >
        Tiếp Theo
      </button>
    </div>
  );
};

// Step 1 - Time Duration
const Step1 = ({ data, onUpdate, onNext, onBack }) => {
  const [startTime, setStartTime] = useState(
    data.startTime ? dayjs(data.startTime, "HH:mm") : dayjs("09:00", "HH:mm")
  );
  const [endTime, setEndTime] = useState(
    data.endTime ? dayjs(data.endTime, "HH:mm") : dayjs("15:00", "HH:mm")
  );

  const handleStartTimeChange = (time) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
  };

  const handleNext = () => {
    onUpdate({
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    });
    onNext();
  };

  // Calculate slider positions based on selected times
  const getSliderPosition = (time) => {
    const hour = time.hour();
    const minute = time.minute();
    const totalMinutes = hour * 60 + minute;
    // Convert to percentage based on 24-hour scale (0-24 hours = 0-100%)
    return (totalMinutes / (24 * 60)) * 100;
  };

  const startPosition = getSliderPosition(startTime);
  const endPosition = getSliderPosition(endTime);
  const rangeWidth = endPosition - startPosition;

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Thời Gian Rảnh Cho Chuyến Đi</h2>
        <p className="step-description">
          Điều chỉnh thời gian dành cho chuyến đi của bạn để tối ưu kế hoạch.
        </p>
      </div>

      <div className="time-selector">
        <div className="time-range">
          <div className="time-input">
            <label>Bắt đầu</label>
            <TimePicker
              value={startTime}
              onChange={handleStartTimeChange}
              format="HH:mm"
              placeholder="Chọn giờ bắt đầu"
              className="ant-timepicker"
              size="large"
            />
          </div>

          <div className="time-divider">—</div>

          <div className="time-input">
            <label>Kết thúc</label>
            <TimePicker
              value={endTime}
              onChange={handleEndTimeChange}
              format="HH:mm"
              placeholder="Chọn giờ kết thúc"
              className="ant-timepicker"
              size="large"
            />
          </div>
        </div>

        <div className="time-slider">
          <div className="time-scale">
            <span>5:00</span>
            <span>12:00</span>
            <span>20:00</span>
          </div>
          <div className="slider-track">
            <div
              className="slider-range"
              style={{
                left: `${startPosition}%`,
                width: `${rangeWidth}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <button className="step-next-btn active" onClick={handleNext}>
        Tiếp Theo
      </button>
    </div>
  );
};

// Step 2 - Travel Companions
const Step2 = ({ data, onUpdate, onNext, onBack }) => {
  const [companion, setCompanion] = useState(data.companion || "");

  const companionOptions = [
    { id: "alone", label: "Chỉ mình tôi", icon: User },
    { id: "family", label: "Với gia đình", icon: Heart },
    { id: "friends", label: "Với người yêu", icon: Users },
    { id: "couple", label: "Với bạn bè", icon: Users },
  ];

  const handleNext = () => {
    if (companion) {
      onUpdate({ companion });
      onNext();
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Bạn Đồng Hành Chuyến Đi</h2>
        <p className="step-description">
          Cho chúng tôi biết bạn sẽ đi cùng ai để thiết kế hành trình phù hợp
          nhất cho bạn.
        </p>
      </div>

      <div className="companion-options">
        {companionOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className={`companion-option ${
                companion === option.id ? "selected" : ""
              }`}
              onClick={() => setCompanion(option.id)}
            >
              <IconComponent size={20} className="companion-icon" />
              <span>{option.label}</span>
            </div>
          );
        })}
      </div>

      <button
        className={`step-next-btn ${companion ? "active" : ""}`}
        onClick={handleNext}
        disabled={!companion}
      >
        Tiếp Theo
      </button>
    </div>
  );
};

// Step 3 - Personalization
const Step3 = ({ data, onUpdate, onNext, onBack }) => {
  const [preferences, setPreferences] = useState(data.preferences || {});

  const preferenceCategories = [
    { id: "nature", label: "Thiên Nhiên", icon: Mountain },
    { id: "food", label: "Ẩm Thực", icon: Utensils },
    { id: "history", label: "Địa Điểm Lịch Sử", icon: MapPin },
    { id: "entertainment", label: "Lễ Hội Ẩm Nhạc", icon: Star },
    { id: "art", label: "Nghệ Thuật", icon: Camera },
    { id: "relaxation", label: "Thư Giãn", icon: Heart },
  ];

  const togglePreference = (prefId) => {
    setPreferences((prev) => ({
      ...prev,
      [prefId]: !prev[prefId],
    }));
  };

  const handleNext = () => {
    onUpdate({ preferences });
    onNext();
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Cá Nhân Hóa Chuyến Đi Của Bạn!</h2>
        <p className="step-description">
          Chọn sở thích của bạn để tùy chỉnh kế hoạch chuyến đi.
        </p>
      </div>

      <div className="preferences-grid">
        {preferenceCategories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = preferences[category.id];

          return (
            <div
              key={category.id}
              className={`preference-item ${isSelected ? "selected" : ""}`}
              onClick={() => togglePreference(category.id)}
            >
              <IconComponent size={20} className="preference-icon" />
              <span>{category.label}</span>
            </div>
          );
        })}
      </div>

      <button className="step-next-btn active" onClick={handleNext}>
        Tiếp Theo
      </button>
    </div>
  );
};

// Step 4 - Budget
const Step4 = ({ data, onUpdate, onNext, onBack }) => {
  const [budget, setBudget] = useState(data.budget || {});

  const budgetOptions = [
    { id: "cheap", label: "Rẻ", amount: "Dưới 300.000 VNĐ", icon: Banknote },
    {
      id: "moderate",
      label: "Kinh Tế",
      amount: "Từ 300.000 VNĐ đến 1.000.000 VNĐ",
      icon: Banknote,
    },
    {
      id: "premium",
      label: "Cao Cấp",
      amount: "Từ 1.000.000 VNĐ đến 3.000.000 VNĐ",
      icon: Star,
    },
    {
      id: "flexible",
      label: "Linh hoạt",
      amount: "Không có hạn chế về ngân sách",
      icon: Globe,
    },
  ];

  const handleBudgetSelect = (budgetId) => {
    setBudget({ type: budgetId });
    onUpdate({ budget: { type: budgetId } });
  };

  const handleFinish = () => {
    // Handle trip creation
    console.log("Creating trip with data:", { ...data, budget });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Đặt Ngân Sách Chuyến Đi Của Bạn</h2>
        <p className="step-description">
          Hãy cho chúng tôi biết ngân sách mong muốn của bạn và chúng tôi sẽ
          thiết kế hành trình phù hợp với khả năng tài chính của bạn.
        </p>
      </div>

      <div className="budget-options">
        {budgetOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = budget.type === option.id;

          return (
            <div
              key={option.id}
              className={`budget-option ${isSelected ? "selected" : ""}`}
              onClick={() => handleBudgetSelect(option.id)}
            >
              <div className="budget-info">
                <IconComponent size={20} className="budget-icon" />
                <div className="budget-text">
                  <span className="budget-label">{option.label}</span>
                  <span className="budget-amount">{option.amount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`step-next-btn ${budget.type ? "active" : ""}`}
        onClick={handleFinish}
        disabled={!budget.type}
      >
        Tạo Kế Hoạch
      </button>
    </div>
  );
};

// Main TripPlanning Component
function TripPlanning() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [tripData, setTripData] = useState({});
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  const totalSteps = 5;

  const handleStart = () => {
    // Check if user is logged in
    if (!user) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description:
          "Bạn cần đăng nhập để tạo kế hoạch chuyến đi. Vui lòng đăng nhập trước.",
        duration: 3,
        placement: "topRight",
      });
      // Navigate to login page
      navigate("/login");
      return;
    }

    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      // Show confirmation modal when backing from first step
      Modal.confirm({
        title: "Hủy Tạo Kế Hoạch",
        content:
          "Bạn có chắc chắn muốn hủy tạo kế hoạch chuyến đi không? Tất cả thông tin đã nhập sẽ bị mất.",
        okText: "Có, hủy kế hoạch",
        cancelText: "Không, tiếp tục",
        onOk() {
          setCurrentStep(-1);
        },
        onCancel() {
          // Do nothing, stay on current step
        },
      });
    }
  };

  const handleUpdateData = (data) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case -1:
        return <WelcomeScreen onStart={handleStart} />;
      case 0:
        return (
          <Step0
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <Step1
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step2
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="trip-planning-page header-page-container">
        <Header />

        <div className="trip-planning-container">
          {/* Show progress bar and back button only for steps, not welcome screen */}
          {currentStep >= 0 && (
            <div className="step-navigation">
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={20} />
              </button>
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          )}

          <div className="step-content">{renderStep()}</div>
        </div>

        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default TripPlanning;
