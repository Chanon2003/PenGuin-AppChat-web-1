import victory from '@/assets/victory.svg'
import Background from '@/assets/penguin.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { toast } from 'sonner'
import Axios from '@/utils/Axios'
import SummaryApi from '@/common/SummaryApi'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [email1, setEmail1] = useState("")
  const [password1, setPassword1] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [tabValue, setTabValue] = useState("signup");

  const { setUserInfo } = useAppStore()

  const navigate = useNavigate()

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email1.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password1.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignup()) return;

    try {
      const response = await Axios({
        ...SummaryApi.signup_route,
        data: { email, password }
      });

      setEmail('')
      setPassword('')
      setConfirmPassword('')
      toast.success("Signup successful!");
      alert("Done");
      setTabValue('login');
    } catch (error) {
      const message =
        error.response?.data?.msg || "Signup failed. Please try again.";
      toast.error(message);
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const response = await Axios({
        ...SummaryApi.login_route,
        data: { email: email1, password: password1 },
      });

      const { data: responseData } = response;

      if (response.status === 201 && responseData?.user?.id) {
        toast.success("Login successful!");
        setUserInfo(responseData.user)
        setEmail1('')
        setPassword1('')
        // ตรวจว่าเคย setup profile แล้วหรือยัง
        if (responseData.user.profileSetup) {
          navigate('/chat');
        } else {
          navigate('/profile');
        }
      }
    } catch (error) {
      console.log("error.response", error.response);
      const message =
        error.response?.data?.msg || "Login failed. Please try again.";
      console.log('message', message)
      toast.dismiss(); // เคลียร์ toast เดิม
      toast.error(message);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">WelCome</h1>
              <img src={victory} alt="victoryEmoji" className='h-[100px]' />
            </div>
            <p className='font-medium text-center'>Fill in the details to get started</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs
              className='w-3/4'
              defaultValue="login"
              value={tabValue}
              onValueChange={setTabValue}
            >
              <TabsList className='bg-transparent rounded-none w-full'>
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 duration-300 transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 duration-300 transition-all"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="flex flex-col gap-5 mt-10"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="flex flex-col gap-5"
                >
                  <Input
                    placholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email1}
                    placeholder="Email"
                    onChange={(e) => setEmail1(e.target.value)}
                  />
                  <Input
                    placholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password1}
                    placeholder="Password"
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                  <Button
                    className="rounded-full p-6"
                    type='submit'
                  >
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent
                value="signup"
                className="flex flex-col gap-5"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUp();
                  }}
                  className="flex flex-col gap-5"
                >
                  <Input
                    placholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    className="rounded-full p-6"
                    type="submit"
                  >
                    Signup
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex justify-center items-center'>
          <img
            src={Background}
            alt="background login"
            className='h-[700px]'
          />
        </div>
      </div>
    </div>
  )
}
export default Auth