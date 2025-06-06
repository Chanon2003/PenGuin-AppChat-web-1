import SummaryApi from '@/common/SummaryApi'
import { useSocket } from '@/context/SocketContext'
import { useAppStore } from '@/store'
import Axios from '@/utils/Axios'
import EmojiPicker from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'

const MessageBar = () => {
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const emojiRef = useRef()
  const fileInputRef = useRef()

  const socketRef = useSocket();
  const socket = socketRef?.current;
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress
  } = useAppStore()

  const handleAddEmoji = (emojiData, event) => {
    setMessage((msg) => msg + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (!socket || !socket.connected) {
      console.warn("Socket not connected");
      return;
    }

    if (selectedChatType === 'contact') {
      socket.emit('sendMessage', {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: 'text',
        fileUrl: undefined,
      });
    } else if (selectedChatType === 'channel') {
      socket.emit('send-channel-message', {
        sender: userInfo.id,
        content: message,
        messageType: 'text',
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0]

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderType', 'chat');
        setIsUploading(true)
        const response = await Axios({
          ...SummaryApi.upload_file_routes,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
          }
        })

        if (response.status === 200 && response.data) {
          setIsUploading(false)
          if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: 'file',
              fileUrl: response.data.filePath,
            })
          } else if (selectedChatType === 'channel') {
            socket.emit('send-channel-message', {
              sender: userInfo.id,
              content: undefined,
              messageType: 'file',
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            })
          }

        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [emojiRef])

  // useEffect(() => {
  //   if (socket?.current) {
  //     console.log("Socket ready:", socket.current.connected);
  //     console.log("socketRef:", socketRef); // จะเห็นว่าเป็น { current: Socket }

  //     console.log("socket:", socket); // จะเห็นว่าเป็น Socket {...}

  //     console.log("socket.connected:", socket?.connected); // true ถ้าเชื่อมแล้ว
  //   }
  // }, [socket]);

  return (
    <div className="h-10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && message.trim()) {
              handleSendMessage();
            }
          }}
        />
        <button
          className='text-neutral-500 focus:border-none focus:outline-none  focus:text-white duration-300 transition-all'
          onClick={handleAttachmentClick}
        >
          <GrAttachment className='text-2xl' />
        </button>
        <input
          type="file"
          className='hidden'
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className='text-neutral-500 focus:border-none focus:outline-none  focus:text-white duration-300 transition-all'
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          <div
            className='absolute bottom-16 right-0'
            ref={emojiRef}
          >
            <EmojiPicker
              theme='dark'
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className='bg-[#8717ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none  focus:text-white duration-300 transition-all cursor-pointer'
        onClick={handleSendMessage}
      >
        <IoSend className='text-2xl' />
      </button>
    </div>
  )
}
export default MessageBar