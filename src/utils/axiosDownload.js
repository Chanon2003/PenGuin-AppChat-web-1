// axiosDownload.js
import axios from 'axios';

const axiosDownload = axios.create({
  withCredentials: false, // ❗ สำคัญ: ไม่แนบ cookie/credentials ไปกับ request
});

export default axiosDownload;
