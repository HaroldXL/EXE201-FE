import React, { useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Menu,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import api from "../../../config/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Set default date range (last 4 weeks)
  useEffect(() => {
    const today = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(today.getDate() - 28);

    setDateRange({
      startDate: fourWeeksAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  }, []);

  // Fetch revenue data
  const fetchRevenueData = useCallback(async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    try {
      setLoading(true);
      const response = await api.get("/Transaction/report/weeks", {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setRevenueData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchRevenueData();
    }
  }, [dateRange, fetchRevenueData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate total revenue
  const totalRevenue = Array.isArray(revenueData)
    ? revenueData.reduce((sum, week) => sum + (week.totalAmount || 0), 0)
    : 0;

  // Find max revenue for chart scaling
  const maxRevenue = Array.isArray(revenueData)
    ? Math.max(...revenueData.map((w) => w.totalAmount || 0), 1)
    : 1;

  return (
    <div className="admin-dashboard">
      {/* Admin Sidebar Component */}
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="admin-dashboard__main">
        {/* Mobile Menu Toggle */}
        <button
          className="admin-dashboard__menu-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Header */}
        <div className="admin-dashboard__header">
          <div className="admin-dashboard__header-content">
            <div className="admin-dashboard__header-icon">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1>Dashboard - Báo cáo Doanh thu</h1>
              <p>Thống kê doanh thu theo tuần</p>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__filter-group">
            <label>
              <Calendar size={16} />
              Từ ngày:
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="admin-dashboard__filter-group">
            <label>
              <Calendar size={16} />
              Đến ngày:
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="admin-dashboard__summary">
          <div className="admin-dashboard__card admin-dashboard__card--primary">
            <div className="admin-dashboard__card-icon">
              <DollarSign size={32} />
            </div>
            <div className="admin-dashboard__card-content">
              <h3>Tổng Doanh Thu</h3>
              <p className="admin-dashboard__card-value">
                {new Intl.NumberFormat("vi-VN").format(totalRevenue)} VND
              </p>
            </div>
          </div>

          <div className="admin-dashboard__card admin-dashboard__card--success">
            <div className="admin-dashboard__card-icon">
              <TrendingUp size={32} />
            </div>
            <div className="admin-dashboard__card-content">
              <h3>Số tuần</h3>
              <p className="admin-dashboard__card-value">
                {revenueData.length}
              </p>
            </div>
          </div>

          <div className="admin-dashboard__card admin-dashboard__card--info">
            <div className="admin-dashboard__card-icon">
              <FileText size={32} />
            </div>
            <div className="admin-dashboard__card-content">
              <h3>Trung bình / tuần</h3>
              <p className="admin-dashboard__card-value">
                {revenueData.length > 0
                  ? new Intl.NumberFormat("vi-VN").format(
                      Math.round(totalRevenue / revenueData.length)
                    )
                  : 0}{" "}
                VND
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="admin-dashboard__chart-container">
          <h2>Doanh thu theo tuần</h2>

          {loading ? (
            <div className="admin-dashboard__loading">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : revenueData.length > 0 ? (
            <div className="admin-dashboard__chart">
              {revenueData.map((week, index) => (
                <div key={index} className="admin-dashboard__chart-bar">
                  <div
                    className="admin-dashboard__chart-bar-fill"
                    style={{
                      height: `${(week.totalAmount / maxRevenue) * 100}%`,
                    }}
                    title={`${new Intl.NumberFormat("vi-VN").format(
                      week.totalAmount
                    )} VND`}
                  >
                    <span className="admin-dashboard__chart-value">
                      {new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(week.totalAmount)}
                    </span>
                  </div>
                  <div className="admin-dashboard__chart-label">
                    Tuần {week.weekNumber}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__empty">
              Không có dữ liệu trong khoảng thời gian này
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="admin-dashboard__table-container">
          <h2>Chi tiết doanh thu</h2>
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Tuần</th>
                <th>Năm</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    <Spin />
                  </td>
                </tr>
              ) : revenueData.length > 0 ? (
                revenueData.map((week, index) => (
                  <tr key={index}>
                    <td>Tuần {week.weekNumber}</td>
                    <td>{week.year}</td>
                    <td>
                      {new Intl.NumberFormat("vi-VN").format(week.totalAmount)}{" "}
                      VND
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
