import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import api from "../../config/axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Xin chào, tôi là PlanAI! 👋 Tôi ở đây để giải đáp và hỗ trợ bạn. Tôi có thể giúp gì cho bạn ?",
      timestamp: new Date(),
      suggestions: [
        "Làm sao để tạo kế hoạch ?",
        "Gợi ý 1 địa điểm rẻ cho sinh viên.",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    // Scroll ngay lập tức và sau delay để đảm bảo
    scrollToBottom();

    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Scroll sau khi thêm user message
    setTimeout(() => scrollToBottom(), 50);

    try {
      const response = await api.post("/Chat/message", {
        message: messageText,
      });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.data.response,
          timestamp: new Date(response.data.timestamp),
          suggestions:
            response.data.suggestedLocations?.map((loc) => loc.name) || [],
        };
        setMessages((prev) => [...prev, botMessage]);
        // Scroll sau khi thêm bot message
        setTimeout(() => scrollToBottom(), 50);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      // Scroll sau khi thêm error message
      setTimeout(() => scrollToBottom(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <div className="header-page-container">
        <div className="chatbot">
          {/* Chat Header - Simplified */}
          <div className="chatbot-header">
            <div className="chatbot-bot-info">
              <div className="chatbot-bot-avatar">
                <div className="chatbot-bot-icon">AI</div>
              </div>
              <div className="chatbot-bot-details">
                <h3 className="chatbot-bot-name">PlanAI</h3>
                <div className="chatbot-bot-status">
                  <span className="chatbot-status-dot"></span>
                  Luôn hoạt động
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message chatbot-message--${message.type}`}
              >
                {message.type === "bot" && (
                  <div className="chatbot-message-avatar">
                    <div className="chatbot-bot-icon">AI</div>
                  </div>
                )}

                <div className="chatbot-message-content">
                  <div className="chatbot-message-bubble">
                    {message.content}
                  </div>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="chatbot-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="chatbot-suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="chatbot-message-time">
                    Hôm nay, {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message chatbot-message--bot">
                <div className="chatbot-message-avatar">
                  <div className="chatbot-bot-icon">AI</div>
                </div>
                <div className="chatbot-message-content">
                  <div className="chatbot-message-bubble chatbot-typing">
                    <div className="chatbot-typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} style={{ height: "20px" }} />
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Hỏi gì đó ..."
                className="chatbot-input"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="chatbot-send-btn"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Chatbot;
