import React, { useState, useEffect } from "react";
import { Search, Star, MapPin } from "lucide-react";
import { Skeleton } from "@mui/material";
import { Empty } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./Explore.css";

function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("noi-bat");
  const [attractions, setAttractions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_currentPage, setCurrentPage] = useState(1);
  const [_totalCount, setTotalCount] = useState(0);
  const pageSize = 100;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="wrapper-explore__card">
      <div className="wrapper-explore__card-image">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          animation="wave"
          sx={{ borderRadius: "12px 12px 0 0" }}
        />
      </div>
      <div className="wrapper-explore__card-content">
        <div className="wrapper-explore__card-top">
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
          className="wrapper-explore__card-location"
          style={{ marginTop: "8px" }}
        >
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
        </div>
      </div>
    </div>
  );

  // API calls
  const fetchTopics = async () => {
    try {
      const response = await api.get("/Topic/list-active");
      setTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchAttractions = async (topicId = null, page = 1) => {
    try {
      setLoading(true);
      let response;

      if (topicId) {
        // Fetch locations by specific topic
        response = await api.get(`/Location/topic/${topicId}`, {
          params: {
            page: page,
            pageSize: pageSize,
          },
        });
      } else {
        // Fetch all locations for "Nổi Bật" tab
        response = await api.get("/Location/list", {
          params: {
            page: page,
            pageSize: pageSize,
          },
        });
      }

      if (response.data) {
        setAttractions(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.page || 1);
      }
    } catch (error) {
      console.error("Error fetching attractions:", error);
      setAttractions([]);
      // You could add a toast notification here to show user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();

    // Check for topic parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const topicParam = urlParams.get("topic");

    if (topicParam) {
      // If topic parameter exists, we need to wait for topics to load first
      // The tab setting will be handled in the second useEffect
      fetchAttractions(parseInt(topicParam), 1);
    } else {
      fetchAttractions();
    }
  }, [location.search]);

  // Handle URL topic parameter after topics are loaded
  useEffect(() => {
    if (topics.length > 0) {
      const urlParams = new URLSearchParams(location.search);
      const topicParam = urlParams.get("topic");

      if (topicParam) {
        const topicId = parseInt(topicParam);
        const matchingTopic = topics.find((topic) => topic.id === topicId);

        if (matchingTopic) {
          const tabId = matchingTopic.name.toLowerCase().replace(/\s+/g, "-");
          setActiveTab(tabId);
        }
      }
    }
  }, [topics, location.search]);

  // Update tabs based on API topics
  const tabs = [
    { id: "noi-bat", label: "Nổi Bật", topicId: null },
    ...topics.map((topic) => ({
      id: topic.name.toLowerCase().replace(/\s+/g, "-"),
      label: topic.name,
      topicId: topic.id, // Use topic.id as topicId
    })),
  ];

  // Handle tab change and fetch attractions for selected topic
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const selectedTab = tabs.find((tab) => tab.id === tabId);
    if (selectedTab) {
      fetchAttractions(selectedTab.topicId, 1);
    }
  };

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch = attraction.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch; // No need to filter by tab since API already filters by topic
  });

  return (
    <div>
      <Header />
      <div className="wrapper">
        <div className="wrapper-explore">
          {/* Header Section */}
          <div className="wrapper-explore__header">
            <h1 className="wrapper-explore__title">Khám Phá</h1>
          </div>

          {/* Search Section */}
          <div className="wrapper-explore__search">
            <div className="wrapper-explore__search-wrapper">
              <Search size={20} className="wrapper-explore__search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm điểm đến hoặc địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="wrapper-explore__search-input"
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="wrapper-explore__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`wrapper-explore__tab ${
                  activeTab === tab.id ? "wrapper-explore__tab--active" : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Attractions Grid */}
          <div className="wrapper-explore__grid">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction, index) => (
                <div
                  key={attraction.id}
                  className="wrapper-explore__card wrapper-explore__card--fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/explore/${attraction.id}`)}
                >
                  <div className="wrapper-explore__card-image">
                    <img
                      src={
                        attraction.imageUrl ||
                        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
                      }
                      alt={attraction.name}
                      className="wrapper-explore__card-img"
                      onLoad={(e) => {
                        e.target.style.opacity = "1";
                      }}
                      onError={(e) => {
                        e.target.style.opacity = "1";
                      }}
                    />
                  </div>
                  <div className="wrapper-explore__card-content">
                    <div className="wrapper-explore__card-top">
                      <div className="wrapper-explore__card-category">
                        {attraction.topicName || "Địa điểm"}
                      </div>
                      <div className="wrapper-explore__card-rating">
                        <Star
                          size={16}
                          className="wrapper-explore__card-star"
                        />
                        <span className="wrapper-explore__card-rating-text">
                          {attraction.averageRating || 0}
                        </span>
                      </div>
                    </div>
                    <h3 className="wrapper-explore__card-title">
                      {attraction.name}
                    </h3>
                    <div className="wrapper-explore__card-location">
                      <MapPin
                        size={14}
                        className="wrapper-explore__card-location-icon"
                      />
                      <span className="wrapper-explore__card-location-text">
                        {attraction.districtName}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="wrapper-explore__no-results">
                <Empty
                  description="Không tìm thấy địa điểm nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Explore;
