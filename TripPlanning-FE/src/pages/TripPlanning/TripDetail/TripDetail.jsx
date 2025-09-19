import React from "react";
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
} from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./TripDetail.css";

function TripDetail() {
  // Sample trip data - will be replaced with actual data from API
  const tripData = {
    title: "Chuyến Đi Quanh Sài Gòn Với Máy Đúa Ban",
    location: "Thành phố Hồ Chí Minh, Việt Nam",
    date: "30 Tháng 06, 2025",
    participants: "Với bạn bè",
    itinerary: [
      {
        id: 1,
        time: "10:00 - 11:15 AM",
        title: "Dinh Độc Lập",
        location: "Bến Thành, Quận 1, Hồ Chí Minh",
        image: "/api/placeholder/280/200",
        coordinates: { lat: 10.7769, lng: 106.6951 },
      },
      {
        id: 2,
        time: "11:30 - 13:00 PM",
        title: "Nhà Thờ Đức Bà Sài Gòn",
        location: "Bến Nghé, Quận 1, Hồ Chí Minh",
        image: "/api/placeholder/280/200",
        coordinates: { lat: 10.7798, lng: 106.699 },
      },
      {
        id: 3,
        time: "13:15 - 14:15 PM",
        title: "Pizza 4P's Lê Thánh Tôn",
        location: "Bến Nghé, Quận 1, Hồ Chí Minh",
        image: "/api/placeholder/280/200",
        coordinates: { lat: 10.7741, lng: 106.7024 },
      },
    ],
  };

  return (
    <div>
      <Header />

      <div className="wrapper">
        <div className="trip-detail">
          {/* Map Section */}
          <div className="trip-detail__map">
            <div className="trip-detail__map-container">
              {/* This would be replaced with actual Google Maps component */}
              <div className="trip-detail__map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5346138030296!2d106.69514731533456!3d10.776530161875896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zVHLGsOG7nW5nIHThuKNpIGjhu41jIFThuq1uZyBD4buNbmcgSOG7kyBDaMOtIE1pbmggLSBVbml2ZXJzaXR5IG9mIFRlY2hub2xvZ3ksIEhvIENoaSBNaW5oIENpdHk!5e0!3m2!1svi!2s!4v1621234567890!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Trip Route Map"
                ></iframe>
              </div>

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
                {tripData.itinerary.map((item, index) => (
                  <div
                    key={item.id}
                    className={`trip-detail__route-point trip-detail__route-point--${
                      index + 1
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trip Info Section */}
          <div className="trip-detail__info">
            <div className="trip-detail__header">
              <div className="trip-detail__title-section">
                <div className="trip-detail__title-wrapper">
                  <h1 className="trip-detail__title">{tripData.title}</h1>
                  <button className="trip-detail__edit-btn">
                    <Edit size={18} />
                  </button>
                </div>
                <div className="trip-detail__meta">
                  <div className="trip-detail__meta-item">
                    <MapPin size={16} />
                    <span>{tripData.location}</span>
                  </div>
                  <div className="trip-detail__meta-item">
                    <Calendar size={16} />
                    <span>{tripData.date}</span>
                  </div>
                  <div className="trip-detail__meta-item">
                    <Users size={16} />
                    <span>{tripData.participants}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="trip-detail__itinerary">
              <div className="trip-detail__timeline">
                {tripData.itinerary.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="trip-detail__timeline-item">
                      <div className="trip-detail__timeline-marker">
                        <div className="trip-detail__timeline-dot">
                          <span>{index + 1}</span>
                        </div>
                        {/* Hiển thị line cho tất cả item trừ item cuối */}
                        <div className="trip-detail__timeline-line"></div>
                      </div>

                      <div className="trip-detail__timeline-content">
                        <div className="trip-detail__timeline-time">
                          <Clock size={16} />
                          <span>{item.time}</span>
                          <button className="trip-detail__more-btn">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>

                        <div className="trip-detail__location-card">
                          <div className="trip-detail__location-image">
                            <img src={item.image} alt={item.title} />
                          </div>

                          <div className="trip-detail__location-info">
                            <h3 className="trip-detail__location-title">
                              {item.title}
                            </h3>
                            <div className="trip-detail__location-address">
                              <MapPin size={14} />
                              <span>{item.location}</span>
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
                    {index < tripData.itinerary.length - 1 && (
                      <div className="trip-detail__travel-time">
                        <div className="trip-detail__travel-time-marker">
                          <div className="trip-detail__travel-time-icon-wrapper">
                            <MapPinned size={16} />
                          </div>
                        </div>
                        <div className="trip-detail__travel-time-content">
                          <div className="trip-detail__travel-time-info">
                            <div className="trip-detail__travel-time-details">
                              <span className="trip-detail__travel-time-duration">
                                25m
                              </span>
                              <span className="trip-detail__travel-time-method">
                                Di chuyển
                              </span>
                            </div>
                            <button className="trip-detail__direction-btn">
                              <span>Direction</span>
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
      </div>

      <Footer />
    </div>
  );
}

export default TripDetail;
