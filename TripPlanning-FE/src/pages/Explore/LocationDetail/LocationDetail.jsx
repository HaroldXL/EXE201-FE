import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, ExternalLink } from "lucide-react";
import { Skeleton } from "@mui/material";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./LocationDetail.css";

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [relatedLocations, setRelatedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // Fetch location details
  const fetchLocationDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Location/${id}`);
      setLocation(response.data);
    } catch (error) {
      console.error("Error fetching location detail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch related locations (from Explore)
  const fetchRelatedLocations = useCallback(async () => {
    try {
      setRelatedLoading(true);
      const response = await api.get("/Location/list", {
        params: { page: 1, pageSize: 10 },
      });
      // Filter out current location and take first 4
      const filtered =
        response.data.items
          ?.filter((item) => item.id !== parseInt(id))
          ?.slice(0, 3) || [];
      setRelatedLocations(filtered);
    } catch (error) {
      console.error("Error fetching related locations:", error);
    } finally {
      setRelatedLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLocationDetail();
      fetchRelatedLocations();
    }
  }, [id]);

  // Parse opening hours
  const parseOpeningHours = (hoursString) => {
    try {
      const hours = JSON.parse(hoursString);
      if (hours && hours.length > 0) {
        const todayHours = hours[0];
        if (todayHours.Open === "00:00" && todayHours.Close === "24:00") {
          return "Mở cửa 24/7";
        }
        return `${todayHours.Open} - ${todayHours.Close}`;
      }
    } catch (error) {
      console.error("Error parsing opening hours:", error);
    }
    return "Không có thông tin";
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRelatedLocationClick = (locationId) => {
    navigate(`/explore/${locationId}`);
  };

  const handleGoogleMapClick = () => {
    if (location.googlePlaceId) {
      // Open Google Maps with place ID
      const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceId}`;
      window.open(googleMapsUrl, "_blank");
    } else if (location.address || location.name) {
      // Fallback to search query if no place ID
      const query = encodeURIComponent(location.address || location.name);
      const googleMapsUrl = `https://www.google.com/maps/search/${query}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="wrapper header-page-container">
          <div className="wrapper-location-detail">
            <div className="wrapper-location-detail__main-section">
              {/* Loading skeleton for image */}
              <div className="wrapper-location-detail__image">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ borderRadius: "12px" }}
                />
              </div>

              {/* Loading skeleton for info section */}
              <div className="wrapper-location-detail__info-section">
                <div className="wrapper-location-detail__title-section">
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={24}
                    animation="wave"
                    sx={{ borderRadius: "12px", mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={32}
                    animation="wave"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={20}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    animation="wave"
                  />
                </div>

                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  animation="wave"
                  sx={{ borderRadius: "12px" }}
                />
              </div>
            </div>

            {/* Loading skeleton for content section */}
            <div className="wrapper-location-detail__content">
              <div className="wrapper-location-detail__description">
                <Skeleton
                  variant="text"
                  width={200}
                  height={24}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  animation="wave"
                />
              </div>

              <div className="wrapper-location-detail__related">
                <div className="wrapper-location-detail__related-header">
                  <Skeleton
                    variant="text"
                    width={180}
                    height={24}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    animation="wave"
                  />
                </div>

                <div className="wrapper-location-detail__related-grid">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="wrapper-location-detail__related-card"
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={180}
                        animation="wave"
                      />
                      <div style={{ padding: "16px" }}>
                        <Skeleton
                          variant="text"
                          width="100%"
                          height={20}
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={16}
                          animation="wave"
                        />
                      </div>
                    </div>
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

  if (!location) {
    return (
      <div>
        <Header />
        <div className="wrapper header-page-container">
          <div className="wrapper-location-detail">
            <div className="wrapper-location-detail__container">
              <div className="wrapper-location-detail__error">
                <h2>Không tìm thấy địa điểm</h2>
                <button
                  onClick={handleBackClick}
                  className="wrapper-location-detail__back-btn"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="wrapper header-page-container">
        <div className="wrapper-location-detail">
          <div className="wrapper-location-detail__main-section">
            {/* Main image */}
            <div className="wrapper-location-detail__image">
              <img
                src={
                  location.imageUrl ||
                  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=400&fit=crop"
                }
                alt={location.name}
                className="wrapper-location-detail__main-img"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=400&fit=crop";
                }}
              />
            </div>

            {/* Info section - sẽ ở bên phải image trên desktop */}
            <div className="wrapper-location-detail__info-section">
              {/* Title and topic */}
              <div className="wrapper-location-detail__title-section">
                <div className="wrapper-location-detail__topic">
                  {location.topicName}
                </div>
                <h2 className="wrapper-location-detail__title">
                  {location.name}
                </h2>
              </div>

              {/* Location info */}
              <div className="wrapper-location-detail__info">
                <div className="wrapper-location-detail__info-item">
                  <MapPin
                    size={16}
                    className="wrapper-location-detail__info-icon"
                  />
                  <span>
                    {location.address ||
                      `${location.districtName}, Hồ Chí Minh`}
                  </span>
                </div>

                <div className="wrapper-location-detail__info-item">
                  <Star
                    size={16}
                    className="wrapper-location-detail__info-icon wrapper-location-detail__info-icon--star"
                  />
                  <span>{location.averageRating || 0} đánh giá</span>
                </div>

                <div className="wrapper-location-detail__info-item">
                  <Clock
                    size={16}
                    className="wrapper-location-detail__info-icon"
                  />
                  <span>{parseOpeningHours(location.openingHours)}</span>
                </div>
              </div>

              {/* View on Google Maps button */}
              <button
                className="wrapper-location-detail__maps-btn"
                onClick={handleGoogleMapClick}
              >
                <ExternalLink size={16} />
                <span>Xem trên Google Map</span>
              </button>
            </div>
          </div>

          {/* Content section - full width */}
          <div className="wrapper-location-detail__content">
            {/* Description */}
            <div className="wrapper-location-detail__description">
              <h3>Thông tin địa điểm</h3>
              <p>{location.description}</p>
            </div>

            {/* Related locations */}
            <div className="wrapper-location-detail__related">
              <div className="wrapper-location-detail__related-header">
                <h3>Những Địa Điểm Khác</h3>
                <button
                  className="wrapper-location-detail__view-more"
                  onClick={() => navigate("/explore")}
                >
                  Xem Thêm
                </button>
              </div>

              <div className="wrapper-location-detail__related-grid">
                {relatedLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="wrapper-location-detail__related-card"
                      >
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={120}
                        />
                        <div style={{ padding: "12px" }}>
                          <Skeleton variant="text" width="100%" height={20} />
                          <Skeleton variant="text" width="60%" height={16} />
                        </div>
                      </div>
                    ))
                  : relatedLocations.map((relatedLocation) => (
                      <div
                        key={relatedLocation.id}
                        className="wrapper-location-detail__related-card"
                        onClick={() =>
                          handleRelatedLocationClick(relatedLocation.id)
                        }
                      >
                        <div className="wrapper-location-detail__related-image">
                          <img
                            src={
                              relatedLocation.imageUrl ||
                              "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=200&fit=crop"
                            }
                            alt={relatedLocation.name}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=200&fit=crop";
                            }}
                          />
                        </div>
                        <div className="wrapper-location-detail__related-content">
                          <h4>{relatedLocation.name}</h4>
                          <div className="wrapper-location-detail__related-location">
                            <MapPin size={12} />
                            <span>{relatedLocation.districtName}</span>
                          </div>
                        </div>
                      </div>
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

export default LocationDetail;
