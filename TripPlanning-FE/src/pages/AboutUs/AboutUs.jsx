import React, { useEffect, useRef } from "react";
import { MapPin, Users, Compass, Sparkles, Heart, Target } from "lucide-react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./AboutUs.css";

function AboutUs() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Initialize MapTiler map
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    // FPT University HCM coordinates
    const fptLocation = [106.8098791686378, 10.841171383450355];

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: fptLocation,
      zoom: 17,
    });

    // Add marker for FPT University
    const marker = new maptilersdk.Marker()
      .setLngLat(fptLocation)
      .addTo(map.current);

    // Add popup with location info
    const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<div style="padding: 12px; text-align: center;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">Trường Đại học FPT TP.HCM</h3>
        <p style="margin: 0; font-size: 13px; color: #64748b;">Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
      </div>`
    );

    marker.setPopup(popup);

    // Open popup by default
    popup.addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="aboutus-page">
      <Header />

      <div className="wrapper-aboutus">
        <div className="aboutus-container">
          {/* Hero Section */}
          <div className="aboutus-hero">
            <h1 className="aboutus-title">Về Chúng Tôi</h1>
            <p className="aboutus-subtitle">
              Khám phá Việt Nam cùng Trip Planning - Người bạn đồng hành tin cậy
              trong mọi hành trình
            </p>
          </div>

          {/* Mission Section */}
          <div className="aboutus-section">
            <div className="aboutus-section-icon">
              <Target size={48} />
            </div>
            <h2 className="aboutus-section-title">Sứ Mệnh</h2>
            <p className="aboutus-section-content">
              Trip Planning được ra đời với sứ mệnh mang đến trải nghiệm lập kế
              hoạch du lịch thông minh, tiện lợi và cá nhân hóa cho mọi du khách
              Việt Nam. Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện
              đáng nhớ, và chúng tôi ở đây để giúp bạn viết nên câu chuyện của
              riêng mình.
            </p>
          </div>

          {/* Vision Section */}
          <div className="aboutus-section">
            <div className="aboutus-section-icon">
              <Sparkles size={48} />
            </div>
            <h2 className="aboutus-section-title">Tầm Nhìn</h2>
            <p className="aboutus-section-content">
              Trở thành nền tảng lập kế hoạch du lịch hàng đầu Việt Nam, nơi mọi
              người có thể dễ dàng khám phá và trải nghiệm vẻ đẹp đất nước một
              cách thông minh và tiết kiệm nhất. Chúng tôi hướng tới việc kết
              nối du khách với những điểm đến tuyệt vời, văn hóa phong phú và ẩm
              thực đa dạng của Việt Nam.
            </p>
          </div>

          {/* Features Grid */}
          <div className="aboutus-features">
            <h2 className="aboutus-features-title">
              Điều Gì Làm Nên Sự Khác Biệt
            </h2>

            <div className="aboutus-features-grid">
              <div className="aboutus-feature-card">
                <div className="aboutus-feature-icon">
                  <MapPin size={32} />
                </div>
                <h3 className="aboutus-feature-title">
                  Lập Kế Hoạch Thông Minh
                </h3>
                <p className="aboutus-feature-desc">
                  Hệ thống AI tự động gợi ý lịch trình tối ưu dựa trên sở thích,
                  thời gian và ngân sách của bạn
                </p>
              </div>

              <div className="aboutus-feature-card">
                <div className="aboutus-feature-icon">
                  <Compass size={32} />
                </div>
                <h3 className="aboutus-feature-title">Khám Phá Đa Dạng</h3>
                <p className="aboutus-feature-desc">
                  Hàng nghìn địa điểm du lịch được cập nhật liên tục với thông
                  tin chi tiết và hình ảnh chân thực
                </p>
              </div>

              <div className="aboutus-feature-card">
                <div className="aboutus-feature-icon">
                  <Users size={32} />
                </div>
                <h3 className="aboutus-feature-title">Cộng Đồng Sôi Động</h3>
                <p className="aboutus-feature-desc">
                  Kết nối với cộng đồng du khách, chia sẻ trải nghiệm và học hỏi
                  từ những câu chuyện thú vị
                </p>
              </div>

              <div className="aboutus-feature-card">
                <div className="aboutus-feature-icon">
                  <Heart size={32} />
                </div>
                <h3 className="aboutus-feature-title">Hỗ Trợ Tận Tâm</h3>
                <p className="aboutus-feature-desc">
                  Đội ngũ hỗ trợ nhiệt tình, sẵn sàng giải đáp mọi thắc mắc và
                  đồng hành cùng bạn trong mọi hành trình
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="aboutus-cta">
            <h2 className="aboutus-cta-title">
              Bắt Đầu Hành Trình Của Bạn Ngay Hôm Nay
            </h2>
            <p className="aboutus-cta-desc">
              Tham gia cùng hàng nghìn du khách đã tin tưởng lựa chọn Trip
              Planning
            </p>
            <button
              className="aboutus-cta-btn"
              onClick={() => (window.location.href = "/trip-planning")}
            >
              Lập Kế Hoạch Ngay
            </button>
          </div>

          {/* Location Map */}
          <div className="aboutus-location">
            <h2 className="aboutus-location-title">Địa Điểm Của Chúng Tôi</h2>
            <p className="aboutus-location-subtitle">
              Trường Đại học FPT TP.HCM - Nơi khởi nguồn của Trip Planning
            </p>
            <div ref={mapContainer} className="aboutus-map-container" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AboutUs;
