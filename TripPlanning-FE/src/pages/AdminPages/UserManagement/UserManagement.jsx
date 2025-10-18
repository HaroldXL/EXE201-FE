import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Menu,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Shield,
  Edit,
  Save,
  X as XIcon,
} from "lucide-react";
import { Modal, message, Select } from "antd";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import api from "../../../config/axios";
import "./UserManagement.css";

const { Option } = Select;

function UserManagement() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdminEditModalOpen, setIsAdminEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    password: "",
    phone: "",
    dob: "",
  });
  const [adminEditForm, setAdminEditForm] = useState({
    userId: 0,
    status: "",
    roleId: 0,
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/User/list", {
          params: {
            page: pagination.page,
            pageSize: pagination.pageSize,
          },
        });
        setUsers(response.data.items || []);
        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.totalCount || 0,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.page, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 when searching
  };

  // Filter users based on search, role and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesRole =
      roleFilter === "all" || user.roleName?.toLowerCase() === roleFilter;

    const matchesStatus =
      statusFilter === "all" || user.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getRoleBadge = (roleName) => {
    const roleColors = {
      admin: "admin-users__badge--admin",
      customer: "admin-users__badge--customer",
    };
    return (
      roleColors[roleName?.toLowerCase()] || "admin-users__badge--customer"
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "admin-users__badge--active",
      inactive: "admin-users__badge--inactive",
    };
    return statusColors[status?.toLowerCase()] || "admin-users__badge--active";
  };

  // Open Edit Profile Modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username || "",
      password: "",
      phone: user.phone || "",
      dob: user.dob ? user.dob.split("T")[0] : "",
    });
    setIsEditModalOpen(true);
  };

  // Open Admin Edit Modal
  const handleOpenAdminEditModal = (user) => {
    setSelectedUser(user);
    setAdminEditForm({
      userId: user.id,
      status: user.status || "active",
      roleId: user.roleName === "admin" ? 1 : 2, // Assuming admin=1, customer=2
    });
    setIsAdminEditModalOpen(true);
  };

  // Handle Edit Profile Form Change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Edit Profile
  const handleSubmitEditProfile = async () => {
    try {
      await api.patch("/User/edit-profile", editForm);
      message.success("Cập nhật thông tin thành công!");
      setIsEditModalOpen(false);
      // Refresh user list
      const response = await api.get("/User/list", {
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      });
      setUsers(response.data.items || []);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  // Submit Admin Edit
  const handleSubmitAdminEdit = async () => {
    try {
      await api.put("/User/admin-edit", adminEditForm);
      message.success("Cập nhật quyền và trạng thái thành công!");
      setIsAdminEditModalOpen(false);
      // Refresh user list
      const response = await api.get("/User/list", {
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      });
      setUsers(response.data.items || []);
    } catch (error) {
      console.error("Error admin editing user:", error);
      message.error("Cập nhật thất bại!");
    }
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

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
        <div className="admin-users__header">
          <div className="admin-users__header-content">
            <div className="admin-users__header-icon">
              <Users size={32} />
            </div>
            <div>
              <h1>Quản lý người dùng</h1>
              <p>Tổng số {pagination.totalCount} người dùng</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-users__stats">
          <div className="admin-users__stat-card">
            <div className="admin-users__stat-icon admin-users__stat-icon--total">
              <Users size={24} />
            </div>
            <div className="admin-users__stat-content">
              <h3>Tổng người dùng</h3>
              <p>{pagination.totalCount}</p>
            </div>
          </div>

          <div className="admin-users__stat-card">
            <div className="admin-users__stat-icon admin-users__stat-icon--admin">
              <Shield size={24} />
            </div>
            <div className="admin-users__stat-content">
              <h3>Quản trị viên</h3>
              <p>{users.filter((u) => u.roleName === "admin").length}</p>
            </div>
          </div>

          <div className="admin-users__stat-card">
            <div className="admin-users__stat-icon admin-users__stat-icon--customer">
              <Users size={24} />
            </div>
            <div className="admin-users__stat-content">
              <h3>Khách hàng</h3>
              <p>{users.filter((u) => u.roleName === "customer").length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="admin-users__filters">
          <div className="admin-users__search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            className="admin-users__role-filter"
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            style={{ width: 200 }}
          >
            <Option value="all">Tất cả vai trò</Option>
            <Option value="admin">Quản trị viên</Option>
            <Option value="customer">Khách hàng</Option>
          </Select>

          <Select
            className="admin-users__status-filter"
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

        {/* Users Table */}
        <div className="admin-users__table-container">
          <div className="admin-users__table-header">
            <h2>Danh sách người dùng</h2>
          </div>

          {loading ? (
            <div className="admin-users__loading">Đang tải dữ liệu...</div>
          ) : users.length > 0 ? (
            <>
              <div className="admin-users__table-wrapper">
                <table className="admin-users__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người dùng</th>
                      <th>Liên hệ</th>
                      <th>Ngày sinh</th>
                      <th>Số dư</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <span className="admin-users__id">#{user.id}</span>
                        </td>
                        <td>
                          <div className="admin-users__user-info">
                            <div className="admin-users__avatar">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="admin-users__username">
                                {user.username}
                              </div>
                              <div className="admin-users__email">
                                <Mail size={12} />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-users__contact">
                            {user.phone ? (
                              <div className="admin-users__phone">
                                <Phone size={14} />
                                {user.phone}
                              </div>
                            ) : (
                              <span className="admin-users__na">N/A</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="admin-users__dob">
                            <Calendar size={14} />
                            {formatDate(user.dob)}
                          </div>
                        </td>
                        <td>
                          <div className="admin-users__balance">
                            <Wallet size={14} />
                            {formatCurrency(user.balance)} VND
                          </div>
                        </td>
                        <td>
                          <span
                            className={`admin-users__badge ${getRoleBadge(
                              user.roleName
                            )}`}
                          >
                            {user.roleName === "admin"
                              ? "Quản trị viên"
                              : "Khách hàng"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-users__badge ${getStatusBadge(
                              user.status
                            )}`}
                          >
                            {user.status === "active"
                              ? "Hoạt động"
                              : "Ngừng hoạt động"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="admin-users__actions">
                            <button
                              className="admin-users__action-btn admin-users__action-btn--edit"
                              onClick={() => handleOpenEditModal(user)}
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="admin-users__action-btn admin-users__action-btn--admin"
                              onClick={() => handleOpenAdminEditModal(user)}
                              title="Quản lý quyền"
                            >
                              <Shield size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results Info */}
              {searchTerm || roleFilter !== "all" || statusFilter !== "all" ? (
                <div className="admin-users__filter-results">
                  Tìm thấy {filteredUsers.length} kết quả
                  {searchTerm && ` cho "${searchTerm}"`}
                  {roleFilter !== "all" &&
                    ` (${
                      roleFilter === "admin" ? "Quản trị viên" : "Khách hàng"
                    })`}
                  {statusFilter !== "all" &&
                    ` - ${
                      statusFilter === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"
                    }`}
                </div>
              ) : null}

              {/* Pagination */}
              <div className="admin-users__pagination">
                <button
                  className="admin-users__pagination-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trước
                </button>

                <div className="admin-users__pagination-pages">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= pagination.page - 1 &&
                        pageNumber <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          className={`admin-users__pagination-page ${
                            pagination.page === pageNumber
                              ? "admin-users__pagination-page--active"
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
                  className="admin-users__pagination-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                >
                  Sau
                </button>
              </div>

              <div className="admin-users__pagination-info">
                Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalCount
                )}{" "}
                trong tổng số {pagination.totalCount} người dùng
              </div>
            </>
          ) : (
            <div className="admin-users__empty">Không có dữ liệu</div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={isEditModalOpen}
        onOk={handleSubmitEditProfile}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        centered
        width={500}
      >
        {selectedUser && (
          <div className="admin-users__modal-form">
            <div className="admin-users__form-group">
              <label>Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleEditFormChange}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="admin-users__form-group">
              <label>Mật khẩu mới (để trống nếu không đổi)</label>
              <input
                type="password"
                name="password"
                value={editForm.password}
                onChange={handleEditFormChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="admin-users__form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleEditFormChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="admin-users__form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={editForm.dob}
                onChange={handleEditFormChange}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Admin Edit Modal */}
      <Modal
        title="Quản lý quyền và trạng thái"
        open={isAdminEditModalOpen}
        onOk={handleSubmitAdminEdit}
        onCancel={() => setIsAdminEditModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        centered
        width={500}
      >
        {selectedUser && (
          <div className="admin-users__modal-form">
            <div className="admin-users__user-preview">
              <div className="admin-users__avatar">
                {selectedUser.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3>{selectedUser.username}</h3>
                <p>{selectedUser.email}</p>
              </div>
            </div>

            <div className="admin-users__form-group">
              <label>Trạng thái</label>
              <Select
                value={adminEditForm.status}
                onChange={(value) =>
                  setAdminEditForm((prev) => ({ ...prev, status: value }))
                }
                style={{ width: "100%" }}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Ngừng hoạt động</Option>
              </Select>
            </div>

            <div className="admin-users__form-group">
              <label>Vai trò</label>
              <Select
                value={adminEditForm.roleId}
                onChange={(value) =>
                  setAdminEditForm((prev) => ({ ...prev, roleId: value }))
                }
                style={{ width: "100%" }}
              >
                <Option value={2}>Khách hàng</Option>
                <Option value={1}>Quản trị viên</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserManagement;
