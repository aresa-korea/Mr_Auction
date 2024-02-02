import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);

  // 화면 로딩 후 이벤트 추가
  useEffect(() => {
    // getModels();
  }, []);

  const getModels = async () => {
    try {
      const response = await axios.get("/api/models");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { text: input, author: "user" };

    try {
      const res = await axios.post("/api/chat", { prompt: input });
      console.log(res.data);
      // GPT 응답 메시지 추가
      const botMessage = {
        text: res.data[0].content[0].text.value,
        author: res.data[0].role,
      };

      // 함수형 업데이트를 사용하여 대화 목록 업데이트
      setConversations((prevConversations) => [...prevConversations, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      // 에러 메시지를 대화 목록에 추가할 수도 있습니다.
      setConversations((prevConversations) => [
        ...prevConversations,
        { text: "Error fetching response from the server.", author: "bot" },
      ]);
    }

    setInput(""); // 입력 필드 초기화
  };

  return (
    <div className="container">
      <h1>경매씨</h1>
      <div className="chat-box">
        {conversations.map((msg, index) => (
          <div key={index} className={`message ${msg.author}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }
        .chat-box {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 20px;
          height: 300px;
          overflow-y: auto;
        }
        .message {
          margin-bottom: 10px;
        }
        .user {
          text-align: right;
        }
        .bot {
          text-align: left;
        }
        input {
          width: 80%;
          padding: 10px;
        }
        button {
          width: 18%;
          padding: 10px;
          margin-left: 2%;
        }
      `}</style>
    </div>
  );
}
