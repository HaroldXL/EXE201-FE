import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Menu,
  Image as ImageIcon,
  Star,
  Edit,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  Navigation,
  X,
} from "lucide-react";
import { Select, Modal, message } from "antd";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import api from "../../../config/axios";
import "./LocationManagement.css";

const { Option } = Select;

function LocationManagement() {
  const [activeMenu, setActiveMenu] = useState("locations");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // View Detail Modal State
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/Location/admin/list", {
          params: {
            page: pagination.page,
            pageSize: pagination.pageSize,
          },
        });
        setLocations(response.data.items || []);
        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.totalCount || 0,
        }));
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [pagination.page, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle view location detail
  const handleViewLocation = async (locationId) => {
    try {
      setLoadingDetail(true);
      setViewModalVisible(true);
      const response = await api.get(`/Location/admin/${locationId}`);
      setSelectedLocation(response.data);
    } catch (error) {
      console.error("Error fetching location detail:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Không thể tải thông tin chi tiết địa điểm. Vui lòng thử lại sau.",
        centered: true,
      });
      setViewModalVisible(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedLocation(null);
  };

  // Filter locations based on search and status
  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.topicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.districtName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || location.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "admin-locations__badge--active",
      inactive: "admin-locations__badge--inactive",
    };
    return (
      statusColors[status?.toLowerCase()] || "admin-locations__badge--active"
    );
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  // Get unique topics for stats
  const uniqueTopics = [...new Set(locations.map((loc) => loc.topicName))];
  const activeCount = locations.filter((loc) => loc.status === "active").length;

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="admin-dashboard__main">
        {/* Mobile Menu Toggle */}
        <button
          className="admin-dashboard__menu-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Header */}
        <div className="admin-locations__header">
          <div className="admin-locations__header-content">
            <div className="admin-locations__header-icon">
              <MapPin size={32} />
            </div>
            <div>
              <h1>Quản lý địa điểm</h1>
              <p>Tổng số {pagination.totalCount} địa điểm</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-locations__stats">
          <div className="admin-locations__stat-card">
            <div className="admin-locations__stat-icon admin-locations__stat-icon--total">
              <MapPin size={24} />
            </div>
            <div className="admin-locations__stat-content">
              <h3>Tổng địa điểm</h3>
              <p>{pagination.totalCount}</p>
            </div>
          </div>

          <div className="admin-locations__stat-card">
            <div className="admin-locations__stat-icon admin-locations__stat-icon--active">
              <Star size={24} />
            </div>
            <div className="admin-locations__stat-content">
              <h3>Đang hoạt động</h3>
              <p>{activeCount}</p>
            </div>
          </div>

          <div className="admin-locations__stat-card">
            <div className="admin-locations__stat-icon admin-locations__stat-icon--topics">
              <ImageIcon size={24} />
            </div>
            <div className="admin-locations__stat-content">
              <h3>Chủ đề</h3>
              <p>{uniqueTopics.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="admin-locations__filters">
          <div className="admin-locations__search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, chủ đề hoặc quận..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            className="admin-locations__status-filter"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
        </div>

        {/* Locations Table */}
        <div className="admin-locations__table-container">
          <div className="admin-locations__table-header">
            <h2>Danh sách địa điểm</h2>
          </div>

          {loading ? (
            <div className="admin-locations__loading">Đang tải dữ liệu...</div>
          ) : locations.length > 0 ? (
            <>
              <div className="admin-locations__table-wrapper">
                <table className="admin-locations__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Hình ảnh</th>
                      <th>Tên địa điểm</th>
                      <th>Chủ đề</th>
                      <th>Quận</th>
                      <th>Đánh giá TB</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocations.map((location) => (
                      <tr key={location.id}>
                        <td>
                          <span className="admin-locations__id">
                            #{location.id}
                          </span>
                        </td>
                        <td>
                          <div className="admin-locations__image-wrapper">
                            <img
                              src={location.imageUrl}
                              alt={location.name}
                              className="admin-locations__image"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80x80?text=No+Image";
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="admin-locations__name">
                            {location.name}
                          </div>
                        </td>
                        <td>
                          <span className="admin-locations__topic">
                            {location.topicName}
                          </span>
                        </td>
                        <td>
                          <span className="admin-locations__district">
                            {location.districtName}
                          </span>
                        </td>
                        <td>
                          <div className="admin-locations__rating">
                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                            <span>
                              {location.averageRating.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`admin-locations__badge ${getStatusBadge(
                              location.status
                            )}`}
                          >
                            {location.status === "active"
                              ? "Hoạt động"
                              : "Ngừng hoạt động"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-locations__actions">
                            <button
                              className="admin-locations__action-btn admin-locations__action-btn--view"
                              title="Xem chi tiết"
                              onClick={() => handleViewLocation(location.id)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="admin-locations__action-btn admin-locations__action-btn--edit"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results Info */}
              {searchTerm || statusFilter !== "all" ? (
                <div className="admin-locations__filter-results">
                  Tìm thấy {filteredLocations.length} kết quả
                  {searchTerm && ` cho "${searchTerm}"`}
                  {statusFilter !== "all" &&
                    ` - ${
                      statusFilter === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"
                    }`}
                </div>
              ) : null}

              {/* Pagination */}
              <div className="admin-locations__pagination">
                <button
                  className="admin-locations__pagination-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trước
                </button>

                <div className="admin-locations__pagination-pages">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= pagination.page - 1 &&
                        pageNumber <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          className={`admin-locations__pagination-page ${
                            pagination.page === pageNumber
                              ? "admin-locations__pagination-page--active"
                              : ""
                          }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === pagination.page - 2 ||
                      pageNumber === pagination.page + 2
                    ) {
                      return <span key={pageNumber}>...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  className="admin-locations__pagination-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                >
                  Sau
                </button>
              </div>

              <div className="admin-locations__pagination-info">
                Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalCount
                )}{" "}
                trong tổng số {pagination.totalCount} địa điểm
              </div>
            </>
          ) : (
            <div className="admin-locations__empty">Không có dữ liệu</div>
          )}
        </div>

        {/* View Location Detail Modal */}
        <Modal
          title={null}
          open={viewModalVisible}
          onCancel={handleCloseViewModal}
          footer={null}
          width={800}
          centered
          closeIcon={<X size={20} />}
        >
          {loadingDetail ? (
            <div className="admin-locations__modal-loading">
              Đang tải thông tin...
            </div>
          ) : selectedLocation ? (
            <div className="admin-locations__detail-modal">
              {/* Header */}
              <div className="admin-locations__detail-header">
                <div className="admin-locations__detail-title-section">
                  <h2>{selectedLocation.name}</h2>
                  <span
                    className={`admin-locations__badge ${getStatusBadge(
                      selectedLocation.status
                    )}`}
                  >
                    {selectedLocation.status === "active"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </div>
                <div className="admin-locations__detail-topic">
                  <span className="admin-locations__topic">
                    {selectedLocation.topicName}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="admin-locations__detail-image-wrapper">
                <img
                  src={selectedLocation.imageUrl}
                  alt={selectedLocation.name}
                  className="admin-locations__detail-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
              </div>

              {/* Info Grid */}
              <div className="admin-locations__detail-grid">
                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <MapPin size={16} />
                    <span>Địa chỉ</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    {selectedLocation.address}
                  </div>
                </div>

                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <Navigation size={16} />
                    <span>Quận</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    {selectedLocation.districtName}
                  </div>
                </div>

                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <Star size={16} />
                    <span>Đánh giá trung bình</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    <div className="admin-locations__rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>
                        {selectedLocation.averageRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <Clock size={16} />
                    <span>Thời gian gợi ý</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    {selectedLocation.suggestedDuration} phút
                  </div>
                </div>

                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <DollarSign size={16} />
                    <span>Chi phí gợi ý</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedLocation.suggestedPrice)}
                  </div>
                </div>

                <div className="admin-locations__detail-item">
                  <div className="admin-locations__detail-label">
                    <Calendar size={16} />
                    <span>Ngày tạo</span>
                  </div>
                  <div className="admin-locations__detail-value">
                    {new Date(selectedLocation.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="admin-locations__detail-coordinates">
                <div className="admin-locations__detail-label">
                  <Navigation size={16} />
                  <span>Tọa độ</span>
                </div>
                <div className="admin-locations__detail-value">
                  Lat: {selectedLocation.latitude}, Long:{" "}
                  {selectedLocation.longitude}
                </div>
              </div>

              {/* Description */}
              <div className="admin-locations__detail-description">
                <h3>Mô tả</h3>
                <p>{selectedLocation.description}</p>
              </div>

              {/* Google Place ID */}
              <div className="admin-locations__detail-footer">
                <span className="admin-locations__detail-place-id">
                  Google Place ID: {selectedLocation.googlePlaceId}
                </span>
              </div>
            </div>
          ) : null}
        </Modal>
      </main>
    </div>
  );
}

export default LocationManagement;
