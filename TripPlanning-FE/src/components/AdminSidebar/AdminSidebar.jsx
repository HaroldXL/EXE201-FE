import React from "react";
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { logout } from "../../store/redux/features/userSlice";
import "./AdminSidebar.css";

function AdminSidebar({
  activeMenu,
  setActiveMenu,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "locations", label: "Quản lý địa điểm", icon: MapPin },
    { id: "reports", label: "Báo cáo", icon: FileText },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Admin?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      centered: true,
      onOk: () => {
        dispatch(logout());
        navigate("/");
      },
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}
      >
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <h2>Admin Panel</h2>
          </div>
          <button
            className="admin-sidebar__close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="admin-sidebar__menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`admin-sidebar__menu-item ${
                  activeMenu === item.id
                    ? "admin-sidebar__menu-item--active"
                    : ""
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;
