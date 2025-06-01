import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAppStore } from "./store"
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";

const App = () => {
  const navigate = useNavigate();

  const userInfo = useAppStore((s) => s.userInfo);
  const setUserInfo = useAppStore((s) => s.setUserInfo);
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    try {
      const response = await Axios({ ...SummaryApi.get_user_info });
      if (response.status === 200 && response.data.id) {
        setUserInfo(response.data);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      setUserInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!loading && userInfo) {
      // ถ้า profileSetup ยังไม่เสร็จ บังคับไปแก้ profile
      if (!userInfo.profileSetup && location.pathname !== '/profile') {
        navigate('/profile');
      }
      // ถ้า profileSetup เสร็จแล้ว ไม่ต้อง redirect อัตโนมัติ (ปล่อยให้ user navigate เอง)
    }
  }, [loading, userInfo, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Outlet />
    </main>
  )
}
export default App