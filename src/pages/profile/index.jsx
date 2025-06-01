import { useAppStore } from "@/store"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from 'react-icons/io5'
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/utils/colors";
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Axios from "@/utils/Axios";
import SummaryApi from "@/common/SummaryApi";
import Loading from "@/components/Loading";

const Profile = () => {
  const navigate = useNavigate()

  const userInfo = useAppStore((s) => s.userInfo)
  const setUserInfo = useAppStore((s) => s.setUserInfo)

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(userInfo.image || null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);

  const validateProfile = () => {
    if (!firstName) {
      toast.error('FirstName is required.')
      return false
    }
    if (!lastName) {
      toast.error('Lastname is required.')
      return false
    }
    return true
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const payload = { firstName, lastName, color: selectedColor }
        const response = await Axios({
          ...SummaryApi.update_profile_route,
          data: payload
        })
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success('Profile updated successfully.');
          navigate('/chat');
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate('/chat');
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async (e) => {
    setLoading(true)
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);                // ไฟล์รูป
      formData.append('folderType', 'profile');      // folder ปลายทางบน Cloudinary

      const response = await Axios({
        ...SummaryApi.add_profile_image,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
      // setImage(response.data.image);
      setUserInfo({
        ...userInfo,
        image: response.data.image,
      });
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      // คุณอาจโชว์ toast หรือ error message บนหน้า UI
    } finally {
      setLoading(false)
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.remove_profile_image
      })
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success('Image removed successfully.');
        setImage(null);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(userInfo.image)
    }
  }, [userInfo])

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                loading ? (
                  <Loading />
                ) : image ? (
                  <AvatarImage
                    src={image}
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                    {firstName
                      ? firstName[0]
                      : userInfo.email?.charAt(0)?.toUpperCase()
                    }
                  </div>
                )
              }
            </Avatar>
            {
              hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {
                    image
                      ? <FaTrash className="text-white text-3xl cursor-pointer" />
                      : <FaPlus className="text-white text-3xl cursor-pointer" />
                  }
                </div>
              )
            }
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jgp, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder='Email'
                type='email'
                disabled 
                value={userInfo.email}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full">
              <Input
                placeholder='First Name'
                type='text'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full">
              <Input
                placeholder='Last Name'
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full flex gap-5">
              {
                colors.map((color, index) => {
                  return (
                    <div
                      className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                    ${selectedColor === index
                          ? "outline-2 outline-white/50"
                          : ""
                        }`}
                      key={index}
                      onClick={() => setSelectedColor(index)}
                    ></div>
                  );
                })
              };
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900  transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Profile