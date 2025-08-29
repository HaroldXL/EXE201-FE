import React, { useState } from "react";
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
} from "lucide-react";
import "./Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <a href="#" className="sidebar-link">
            Trang Chủ
          </a>
          <a href="#" className="sidebar-link">
            Khám Phá
          </a>
          <a href="#" className="sidebar-link">
            Tạo Kế Hoạch
          </a>
          <a href="#" className="sidebar-link">
            Hỏi Đáp AI
          </a>
          <a href="#" className="sidebar-link">
            Về Chúng Tôi
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
        <nav className="hero-navigation">
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Mobile Actions */}
          <div className="mobile-nav-actions">
            <button className="mobile-nav-icon-btn">
              <Bell size={20} />
            </button>
            <button className="mobile-nav-icon-btn">
              <User size={20} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <div className="nav-links">
              <a href="#" className="nav-link">
                Trang Chủ
              </a>
              <a href="#" className="nav-link">
                Khám Phá
              </a>
              <a href="#" className="nav-link">
                Tạo Kế Hoạch
              </a>
              <a href="#" className="nav-link">
                Hỏi Đáp AI
              </a>
              <a href="#" className="nav-link">
                Về Chúng Tôi
              </a>
            </div>
            <div className="nav-actions">
              <button className="nav-icon-btn">
                <Bell size={20} />
              </button>
              <button className="nav-icon-btn">
                <User size={20} />
              </button>
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
            <button className="category-btn">
              <Map size={24} />
              <span>Khám Phá</span>
            </button>
            <button className="category-btn">
              <MessageCircle size={24} />
              <span>Hỏi đáp AI</span>
            </button>
          </div>
        </div>
      </section>
      <div className="wrapper">
        {/* Content Sections */}
        <main className="main-content">
          {/* Lịch Trình Nổi Bật */}
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">Lịch Trình Nổi Bật</h2>
              <button className="view-more-btn">Xem Thêm</button>
            </div>
            <div className="trip-cards">
              <div className="trip-card">
                <div className="trip-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1580837119756-563d608dd119?w=300&h=200&fit=crop"
                    alt="Chuyến đi quanh Sài Gòn"
                    className="trip-image"
                  />
                </div>
                <div className="trip-info">
                  <h3 className="trip-title">
                    Chuyến đi quanh Sài Gòn với máy đưa bạn
                  </h3>
                  <div className="trip-meta">
                    <div className="trip-date">
                      <Calendar size={16} />
                      <span>28 Tháng 08, 2024</span>
                    </div>
                    <div className="trip-participants">
                      <Users size={16} />
                      <span>Với bạn bè</span>
                    </div>
                    <div className="trip-location">
                      <MapPin size={16} />
                      <span>Thành phố Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trip-card">
                <div className="trip-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1580837119756-563d608dd119?w=300&h=200&fit=crop"
                    alt="Chuyến đi quanh Sài Gòn"
                    className="trip-image"
                  />
                </div>
                <div className="trip-info">
                  <h3 className="trip-title">
                    Chuyến đi quanh Sài Gòn với máy đưa bạn
                  </h3>
                  <div className="trip-meta">
                    <div className="trip-date">
                      <Calendar size={16} />
                      <span>29 Tháng 08, 2024</span>
                    </div>
                    <div className="trip-participants">
                      <Users size={16} />
                      <span>Với gia đình</span>
                    </div>
                    <div className="trip-location">
                      <MapPin size={16} />
                      <span>Thành phố Hồ Chí Minh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Địa Điểm Nổi Bật */}
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">Địa Điểm Nổi Bật</h2>
              <button className="view-more-btn">Xem Thêm</button>
            </div>
            <div className="destination-cards">
              <div className="destination-card">
                <div className="destination-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
                    alt="Dinh Độc Lập"
                    className="destination-image"
                  />
                </div>
                <div className="destination-info">
                  <h3 className="destination-title">Dinh Độc Lập</h3>
                  <div className="destination-location">
                    <MapPin size={16} />
                    <span>Bến Thành, Quận 1, Hồ Chí Minh</span>
                  </div>
                </div>
              </div>

              <div className="destination-card">
                <div className="destination-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                    alt="Nhà Thờ Đức Bà Sài Gòn"
                    className="destination-image"
                  />
                </div>
                <div className="destination-info">
                  <h3 className="destination-title">Nhà Thờ Đức Bà Sài Gòn</h3>
                  <div className="destination-location">
                    <MapPin size={16} />
                    <span>Bến Nghé, Quận 1, Hồ Chí Minh</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vui Chơi */}
          <section className="content-section">
            <div className="section-header">
              <h2 className="section-title">Vui Chơi</h2>
              <button className="view-more-btn">Xem Thêm</button>
            </div>
            <div className="entertainment-cards">
              <div className="entertainment-card">
                <div className="entertainment-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop"
                    alt="Thảo Cầm Viên"
                    className="entertainment-image"
                  />
                </div>
                <div className="entertainment-info">
                  <h3 className="entertainment-title">Thảo Cầm Viên</h3>
                  <div className="entertainment-location">
                    <MapPin size={16} />
                    <span>Bến Nghé, Quận 1, Hồ Chí Minh</span>
                  </div>
                </div>
              </div>

              <div className="entertainment-card">
                <div className="entertainment-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                    alt="Phố Đi Bộ Nguyễn Huệ"
                    className="entertainment-image"
                  />
                </div>
                <div className="entertainment-info">
                  <h3 className="entertainment-title">Phố Đi Bộ Nguyễn Huệ</h3>
                  <div className="entertainment-location">
                    <MapPin size={16} />
                    <span>Bến Nghé, Quận 1, Hồ Chí Minh</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
