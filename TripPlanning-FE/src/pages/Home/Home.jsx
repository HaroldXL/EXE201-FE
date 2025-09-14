import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Percent,
  Map,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Menu,
  X,
  Bell,
  User,
  Home as HomeIcon,
  Info,
  Star,
} from "lucide-react";
import "./Home.css";
import "../Explore/LocationList/Explore.css";
import { useSelector } from "react-redux";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

function Home() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [popularLocations, setPopularLocations] = useState([]);
  const [historyLocations, setHistoryLocations] = useState([]);
  const [cultureLocations, setCultureLocations] = useState([]);
  const [natureLocations, setNatureLocations] = useState([]);
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

  // Fetch entertainment locations (topic ID 7 is "Giải trí")
  const fetchHistoryLocations = async () => {
    try {
      const response = await api.get("/Location/topic/3", {
        params: { page: 1, pageSize: 3 },
      });
      setHistoryLocations(response.data.items || []);
    } catch (error) {
      console.error("Error fetching history locations:", error);
    }
  };

  // Fetch culture locations (topic ID 2 is "Văn Hóa")
  const fetchCultureLocations = async () => {
    try {
      const response = await api.get("/Location/topic/5", {
        params: { page: 1, pageSize: 3 },
      });
      setCultureLocations(response.data.items || []);
    } catch (error) {
      console.error("Error fetching culture locations:", error);
    }
  };

  // Fetch nature locations (topic ID 3 is "Thiên Nhiên")
  const fetchNatureLocations = async () => {
    try {
      const response = await api.get("/Location/topic/1", {
        params: { page: 1, pageSize: 3 },
      });
      setNatureLocations(response.data.items || []);
    } catch (error) {
      console.error("Error fetching nature locations:", error);
    }
  };

  // Fetch all data on component mount
  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchPopularLocations(),
      fetchHistoryLocations(),
      fetchCultureLocations(),
      fetchNatureLocations(),
    ]);
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>
        <div className="sidebar-content">
          <a href="/" className="sidebar-link">
            <HomeIcon size={20} />
            <span>Trang Chủ</span>
          </a>
          <a href="/explore" className="sidebar-link">
            <Map size={20} />
            <span>Khám Phá</span>
          </a>
          <a href="#" className="sidebar-link">
            <Percent size={20} />
            <span>Tạo Kế Hoạch</span>
          </a>
          <a href="#" className="sidebar-link">
            <MessageCircle size={20} />
            <span>Hỏi Đáp AI</span>
          </a>
          <a href="#" className="sidebar-link">
            <Info size={20} />
            <span>Về Chúng Tôi</span>
          </a>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <img className="poster" src="./City.jpg" alt="City" />
          <div className="hero-overlay"></div>
        </div>

        {/* Navigation in Hero */}
        <nav className={`hero-navigation ${isScrolled ? "scrolled" : ""}`}>
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Mobile Actions */}
          <div className="mobile-nav-actions">
            {user && user.token ? (
              // Hiển thị search, notification và avatar khi đã login
              <>
                <button className="mobile-nav-icon-btn">
                  <Search size={20} />
                </button>
                <button className="mobile-nav-icon-btn">
                  <Bell size={20} />
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="mobile-nav-icon-btn"
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              // Hiển thị search, login và register khi chưa login
              <>
                <button className="mobile-nav-icon-btn">
                  <Search size={20} />
                </button>
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
              <a href="#" className="nav-link">
                Tạo Kế Hoạch
              </a>
              <a href="/chatbot" className="nav-link">
                Hỏi Đáp AI
              </a>
              <a href="#" className="nav-link">
                Về Chúng Tôi
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {user && user.token ? (
                // Hiển thị search, notification và avatar khi đã login
                <>
                  <div className="nav-search">
                    <button className="nav-icon-btn">
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
                // Hiển thị search, login và register khi chưa login
                <>
                  <div className="nav-search">
                    <button className="nav-icon-btn">
                      <Search size={20} />
                    </button>
                  </div>
                  <div className="desktop-auth-buttons">
                    <a
                      href="/login"
                      className="desktop-auth-btn desktop-login-btn"
                    >
                      Đăng nhập
                    </a>
                    <a
                      href="/register"
                      className="desktop-auth-btn desktop-register-btn"
                    >
                      Đăng ký
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="hero-content">
          {/* Search Bar */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm hoặc gói tour"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          {/* Category Buttons */}
          <div className="category-buttons">
            <button className="category-btn">
              <Percent size={24} />
              <span>Tạo Kế Hoạch</span>
            </button>
            <button
              className="category-btn"
              onClick={() => navigate("/explore")}
            >
              <Map size={24} />
              <span>Khám Phá</span>
            </button>
            <button
              className="category-btn"
              onClick={() => navigate("/chatbot")}
            >
              <MessageCircle size={24} />
              <span>Hỏi đáp AI</span>
            </button>
          </div>
        </div>
      </section>

      <div className="wrapper">
        {/* Content Sections */}
        <main className="wrapper-content">
          {/* Lịch Trình Nổi Bật */}
          <section className="wrapper-section">
            <div className="wrapper-section__header">
              <h2 className="wrapper-section__title">Lịch Trình Nổi Bật</h2>
              <button className="wrapper-section__view-more">Xem Thêm</button>
            </div>
            <div className="wrapper-cards wrapper-cards--trip">
              <div className="wrapper-card wrapper-card--trip">
                <div className="wrapper-card__image-container">
                  <img
                    src="https://images.unsplash.com/photo-1580837119756-563d608dd119?w=300&h=200&fit=crop"
                    alt="Chuyến đi quanh Sài Gòn"
                    className="wrapper-card__image"
                  />
                </div>
                <div className="wrapper-card__info">
                  <h3 className="wrapper-card__title">
                    Chuyến đi quanh Sài Gòn với máy đưa bạn
                  </h3>
                  <div className="wrapper-card__meta">
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--date">
                      <Calendar size={16} />
                      <span>28 Tháng 08, 2024</span>
                    </div>
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--participants">
                      <Users size={16} />
                      <span>Với bạn bè</span>
                    </div>
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--location">
                      <MapPin size={16} />
                      <span>Thành phố Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wrapper-card wrapper-card--trip">
                <div className="wrapper-card__image-container">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
                    alt="Chuyến đi quanh Sài Gòn"
                    className="wrapper-card__image"
                  />
                </div>
                <div className="wrapper-card__info">
                  <h3 className="wrapper-card__title">
                    Chuyến đi quanh Sài Gòn với máy đưa bạn
                  </h3>
                  <div className="wrapper-card__meta">
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--date">
                      <Calendar size={16} />
                      <span>29 Tháng 08, 2024</span>
                    </div>
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--participants">
                      <Users size={16} />
                      <span>Với gia đình</span>
                    </div>
                    <div className="wrapper-card__meta-item wrapper-card__meta-item--location">
                      <MapPin size={16} />
                      <span>Thành phố Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Địa Điểm Nổi Bật */}
          <section className="wrapper-section">
            <div className="wrapper-section__header">
              <h2 className="wrapper-section__title">Địa Điểm Nổi Bật</h2>
              <button
                className="wrapper-section__view-more"
                onClick={() => navigate("/explore")}
              >
                Xem Thêm
              </button>
            </div>
            <div className="wrapper-cards wrapper-cards--destination">
              {loading
                ? // Show loading placeholders
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="wrapper-explore__card">
                      <div className="wrapper-explore__card-image">
                        <div className="loading-placeholder"></div>
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="loading-text"></div>
                          <div className="loading-text-small"></div>
                        </div>
                        <div className="loading-text"></div>
                        <div className="loading-text-small"></div>
                      </div>
                    </div>
                  ))
                : popularLocations.map((location) => (
                    <div
                      key={location.id}
                      className="wrapper-explore__card"
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
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop";
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
          </section>

          {/* Lịch Sử */}
          <section className="wrapper-section">
            <div className="wrapper-section__header">
              <h2 className="wrapper-section__title">Lịch Sử</h2>
              <button
                className="wrapper-section__view-more"
                onClick={() => navigate("/explore?topic=3")}
              >
                Xem Thêm
              </button>
            </div>
            <div className="wrapper-cards wrapper-cards--history">
              {loading
                ? // Show loading placeholders
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="wrapper-explore__card">
                      <div className="wrapper-explore__card-image">
                        <div className="loading-placeholder"></div>
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="loading-text"></div>
                          <div className="loading-text-small"></div>
                        </div>
                        <div className="loading-text"></div>
                        <div className="loading-text-small"></div>
                      </div>
                    </div>
                  ))
                : historyLocations.map((location) => (
                    <div
                      key={location.id}
                      className="wrapper-explore__card"
                      onClick={() => navigate(`/explore/${location.id}`)}
                    >
                      <div className="wrapper-explore__card-image">
                        <img
                          src={
                            location.imageUrl ||
                            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                          }
                          alt={location.name}
                          className="wrapper-explore__card-img"
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop";
                            e.target.style.opacity = "1";
                          }}
                        />
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="wrapper-explore__card-category">
                            {location.topicName || "Lịch sử"}
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
          </section>

          {/* Văn Hóa */}
          <section className="wrapper-section">
            <div className="wrapper-section__header">
              <h2 className="wrapper-section__title">Văn Hóa</h2>
              <button
                className="wrapper-section__view-more"
                onClick={() => navigate("/explore?topic=5")}
              >
                Xem Thêm
              </button>
            </div>
            <div className="wrapper-cards wrapper-cards--culture">
              {loading
                ? // Show loading placeholders
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="wrapper-explore__card">
                      <div className="wrapper-explore__card-image">
                        <div className="loading-placeholder"></div>
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="loading-text"></div>
                          <div className="loading-text-small"></div>
                        </div>
                        <div className="loading-text"></div>
                        <div className="loading-text-small"></div>
                      </div>
                    </div>
                  ))
                : cultureLocations.map((location) => (
                    <div
                      key={location.id}
                      className="wrapper-explore__card"
                      onClick={() => navigate(`/explore/${location.id}`)}
                    >
                      <div className="wrapper-explore__card-image">
                        <img
                          src={
                            location.imageUrl ||
                            "https://images.unsplash.com/photo-1555400113-d6ec8afb3c0d?w=400&h=300&fit=crop"
                          }
                          alt={location.name}
                          className="wrapper-explore__card-img"
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1555400113-d6ec8afb3c0d?w=400&h=300&fit=crop";
                            e.target.style.opacity = "1";
                          }}
                        />
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="wrapper-explore__card-category">
                            {location.topicName || "Văn hóa"}
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
          </section>

          {/* Thiên Nhiên */}
          <section className="wrapper-section">
            <div className="wrapper-section__header">
              <h2 className="wrapper-section__title">Thiên Nhiên</h2>
              <button
                className="wrapper-section__view-more"
                onClick={() => navigate("/explore?topic=1")}
              >
                Xem Thêm
              </button>
            </div>
            <div className="wrapper-cards wrapper-cards--nature">
              {loading
                ? // Show loading placeholders
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="wrapper-explore__card">
                      <div className="wrapper-explore__card-image">
                        <div className="loading-placeholder"></div>
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="loading-text"></div>
                          <div className="loading-text-small"></div>
                        </div>
                        <div className="loading-text"></div>
                        <div className="loading-text-small"></div>
                      </div>
                    </div>
                  ))
                : natureLocations.map((location) => (
                    <div
                      key={location.id}
                      className="wrapper-explore__card"
                      onClick={() => navigate(`/explore/${location.id}`)}
                    >
                      <div className="wrapper-explore__card-image">
                        <img
                          src={
                            location.imageUrl ||
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                          }
                          alt={location.name}
                          className="wrapper-explore__card-img"
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
                            e.target.style.opacity = "1";
                          }}
                        />
                      </div>
                      <div className="wrapper-explore__card-content">
                        <div className="wrapper-explore__card-top">
                          <div className="wrapper-explore__card-category">
                            {location.topicName || "Thiên nhiên"}
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
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Home;
