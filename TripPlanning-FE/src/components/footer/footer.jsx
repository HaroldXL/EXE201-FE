import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
} from "lucide-react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-logo">TripPlanning</h3>
          <p className="footer-description">
            Khám phá thế giới với những kế hoạch du lịch hoàn hảo. Tạo ra những
            trải nghiệm đáng nhớ cùng chúng tôi.
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <MapPin size={16} />
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+84 123 456 789</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>contact@tripplanning.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Liên Kết Nhanh</h4>
          <ul className="footer-links">
            <li>
              <a href="/" className="footer-link">
                Trang Chủ
              </a>
            </li>
            <li>
              <a href="/explore" className="footer-link">
                Khám Phá
              </a>
            </li>
            <li>
              <a href="/create-plan" className="footer-link">
                Tạo Kế Hoạch
              </a>
            </li>
            <li>
              <a href="/chatbot" className="footer-link">
                Hỏi Đáp AI
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Về Chúng Tôi
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4 className="footer-title">Dịch Vụ</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Lập Kế Hoạch Du Lịch
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Tư Vấn Địa Điểm
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Hỗ Trợ AI
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Đánh Giá & Review
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Hỗ Trợ 24/7
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="footer-title">Kết Nối</h4>
          <p className="footer-social-text">
            Theo dõi chúng tôi để cập nhật những điểm đến mới nhất
          </p>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/minhthien.phung.5"
              target="_blank"
              className="social-link"
            >
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link">
              <Twitter size={20} />
            </a>
            <a
              href="https://www.instagram.com/harold2996s"
              target="_blank"
              className="social-link"
            >
              <Instagram size={20} />
            </a>
            <a href="#" className="social-link">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © 2024 TripPlanning. Tất cả quyền được bảo lưu.
          </p>
          <div className="footer-made-with">
            <span>Được tạo với</span>
            <Heart size={16} className="heart-icon" />
            <span>tại Việt Nam</span>
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="legal-link">
              Điều Khoản Sử Dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
