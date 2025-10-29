import { useState, useEffect } from "react";
import {
  Calendar,
  TimePicker,
  ConfigProvider,
  Modal,
  message,
  Spin,
} from "antd";
import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Users,
  User,
  MapPin,
  Banknote,
  Star,
  Globe,
} from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import { login } from "../../../store/redux/features/userSlice";
import "./TripPlanning.css";

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

// Welcome Screen Component
const WelcomeScreen = ({
  onStart,
  isTransitioning,
  tripCount,
  maxFreeTrips,
  isProActive,
}) => {
  const remainingFreeTrips = Math.max(0, maxFreeTrips - tripCount);
  const showFreeTripsInfo = !isProActive && remainingFreeTrips >= 0;

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

        {showFreeTripsInfo && (
          <div
            style={{
              background:
                remainingFreeTrips > 0
                  ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
                  : "linear-gradient(135deg, #fef2f2, #fee2e2)",
              border:
                remainingFreeTrips > 0
                  ? "1px solid #86efac"
                  : "1px solid #fecaca",
              padding: "12px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              maxWidth: "400px",
              margin: "0 auto 20px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: remainingFreeTrips > 0 ? "#065f46" : "#991b1b",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {remainingFreeTrips > 0 ? (
                <>
                  Bạn còn{" "}
                  <span style={{ fontSize: "16px" }}>
                    {remainingFreeTrips}/{maxFreeTrips}
                  </span>{" "}
                  lượt tạo miễn phí
                </>
              ) : (
                <>
                  Đã hết lượt miễn phí ({tripCount}/{maxFreeTrips})
                </>
              )}
            </div>
          </div>
        )}

        <button
          className="welcome-start-btn"
          onClick={onStart}
          disabled={isTransitioning}
          style={{
            opacity: isTransitioning ? 0.5 : 1,
            cursor: isTransitioning ? "not-allowed" : "pointer",
          }}
        >
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
    if (time) {
      setStartTime(time);
    }
  };

  const handleEndTimeChange = (time) => {
    if (time) {
      setEndTime(time);
    }
  };

  const handleNext = () => {
    const startTimeFormatted = startTime.format("HH:mm:ss");
    const endTimeFormatted = endTime.format("HH:mm:ss");

    onUpdate({
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
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
              allowClear={false}
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
              allowClear={false}
            />
          </div>
        </div>

        <div className="time-slider">
          <div className="time-scale">
            <span>0:00</span>
            <span>6:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
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
    { id: "1", label: "1 người", icon: User },
    { id: "2", label: "2 người", icon: Users },
    { id: "3-5", label: "3-5 người", icon: Users },
    { id: "6-10", label: "6-10 người", icon: Users },
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
        <h2 className="step-title">Số Người Tham Gia Chuyến Đi</h2>
        <p className="step-description">
          Cho chúng tôi biết số lượng người tham gia để thiết kế hành trình phù
          hợp nhất cho nhóm của bạn.
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
  const [preferences, setPreferences] = useState(data.preferences || []);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics from API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await api.get("/Topic/list-active");
        setTopics(response.data || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        message.error("Không thể tải danh sách chủ đề. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const togglePreference = (topicId) => {
    setPreferences((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      } else {
        // Cho phép chọn nhiều topics, không giới hạn tối đa
        return [...prev, topicId];
      }
    });
  };

  const handleNext = () => {
    if (preferences.length < 3) {
      message.warning("Bạn cần chọn ít nhất 3 chủ đề yêu thích để tiếp tục.");
      return;
    }
    onUpdate({ preferences });
    onNext();
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Cá Nhân Hóa Chuyến Đi Của Bạn!</h2>
        <p className="step-description">
          Chọn ít nhất 3 chủ đề yêu thích của bạn để tùy chỉnh kế hoạch chuyến
          đi.
        </p>
        <div className="selection-counter">
          Đã chọn: {preferences.length}/3 (tối thiểu)
        </div>
      </div>

      <div className="preferences-grid">
        {loading
          ? // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="preference-item loading">
                <div className="preference-text-skeleton"></div>
              </div>
            ))
          : topics.map((topic) => {
              const isSelected = preferences.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  className={`preference-item ${isSelected ? "selected" : ""}`}
                  onClick={() => togglePreference(topic.id)}
                  title={topic.description}
                >
                  <span>{topic.name}</span>
                </div>
              );
            })}
      </div>

      <button
        className={`step-next-btn ${preferences.length >= 3 ? "active" : ""}`}
        onClick={handleNext}
        disabled={loading || preferences.length < 3}
      >
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
      amount: "Tối đa 1.000.000 VNĐ",
      icon: Banknote,
    },
    {
      id: "premium",
      label: "Cao Cấp",
      amount: "Tối đa 3.000.000 VNĐ",
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

  const handleNext = () => {
    onNext();
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
        onClick={handleNext}
        disabled={!budget.type}
      >
        Tiếp Theo
      </button>
    </div>
  );
};

// Step 5 - Trip Title
const Step5 = ({
  data,
  onUpdate,
  onNext,
  onBack,
  onCreateTrip,
  isCreating,
}) => {
  const [title, setTitle] = useState(data.title || "");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFinish = async () => {
    if (!title.trim()) {
      message.error("Vui lòng nhập tiêu đề cho chuyến đi.");
      return;
    }

    // Create final data with all current state
    const finalData = {
      ...data,
      title: title.trim(),
    };

    // Update local state and call API
    onUpdate({ title: title.trim() });
    await onCreateTrip(finalData);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Đặt Tiêu Đề Cho Kế Hoạch Của Bạn</h2>
        <p className="step-description">
          Hãy đặt một tiêu đề thú vị cho chuyến đi của bạn để dễ dàng nhận biết
          và chia sẻ với bạn bè.
        </p>
      </div>

      <div className="title-input-container">
        <div className="title-input-wrapper">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Nhập tiêu đề cho chuyến đi của bạn..."
            className="title-input"
            maxLength={50}
            disabled={isCreating}
          />
          <div className="title-char-count">{title.length}/50</div>
        </div>
      </div>

      <button
        className={`step-next-btn ${
          title.trim() && !isCreating ? "active" : ""
        }`}
        onClick={handleFinish}
        disabled={!title.trim() || isCreating}
      >
        {isCreating ? (
          <>
            <Spin size="small" style={{ marginRight: 8 }} />
            Đang tạo kế hoạch...
          </>
        ) : (
          "Tạo Kế Hoạch"
        )}
      </button>
    </div>
  );
};

// Main TripPlanning Component
function TripPlanning() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [tripData, setTripData] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isConfirmPaymentModalVisible, setIsConfirmPaymentModalVisible] =
    useState(false);
  const [balance, setBalance] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [pendingTripData, setPendingTripData] = useState(null);
  const [tripCount, setTripCount] = useState(0);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalSteps = 6;
  const TRIP_CREATION_PRICE = 10000;
  const MAX_FREE_TRIPS = 5;

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("/User/profile");
        setBalance(response.data.balance || 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (user) {
      fetchBalance();
    }
  }, [user]);

  // Fetch user trip count
  useEffect(() => {
    const fetchTripCount = async () => {
      try {
        const response = await api.get("/Itinerary", {
          params: {
            page: 1,
            pageSize: 1, // Only need totalCount
          },
        });
        setTripCount(response.data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching trip count:", error);
      }
    };

    if (user) {
      fetchTripCount();
    }
  }, [user]);

  // Check if user has active Pro subscription
  const isProActive = () => {
    const subscriptionExpiredAt =
      user?.user?.subscriptionExpiredAt || user?.subscriptionExpiredAt;

    if (!subscriptionExpiredAt) {
      return false;
    }

    const expiryDate = new Date(subscriptionExpiredAt);
    const now = new Date();

    return expiryDate > now;
  };

  // Helper function to convert companion selection to numPeople
  const getNumPeople = (companion) => {
    switch (companion) {
      case "1":
        return 1;
      case "2":
        return 2;
      case "3-5":
        return 5;
      case "6-10":
        return 10;
      default:
        return 1;
    }
  };

  // Helper function to convert budget selection to maximumPrice
  const getMaximumPrice = (budgetType) => {
    switch (budgetType) {
      case "cheap":
        return 300000;
      case "moderate":
        return 1000000;
      case "premium":
        return 3000000;
      case "flexible":
        return 10000000;
      default:
        return 1000000;
    }
  };

  // API call to create trip
  const createTrip = async (finalData) => {
    try {
      setIsCreating(true);

      // Validate required fields
      if (!finalData.title || !finalData.title.trim()) {
        message.error("Vui lòng nhập tiêu đề cho chuyến đi.");
        return;
      }

      if (!finalData.companion) {
        message.error("Vui lòng chọn số người tham gia.");
        return;
      }

      if (!finalData.budget?.type) {
        message.error("Vui lòng chọn ngân sách cho chuyến đi.");
        return;
      }

      if (!finalData.preferences || finalData.preferences.length < 3) {
        message.error("Vui lòng chọn ít nhất 3 chủ đề yêu thích.");
        return;
      }

      // Check if user is Pro or needs to pay
      if (!isProActive()) {
        // Check if user has exceeded free trip limit
        if (tripCount >= MAX_FREE_TRIPS) {
          // User must pay for additional trips
          if (balance < TRIP_CREATION_PRICE) {
            setIsPaymentModalVisible(true);
            setIsCreating(false);
            return;
          }

          // Store trip data and show confirmation modal
          setPendingTripData(finalData);
          setIsConfirmPaymentModalVisible(true);
          setIsCreating(false);
          return;
        }
        // User still has free trips remaining - create directly
      }

      // Pro user or Free user with remaining free trips - create trip directly
      await executeCreateTrip(finalData);
    } catch (error) {
      console.error("Error creating trip:", error);
      message.error("Không thể tạo kế hoạch chuyến đi. Vui lòng thử lại.");
      setIsCreating(false);
    }
  };

  // Execute trip creation after payment confirmation
  const executeCreateTrip = async (finalData) => {
    try {
      setIsCreating(true);

      // Pay for trip creation if not Pro and exceeded free limit
      if (!isProActive() && tripCount >= MAX_FREE_TRIPS) {
        try {
          await api.post("/Transaction/pay", {
            amount: TRIP_CREATION_PRICE,
            paymentMethod: "Wallet",
            description: "Thanh toán tạo kế hoạch chuyến đi",
          });

          // Update balance and user data
          const response = await api.get("/User/profile");
          setBalance(response.data.balance || 0);

          // Update Redux state
          const updatedUserData = {
            token: user.token,
            user: response.data,
            expiresAt: user.expiresAt,
          };
          dispatch(login(updatedUserData));

          message.success("Thanh toán thành công!");
        } catch (error) {
          console.error("Error processing payment:", error);
          message.error(
            error.response?.data?.message ||
              "Thanh toán thất bại. Vui lòng thử lại."
          );
          setIsCreating(false);
          return;
        }
      }

      const requestData = {
        Title: finalData.title.trim(),
        NumPeople: getNumPeople(finalData.companion),
        TripDate: finalData.date,
        StartTime: finalData.startTime,
        EndTime: finalData.endTime,
        TopicIds: finalData.preferences || [],
        MaximumPrice: getMaximumPrice(finalData.budget?.type),
      };

      const response = await api.post("/Itinerary/create", requestData);

      if (response.data && response.data.success) {
        message.success("Tạo kế hoạch chuyến đi thành công!");
        // Navigate to trip detail page using itineraryId
        navigate(`/trip-planning/${response.data.itineraryId}`);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      message.error("Không thể tạo kế hoạch chuyến đi. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStart = () => {
    // Check if user is logged in
    if (!user) {
      message.warning(
        "Bạn cần đăng nhập để tạo kế hoạch chuyến đi. Vui lòng đăng nhập trước."
      );
      // Navigate to login page
      navigate("/login");
      return;
    }

    // Show initial modal if not Pro
    if (!isProActive()) {
      // Check if user has exceeded free trips
      if (tripCount >= MAX_FREE_TRIPS) {
        // Show modal with payment warning
        setIsStartModalVisible(true);
      } else {
        // User still has free trips - start directly
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep(0);
          setIsTransitioning(false);
        }, 200);
      }
    } else {
      // Pro user - start directly
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(0);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleConfirmStart = () => {
    setIsStartModalVisible(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(0);
      setIsTransitioning(false);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleBack = () => {
    // Prevent going back when creating trip
    if (isCreating) {
      return;
    }

    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 200);
    } else if (currentStep === 0) {
      // Show confirmation modal when backing from first step
      Modal.confirm({
        title: "Hủy Tạo Kế Hoạch",
        content:
          "Bạn có chắc chắn muốn hủy tạo kế hoạch chuyến đi không? Tất cả thông tin đã nhập sẽ bị mất.",
        okText: "Có, hủy kế hoạch",
        cancelText: "Không, tiếp tục",
        onOk() {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentStep(-1);
            setIsTransitioning(false);
          }, 200);
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const renderStep = () => {
    switch (currentStep) {
      case -1:
        return (
          <WelcomeScreen
            onStart={handleStart}
            isTransitioning={isTransitioning}
            tripCount={tripCount}
            maxFreeTrips={MAX_FREE_TRIPS}
            isProActive={isProActive()}
          />
        );
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
      case 5:
        return (
          <Step5
            data={tripData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
            onCreateTrip={createTrip}
            isCreating={isCreating}
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

        <div
          className={`trip-planning-container ${
            isPageLoaded ? "trip-planning-container--loaded" : ""
          }`}
        >
          {/* Show progress bar and back button only for steps, not welcome screen */}
          {currentStep >= 0 && (
            <div className="step-navigation">
              <button
                className="back-button"
                onClick={handleBack}
                disabled={isCreating || isTransitioning}
                style={{
                  opacity: isCreating || isTransitioning ? 0.5 : 1,
                  cursor:
                    isCreating || isTransitioning ? "not-allowed" : "pointer",
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          )}

          <div
            className={`step-content ${
              isTransitioning
                ? "step-content--transitioning"
                : "step-content--visible"
            }`}
          >
            {renderStep()}
          </div>
        </div>

        {/* Payment Modal */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              Thanh toán tạo kế hoạch
            </div>
          }
          open={isPaymentModalVisible}
          onCancel={() => setIsPaymentModalVisible(false)}
          footer={null}
          centered
          width={500}
        >
          <div style={{ padding: "20px 0" }}>
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Số dư hiện tại:
                </span>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginTop: "4px",
                  }}
                >
                  {formatCurrency(balance)}
                </div>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Giá tạo kế hoạch:
                </span>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#3b82f6",
                    marginTop: "4px",
                  }}
                >
                  {formatCurrency(TRIP_CREATION_PRICE)}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                color: "#dc2626",
                fontSize: "14px",
              }}
            >
              Số dư không đủ. Vui lòng nạp thêm{" "}
              {formatCurrency(TRIP_CREATION_PRICE - balance)} để tạo kế hoạch.
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                color: "#1e40af",
                fontSize: "14px",
              }}
            >
              💡 <strong>Mẹo:</strong> Nâng cấp lên gói Pro để tạo không giới
              hạn kế hoạch chuyến đi!
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsPaymentModalVisible(false);
                  navigate("/profile/wallet");
                }}
              >
                Nạp tiền vào ví
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsPaymentModalVisible(false);
                  navigate("/profile/subscription");
                }}
              >
                Nâng cấp Pro
              </button>
            </div>
          </div>
        </Modal>

        {/* Start Modal - Warning about 10k fee */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: "600" }}>Thông báo</div>
          }
          open={isStartModalVisible}
          onCancel={() => setIsStartModalVisible(false)}
          footer={null}
          centered
          width={500}
        >
          <div style={{ padding: "20px 0" }}>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#991b1b",
                  marginBottom: "12px",
                  fontWeight: "600",
                }}
              >
                ⚠️ Đã hết lượt tạo miễn phí
              </div>
              <div style={{ fontSize: "14px", color: "#7f1d1d" }}>
                Bạn đã tạo{" "}
                <strong>
                  {tripCount}/{MAX_FREE_TRIPS}
                </strong>{" "}
                kế hoạch miễn phí. Để tạo thêm kế hoạch, bạn cần thanh toán{" "}
                <strong>{formatCurrency(TRIP_CREATION_PRICE)}</strong> cho mỗi
                kế hoạch.
              </div>
            </div>

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fcd34d",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#78350f",
                  marginBottom: "12px",
                  fontWeight: "600",
                }}
              >
                💰 Chi phí tạo kế hoạch
              </div>
              <div style={{ fontSize: "14px", color: "#92400e" }}>
                Mỗi kế hoạch chuyến đi sẽ tốn{" "}
                <strong>{formatCurrency(TRIP_CREATION_PRICE)}</strong> từ số dư
                trong ví của bạn.
              </div>
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                color: "#1e40af",
                fontSize: "14px",
              }}
            >
              <strong>Mẹo:</strong> Nâng cấp lên gói Pro (
              {formatCurrency(50000)} / tháng) để tạo không giới hạn kế hoạch
              chuyến đi và nhiều tính năng khác!
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "14px" }}>
                Số dư hiện tại:
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginTop: "4px",
                }}
              >
                {formatCurrency(balance)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => setIsStartModalVisible(false)}
              >
                Hủy
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={handleConfirmStart}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </Modal>

        {/* Confirm Payment Modal - Before creating trip */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              Xác nhận thanh toán
            </div>
          }
          open={isConfirmPaymentModalVisible}
          onCancel={() => {
            setIsConfirmPaymentModalVisible(false);
            setPendingTripData(null);
          }}
          footer={null}
          centered
          width={500}
        >
          <div style={{ padding: "20px 0" }}>
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Số dư hiện tại:
                </span>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginTop: "4px",
                  }}
                >
                  {formatCurrency(balance)}
                </div>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Chi phí tạo kế hoạch:
                </span>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#ef4444",
                    marginTop: "4px",
                  }}
                >
                  - {formatCurrency(TRIP_CREATION_PRICE)}
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  marginTop: "12px",
                  paddingTop: "12px",
                }}
              >
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Số dư sau thanh toán:
                </span>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#10b981",
                    marginTop: "4px",
                  }}
                >
                  {formatCurrency(balance - TRIP_CREATION_PRICE)}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #fcd34d",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                color: "#92400e",
                fontSize: "14px",
              }}
            >
              Bạn có chắc chắn muốn thanh toán{" "}
              <strong>{formatCurrency(TRIP_CREATION_PRICE)}</strong> để tạo kế
              hoạch chuyến đi này không?
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsConfirmPaymentModalVisible(false);
                  setPendingTripData(null);
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.7 : 1,
                }}
                onClick={async () => {
                  setIsConfirmPaymentModalVisible(false);
                  if (pendingTripData) {
                    await executeCreateTrip(pendingTripData);
                    setPendingTripData(null);
                  }
                }}
                disabled={processing}
              >
                {processing ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </button>
            </div>
          </div>
        </Modal>

        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default TripPlanning;
