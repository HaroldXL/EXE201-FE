import React from "react";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./Pricing.css";

function Pricing() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSelectPlan = (planType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (planType === "free") {
      // Free plan - just redirect to trip planning
      navigate("/trip-planning");
    } else if (planType === "pro") {
      // Pro plan - redirect to payment or upgrade page
      // You can implement payment logic here
      navigate("/profile/wallet"); // or navigate to payment page
    }
  };

  const plans = [
    {
      id: "free",
      name: "Cơ bản",
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
        <div className="wrapper-pricing">
          {/* Header Section */}
          <div className="wrapper-pricing__header">
            <h1 className="wrapper-pricing__title">Chọn gói phù hợp với bạn</h1>
            <p className="wrapper-pricing__subtitle">
              Bắt đầu miễn phí và nâng cấp khi bạn cần thêm tính năng
            </p>
          </div>

          {/* Plans Grid */}
          <div className="wrapper-pricing__plans">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`wrapper-pricing__plan-card ${
                  plan.popular ? "wrapper-pricing__plan-card--popular" : ""
                }`}
              >
                {plan.popular && (
                  <div className="wrapper-pricing__popular-badge">
                    <Sparkles size={14} />
                    <span>Phổ biến nhất</span>
                  </div>
                )}

                <div className="wrapper-pricing__plan-header">
                  <h3 className="wrapper-pricing__plan-name">{plan.name}</h3>
                  <p className="wrapper-pricing__plan-description">
                    {plan.description}
                  </p>
                </div>

                <div className="wrapper-pricing__plan-price">
                  <span className="wrapper-pricing__price-amount">
                    {plan.price === 0
                      ? "Miễn phí"
                      : new Intl.NumberFormat("vi-VN").format(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="wrapper-pricing__price-currency">VND</span>
                  )}
                </div>

                <button
                  className={`wrapper-pricing__plan-button ${
                    plan.popular
                      ? "wrapper-pricing__plan-button--primary"
                      : "wrapper-pricing__plan-button--secondary"
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.buttonText}
                </button>

                <div className="wrapper-pricing__plan-features">
                  <p className="wrapper-pricing__features-title">
                    Tính năng bao gồm:
                  </p>
                  <ul className="wrapper-pricing__features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="wrapper-pricing__feature-item">
                        <Check
                          size={18}
                          className="wrapper-pricing__feature-icon"
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
      <Footer />
    </div>
  );
}

export default Pricing;
