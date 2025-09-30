import {
  User,
  Clock,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Header from "../../../components/header/header";
import "./ProfilePav.css";
import Footer from "../../../components/footer/footer";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/redux/features/userSlice";

function ProfilePav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận Đăng Xuất",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        dispatch(logout());
        navigate("/");
      },
      onCancel() {},
    });
  };

  const handleMenuClick = (item) => {
    if (item.id === 1) {
      // Thông Tin Cá Nhân
      navigate("/profile/info");
    }
    if (item.id === 2) {
      // Lịch Sử (Kế Hoạch Chuyến Đi)
      navigate("/profile/history");
    }
    if (item.id === 3) {
      // Ví Của Bạn
      navigate("/profile/wallet");
    }
    if (item.id === 4) {
      // Trợ Giúp
      navigate("/profile/help");
    }
    if (item.id === 5) {
      // Đăng Xuất
      handleLogout();
    }
    // Có thể thêm các điều hướng khác ở đây
  };

  const profileMenuItems = [
    {
      id: 1,
      icon: User,
      title: "Thông Tin Cá Nhân",
      description: "Chỉnh sửa thông tin cá nhân",
      hasArrow: true,
    },
    {
      id: 2,
      icon: Clock,
      title: "Chuyến Đi Của Tôi",
      description: "Xem các chuyến đi đã lập kế hoạch",
      hasArrow: true,
    },
    {
      id: 3,
      icon: CreditCard,
      title: "Ví Của Bạn",
      description: "Quản lý số dư tài khoản của bạn",
      hasArrow: true,
    },
    {
      id: 4,
      icon: HelpCircle,
      title: "Trợ Giúp",
      description: "Hỗ trợ và câu hỏi thường gặp",
      hasArrow: true,
    },
    {
      id: 5,
      icon: LogOut,
      title: "Đăng Xuất",
      description: "Thoát khỏi tài khoản",
      hasArrow: false,
      isLogout: true,
    },
  ];

  return (
    <div>
      <Header />
      <div className="wrapper">
        <div className="wrapper-profile">
          {/* Profile Header */}

          {/* Profile Menu */}
          <div className="wrapper-profile__menu">
            {profileMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className={`wrapper-profile__menu-item ${
                    item.isLogout ? "wrapper-profile__menu-item--logout" : ""
                  }`}
                  onClick={() => handleMenuClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="wrapper-profile__menu-item-left">
                    <div className="wrapper-profile__menu-item-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="wrapper-profile__menu-item-content">
                      <h3 className="wrapper-profile__menu-item-title">
                        {item.title}
                      </h3>
                      <p className="wrapper-profile__menu-item-description">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.hasArrow && (
                    <ChevronRight
                      size={20}
                      className="wrapper-profile__menu-item-arrow"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfilePav;
