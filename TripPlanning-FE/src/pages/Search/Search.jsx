import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, MapPin, Star } from "lucide-react";
import { Pagination } from "@mui/material";
import { Empty } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import api from "../../config/axios";
import "./Search.css";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="search-card">
      <div className="search-card-image">
        <div className="search-skeleton-image"></div>
      </div>
      <div className="search-card-content">
        <div className="search-card-top">
          <div className="search-skeleton-category"></div>
          <div className="search-skeleton-rating"></div>
        </div>
        <div className="search-skeleton-title"></div>
        <div className="search-skeleton-location"></div>
      </div>
    </div>
  );

  // Skeleton List Item Component
  const SkeletonListItem = () => (
    <div className="search-skeleton-card">
      <div className="search-skeleton-info">
        <div className="search-skeleton-title"></div>
        <div className="search-skeleton-location"></div>
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
            pageSize: 6, // Chỉ lấy 6 địa điểm cho đề xuất
          },
        });
      } else {
        // Fetch all locations - chỉ lấy vài địa điểm
        response = await api.get("/Location/list", {
          params: {
            page: 1,
            pageSize: 6, // Chỉ lấy 6 địa điểm cho đề xuất
          },
        });
      }

      if (response.data) {
        setSearchResults(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.page || page);
      }
    } catch (error) {
      console.error("Error fetching attractions:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchAttractions = async (query, page = 1) => {
    try {
      setLoading(true);
      const encodedQuery = encodeURIComponent(query);
      const response = await api.get(
        `/Location/search?name=${encodedQuery}&page=${page}&pageSize=${pageSize}`
      );

      if (response.data) {
        setSearchResults(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.page || page);
      }
    } catch (error) {
      console.error("Error searching attractions:", error);
      setSearchResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Create categories from API topics - chỉ lấy 4 categories đầu tiên
  const categories = [
    { id: "all", name: "Tất Cả", icon: Star, topicId: null },
    ...topics.slice(0, 3).map((topic) => ({
      id: topic.id.toString(),
      name: topic.name,
      icon: MapPin, // You can map different icons based on topic name if needed
      topicId: topic.id,
    })),
  ];

  // Handle search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAttractions(searchQuery.trim(), 1);
        setSelectedCategory("");
      } else {
        fetchAttractions(null, 1);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);

    // Navigate to Explore page with topic parameter
    const selectedCategoryData = categories.find(
      (cat) => cat.id === categoryId
    );

    if (selectedCategoryData) {
      if (selectedCategoryData.topicId) {
        // Navigate to Explore with specific topic
        navigate(`/explore?topic=${selectedCategoryData.topicId}`);
      } else {
        // Navigate to Explore without topic (show all)
        navigate("/explore");
      }
    }
  };

  const handleLocationClick = (locationId) => {
    // Navigate to LocationDetail page
    navigate(`/explore/${locationId}`);
  };

  useEffect(() => {
    // Fetch topics on component mount
    fetchTopics();

    // Check for search query in URL parameters
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get("query");

    if (queryParam) {
      setSearchQuery(decodeURIComponent(queryParam));
    } else {
      // Load initial attractions if no query
      fetchAttractions(null, 1);
    }

    // Auto-focus the search input when component mounts
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="search-page">
      <Header />

      <div className="search-content">
        {/* Search Header */}
        <div className="search-header">
          <form onSubmit={(e) => e.preventDefault()} className="search-form">
            <div className="search-input-container">
              <SearchIcon className="search-input-icon" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm điểm đến hoặc địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`category-filter-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
              >
                <IconComponent size={18} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Results */}
        <div className="search-results">
          <div className="search-results-header">
            <h2>
              {searchQuery.trim()
                ? `Kết quả tìm kiếm cho "${searchQuery}"`
                : "Địa Điểm Đề Xuất"}
            </h2>
            {!loading && searchResults.length > 0 && searchQuery.trim() && (
              <span className="search-results-count">
                ({totalCount} địa điểm)
              </span>
            )}
          </div>

          {/* Conditional rendering: Grid for search results, List for suggestions */}
          {searchQuery.trim() ? (
            // Grid layout for search results
            <div className="search-results-grid">
              {loading ? (
                // Show skeleton cards while loading
                Array.from({ length: 9 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="search-card search-card--fade-in"
                    style={{
                      cursor: "pointer",
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleLocationClick(result.id)}
                  >
                    <div className="search-card-image">
                      <img
                        src={
                          result.imageUrl ||
                          "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
                        }
                        alt={result.name}
                        className="search-card-img"
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop";
                          e.target.style.opacity = "1";
                        }}
                      />
                    </div>
                    <div className="search-card-content">
                      <div className="search-card-top">
                        <div className="search-card-category">
                          {result.topicName || "Địa điểm"}
                        </div>
                        <div className="search-card-rating">
                          <Star size={16} className="search-card-star" />
                          <span className="search-card-rating-text">
                            {result.averageRating || 0}
                          </span>
                        </div>
                      </div>
                      <h3 className="search-card-title">{result.name}</h3>
                      <div className="search-card-location">
                        <MapPin
                          size={14}
                          className="search-card-location-icon"
                        />
                        <span className="search-card-location-text">
                          {result.districtName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">
                  <Empty
                    description={`Không tìm thấy kết quả cho "${searchQuery}"`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </div>
          ) : (
            // List layout for suggestions (default)
            <div className="search-results-list">
              {loading ? (
                // Show skeleton list items while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonListItem key={index} />
                ))
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="search-result-item search-result-item--fade-in"
                    style={{
                      cursor: "pointer",
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleLocationClick(result.id)}
                  >
                    <div className="search-result-info">
                      <h3 className="search-result-name">{result.name}</h3>
                      <div className="search-result-location">
                        <MapPin size={14} />
                        <span>{result.districtName}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">
                  <Empty
                    description="Không có địa điểm nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </div>
          )}

          {/* Pagination - Chỉ hiển thị khi đang search và có nhiều kết quả */}
          {!loading &&
            searchResults.length > 0 &&
            searchQuery.trim() &&
            totalCount > pageSize && (
              <div className="search-pagination">
                <Pagination
                  count={Math.ceil(totalCount / pageSize)}
                  page={currentPage}
                  onChange={(event, newPage) => {
                    setCurrentPage(newPage);
                    if (searchQuery.trim()) {
                      searchAttractions(searchQuery.trim(), newPage);
                    } else {
                      fetchAttractions(null, newPage);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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

export default Search;
