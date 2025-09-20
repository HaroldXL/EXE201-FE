import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, MoreHorizontal } from "lucide-react";
import { Empty } from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const [tripHistory, setTripHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // Handle card click to navigate to trip detail
  const handleCardClick = (tripId) => {
    navigate(`/trip-planning/${tripId}`);
  };

  // Handle menu click to prevent card navigation
  const handleMenuClick = (e) => {
    e.stopPropagation();
    // Add menu functionality here if needed
  };

  // Fetch trip history from API
  const fetchTripHistory = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/Itinerary", {
        params: {
          page: page,
          pageSize: pageSize,
        },
      });

      const {
        items,
        totalCount,
        page: currentPage,
        pageSize: currentPageSize,
      } = response.data;

      // Transform API data to match component structure
      const transformedData = items.map((item) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.tripDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        participants: `${item.numPeople} người`,
        location: "Thành phố Hồ Chí Minh", // Default location
        image: "/City.jpg", // Default image
        status: "completed",
        username: item.username,
        totalPrice: item.totalPrice,
      }));

      setTripHistory(transformedData);
      setPagination({
        page: currentPage,
        pageSize: currentPageSize,
        totalCount: totalCount,
      });
    } catch (err) {
      console.error("Error fetching trip history:", err);
      setError("Không thể tải lịch sử chuyến đi. Vui lòng thử lại.");
      setTripHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripHistory(1, 10); // Load first page initially
  }, []);

  return (
    <div className="history-page header-page-container">
      <Header />

      <div className="wrapper-history">
        <div className="wrapper-history__container">
          {/* Header */}
          <div className="wrapper-history__header">
            <h1 className="wrapper-history__title">Chuyến Đi Của Tôi</h1>
          </div>

          {/* Trip History Cards */}
          <div className="wrapper-history__content">
            {loading ? (
              <div className="wrapper-history__grid">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="wrapper-history__card wrapper-history__card--skeleton"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="wrapper-history__card-image-container">
                      <div className="wrapper-history__skeleton-image"></div>
                    </div>

                    <div className="wrapper-history__card-content">
                      <div className="wrapper-history__card-header">
                        <div className="wrapper-history__skeleton-title"></div>
                        <div className="wrapper-history__skeleton-menu"></div>
                      </div>

                      <div className="wrapper-history__card-meta">
                        <div className="wrapper-history__card-meta-item">
                          <div className="wrapper-history__skeleton-icon"></div>
                          <div className="wrapper-history__skeleton-text"></div>
                        </div>

                        <div className="wrapper-history__card-meta-item">
                          <div className="wrapper-history__skeleton-icon"></div>
                          <div className="wrapper-history__skeleton-text"></div>
                        </div>

                        <div className="wrapper-history__card-meta-item">
                          <div className="wrapper-history__skeleton-icon"></div>
                          <div className="wrapper-history__skeleton-text"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="wrapper-history__error">
                <p>{error}</p>
                <button
                  onClick={() => fetchTripHistory(1, 10)}
                  className="wrapper-history__retry-btn"
                >
                  Thử lại
                </button>
              </div>
            ) : tripHistory.length > 0 ? (
              <div className="wrapper-history__grid">
                {tripHistory.map((trip, index) => (
                  <div
                    key={trip.id}
                    className="wrapper-history__card wrapper-history__card--fade-in"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                    onClick={() => handleCardClick(trip.id)}
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
                        <button
                          className="wrapper-history__card-menu"
                          onClick={handleMenuClick}
                        >
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
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ color: "#6b7280", fontSize: "16px" }}>
                      Chưa có chuyến đi nào
                    </span>
                  }
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    Bắt đầu tạo kế hoạch cho chuyến đi đầu tiên của bạn!
                  </p>
                </Empty>
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
