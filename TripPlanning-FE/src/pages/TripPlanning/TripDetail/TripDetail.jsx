import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Navigation,
  Share2,
  Edit,
  ChevronRight,
  MapPinned,
  Loader,
  CircleDollarSign,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { message, Spin } from "antd";
import { Skeleton } from "@mui/material";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./TripDetail.css";

function TripDetail() {
  const { id } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Skeleton Components
  const SkeletonMap = () => (
    <div className="trip-detail__map">
      <div className="trip-detail__map-container">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ borderRadius: "12px" }}
        />
      </div>
    </div>
  );

  const SkeletonMeta = () => (
    <div className="trip-detail__meta">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="trip-detail__meta-item">
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            animation="wave"
          />
          <Skeleton variant="text" width={120} height={20} animation="wave" />
        </div>
      ))}
    </div>
  );

  const SkeletonTimelineItem = ({ index }) => (
    <div
      className="trip-detail__timeline-item"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="trip-detail__timeline-marker">
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
        <div className="trip-detail__timeline-line"></div>
      </div>
      <div className="trip-detail__timeline-content">
        <div className="trip-detail__timeline-time">
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            animation="wave"
          />
          <Skeleton variant="text" width={100} height={20} animation="wave" />
        </div>
        <div className="trip-detail__location-card">
          <div className="trip-detail__location-image">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={160}
              animation="wave"
              sx={{ borderRadius: "12px 12px 0 0" }}
            />
          </div>
          <div className="trip-detail__location-info">
            <Skeleton variant="text" width="80%" height={24} animation="wave" />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              animation="wave"
              sx={{ mt: 1 }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={16}
              animation="wave"
              sx={{ mt: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={32}
              animation="wave"
              sx={{ borderRadius: "16px", mt: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to format time from duration in minutes
  const formatTimeFromDuration = (visitedAt, duration) => {
    const startTime = new Date(visitedAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const formatTime = (date) => {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Fetch trip details from API
  const fetchTripDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/Itinerary/${id}`);
      setTripData(response.data);
    } catch (err) {
      console.error("Error fetching trip details:", err);
      setError("Không thể tải thông tin chuyến đi. Vui lòng thử lại sau.");
      message.error("Không thể tải thông tin chuyến đi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTripDetail();
    }
  }, [id, fetchTripDetail]);

  return (
    <div>
      <Header />

      <div className="wrapper">
        {loading ? (
          <div className="trip-detail trip-detail--loading">
            {/* Skeleton Map Section */}
            <SkeletonMap />

            {/* Skeleton Trip Info Section */}
            <div className="trip-detail__info">
              <div className="trip-detail__header">
                <div className="trip-detail__title-section">
                  <div className="trip-detail__title-wrapper">
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={32}
                      animation="wave"
                    />
                    <Skeleton
                      variant="circular"
                      width={36}
                      height={36}
                      animation="wave"
                    />
                  </div>
                  <SkeletonMeta />
                </div>
              </div>

              {/* Skeleton Itinerary Timeline */}
              <div className="trip-detail__itinerary">
                <div className="trip-detail__timeline">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonTimelineItem key={index} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div
            className="trip-detail"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: "#ef4444",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              {error}
            </p>
            <button
              onClick={fetchTripDetail}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Thử lại
            </button>
          </div>
        ) : tripData ? (
          <div className="trip-detail trip-detail--fade-in">
            {/* Map Section */}
            <div className="trip-detail__map trip-detail__map--fade-in">
              <div className="trip-detail__map-container">
                {/* This would be replaced with actual Google Maps component */}
                <div className="trip-detail__map-placeholder">
                  <iframe
                    src={
                      tripData.googleRouteData ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5346138030296!2d106.69514731533456!3d10.776530161875896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zVHLGsOG7nW5nIHThuKNpIGjhu41jIFThuq1uZyBD4buNbmcgSOG7kyBDaMOtIE1pbmggLSBVbml2ZXJzaXR5IG9mIFRlY2hub2xvZ3ksIEhvIENoaSBNaW5oIENpdHk!5e0!3m2!1svi!2s!4v1621234567890!5m2!1svi!2s"
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Trip Route Map"
                  ></iframe>
                </div>{" "}
                {/* Map Controls */}
                <div className="trip-detail__map-controls">
                  <button className="trip-detail__map-control-btn">
                    <Navigation size={20} />
                  </button>
                  <button className="trip-detail__map-control-btn">
                    <Share2 size={20} />
                  </button>
                </div>
                {/* Route Points */}
                <div className="trip-detail__route-points">
                  {tripData.locations?.map((location, index) => (
                    <div
                      key={location.orderIndex}
                      className={`trip-detail__route-point trip-detail__route-point--${
                        index + 1
                      }`}
                    >
                      {location.orderIndex}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trip Info Section */}
            <div className="trip-detail__info trip-detail__info--fade-in">
              <div className="trip-detail__header">
                <div className="trip-detail__title-section">
                  <div className="trip-detail__title-wrapper">
                    <h1 className="trip-detail__title">{tripData.title}</h1>
                    <button className="trip-detail__edit-btn">
                      <Edit size={18} />
                    </button>
                  </div>
                  <div
                    className="trip-detail__meta trip-detail__meta--fade-in"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <div className="trip-detail__meta-item">
                      <MapPin size={16} />
                      <span>Thành phố Hồ Chí Minh, Việt Nam</span>
                    </div>
                    <div className="trip-detail__meta-item">
                      <Calendar size={16} />
                      <span>
                        {new Date(tripData.tripDate).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="trip-detail__meta-item">
                      <Users size={16} />
                      <span>{tripData.numPeople} người</span>
                    </div>
                    <div className="trip-detail__meta-item">
                      <CircleDollarSign size={16} />
                      <span>
                        Dự kiến tổng chi phí:{" "}
                        <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                          {tripData.totalPrice?.toLocaleString("vi-VN")} VNĐ
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="trip-detail__itinerary">
                <div className="trip-detail__timeline">
                  {tripData.locations?.map((location, index) => (
                    <React.Fragment key={location.orderIndex}>
                      <div
                        className="trip-detail__timeline-item trip-detail__timeline-item--fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="trip-detail__timeline-marker">
                          <div className="trip-detail__timeline-dot">
                            <span>{location.orderIndex}</span>
                          </div>
                          {/* Hiển thị line cho tất cả item trừ item cuối */}
                          <div className="trip-detail__timeline-line"></div>
                        </div>

                        <div className="trip-detail__timeline-content">
                          <div className="trip-detail__timeline-time">
                            <Clock size={16} />
                            <span>
                              {formatTimeFromDuration(
                                location.visitedAt,
                                location.plannedDuration
                              )}
                            </span>
                            <button className="trip-detail__more-btn">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>

                          <div className="trip-detail__location-card">
                            <div className="trip-detail__location-image">
                              <img
                                src="/api/placeholder/280/200"
                                alt={location.locationName}
                              />
                            </div>

                            <div className="trip-detail__location-info">
                              <h3 className="trip-detail__location-title">
                                {location.locationName}
                              </h3>
                              <div className="trip-detail__location-address">
                                <MapPin size={14} />
                                <span>{location.locationName}</span>
                              </div>
                              <button className="trip-detail__view-map-btn">
                                <ChevronRight size={16} />
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Travel Time between locations (except for the last item) */}
                      {index < tripData.locations.length - 1 &&
                        tripData.locations[index + 1]
                          .travelTimeFromPrevious && (
                          <div
                            className="trip-detail__travel-time trip-detail__timeline-item--fade-in"
                            style={{
                              animationDelay: `${(index + 1) * 0.3 + 0.5}s`,
                            }}
                          >
                            <div className="trip-detail__travel-time-marker">
                              <div className="trip-detail__travel-time-icon-wrapper">
                                <MapPinned size={16} />
                              </div>
                            </div>
                            <div className="trip-detail__travel-time-content">
                              <div className="trip-detail__travel-time-info">
                                <div className="trip-detail__travel-time-details">
                                  <span className="trip-detail__travel-time-duration">
                                    {
                                      tripData.locations[index + 1]
                                        .travelTimeFromPrevious
                                    }{" "}
                                    phút
                                  </span>
                                  <span className="trip-detail__travel-time-method">
                                    Di chuyển (
                                    {tripData.locations[
                                      index + 1
                                    ].distanceFromPreviousKm?.toFixed(1)}
                                    km)
                                  </span>
                                </div>
                                <button
                                  className="trip-detail__direction-btn"
                                  onClick={() =>
                                    window.open(
                                      tripData.locations[index + 1]
                                        .googleRouteSegment,
                                      "_blank"
                                    )
                                  }
                                >
                                  <span>Xem hướng đi</span>
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}

export default TripDetail;
