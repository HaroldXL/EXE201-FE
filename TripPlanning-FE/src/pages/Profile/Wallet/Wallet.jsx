import React, { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { Modal, message } from "antd";
import { useSelector } from "react-redux";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import "./Wallet.css";

function Wallet() {
  const user = useSelector((store) => store.user);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // Predefined amounts
  const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

  // Fetch wallet balance from user profile
  const fetchBalance = async () => {
    try {
      const response = await api.get("/User/profile");
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      message.error("Không thể tải số dư tài khoản");
    }
  };

  // Fetch transaction history
  const fetchTransactions = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await api.get("/Transaction/history", {
        params: {
          page,
          pageSize,
        },
      });
      setTransactions(response.data.items || []);
      setPagination({
        page: response.data.page || 1,
        pageSize: response.data.pageSize || 10,
        totalCount: response.data.totalCount || 0,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [user]);

  // Handle recharge
  const handleRecharge = async () => {
    const amount = parseInt(rechargeAmount);

    if (!amount || amount < 10000) {
      message.error("Số tiền nạp tối thiểu là 10,000 VNĐ");
      return;
    }

    if (amount > 50000000) {
      message.error("Số tiền nạp tối đa là 50,000,000 VNĐ");
      return;
    }

    try {
      setProcessing(true);
      const response = await api.post("/Transaction/sepay/deposit", {
        amount: amount,
      });

      // Save QR data and show QR modal
      setQrData(response.data);
      setIsModalVisible(false);
      setIsQRModalVisible(true);
      setRechargeAmount("");
      setDisplayAmount("");

      message.success("Vui lòng quét mã QR để hoàn tất giao dịch!");
    } catch (error) {
      console.error("Error recharging:", error);
      message.error(
        error.response?.data?.message || "Nạp tiền thất bại. Vui lòng thử lại."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format number with thousand separators
  const formatNumberInput = (value) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");
    // Format with thousand separators
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Remove all non-digit characters to get raw number
    const rawNumber = value.replace(/\D/g, "");

    // Update raw amount for API
    setRechargeAmount(rawNumber);
    // Update display with formatting
    setDisplayAmount(formatNumberInput(value));
  };

  return (
    <div className="wallet-page">
      <Header />

      <div className="wrapper-wallet">
        <div className="wallet-container">
          <div className="wallet-header">
            <h1 className="wallet-title">Ví Của Tôi</h1>
          </div>

          {/* Balance Card */}
          <div className="wallet-balance-card">
            <div className="wallet-balance-info">
              <p className="wallet-balance-label">Số dư khả dụng</p>
              <h2 className="wallet-balance-amount">
                {loading ? "..." : formatCurrency(balance)}
              </h2>
            </div>
            <button
              className="wallet-recharge-btn"
              onClick={() => setIsModalVisible(true)}
            >
              <Plus size={20} />
              Nạp tiền
            </button>
          </div>

          {/* Transaction History */}
          <div className="wallet-transactions">
            <h3 className="wallet-section-title">Lịch sử giao dịch</h3>

            {loading ? (
              <div className="wallet-loading">
                <Clock size={48} className="wallet-loading-icon" />
                <p>Đang tải...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="wallet-empty">
                <WalletIcon size={64} className="wallet-empty-icon" />
                <p>Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="wallet-transaction-list">
                {transactions.map((transaction) => {
                  // Determine transaction type based on transactionType
                  const isDeposit = transaction.transactionType
                    ?.toLowerCase()
                    .includes("deposit");

                  return (
                    <div
                      key={transaction.id}
                      className={`wallet-transaction-item ${
                        isDeposit
                          ? "wallet-transaction-in"
                          : "wallet-transaction-out"
                      }`}
                    >
                      <div className="wallet-transaction-icon">
                        {isDeposit ? (
                          <ArrowDownRight size={24} />
                        ) : (
                          <ArrowUpRight size={24} />
                        )}
                      </div>
                      <div className="wallet-transaction-details">
                        <p className="wallet-transaction-title">
                          {transaction.transactionType || "Giao dịch"}
                        </p>
                        <p className="wallet-transaction-date">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="wallet-transaction-amount">
                        <p
                          className={
                            isDeposit ? "wallet-amount-in" : "wallet-amount-out"
                          }
                        >
                          {isDeposit ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      <Modal
        title={
          <div style={{ fontSize: "18px", fontWeight: "600" }}>
            Nạp tiền vào ví
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setRechargeAmount("");
          setDisplayAmount("");
        }}
        footer={null}
        centered
        width={500}
      >
        <div className="wallet-modal-content">
          <div className="wallet-modal-balance">
            <p>Số dư hiện tại</p>
            <h3>{formatCurrency(balance)}</h3>
          </div>

          <div className="wallet-quick-amounts">
            <p className="wallet-modal-label">Chọn nhanh</p>
            <div className="wallet-amount-grid">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`wallet-amount-btn ${
                    parseInt(rechargeAmount) === amount ? "active" : ""
                  }`}
                  onClick={() => {
                    setRechargeAmount(amount.toString());
                    setDisplayAmount(formatNumberInput(amount.toString()));
                  }}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          <div className="wallet-custom-amount">
            <p className="wallet-modal-label">Hoặc nhập số tiền khác</p>
            <input
              type="text"
              className="wallet-amount-input"
              placeholder="Nhập số tiền (VNĐ)"
              value={displayAmount}
              onChange={handleAmountChange}
            />
            <p className="wallet-input-hint">
              Số tiền tối thiểu: 10,000 VNĐ | Tối đa: 50,000,000 VNĐ
            </p>
          </div>

          <button
            className="wallet-confirm-btn"
            onClick={handleRecharge}
            disabled={processing || !rechargeAmount}
          >
            {processing ? "Đang xử lý..." : "Xác nhận nạp tiền"}
          </button>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title={
          <div style={{ fontSize: "18px", fontWeight: "600" }}>
            Quét mã QR để thanh toán
          </div>
        }
        open={isQRModalVisible}
        onCancel={() => {
          setIsQRModalVisible(false);
          setQrData(null);
          fetchBalance();
          fetchTransactions();
        }}
        footer={null}
        centered
        width={500}
      >
        {qrData && (
          <div className="wallet-qr-content">
            <div className="wallet-qr-image-container">
              <img
                src={qrData.qrUrl}
                alt="QR Code"
                className="wallet-qr-image"
              />
            </div>

            <div className="wallet-qr-details">
              <div className="wallet-qr-detail-item">
                <span className="wallet-qr-detail-label">
                  Số tiền cần thanh toán:
                </span>
                <span className="wallet-qr-detail-value wallet-qr-amount-highlight">
                  {formatCurrency(qrData.amount)}
                </span>
              </div>
              <div className="wallet-qr-detail-item">
                <span className="wallet-qr-detail-label">Mã giao dịch:</span>
                <span className="wallet-qr-detail-value">
                  {qrData.transactionId}
                </span>
              </div>
              <div className="wallet-qr-detail-item">
                <span className="wallet-qr-detail-label">Thời gian tạo:</span>
                <span className="wallet-qr-detail-value">
                  {formatDate(qrData.createdAt)}
                </span>
              </div>
            </div>

            <button
              className="wallet-qr-done-btn"
              onClick={() => {
                setIsQRModalVisible(false);
                setQrData(null);
                fetchBalance();
                fetchTransactions();
              }}
            >
              Đã thanh toán
            </button>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default Wallet;
