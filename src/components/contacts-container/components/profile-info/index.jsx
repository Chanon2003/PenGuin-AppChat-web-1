import { useAppStore } from "@/store"
import { getColor } from "@/utils/colors"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaEdit } from "react-icons/fa"
import { IoLogOut } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { fullLogoutLogic } from "@/utils/Full-logout"
import { toast } from "sonner"

const ProfileInfo = () => {
  const userInfo = useAppStore((s) => s.userInfo)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fullLogoutLogic()
      navigate("/auth"); 
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.warn("Logout API failed", error);
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#212b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative rounded-full">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {
              userInfo.image ? (
                <AvatarImage
                  src={userInfo.image}
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                  {userInfo.firstName
                    ? userInfo.firstName[0]
                    : userInfo.email?.charAt(0)?.toUpperCase()
                  }
                </div>
              )
            }
          </Avatar>
        </div>
        <div>
          {
            userInfo.firstName && userInfo.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}` 
              : ""
          }
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FaEdit
              className="text-purple-500 text-xl font-medium cursor-pointer"
              onClick={() => navigate('/profile')}
            />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
            Edit Profile
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <IoLogOut
              className="text-purple-500 text-xl font-medium cursor-pointer"
              onClick={handleLogout}
            />
          </TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
export default ProfileInfo