"use client";


import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { db } from "../firebase";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";
import OpenAI from "openai"

type Message = {
  text: string;
  sender: string;
  createdAt: Timestamp;
}

const Chat = () => {

  const openai = new OpenAI ({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  //useAppContext()について
  const { selectedRoom } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setmessages] = useState<Message[]>([]);

  //各ルームRoomにおけるメッセージを取得
  useEffect(() => {
    if (selectedRoom) {
      console.log("selectedRoom:", selectedRoom); // ここに追加

      const fetchMessages = async () => {
        const roomDocRef = doc(db, "rooms", selectedRoom);
        const messagesCollectionRef = collection(roomDocRef, "messages");
  
        const q = query(messagesCollectionRef, orderBy("createdAt"));
  
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
            setmessages(newMessages);
            console.log("newMessages:", newMessages);
          } else {
            console.log("No messages found");
          }
        }, (error) => {
          console.error("Error fetching messages: ", error);
        });
  
        return () => {
          unsubscribe();
        };
      };
  
      fetchMessages();
    }
  }, [selectedRoom]);
  

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
        text: inputMessage,
        sender: "user",
        createdAt: serverTimestamp(),
    };

    try {
        // Firestoreにメッセージを保存
        const roomDocRef = doc(db, "rooms", selectedRoom); // "selectedRoom"を使う
        const messageCollectionRef = collection(roomDocRef, "messages");
        await addDoc(messageCollectionRef, messageData);

        // OpenAIからの返信を取得
        const gpt3Response = await openai.chat.completions.create({
            messages: [{ role: "user", content: inputMessage }],
            model: "gpt-3.5-turbo",
        });

        if (gpt3Response.choices.length > 0) {
            const botResponse = gpt3Response.choices[0].message.content;
            console.log("Bot response:", botResponse);
        } else {
            console.error("Bot response was undefined or empty");
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

  
  



  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">Room1</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <div className={message.sender === "user" ? "text-right" : "text-left"}
            >
              <div className={message.sender === "user" ? "bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                : "bg-green-500 inline-block rounded px-4 py-2 mb-2"}>
                  <p className="text-white">{message.text}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a Message"
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button className="absolute inset-y-0 right-4 flex items-center" onClick={() => sendMessage()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
