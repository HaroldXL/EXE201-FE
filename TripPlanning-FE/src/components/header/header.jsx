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
} from "lucide-react";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <Link to="#" className="header-sidebar-link">
            <Map size={20} />
            <span>Khám Phá</span>
          </Link>
          <Link to="#" className="header-sidebar-link">
            <Percent size={20} />
            <span>Tạo Kế Hoạch</span>
          </Link>
          <Link to="#" className="header-sidebar-link">
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
          <button className="header-mobile-nav-icon-btn">
            <Bell size={20} />
          </button>
          <button className="header-mobile-nav-icon-btn">
            <User size={20} />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="header-desktop-nav">
          <div className="header-nav-links">
            <Link to="/" className="header-nav-link">
              Trang Chủ
            </Link>
            <Link to="#" className="header-nav-link">
              Khám Phá
            </Link>
            <Link to="#" className="header-nav-link">
              Tạo Kế Hoạch
            </Link>
            <Link to="#" className="header-nav-link">
              Hỏi Đáp AI
            </Link>
            <Link to="#" className="header-nav-link">
              Về Chúng Tôi
            </Link>
          </div>
          <div className="header-nav-actions">
            <div className="header-nav-notifications">
              <button className="header-nav-icon-btn">
                <Bell size={20} />
              </button>
            </div>
            <div className="header-nav-user-profile">
              <button className="header-nav-icon-btn">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
