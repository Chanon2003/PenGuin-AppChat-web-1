import SummaryApi from "@/common/SummaryApi";
import Axios from "./Axios";
import { useAppStore } from "@/store";
import { toast } from "sonner";

export const fullLogoutLogic = async () => {
  const { logout } = useAppStore.getState();

  try {
    const response = await Axios({
      ...SummaryApi.logout,
    });

    if (response.data.success) {
      toast.success("Logout Success");

      logout(); // ล้าง state และ localStorage

      await useAppStore.clearStorage(); // ล้าง persist storage
    } else {
      toast.error("Logout failed. Please try again.");
    }
  } catch (error) {
    toast.error("Logout failed. Please try again.");
    console.warn("Logout API failed", error);
  }
};


