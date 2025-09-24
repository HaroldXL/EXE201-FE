import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search as SearchIcon, MapPin, Star } from "lucide-react";
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

  // Skeleton Card Component
  const SkeletonCard = () => (
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

  const fetchAttractions = async (topicId = null) => {
    try {
      setLoading(true);
      let response;

      if (topicId) {
        // Fetch locations by specific topic
        response = await api.get(`/Location/topic/${topicId}`, {
          params: {
            page: 1,
            pageSize: 6, // Giảm xuống chỉ 6 địa điểm
          },
        });
      } else {
        // Fetch all locations
        response = await api.get("/Location/list", {
          params: {
            page: 1,
            pageSize: 6, // Giảm xuống chỉ 6 địa điểm
          },
        });
      }

      if (response.data) {
        setSearchResults(response.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching attractions:", error);
      setSearchResults([]);
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

  const handleSearch = useCallback(
    (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Filter results based on search query
      let filtered = searchResults;

      if (searchQuery.trim()) {
        filtered = searchResults.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.districtName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filtered;
    },
    [searchQuery, searchResults]
  );

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
    // Fetch topics and initial attractions on component mount
    fetchTopics();
    fetchAttractions(); // Fetch all attractions initially

    // Check for search query in URL parameters
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get("query");

    if (queryParam) {
      setSearchQuery(decodeURIComponent(queryParam));
    }

    // Auto-focus the search input when component mounts
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300); // Small delay to ensure smooth animation

    return () => clearTimeout(timer);
  }, [location.search]);

  // Get filtered results for display
  const filteredResults = handleSearch();

  return (
    <div className="search-page">
      <Header />

      <div className="search-content">
        {/* Search Header */}
        <div className="search-header">
          <form onSubmit={handleSearch} className="search-form">
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
            <h2>Địa Điểm Đề Xuất</h2>
          </div>

          <div className="search-results-list">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
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
                      <span>{result.districtName || result.location}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-no-results">
                <h3>Không tìm thấy địa điểm nào</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Search;
