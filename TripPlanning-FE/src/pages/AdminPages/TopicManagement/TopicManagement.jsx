import React, { useState, useEffect } from "react";
import { Tag, Search, Menu, Edit, Plus, Check, X } from "lucide-react";
import { Select, Modal, message, Spin } from "antd";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import api from "../../../config/axios";
import "./TopicManagement.css";

const { Option } = Select;

function TopicManagement() {
  const [activeMenu, setActiveMenu] = useState("topics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Topic Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Edit Status Modal State
  const [editStatusModalVisible, setEditStatusModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Fetch topics data
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Topic/list-active");
      setTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "admin-topics__badge--active",
      inactive: "admin-topics__badge--inactive",
    };
    return statusColors[status?.toLowerCase()] || "admin-topics__badge--active";
  };

  // Handle add topic
  const handleOpenAddModal = () => {
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setAddFormData({
      name: "",
      description: "",
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
    if (!addFormData.name || !addFormData.description) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setSubmittingAdd(true);
      await api.post("/Topic", addFormData);

      message.success("Thêm chủ đề thành công!");
      handleCloseAddModal();
      fetchTopics();
    } catch (error) {
      console.error("Error adding topic:", error);
      message.error("Thêm chủ đề thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Handle edit status
  const handleOpenEditStatusModal = (topic) => {
    setSelectedTopic(topic);
    setEditStatus(topic.status);
    setEditStatusModalVisible(true);
  };

  const handleCloseEditStatusModal = () => {
    setEditStatusModalVisible(false);
    setSelectedTopic(null);
    setEditStatus("");
  };

  const handleSubmitEditStatus = async () => {
    if (!selectedTopic) return;

    try {
      setSubmittingStatus(true);
      await api.put(`/Topic/${selectedTopic.id}/status`, null, {
        params: { status: editStatus },
      });

      message.success("Cập nhật trạng thái thành công!");
      handleCloseEditStatusModal();
      fetchTopics();
    } catch (error) {
      console.error("Error updating topic status:", error);
      message.error("Cập nhật trạng thái thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmittingStatus(false);
    }
  };

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
        <div className="admin-topics__header">
          <div className="admin-topics__header-content">
            <div className="admin-topics__header-icon">
              <Tag size={32} />
            </div>
            <div>
              <h1>Quản lý chủ đề</h1>
              <p>Tổng số {topics.length} chủ đề</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-topics__stats">
          <div className="admin-topics__stat-card">
            <div className="admin-topics__stat-icon admin-topics__stat-icon--total">
              <Tag size={24} />
            </div>
            <div className="admin-topics__stat-content">
              <h3>Tổng chủ đề</h3>
              <p>{topics.length}</p>
            </div>
          </div>

          <div className="admin-topics__stat-card">
            <div className="admin-topics__stat-icon admin-topics__stat-icon--active">
              <Check size={24} />
            </div>
            <div className="admin-topics__stat-content">
              <h3>Đang hoạt động</h3>
              <p>{topics.filter((t) => t.status === "active").length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="admin-topics__filters">
          <div className="admin-topics__search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="admin-topics__container">
          <div className="admin-topics__header-section">
            <h2>Danh sách chủ đề</h2>
            <button
              className="admin-topics__add-btn"
              onClick={handleOpenAddModal}
            >
              <Plus size={20} />
              <span>Thêm chủ đề</span>
            </button>
          </div>

          {loading ? (
            <div className="admin-topics__loading">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : filteredTopics.length > 0 ? (
            <>
              <div className="admin-topics__grid">
                {filteredTopics.map((topic) => (
                  <div key={topic.id} className="admin-topics__card">
                    <div className="admin-topics__card-header">
                      <div className="admin-topics__card-icon">
                        <Tag size={24} />
                      </div>
                      <span
                        className={`admin-topics__badge ${getStatusBadge(
                          topic.status
                        )}`}
                      >
                        {topic.status === "active"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </div>

                    <div className="admin-topics__card-content">
                      <h3>{topic.name}</h3>
                      <p>{topic.description}</p>
                    </div>

                    <div className="admin-topics__card-footer">
                      <span className="admin-topics__card-id">
                        ID: {topic.id}
                      </span>
                      <button
                        className="admin-topics__edit-btn"
                        onClick={() => handleOpenEditStatusModal(topic)}
                        title="Chỉnh sửa trạng thái"
                      >
                        <Edit size={16} />
                        <span>Sửa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Info */}
              {searchTerm && (
                <div className="admin-topics__filter-results">
                  Tìm thấy {filteredTopics.length} kết quả cho "{searchTerm}"
                </div>
              )}
            </>
          ) : (
            <div className="admin-topics__empty">
              {searchTerm
                ? `Không tìm thấy chủ đề nào với từ khóa "${searchTerm}"`
                : "Không có dữ liệu"}
            </div>
          )}
        </div>

        {/* Add Topic Modal */}
        <Modal
          title="Thêm chủ đề mới"
          open={addModalVisible}
          onCancel={handleCloseAddModal}
          onOk={handleSubmitAdd}
          okText="Thêm chủ đề"
          cancelText="Hủy"
          width={600}
          centered
          confirmLoading={submittingAdd}
        >
          <div className="admin-topics__add-modal">
            <div className="admin-topics__form">
              <div className="admin-topics__form-group">
                <label>
                  Tên chủ đề <span className="admin-topics__required">*</span>
                </label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => handleAddFormChange("name", e.target.value)}
                  placeholder="Ví dụ: Thiên nhiên"
                />
              </div>

              <div className="admin-topics__form-group">
                <label>
                  Mô tả <span className="admin-topics__required">*</span>
                </label>
                <textarea
                  value={addFormData.description}
                  onChange={(e) =>
                    handleAddFormChange("description", e.target.value)
                  }
                  rows={4}
                  placeholder="Nhập mô tả chủ đề..."
                />
              </div>

              <div className="admin-topics__form-note">
                <p>
                  <span className="admin-topics__required">*</span> Trường bắt
                  buộc
                </p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Edit Status Modal */}
        <Modal
          title="Chỉnh sửa trạng thái chủ đề"
          open={editStatusModalVisible}
          onCancel={handleCloseEditStatusModal}
          onOk={handleSubmitEditStatus}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          width={500}
          centered
          confirmLoading={submittingStatus}
        >
          {selectedTopic && (
            <div className="admin-topics__edit-modal">
              <div className="admin-topics__edit-info">
                <div className="admin-topics__edit-topic-name">
                  <Tag size={20} />
                  <span>{selectedTopic.name}</span>
                </div>
                <p className="admin-topics__edit-description">
                  {selectedTopic.description}
                </p>
              </div>

              <div className="admin-topics__form-group">
                <label>Trạng thái</label>
                <Select
                  className="admin-topics__status-select"
                  value={editStatus}
                  onChange={(value) => setEditStatus(value)}
                  style={{ width: "100%" }}
                >
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Ngừng hoạt động</Option>
                </Select>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

export default TopicManagement;
