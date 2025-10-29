import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  Search,
  Percent,
  Map,
  MessageCircle,
  Info,
  Bell,
  User,
  Menu,
  X,
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Zap,
  Shield,
  Heart,
  TrendingUp,
  Award,
  Navigation,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../components/footer/footer";
import api from "../../config/axios";
import "./Home.css";

function Home() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [popularLocations, setPopularLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch popular locations
  const fetchPopularLocations = async () => {
    try {
      const response = await api.get("/Location/list", {
        params: { page: 1, pageSize: 6 },
      });
      setPopularLocations(response.data.items || []);
    } catch (error) {
      console.error("Error fetching popular locations:", error);
    }
  };

  // Fetch all data on component mount
  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPopularLocations()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Scroll animations
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    const animateElements = document.querySelectorAll(
      ".animate-on-scroll, .animate-fade-up, .animate-stagger, .animate-card-fade-in, .animate-scale-up"
    );
    animateElements.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Menu */}
      <div
        className={`header-mobile-sidebar ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="header-sidebar-header">
          <button className="header-close-btn" onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>
        <div className="header-sidebar-content">
          <Link to="/" className="header-sidebar-link">
            <HomeIcon size={20} />
            <span>Trang Chủ</span>
          </Link>
          <Link to="/explore" className="header-sidebar-link">
            <Map size={20} />
            <span>Khám Phá</span>
          </Link>
          <Link to="/trip-planning" className="header-sidebar-link">
            <Percent size={20} />
            <span>Tạo Kế Hoạch</span>
          </Link>
          <Link to="/chatbot" className="header-sidebar-link">
            <MessageCircle size={20} />
            <span>Hỏi Đáp AI</span>
          </Link>
          <Link to="/about-us" className="header-sidebar-link">
            <Info size={20} />
            <span>Về Chúng Tôi</span>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`header-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Navigation in Hero */}
        <nav className={`hero-navigation ${isScrolled ? "scrolled" : ""}`}>
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Mobile Actions */}
          <div className="mobile-nav-actions">
            {user && user.token ? (
              // Hiển thị notification, search và avatar khi đã login
              <>
                <button className="mobile-nav-icon-btn">
                  <Bell size={20} />
                </button>
                <button
                  onClick={() => navigate("/search")}
                  className="mobile-nav-icon-btn"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="mobile-nav-icon-btn"
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              // Hiển thị login và register khi chưa login
              <>
                <a href="/login" className="mobile-auth-btn mobile-login-btn">
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="mobile-auth-btn mobile-register-btn"
                >
                  Đăng ký
                </a>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <div className="nav-links">
              <a href="/" className="nav-link">
                Trang Chủ
              </a>
              <a href="/explore" className="nav-link">
                Khám Phá
              </a>
              <a href="/trip-planning" className="nav-link">
                Tạo Kế Hoạch
              </a>
              <a href="/chatbot" className="nav-link">
                Hỏi Đáp AI
              </a>
              <a href="/about-us" className="nav-link">
                Về Chúng Tôi
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {user && user.token ? (
                // Hiển thị notification, search và avatar khi đã login
                <>
                  <div className="nav-search">
                    <button
                      onClick={() => navigate("/search")}
                      className="nav-icon-btn"
                    >
                      <Search size={20} />
                    </button>
                  </div>

                  <div className="nav-notifications">
                    <button className="nav-icon-btn">
                      <Bell size={20} />
                    </button>
                  </div>

                  <div className="nav-user-profile">
                    <button
                      onClick={() => navigate("/profile")}
                      className="nav-icon-btn"
                    >
                      <User size={20} />
                    </button>
                  </div>
                </>
              ) : (
                // Hiển thị login và register khi chưa login
                <>
                  <div className="desktop-auth-buttons">
                    <Link
                      to="/login"
                      className="desktop-auth-btn desktop-login-btn"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="desktop-auth-btn desktop-register-btn"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span
                className="hero-word animate-word-slide"
                style={{ animationDelay: "0.1s" }}
              >
                Khám
              </span>
              <span
                className="hero-word animate-word-slide"
                style={{ animationDelay: "0.2s" }}
              >
                phá
              </span>
              <span
                className="hero-word animate-word-slide"
                style={{ animationDelay: "0.3s" }}
              >
                Việt
              </span>
              <span
                className="hero-word animate-word-slide"
                style={{ animationDelay: "0.4s" }}
              >
                Nam
              </span>
              <br />
              <span
                className="hero-word gradient-text--hero animate-word-slide"
                style={{ animationDelay: "0.5s" }}
              >
                Thông
              </span>
              <span
                className="hero-word gradient-text--hero animate-word-slide"
                style={{ animationDelay: "0.6s" }}
              >
                minh
              </span>
              <span
                className="hero-word gradient-text--hero animate-word-slide"
                style={{ animationDelay: "0.7s" }}
              >
                hơn
              </span>
            </h1>
            <p
              className="hero-description animate-fade-in"
              style={{ animationDelay: "0.9s" }}
            >
              Tạo kế hoạch du lịch hoàn hảo. <br className="hidden-mobile" />
              Khám phá những điểm đến tuyệt vời và tạo ra những kỷ niệm đáng
              nhớ.
            </p>
            <div
              className="hero-cta animate-fade-in"
              style={{ animationDelay: "1.1s" }}
            >
              <button
                className="btn btn--primary btn--large"
                onClick={() => navigate("/trip-planning")}
              >
                Bắt đầu lập kế hoạch
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section animate-on-scroll">
        <div className="container">
          <div className="section-header animate-fade-up">
            <div className="section-badge">
              <Star size={16} />
              <span>Tính năng nổi bật</span>
            </div>
            <h2 className="section-title">
              Tại sao chọn <span className="gradient-text">TripPlan</span>?
            </h2>
            <p className="section-description">
              Chúng tôi cung cấp cho bạn giải pháp lập kế hoạch chuyến đi dễ
              dàng và hiệu quả
            </p>
          </div>

          <div className="features-grid">
            <div
              className="feature-card animate-stagger"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="feature-icon feature-icon--ai">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Hỏi Đáp AI</h3>
              <p className="feature-description">
                Trợ lý AI thông minh giúp trả lời mọi thắc mắc về du lịch nhanh
                chóng
              </p>
            </div>

            <div
              className="feature-card animate-stagger"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="feature-icon feature-icon--map">
                <Map size={24} />
              </div>
              <h3 className="feature-title">Khám Phá Toàn Diện</h3>
              <p className="feature-description">
                Cơ sở dữ liệu địa điểm phong phú với thông tin chi tiết và đánh
                giá thực tế
              </p>
            </div>

            <div
              className="feature-card animate-stagger"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="feature-icon feature-icon--planning">
                <Percent size={24} />
              </div>
              <h3 className="feature-title">Lập Kế Hoạch Tự Động</h3>
              <p className="feature-description">
                Tối ưu hóa lộ trình, thời gian và chi phí cho chuyến đi hoàn hảo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section animate-on-scroll">
        <div className="container">
          <div className="section-header animate-fade-up">
            <div className="section-badge">
              <Globe size={16} />
              <span>Điểm đến</span>
            </div>
            <h2 className="section-title">
              Khám phá <span className="gradient-text">Việt Nam</span>
            </h2>
            <p className="section-description">
              Những địa điểm du lịch nổi bật được yêu thích
            </p>
          </div>

          <div className="destinations-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="wrapper-explore__card">
                    <div className="wrapper-explore__card-image">
                      <div className="loading-placeholder"></div>
                    </div>
                    <div className="wrapper-explore__card-content">
                      <div className="loading-text"></div>
                      <div className="loading-text-small"></div>
                    </div>
                  </div>
                ))
              : popularLocations.map((location, index) => (
                  <div
                    key={location.id}
                    className="wrapper-explore__card animate-card-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/explore/${location.id}`)}
                  >
                    <div className="wrapper-explore__card-image">
                      <img
                        src={
                          location.imageUrl ||
                          "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
                        }
                        alt={location.name}
                        className="wrapper-explore__card-img"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop";
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                      />
                    </div>
                    <div className="wrapper-explore__card-content">
                      <div className="wrapper-explore__card-top">
                        <div className="wrapper-explore__card-category">
                          {location.topicName || "Địa điểm"}
                        </div>
                        <div className="wrapper-explore__card-rating">
                          <Star
                            size={16}
                            className="wrapper-explore__card-star"
                          />
                          <span className="wrapper-explore__card-rating-text">
                            {location.averageRating || 0}
                          </span>
                        </div>
                      </div>
                      <h3 className="wrapper-explore__card-title">
                        {location.name}
                      </h3>
                      <div className="wrapper-explore__card-location">
                        <MapPin
                          size={14}
                          className="wrapper-explore__card-location-icon"
                        />
                        <span className="wrapper-explore__card-location-text">
                          {location.districtName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="section-cta">
            <button
              className="btn btn--outline btn--large"
              onClick={() => navigate("/explore")}
            >
              Khám phá thêm
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section animate-on-scroll">
        <div className="container">
          <div className="section-header animate-fade-up">
            <div className="section-badge">
              <Award size={16} />
              <span>Đánh giá</span>
            </div>
            <h2 className="section-title">
              Khách hàng nói gì về{" "}
              <span className="gradient-text">chúng tôi</span>?
            </h2>
          </div>

          <div className="testimonials-grid">
            <div
              className="testimonial-card animate-stagger"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="testimonial-text">
                "TripPlan đã giúp tôi tạo ra một chuyến đi hoàn hảo đến Sapa. AI
                thông minh và gợi ý rất chính xác!"
              </p>
              <div className="testimonial-author">
                <img
                  src="../images/avatar.jpg"
                  alt="Nguyễn Lan Anh"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Nguyễn Lan Anh</div>
                  <div className="testimonial-role">Du khách</div>
                </div>
              </div>
            </div>

            <div
              className="testimonial-card animate-stagger"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="testimonial-text">
                "Giao diện thân thiện, dễ sử dụng. Đặc biệt là tính năng lập kế
                hoạch tự động rất tiện lợi cho người bận rộn như tôi."
              </p>
              <div className="testimonial-author">
                <img
                  src="../images/avatar1.jpg"
                  alt="Trần Minh Hoàng"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Trần Minh Hoàng</div>
                  <div className="testimonial-role">Doanh nhân</div>
                </div>
              </div>
            </div>

            <div
              className="testimonial-card animate-stagger"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="testimonial-text">
                "Cơ sở dữ liệu địa điểm rất phong phú và cập nhật. Đã có nhiều
                chuyến đi tuyệt vời nhờ TripPlan!"
              </p>
              <div className="testimonial-author">
                <img
                  src="../images/avatar2.jpg"
                  alt="Minh Phạm"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Phạm Thu Hà</div>
                  <div className="testimonial-role">Nhiếp ảnh gia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section animate-on-scroll">
        <div className="container">
          <div className="cta-content animate-fade-up">
            <div className="cta-text">
              <h2 className="cta-title">
                Sẵn sàng cho chuyến đi{" "}
                <span className="gradient-text">tiếp theo</span>?
              </h2>
              <p className="cta-description">
                Bắt đầu lập kế hoạch ngay hôm nay và khám phá những trải nghiệm
                tuyệt vời
              </p>
            </div>
            <div className="cta-actions animate-scale-up">
              <button
                className="btn btn--primary btn--large"
                onClick={() => navigate("/trip-planning")}
              >
                Tạo kế hoạch ngay
                <ChevronRight size={20} />
              </button>
              <button
                className="btn btn--outline btn--large"
                onClick={() => navigate("/explore")}
              >
                Khám phá địa điểm
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
