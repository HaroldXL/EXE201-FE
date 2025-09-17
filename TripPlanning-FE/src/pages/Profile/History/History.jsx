import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, MoreHorizontal } from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./History.css";

function History() {
  const [tripHistory, setTripHistory] = useState([]);

  useEffect(() => {
    // Mock data for trip history (replace with API call later)
    const mockTripHistory = [
      {
        id: 1,
        title: "Chuyến đi quanh Sài Gòn với máy đua ban",
        date: "30 Tháng 06, 2025",
        participants: "Với bạn bè",
        location: "Thành phố Hồ Chí Minh",
        image: "/City.jpg",
        status: "completed",
      },
      {
        id: 2,
        title: "Chuyến đi quanh Sài Gòn với máy đua ban",
        date: "20 Tháng 06, 2025",
        participants: "Với bạn bè",
        location: "Thành phố Hồ Chí Minh",
        image: "/City.jpg",
        status: "completed",
      },
      {
        id: 3,
        title: "Khám phá Đà Lạt cùng gia đình",
        date: "15 Tháng 05, 2025",
        participants: "Với gia đình",
        location: "Đà Lạt, Lâm Đồng",
        image: "/City.jpg",
        status: "completed",
      },
      {
        id: 4,
        title: "Hành trình Phú Quốc",
        date: "10 Tháng 04, 2025",
        participants: "Với người yêu",
        location: "Phú Quốc, Kiên Giang",
        image: "/City.jpg",
        status: "completed",
      },
    ];

    // Load trip history data
    setTripHistory(mockTripHistory);
  }, []);

  return (
    <div className="history-page header-page-container">
      <Header />

      <div className="wrapper-history">
        <div className="wrapper-history__container">
          {/* Header */}
          <div className="wrapper-history__header">
            <h1 className="wrapper-history__title">Lịch Sử Chuyến Đi</h1>
          </div>

          {/* Trip History Cards */}
          <div className="wrapper-history__content">
            {tripHistory.length > 0 ? (
              <div className="wrapper-history__grid">
                {tripHistory.map((trip, index) => (
                  <div
                    key={trip.id}
                    className="wrapper-history__card wrapper-history__card--fade-in"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                  >
                    <div className="wrapper-history__card-image-container">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="wrapper-history__card-image"
                      />
                    </div>

                    <div className="wrapper-history__card-content">
                      <div className="wrapper-history__card-header">
                        <h3 className="wrapper-history__card-title">
                          {trip.title}
                        </h3>
                        <button className="wrapper-history__card-menu">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <div className="wrapper-history__card-meta">
                        <div className="wrapper-history__card-meta-item">
                          <Calendar size={16} />
                          <span>{trip.date}</span>
                        </div>

                        <div className="wrapper-history__card-meta-item">
                          <Users size={16} />
                          <span>{trip.participants}</span>
                        </div>

                        <div className="wrapper-history__card-meta-item">
                          <MapPin size={16} />
                          <span>{trip.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="wrapper-history__empty">
                <div className="wrapper-history__empty-icon">
                  <Calendar size={48} />
                </div>
                <h3 className="wrapper-history__empty-title">
                  Chưa có chuyến đi nào
                </h3>
                <p className="wrapper-history__empty-description">
                  Bắt đầu tạo kế hoạch cho chuyến đi đầu tiên của bạn!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default History;
