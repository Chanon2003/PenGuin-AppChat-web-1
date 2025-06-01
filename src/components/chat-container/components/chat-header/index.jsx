import { useAppStore } from '@/store'
import { getColor } from '@/utils/colors'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {
  const closeChat = useAppStore((s) => s.closeChat)
  const selectedChatData = useAppStore((s) => s.selectedChatData)
  const selectedChatType = useAppStore((s) => s.selectedChatType)
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-center">
      <div className="flex gap-5 items-center w-full justify-between px-4">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative rounded-full">
            {
              selectedChatType === 'contact' ?
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  {
                    selectedChatData.image ? (
                      <AvatarImage
                        src={selectedChatData.image}
                        className="object-cover w-full h-full bg-black rounded-full"
                      />
                    ) : (
                      <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                        {selectedChatData.firstName
                          ? selectedChatData.firstName[0]
                          : selectedChatData.email?.charAt(0)?.toUpperCase()
                        }
                      </div>
                    )
                  }
                </Avatar>
                : <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>
            }

          </div>
          <div>
            {selectedChatType === 'channel' && selectedChatData.name}
            {selectedChatType === 'contact' &&
              selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email
            }
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className='text-neutral-500 focus:border-none focus:outline-none  focus:text-white duration-300 transition-all cursor-pointer'
            onClick={closeChat}
          >
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}
export default ChatHeader