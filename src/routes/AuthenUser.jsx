import { useAppStore } from "@/store"

export const AuthenUser = ({ children }) => {
  const user = useAppStore((s) => s.userInfo)
  return (
    <>
      {
        user && user.id
          ? children
          : <p>Do not have account</p>
      }
    </>
  )
}