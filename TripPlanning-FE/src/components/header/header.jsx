import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  Home as HomeIcon,
  Map,
  Percent,
  MessageCircle,
  Info,
  Search,
} from "lucide-react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((store) => store.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    const handleScrollOptimized = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScrollOptimized, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollOptimized);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchClick = () => {
    // Navigate to Search page when clicking search icon
    navigate("/search");
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
          <Link to="#" className="header-sidebar-link">
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

      {/* Header Navigation */}
      <nav className={`header-nav ${isScrolled ? "scrolled" : ""}`}>
        {/* Mobile Menu Button */}
        <button className="header-mobile-menu-btn" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>

        {/* Mobile Actions */}
        <div className="header-mobile-nav-actions">
          {user && user.token ? (
            // Hiển thị search, notification và avatar khi đã login
            <>
              <button
                className="header-mobile-nav-icon-btn"
                onClick={handleSearchClick}
              >
                <Search size={20} />
              </button>
              <button className="header-mobile-nav-icon-btn">
                <Bell size={20} />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="header-mobile-nav-icon-btn"
              >
                <User size={20} />
              </button>
            </>
          ) : (
            // Hiển thị search, login và register khi chưa login
            <>
              <button
                className="header-mobile-nav-icon-btn"
                onClick={handleSearchClick}
              >
                <Search size={20} />
              </button>
              <Link
                to="/login"
                className="header-mobile-auth-btn header-mobile-login-btn"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="header-mobile-auth-btn header-mobile-register-btn"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="header-desktop-nav">
          <div className="header-nav-links">
            <Link to="/" className="header-nav-link">
              Trang Chủ
            </Link>
            <Link to="/explore" className="header-nav-link">
              Khám Phá
            </Link>
            <Link to="/trip-planning" className="header-nav-link">
              Tạo Kế Hoạch
            </Link>
            <Link to="/chatbot" className="header-nav-link">
              Hỏi Đáp AI
            </Link>
            <Link to="#" className="header-nav-link">
              Về Chúng Tôi
            </Link>
          </div>
          <div className="header-nav-actions">
            {user && user.token ? (
              // Hiển thị search, notification và avatar khi đã login
              <>
                <div className="header-nav-search">
                  <button
                    className="header-nav-icon-btn"
                    onClick={handleSearchClick}
                  >
                    <Search size={20} />
                  </button>
                </div>
                <div className="header-nav-notifications">
                  <button className="header-nav-icon-btn">
                    <Bell size={20} />
                  </button>
                </div>
                <div className="header-nav-user-profile">
                  <button
                    onClick={() => navigate("/profile")}
                    className="header-nav-icon-btn"
                  >
                    <User size={20} />
                  </button>
                </div>
              </>
            ) : (
              // Hiển thị search, login và register khi chưa login
              <>
                <div className="header-nav-search">
                  <button
                    className="header-nav-icon-btn"
                    onClick={handleSearchClick}
                  >
                    <Search size={20} />
                  </button>
                </div>
                <div className="header-desktop-auth-buttons">
                  <Link
                    to="/login"
                    className="header-desktop-auth-btn header-desktop-login-btn"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="header-desktop-auth-btn header-desktop-register-btn"
                  >
                    Đăng ký
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
