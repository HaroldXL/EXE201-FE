import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  Star,
  MapPin,
  TrendingUp,
  Clock,
  TreePine,
  PartyPopper,
} from "lucide-react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./Explore.css";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("noi-bat");

  const tabs = [
    { id: "noi-bat", label: "Nổi Bật", icon: TrendingUp },
    { id: "lich-su", label: "Lịch Sử", icon: Clock },
    { id: "thien-nhien", label: "Thiên Nhiên", icon: TreePine },
    { id: "giai-tri", label: "Giải Trí", icon: PartyPopper },
  ];

  const attractions = [
    {
      id: 1,
      title: "Dinh Độc Lập",
      location: "Bến Thành, Quận 1, Hồ Chí Minh",
      category: "Lịch Sử",
      rating: 4.2,
      reviews: 550,
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Nhà Thờ Đức Bà Sài Gòn",
      location: "Bến Nghé, Quận 1, Hồ Chí Minh",
      category: "Lịch Sử",
      rating: 4.2,
      reviews: 550,
      image:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Phố Đi Bộ Nguyễn Huệ",
      location: "Bến Nghé, Quận 1, Hồ Chí Minh",
      category: "Giải Trí",
      rating: 4.2,
      reviews: 550,
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Chợ Bến Thành",
      location: "Bến Thành, Quận 1, Hồ Chí Minh",
      category: "Nổi Bật",
      rating: 4.0,
      reviews: 423,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Công Viên Tao Đàn",
      location: "Quận 1, Hồ Chí Minh",
      category: "Thiên Nhiên",
      rating: 4.1,
      reviews: 287,
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Landmark 81",
      location: "Bình Thạnh, Hồ Chí Minh",
      category: "Giải Trí",
      rating: 4.5,
      reviews: 892,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
  ];

  const filteredAttractions =
    activeTab === "noi-bat"
      ? attractions
      : attractions.filter(
          (attraction) =>
            attraction.category.toLowerCase() ===
            tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()
        );

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
                <tab.icon size={16} className="wrapper-explore__tab-icon" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Attractions Grid */}
          <div className="wrapper-explore__grid">
            {filteredAttractions.map((attraction) => (
              <div key={attraction.id} className="wrapper-explore__card">
                <div className="wrapper-explore__card-image">
                  <img
                    src={attraction.image}
                    alt={attraction.title}
                    className="wrapper-explore__card-img"
                  />
                </div>
                <div className="wrapper-explore__card-content">
                  <div className="wrapper-explore__card-top">
                    <div className="wrapper-explore__card-category">
                      {attraction.category}
                    </div>
                    <div className="wrapper-explore__card-rating">
                      <Star size={16} className="wrapper-explore__card-star" />
                      <span className="wrapper-explore__card-rating-text">
                        {attraction.rating} ({attraction.reviews})
                      </span>
                    </div>
                  </div>
                  <h3 className="wrapper-explore__card-title">
                    {attraction.title}
                  </h3>
                  <div className="wrapper-explore__card-location">
                    <MapPin
                      size={14}
                      className="wrapper-explore__card-location-icon"
                    />
                    <span className="wrapper-explore__card-location-text">
                      {attraction.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Explore;
