import React, { useState, useEffect } from "react";
import { Search, Star, MapPin } from "lucide-react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import api from "../../config/axios";
import "./Explore.css";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("noi-bat");
  const [attractions, setAttractions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_currentPage, setCurrentPage] = useState(1);
  const [_totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // API calls
  const fetchTopics = async () => {
    try {
      const response = await api.get("/Topic/list-active");
      setTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchAttractions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/Location/list", {
        params: {
          page: page,
          pageSize: pageSize,
        },
      });

      if (response.data) {
        setAttractions(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.page || 1);
      }
    } catch (error) {
      console.error("Error fetching attractions:", error);
      setAttractions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchAttractions();
  }, []);

  // Update tabs based on API topics
  const tabs = [
    { id: "noi-bat", label: "Nổi Bật" },
    ...topics.map((topic) => ({
      id: topic.name.toLowerCase().replace(/\s+/g, "-"),
      label: topic.name,
    })),
  ];

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch = attraction.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "noi-bat" ||
      attraction.topicName === tabs.find((tab) => tab.id === activeTab)?.label;
    return matchesSearch && matchesTab;
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
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Attractions Grid */}
          <div className="wrapper-explore__grid">
            {loading ? (
              <div className="wrapper-explore__loading">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <div
                  key={attraction.locationId}
                  className="wrapper-explore__card"
                >
                  <div className="wrapper-explore__card-image">
                    <img
                      src={
                        attraction.imageUrl ||
                        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
                      }
                      alt={attraction.name}
                      className="wrapper-explore__card-img"
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
                          {attraction.averageRating || 0} (
                          {attraction.reviewCount || 0})
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
                <p>Không tìm thấy địa điểm nào</p>
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
