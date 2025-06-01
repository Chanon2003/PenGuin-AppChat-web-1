import SummaryApi from "@/common/SummaryApi";
import { useAppStore } from "@/store";
import Axios from "@/utils/Axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import axiosDownload from "@/utils/axiosDownload";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/utils/colors";

const MessageContainer = () => {

  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore()

  const [showImage, setshowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const renderChannelMessage = (message) => {
    const isSender = message.sender._id === userInfo.id;

    return (
      <div className={`mt-5 ${isSender ? 'text-right' : 'text-left'}`}>
        {message.messageType === 'text' && (
          <div
            className={`${isSender
              ? "bg-[#2a2b33] text-white/80 border-[#8417ff]/50"
              : "bg-[#8417ff] text-white/80 border border-white"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {
          message.messageType === 'file' && <div className={`${message.sender._id === userInfo.id
            ? "bg-[#8417ff] text-white/80 border border-white"
            : "bg-[#2a2b33] text-white/80 border-[#8417ff]/50 "
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {
              checkIfImage(message.fileUrl)
                ? <div
                  className="cursor-pointer"
                  onClick={() => {
                    setImageUrl(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <img
                    src={`${message.fileUrl}`}
                    alt=""
                    height={300}
                    width={300}
                  />
                </div>
                : <div className="w-full max-w-md bg-black/20 rounded-xl p-4 flex items-center gap-4 shadow-md">
                  {/* ไอคอน ZIP */}
                  <div className="text-white/80 text-3xl shrink-0">
                    <MdFolderZip />
                  </div>

                  {/* ชื่อไฟล์ (อยู่ตรงกลางและ responsive) */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm break-words">
                      {message.fileUrl.split('/').pop()}
                    </p>
                  </div>

                  {/* ไอคอนดาวน์โหลด */}
                  <div
                    className="text-white/80 text-2xl shrink-0 hover:bg-black/50 p-2 rounded-full cursor-pointer transition-all duration-300"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </div>
                </div>
            }
          </div >
        }
        {!isSender ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={message.sender.image}
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.charAt(0)
                  : message.sender.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && <div className="text-center text-gray-500 my-2">
            {moment(message.timestamp).format("LL")}
          </div>}
          {
            selectedChatType === 'contact' && renderDMMessage(message)
          }
          {selectedChatType === 'channel' && renderChannelMessage(message)}
        </div>
      )
    })
  };

  const renderDMMessage = (message) => (
    <div className={`${message.sender === selectedChatData._id
      ? 'text-left'
      : 'text-right'
      }`}>
      {message.messageType === 'text' && (
        <div className={`${message.sender !== selectedChatData._id
          ? "bg-[#8417ff] text-white/80 border border-white"
          : "bg-[#2a2b33] text-white/80 border-[#8417ff]/50 "
          }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div >
      )}
      {
        message.messageType === 'file' && <div className={`${message.sender !== selectedChatData._id
          ? "bg-[#8417ff] text-white/80 border border-white"
          : "bg-[#2a2b33] text-white/80 border-[#8417ff]/50 "
          }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {
            checkIfImage(message.fileUrl)
              ? <div
                className="cursor-pointer"
                onClick={() => {
                  setImageUrl(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
              : <div className="w-full max-w-md bg-black/20 rounded-xl p-4 flex items-center gap-4 shadow-md">
                {/* ไอคอน ZIP */}
                <div className="text-white/80 text-3xl shrink-0">
                  <MdFolderZip />
                </div>

                {/* ชื่อไฟล์ (อยู่ตรงกลางและ responsive) */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm break-words">
                    {message.fileUrl.split('/').pop()}
                  </p>
                </div>

                {/* ไอคอนดาวน์โหลด */}
                <div
                  className="text-white/80 text-2xl shrink-0 hover:bg-black/50 p-2 rounded-full cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </div>
              </div>
          }
        </div >
      }
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format('LT')}
      </div>
    </div>
  )

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      const response = await axiosDownload({
        method: 'get',
        url,
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        }
      });

      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const contentDisposition = response.headers['content-disposition'];

      let fileName = 'file.zip'; // ค่า default เผื่อไม่มีชื่อไฟล์
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        } else {
          fileName = url.split('/').pop();
        }
      } else {
        fileName = url.split('/').pop();
      }

      // ถ้าชื่อไฟล์ไม่มี .zip ต่อท้าย และเป็น octet-stream ให้ต่อ .zip เข้าไป
      if (!fileName.toLowerCase().endsWith('.zip') && contentType === 'application/octet-stream') {
        fileName += '.zip';
      }

      const blob = new Blob([response.data], { type: contentType });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
      setFileDownloadProgress(0)
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.get_all_messages_routes,
          data: { id: selectedChatData._id }
        })
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error })
      }
    };
    const getChannelMessages = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.get_channel_messages,
          url: `${SummaryApi.get_channel_messages.url}/${selectedChatData._id}`,

        })
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error })
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === 'channel') getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChatMessages])

  return (
    <>
      {/* ส่วนแสดงข้อความและรูปย่อ */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full relative"
        onClick={(e) => {
          if (e.target.tagName === 'IMG') {
            const imageSrc = e.target.getAttribute('src');
            if (imageSrc) {
              setImageUrl(imageSrc);
              setshowImage(true);
            }
          }
        }}
      >
        {renderMessages()}
       
        <div ref={scrollRef} />
      </div>

      {/* ✅ Modal อยู่แยกนอก container จริง ๆ */}
      {showImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white p-4 rounded-xl shadow-2xl max-w-4xl w-full mx-4">
            {/* ปุ่มด้านขวาบน */}
            <div className="absolute top-3 right-3 flex gap-3">
              <button
                onClick={() => downloadFile(imageUrl)}
                className="bg-purple-400 p-2 rounded-full text-xl hover:bg-purple-700 transition cursor-pointer"
                title="Download"
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                onClick={() => {
                  setshowImage(false);
                  setImageUrl(null);
                }}
                className="bg-purple-400 p-2 rounded-full text-xl hover:bg-purple-700 transition cursor-pointer"
                title="Close"
              >
                <IoCloseSharp />
              </button>
            </div>

            {/* รูปเต็ม */}
            <img
              src={imageUrl}
              alt="modal"
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
export default MessageContainer