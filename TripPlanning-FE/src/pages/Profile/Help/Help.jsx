import { useState } from "react";
import {
  Mail,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Book,
  MapPin,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./Help.css";

function Help() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Lập Kế Hoạch",
      icon: <MapPin size={20} />,
      question: "Làm thế nào để tạo một kế hoạch du lịch mới?",
      answer:
        'Để tạo kế hoạch du lịch mới, hãy vào trang "Lập Kế Hoạch" từ menu chính, chọn điểm đến, ngày tháng, số lượng người và ngân sách của bạn. Hệ thống sẽ tự động đề xuất lịch trình phù hợp với nhu cầu của bạn.',
    },
    {
      id: 2,
      category: "Lập Kế Hoạch",
      icon: <MapPin size={20} />,
      question: "Tôi có thể thay đổi địa điểm trong lịch trình không?",
      answer:
        'Có, bạn hoàn toàn có thể thay đổi địa điểm. Vào trang chi tiết chuyến đi, nhấn nút "Thay đổi địa điểm" tại địa điểm bạn muốn thay thế. Hệ thống sẽ gợi ý các địa điểm tương tự phù hợp với lịch trình của bạn.',
    },
    {
      id: 3,
      category: "Thanh Toán",
      icon: <CreditCard size={20} />,
      question: "Các phương thức thanh toán nào được hỗ trợ?",
      answer:
        "Chúng tôi hỗ trợ nhiều phương thức thanh toán bao gồm: Thẻ ATM nội địa, Ví điện tử (MoMo, ZaloPay, VNPay), và chuyển khoản ngân hàng qua mã QR.",
    },
    {
      id: 4,
      category: "Thanh Toán",
      icon: <CreditCard size={20} />,
      question: "Làm thế nào để nạp tiền vào ví?",
      answer:
        'Vào trang "Ví" trong menu Profile, chọn số tiền muốn nạp, sau đó quét mã QR hoặc chuyển khoản theo hướng dẫn. Số dư sẽ được cập nhật tự động sau khi thanh toán thành công.',
    },
    {
      id: 5,
      category: "Tài Khoản",
      icon: <Settings size={20} />,
      question: "Làm thế nào để thay đổi thông tin cá nhân?",
      answer:
        'Vào trang "Thông Tin" trong menu Profile, bạn có thể cập nhật tên, email, số điện thoại và các thông tin khác. Nhớ nhấn nút "Lưu" để cập nhật thay đổi.',
    },
    {
      id: 6,
      category: "Bảo Mật",
      icon: <Shield size={20} />,
      question: "Thông tin cá nhân của tôi có được bảo mật không?",
      answer:
        "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của bạn. Tất cả dữ liệu đều được mã hóa và tuân thủ các tiêu chuẩn bảo mật quốc tế. Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba.",
    },
    {
      id: 7,
      category: "Khám Phá",
      icon: <Book size={20} />,
      question: "Làm thế nào để tìm kiếm địa điểm du lịch?",
      answer:
        'Vào trang "Khám Phá", bạn có thể tìm kiếm địa điểm theo tên, lọc theo chủ đề (ẩm thực, văn hóa, giải trí...), xem đánh giá và hình ảnh từ cộng đồng.',
    },
  ];

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      description: "support@tripplanning.vn",
      action: "Gửi email",
      color: "#10b981",
    },
    {
      icon: <Phone size={24} />,
      title: "Hotline",
      description: "1900 xxxx (8:00 - 22:00)",
      action: "Gọi ngay",
      color: "#f59e0b",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="help-page">
      <Header />

      <div className="wrapper-help">
        <div className="help-container">
          {/* Header */}
          <div className="help-header">
            <h1 className="help-title">Trung Tâm Hỗ Trợ</h1>
            <p className="help-subtitle">
              Chúng tôi luôn sẵn sàng giúp đỡ bạn. Tìm câu trả lời nhanh chóng
              hoặc liên hệ với chúng tôi.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="help-contact-section">
            <h2 className="help-section-title">Liên Hệ Nhanh</h2>
            <div className="help-contact-grid">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="help-contact-card"
                  style={{ "--accent-color": method.color }}
                >
                  <div
                    className="help-contact-icon"
                    style={{ backgroundColor: `${method.color}15` }}
                  >
                    <div style={{ color: method.color }}>{method.icon}</div>
                  </div>
                  <h3 className="help-contact-title">{method.title}</h3>
                  <p className="help-contact-description">
                    {method.description}
                  </p>
                  <button
                    className="help-contact-btn"
                    style={{ backgroundColor: method.color }}
                  >
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="help-faq-section">
            <h2 className="help-section-title">
              <HelpCircle size={24} />
              Câu Hỏi Thường Gặp
            </h2>

            {faqs.length > 0 ? (
              <div className="help-faq-list">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`help-faq-item ${
                      expandedFaq === faq.id ? "expanded" : ""
                    }`}
                  >
                    <button
                      className="help-faq-question"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="help-faq-question-content">
                        <div className="help-faq-category">
                          {faq.icon}
                          <span>{faq.category}</span>
                        </div>
                        <h3>{faq.question}</h3>
                      </div>
                      <div className="help-faq-toggle">
                        {expandedFaq === faq.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="help-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="help-no-results">
                <HelpCircle size={48} />
                <p>Không tìm thấy câu hỏi phù hợp</p>
                <span>Hãy thử tìm kiếm với từ khóa khác</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Help;
