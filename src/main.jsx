import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import { RouterProvider } from 'react-router-dom'
import router from './routes/indes'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
  </SocketProvider>
)
