import { Check, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./Subscription.css";

function Subscription() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [balance, setBalance] = useState(0);
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const PRO_PLAN_PRICE = 50000;

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

  // Check if user has active Pro subscription
  const isProActive = () => {
    console.log("User object:", user);
    console.log("subscriptionExpiredAt:", user?.user?.subscriptionExpiredAt);

    if (!user?.user?.subscriptionExpiredAt) {
      console.log("No subscription expiry date found");
      return false;
    }
    const expiryDate = new Date(user.user.subscriptionExpiredAt);
    const now = new Date();

    console.log("Expiry Date:", expiryDate);
    console.log("Now:", now);
    console.log("Is Pro Active:", expiryDate > now);

    return expiryDate > now;
  };

  const currentPlan = isProActive() ? "pro" : "free";
  console.log("Current Plan:", currentPlan);

  const handleSelectPlan = (planType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Prevent action if already on Pro and trying to downgrade
    if (currentPlan === "pro" && planType === "free") {
      message.info(
        "Bạn đang sử dụng gói Pro. Không thể chuyển về gói miễn phí."
      );
      return;
    }

    if (planType === "free") {
      // Free plan - just redirect to trip planning
      navigate("/trip-planning");
    } else if (planType === "pro") {
      // Show upgrade modal
      setIsUpgradeModalVisible(true);
    }
  };

  // Handle upgrade to Pro
  const handleUpgradeToPro = async () => {
    try {
      setProcessing(true);
      await api.post("/Transaction/subscription", {
        numberDay: 30,
        amount: PRO_PLAN_PRICE,
        paymentMethod: "Wallet",
        description: "Nâng cấp gói Pro",
      });

      message.success("Nâng cấp gói Pro thành công!");
      setIsUpgradeModalVisible(false);

      dispatch(user);
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      message.error(
        error.response?.data?.message || "Nâng cấp thất bại. Vui lòng thử lại."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const hasEnoughBalance = balance >= PRO_PLAN_PRICE;

  const plans = [
    {
      id: "free",
      name: "Cơ bản",
      price: 0,
      description: "Bắt đầu với những tính năng cơ bản",
      features: [
        "Tạo tối đa 3 kế hoạch du lịch",
        "Khám phá địa điểm du lịch",
        "Tìm kiếm địa điểm",
        "Xem chi tiết địa điểm",
        "Đánh giá và nhận xét",
      ],
      buttonText: "Bắt đầu miễn phí",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 50000,
      description: "Nâng cấp trải nghiệm lập kế hoạch",
      features: [
        "Tạo không giới hạn kế hoạch du lịch",
        "Tất cả tính năng của Free",
        "Gợi ý địa điểm thông minh",
        "Tối ưu hóa lộ trình",
        "Hỗ trợ ưu tiên",
        "Lưu trữ không giới hạn",
      ],
      buttonText: "Nâng cấp ngay",
      popular: true,
    },
  ];

  return (
    <div>
      <Header />
      <div className="wrapper header-page-container">
        <div className="wrapper-subscription">
          {/* Header Section */}
          <div className="wrapper-subscription__header">
            <h1 className="wrapper-subscription__title">Gói Thành Viên</h1>
            <p className="wrapper-subscription__subtitle">
              Nâng cấp gói Pro để trải nghiệm đầy đủ tính năng
            </p>
            {currentPlan === "pro" && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  borderRadius: "20px",
                  color: "white",
                  fontWeight: "600",
                  marginTop: "12px",
                }}
              >
                <Crown size={18} />
                <span>Bạn đang sử dụng gói Pro</span>
              </div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="wrapper-subscription__plans">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`wrapper-subscription__plan-card ${
                  plan.popular ? "wrapper-subscription__plan-card--popular" : ""
                }`}
              >
                {plan.popular && (
                  <div className="wrapper-subscription__popular-badge">
                    <Sparkles size={14} />
                    <span>Phổ biến nhất</span>
                  </div>
                )}

                <div className="wrapper-subscription__plan-header">
                  <h3 className="wrapper-subscription__plan-name">
                    {plan.name}
                  </h3>
                  <p className="wrapper-subscription__plan-description">
                    {plan.description}
                  </p>
                </div>

                <div className="wrapper-subscription__plan-price">
                  <span className="wrapper-subscription__price-amount">
                    {plan.price === 0
                      ? "Miễn phí"
                      : new Intl.NumberFormat("vi-VN").format(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="wrapper-subscription__price-currency">
                      VND
                    </span>
                  )}
                </div>

                <button
                  className={`wrapper-subscription__plan-button ${
                    plan.popular
                      ? "wrapper-subscription__plan-button--primary"
                      : "wrapper-subscription__plan-button--secondary"
                  } ${
                    currentPlan === plan.id
                      ? "wrapper-subscription__plan-button--active"
                      : ""
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={
                    currentPlan === plan.id ||
                    (currentPlan === "pro" && plan.id === "free")
                  }
                >
                  {currentPlan === plan.id ? (
                    <>
                      <Check size={18} />
                      <span>Gói hiện tại</span>
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                <div className="wrapper-subscription__plan-features">
                  <p className="wrapper-subscription__features-title">
                    Tính năng bao gồm:
                  </p>
                  <ul className="wrapper-subscription__features-list">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="wrapper-subscription__feature-item"
                      >
                        <Check
                          size={18}
                          className="wrapper-subscription__feature-icon"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal
        title={
          <div style={{ fontSize: "18px", fontWeight: "600" }}>
            Nâng cấp gói Pro
          </div>
        }
        open={isUpgradeModalVisible}
        onCancel={() => setIsUpgradeModalVisible(false)}
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
                Giá gói Pro:
              </span>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#3b82f6",
                  marginTop: "4px",
                }}
              >
                {formatCurrency(PRO_PLAN_PRICE)}
              </div>
            </div>
          </div>

          {!hasEnoughBalance && (
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
              {formatCurrency(PRO_PLAN_PRICE - balance)} để nâng cấp.
            </div>
          )}

          {hasEnoughBalance ? (
            <button
              style={{
                width: "100%",
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
              onClick={handleUpgradeToPro}
              disabled={processing}
            >
              {processing ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
          ) : (
            <button
              style={{
                width: "100%",
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
                setIsUpgradeModalVisible(false);
                navigate("/profile/wallet");
              }}
            >
              Nạp tiền vào ví
            </button>
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default Subscription;
