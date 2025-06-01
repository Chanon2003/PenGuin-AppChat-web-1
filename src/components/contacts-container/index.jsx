import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import Axios from "@/utils/Axios";
import SummaryApi from "@/common/SummaryApi";
import { useAppStore } from "@/store";
import Contactlist from "../Contactlist";
import CreateChannel from "./components/create-channel";
import Penguin87 from '../../assets/penguin.webp'

const ContactContainer = () => {

  const { setDirectMessageContacts, directMessagesContacts, channels, setChannels } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await Axios({
        ...SummaryApi.get_all_contactsDM_routes
      })
      if (response.data.contacts) {
        setDirectMessageContacts(response.data.contacts);
      }
    }
    const getChannels = async () => {
      const response = await Axios({
        ...SummaryApi.get_user_channel_routes
      })
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    }
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessageContacts])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full ">
      <div className="pt-6 text-center space-y-2">
        <a href="/chat">
          <img src={Penguin87} alt="Penguin" className="w-16 h-16 mx-auto rounded-full shadow-md" />
        <h1 className="text-xl font-semibold text-green-300 tracking-wide">Penguin 87</h1>
        </a>
        
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text='Direct Message' />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scroll-hidden">
          <Contactlist contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text='Channels' />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scroll-hidden">
          <Contactlist contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}
export default ContactContainer

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-videst text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  )
}