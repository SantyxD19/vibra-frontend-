import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

function ComboChat() {
  const { comboId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef();
  const socket = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 CARGAR MENSAJES
  useEffect(() => {
    if (!comboId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        toast.error("Error cargando mensajes");
      }
    };

    loadMessages();
  }, [comboId]);

  // 🔥 SOCKET (CORREGIDO)
  useEffect(() => {
    if (!comboId) return;

    socket.current = io(API, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.current.emit("joinCombo", Number(comboId));

    socket.current.on("newMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [comboId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 ENVIAR MENSAJE (CORREGIDO)
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          combo_id: Number(comboId),
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      socket.current.emit("sendMessage", {
        ...data,
        combo_id: Number(comboId),
      });

      setContent("");
    } catch (err) {
      console.error(err);
      toast.error("Error enviando mensaje");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex items-center gap-3 bg-gray-900 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>←</button>

        <div>
          <h2 className="font-semibold text-sm">Chat del combo</h2>
          <p className="text-xs text-gray-400">En línea</p>
        </div>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {messages.map((m) => {
          const isMine = Number(user?.id) === Number(m.user_id);

          return (
            <div
              key={m.id}
              className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] text-sm ${
                  isMine
                    ? "bg-green-500 text-black rounded-2xl rounded-br-sm"
                    : "bg-gray-700 text-white rounded-2xl rounded-bl-sm"
                }`}
              >
                {!isMine && (
                  <p className="text-[10px] text-gray-300 mb-1">
                    {m.user_name}
                  </p>
                )}

                <p className="break-words">{m.content}</p>

                <p className="text-[10px] text-right mt-1 opacity-70">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="p-2 border-t border-gray-700 flex gap-2 bg-gray-900"
      >
        <input
          className="flex-1 p-2 rounded-full bg-gray-800 outline-none text-sm"
          placeholder="Mensaje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="bg-purple-600 px-4 rounded-full">➤</button>
      </form>
    </div>
  );
}

export default ComboChat;
