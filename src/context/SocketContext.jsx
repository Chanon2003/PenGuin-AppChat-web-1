import { useAppStore } from "@/store";
import { baseURL } from "@/utils/Axios";

import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const userInfo = useAppStore((s) => s.userInfo)

  useEffect(() => {
  if (!userInfo) return;

  socket.current = io(baseURL, {
    withCredentials: true,
    query: { userId: userInfo.id },
  });

  socket.current.on("connect_error", (err) => {
    console.error("Socket connect error:", err);
  });

  socket.current.on("connect", () => {
    console.log("Connected to socket server.");
  });

  const handleRecieveChannelMessage = (message)=>{
    const { selectedChatData, selectedChatType, addMessage,  addChannelInChannelList,addContactsInDMContacts } = useAppStore.getState();

    if(selectedChatType!== undefined && selectedChatData._id === message.channelId){
      addMessage(message)
    }
      addChannelInChannelList(message)
      // addContactsInDMContacts(message)
  }

  socket.current.on('receive-channel-message',handleRecieveChannelMessage)
  
  socket.current.on("receiveMessage", (message) => {
    const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

    if (
      selectedChatType !== undefined &&
      (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
    ) {
      addMessage(message);
    }
  });

  return () => {
    socket.current.disconnect();
  };
}, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

