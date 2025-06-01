import App from "@/App";
import Auth from "@/pages/auth";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import { createBrowserRouter } from "react-router-dom";
import { AuthenUser } from "./AuthenUser";

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {path:"",element:<Auth/>},
      {path:"chat",element:<AuthenUser><Chat/></AuthenUser>},
      {path:"profile",element:<AuthenUser><Profile/></AuthenUser>},
      {path:"*",element:<Auth/>}
    ]
  }
])

export default router