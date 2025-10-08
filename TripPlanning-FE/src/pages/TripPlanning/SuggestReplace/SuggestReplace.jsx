import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  ArrowLeft,
  ChevronRight,
  MapPinCheck,
} from "lucide-react";
import { Skeleton, Pagination } from "@mui/material";
import { Empty, Modal, message } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./SuggestReplace.css";

function SuggestReplace() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itineraryId, orderIndex } = useParams();
  const [allAttractions, setAllAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState("tat-ca");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [replacing, setReplacing] = useState(false);
  const pageSize = 9;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="suggest-replace__card">
      <div className="suggest-replace__card-image">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          animation="wave"
          sx={{ borderRadius: "12px 12px 0 0" }}
        />
      </div>
      <div className="suggest-replace__card-content">
        <div className="suggest-replace__card-top">
          <Skeleton variant="text" width={80} height={24} animation="wave" />
          <Skeleton variant="text" width={60} height={20} animation="wave" />
        </div>
        <Skeleton
          variant="text"
          width="90%"
          height={28}
          animation="wave"
          sx={{ mt: 1 }}
        />
        <div
          className="suggest-replace__card-location"
          style={{ marginTop: "8px" }}
        >
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
        </div>
      </div>
    </div>
  );

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      const response = await api.get("/Topic/list-active");
      setTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  // Handle replace location with confirmation
  const handleReplaceLocation = (attraction) => {
    Modal.confirm({
      title: "Xác nhận thay đổi địa điểm",
      content: (
        <div>
          <p style={{ fontSize: "15px", marginBottom: "8px" }}>
            Bạn có chắc chắn muốn thay đổi địa điểm thành:
          </p>
          <p
            style={{
              fontWeight: "600",
              color: "#3b82f6",
              marginTop: "8px",
              fontSize: "16px",
            }}
          >
            {attraction.name}
          </p>
        </div>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          setReplacing(true);

          const requestBody = {
            itineraryId: parseInt(itineraryId),
            orderIndex: parseInt(orderIndex),
            newLocationId: attraction.id,
          };

          console.log("Replacing location with:", requestBody);

          const response = await api.post(
            "/Itinerary/replace-location",
            requestBody
          );

          message.success("Thay đổi địa điểm thành công!");

          // Navigate back to trip detail page
          navigate(`/trip-planning/${itineraryId}`);
        } catch (error) {
          console.error("Error replacing location:", error);
          message.error(
            error.response?.data?.message ||
              "Không thể thay đổi địa điểm. Vui lòng thử lại."
          );
        } finally {
          setReplacing(false);
        }
      },
    });
  };

  useEffect(() => {
    // Fetch topics first
    fetchTopics();

    // Get data from navigation state
    if (location.state) {
      const { suggestions } = location.state;
      setAllAttractions(suggestions || []);
      setFilteredAttractions(suggestions || []);
      setTotalCount(suggestions?.length || 0);
      setLoading(false);
    } else {
      // If no data, redirect back to trip detail
      navigate(`/trip-planning/${itineraryId}`);
    }
  }, [location.state, navigate, itineraryId]);

  // Create tabs from topics
  const tabs = [
    { id: "tat-ca", label: "Tất Cả", topicName: null },
    ...topics.map((topic) => ({
      id: topic.name.toLowerCase().replace(/\s+/g, "-"),
      label: topic.name,
      topicName: topic.name,
    })),
  ];

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);

    const selectedTab = tabs.find((tab) => tab.id === tabId);
    if (selectedTab && selectedTab.topicName) {
      // Filter by topic
      const filtered = allAttractions.filter(
        (attraction) => attraction.topicName === selectedTab.topicName
      );
      setFilteredAttractions(filtered);
      setTotalCount(filtered.length);
    } else {
      // Show all
      setFilteredAttractions(allAttractions);
      setTotalCount(allAttractions.length);
    }
  };

  // Handle pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAttractions = filteredAttractions.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <Header />
      <div className="wrapper">
        <div className="suggest-replace">
          {/* Header Section */}
          <div className="suggest-replace__header">
            <button
              className="suggest-replace__back-btn"
              onClick={() => navigate(`/trip-planning/${itineraryId}`)}
            >
              <ArrowLeft size={20} />
              <span>Quay lại</span>
            </button>
            <h1 className="suggest-replace__title">
              Đề Xuất Địa Điểm Thay Thế
            </h1>
          </div>

          {/* Tabs Section */}
          <div className="suggest-replace__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`suggest-replace__tab ${
                  activeTab === tab.id ? "suggest-replace__tab--active" : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Attractions Grid */}
          <div className="suggest-replace__grid">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : currentAttractions.length > 0 ? (
              currentAttractions.map((attraction, index) => (
                <div
                  key={attraction.id}
                  className="suggest-replace__card suggest-replace__card--fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="suggest-replace__card-image">
                    <img
                      src={
                        attraction.imageUrl ||
                        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
                      }
                      alt={attraction.name}
                      className="suggest-replace__card-img"
                      onLoad={(e) => {
                        e.target.style.opacity = "1";
                      }}
                      onError={(e) => {
                        e.target.style.opacity = "1";
                      }}
                    />
                  </div>
                  <div className="suggest-replace__card-content">
                    <div className="suggest-replace__card-top">
                      <div className="suggest-replace__card-category">
                        {attraction.topicName || "Địa điểm"}
                      </div>
                      <div className="suggest-replace__card-rating">
                        <Star
                          size={16}
                          className="suggest-replace__card-star"
                        />
                        <span className="suggest-replace__card-rating-text">
                          {attraction.averageRating || 0}
                        </span>
                      </div>
                    </div>
                    <h3 className="suggest-replace__card-title">
                      {attraction.name}
                    </h3>
                    <div className="suggest-replace__card-location">
                      <MapPin
                        size={14}
                        className="suggest-replace__card-location-icon"
                      />
                      <span className="suggest-replace__card-location-text">
                        {attraction.districtName}
                      </span>
                    </div>
                    <div className="suggest-replace__card-actions">
                      <button
                        className="suggest-replace__view-detail-btn"
                        onClick={() => navigate(`/explore/${attraction.id}`)}
                      >
                        <ChevronRight size={14} />
                        Xem chi tiết
                      </button>
                      <button
                        className="suggest-replace__select-btn"
                        onClick={() => handleReplaceLocation(attraction)}
                        disabled={replacing}
                      >
                        <MapPinCheck size={14} />
                        {replacing ? "Đang thay đổi..." : "Chọn thay thế"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="suggest-replace__no-results">
                <Empty
                  description="Không có địa điểm đề xuất nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading &&
            currentAttractions.length > 0 &&
            totalCount > pageSize && (
              <div className="suggest-replace__pagination">
                <Pagination
                  count={Math.ceil(totalCount / pageSize)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    "& .MuiPaginationItem-root": {
                      color: "#3b82f6",
                      fontWeight: 500,
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#3b82f6",
                      color: "white",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      backgroundColor: "#eff6ff",
                    },
                  }}
                />
              </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SuggestReplace;
