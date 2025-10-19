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
  Plus,
} from "lucide-react";
import { Select, Modal, message, Spin } from "antd";
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
  const [topicFilter, setTopicFilter] = useState("all");
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // View Detail Modal State
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    description: "",
    imageUrl: "",
    openingHours: "",
    suggestedDuration: 0,
    suggestedPrice: 0,
    status: "",
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Add Location Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addFormData, setAddFormData] = useState({
    topicId: 0,
    description: "",
    googlePlaceId: "",
    districtId: 0,
    suggestedDuration: 0,
    suggestedPrice: 0,
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Fetch topics list
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("/Topic/list-active");
        setTopics(response.data || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
      }
    };

    fetchTopics();
  }, []);

  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);

        let endpoint;
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
        };

        // Determine which API to use based on filters
        if (topicFilter !== "all") {
          // Use topic filter API
          endpoint = `/Location/topic/${topicFilter}`;
        } else if (searchTerm) {
          // Use search API
          endpoint = "/Location/search";
          params.name = searchTerm;
        } else {
          // Use list all API
          endpoint = "/Location/admin/list";
        }

        const response = await api.get(endpoint, { params });
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
  }, [pagination.page, pagination.pageSize, searchTerm, topicFilter]);

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

  // Handle edit location
  const handleEditLocation = async (locationId) => {
    try {
      setLoadingDetail(true);
      const response = await api.get(`/Location/admin/${locationId}`);
      const locationData = response.data;

      setEditFormData({
        description: locationData.description || "",
        imageUrl: locationData.imageUrl || "",
        openingHours: locationData.openingHours || "",
        suggestedDuration: locationData.suggestedDuration || 0,
        suggestedPrice: locationData.suggestedPrice || 0,
        status: locationData.status || "",
      });
      setSelectedLocation(locationData);
      setEditModalVisible(true);
    } catch (error) {
      console.error("Error fetching location for edit:", error);
      message.error("Không thể tải thông tin địa điểm. Vui lòng thử lại sau.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedLocation(null);
    setEditFormData({
      description: "",
      imageUrl: "",
      openingHours: "",
      suggestedDuration: 0,
      suggestedPrice: 0,
      status: "",
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedLocation) return;

    try {
      setSubmittingEdit(true);
      await api.patch(`/Location/admin/${selectedLocation.id}`, editFormData);

      message.success("Cập nhật địa điểm thành công!");
      handleCloseEditModal();

      // Refresh locations list
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
      console.error("Error updating location:", error);
      message.error("Cập nhật địa điểm thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle add location
  const handleOpenAddModal = () => {
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setAddFormData({
      topicId: 0,
      description: "",
      googlePlaceId: "",
      districtId: 0,
      suggestedDuration: 0,
      suggestedPrice: 0,
    });
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitAdd = async () => {
    // Validate required fields
    if (
      !addFormData.topicId ||
      !addFormData.googlePlaceId ||
      !addFormData.districtId
    ) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setSubmittingAdd(true);
      await api.post("/Location/add", addFormData);

      message.success("Thêm địa điểm thành công!");
      handleCloseAddModal();

      // Refresh locations list
      const response = await api.get("/Location/admin/list", {
        params: {
          page: 1,
          pageSize: pagination.pageSize,
        },
      });
      setLocations(response.data.items || []);
      setPagination((prev) => ({
        ...prev,
        page: 1,
        totalCount: response.data.totalCount || 0,
      }));
    } catch (error) {
      console.error("Error adding location:", error);
      message.error("Thêm địa điểm thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Filter locations based on status only (search is now handled by API)
  const filteredLocations = locations.filter((location) => {
    const matchesStatus =
      statusFilter === "all" || location.status?.toLowerCase() === statusFilter;

    return matchesStatus;
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
              placeholder="Tìm kiếm theo tên địa điểm..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            className="admin-locations__topic-filter"
            value={topicFilter}
            onChange={(value) => {
              setTopicFilter(value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
            placeholder="Lọc theo chủ đề"
          >
            <Option value="all">Tất cả chủ đề</Option>
            {topics.map((topic) => (
              <Option key={topic.id} value={topic.id}>
                {topic.name}
              </Option>
            ))}
          </Select>

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
            <button
              className="admin-locations__add-btn"
              onClick={handleOpenAddModal}
            >
              <Plus size={20} />
              <span>Thêm địa điểm</span>
            </button>
          </div>

          {loading ? (
            <div className="admin-locations__loading">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
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
                              onClick={() => handleEditLocation(location.id)}
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
              {searchTerm || statusFilter !== "all" || topicFilter !== "all" ? (
                <div className="admin-locations__filter-results">
                  Tìm thấy {filteredLocations.length} kết quả
                  {searchTerm && ` cho "${searchTerm}"`}
                  {topicFilter !== "all" &&
                    ` - Chủ đề: ${
                      topics.find((t) => t.id === parseInt(topicFilter))
                        ?.name || ""
                    }`}
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
              <Spin size="large" tip="Đang tải thông tin..." />
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

        {/* Edit Location Modal */}
        <Modal
          title="Chỉnh sửa địa điểm"
          open={editModalVisible}
          onCancel={handleCloseEditModal}
          onOk={handleSubmitEdit}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          width={700}
          centered
          confirmLoading={submittingEdit}
        >
          {loadingDetail ? (
            <div className="admin-locations__modal-loading">
              <Spin size="large" tip="Đang tải thông tin..." />
            </div>
          ) : selectedLocation ? (
            <div className="admin-locations__edit-modal">
              {/* Location Info Header */}
              <div className="admin-locations__edit-header">
                <h3>{selectedLocation.name}</h3>
                <span className="admin-locations__topic">
                  {selectedLocation.topicName}
                </span>
              </div>

              {/* Edit Form */}
              <div className="admin-locations__edit-form">
                <div className="admin-locations__form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      handleEditFormChange("description", e.target.value)
                    }
                    rows={6}
                    placeholder="Nhập mô tả địa điểm..."
                  />
                </div>

                <div className="admin-locations__form-group">
                  <label>URL hình ảnh</label>
                  <input
                    type="text"
                    value={editFormData.imageUrl}
                    onChange={(e) =>
                      handleEditFormChange("imageUrl", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="admin-locations__form-group">
                  <label>Giờ mở cửa</label>
                  <input
                    type="text"
                    value={editFormData.openingHours}
                    onChange={(e) =>
                      handleEditFormChange("openingHours", e.target.value)
                    }
                    placeholder="Ví dụ: 08:00 - 22:00"
                  />
                </div>

                <div className="admin-locations__form-row">
                  <div className="admin-locations__form-group">
                    <label>Thời gian gợi ý (phút)</label>
                    <input
                      type="number"
                      value={editFormData.suggestedDuration}
                      onChange={(e) =>
                        handleEditFormChange(
                          "suggestedDuration",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      placeholder="120"
                    />
                  </div>

                  <div className="admin-locations__form-group">
                    <label>Chi phí gợi ý (VND)</label>
                    <input
                      type="text"
                      value={new Intl.NumberFormat("vi-VN").format(
                        editFormData.suggestedPrice
                      )}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleEditFormChange(
                          "suggestedPrice",
                          parseInt(value) || 0
                        );
                      }}
                      placeholder="180.000"
                    />
                  </div>
                </div>

                <div className="admin-locations__form-group">
                  <label>Trạng thái</label>
                  <Select
                    className="admin-locations__edit-select"
                    value={editFormData.status}
                    onChange={(value) => handleEditFormChange("status", value)}
                    style={{ width: "100%" }}
                  >
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Ngừng hoạt động</Option>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
        </Modal>

        {/* Add Location Modal */}
        <Modal
          title="Thêm địa điểm mới"
          open={addModalVisible}
          onCancel={handleCloseAddModal}
          onOk={handleSubmitAdd}
          okText="Thêm địa điểm"
          cancelText="Hủy"
          width={700}
          centered
          confirmLoading={submittingAdd}
        >
          <div className="admin-locations__add-modal">
            <div className="admin-locations__add-form">
              <div className="admin-locations__form-group">
                <label>
                  Topic ID <span className="admin-locations__required">*</span>
                </label>
                <input
                  type="number"
                  value={addFormData.topicId}
                  onChange={(e) =>
                    handleAddFormChange(
                      "topicId",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  placeholder="Nhập Topic ID"
                />
              </div>

              <div className="admin-locations__form-group">
                <label>
                  Google Place ID{" "}
                  <span className="admin-locations__required">*</span>
                </label>
                <input
                  type="text"
                  value={addFormData.googlePlaceId}
                  onChange={(e) =>
                    handleAddFormChange("googlePlaceId", e.target.value)
                  }
                  placeholder="ChIJV09QuFAvdTERT6v9xMqRsKk"
                />
              </div>

              <div className="admin-locations__form-group">
                <label>
                  District ID{" "}
                  <span className="admin-locations__required">*</span>
                </label>
                <input
                  type="number"
                  value={addFormData.districtId}
                  onChange={(e) =>
                    handleAddFormChange(
                      "districtId",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  placeholder="Nhập District ID"
                />
              </div>

              <div className="admin-locations__form-group">
                <label>Mô tả</label>
                <textarea
                  value={addFormData.description}
                  onChange={(e) =>
                    handleAddFormChange("description", e.target.value)
                  }
                  rows={6}
                  placeholder="Nhập mô tả địa điểm..."
                />
              </div>

              <div className="admin-locations__form-row">
                <div className="admin-locations__form-group">
                  <label>Thời gian gợi ý (phút)</label>
                  <input
                    type="number"
                    value={addFormData.suggestedDuration}
                    onChange={(e) =>
                      handleAddFormChange(
                        "suggestedDuration",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                    placeholder="120"
                  />
                </div>

                <div className="admin-locations__form-group">
                  <label>Chi phí gợi ý (VND)</label>
                  <input
                    type="text"
                    value={new Intl.NumberFormat("vi-VN").format(
                      addFormData.suggestedPrice
                    )}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleAddFormChange(
                        "suggestedPrice",
                        parseInt(value) || 0
                      );
                    }}
                    placeholder="180.000"
                  />
                </div>
              </div>

              <div className="admin-locations__form-note">
                <p>
                  <span className="admin-locations__required">*</span> Trường
                  bắt buộc
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default LocationManagement;
