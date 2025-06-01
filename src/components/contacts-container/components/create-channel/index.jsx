import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Axios from "@/utils/Axios"
import SummaryApi from "@/common/SummaryApi"
import { useAppStore } from "@/store"
import { Button } from "@/components/ui/button"
import MultipleSelector from "@/components/ui/multipleselect"

const CreateChannel = () => {
  const [newChannelModal, setOpenNewContactModel] = useState(false)
  const [allContacts, setAllContacts] = useState([])
  const [channelName, setChannelName] = useState("")
  const [selectedContacts, setSelectedContacts] = useState([])
  const { setSelectedChatType, addChannel, setSelectedChatData } = useAppStore()

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.get_all_contacts_routes,
        });

        const contacts = response.data.contacts;
        const filteredContacts = contacts.filter((ct) => ct.label); // เก็บเฉพาะที่มี label
        setAllContacts(filteredContacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    getData();
  }, []);

  const CreateChannel = async () => {
    try {
      if (channelName.trim().length > 0 && selectedContacts.length > 0) {
        const response = await Axios({
          ...SummaryApi.create_channel_routes,
          data: { name: channelName, members: selectedContacts.map((contact) => contact.value) }
        })
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setOpenNewContactModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent
            className="bg-[#1c1b1b] border-none mb-2 p-3 text-white"
          >
            Create New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={newChannelModal}
        onOpenChange={setOpenNewContactModel}
      >
        <DialogContent
          className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col"

        >
          <DialogHeader>
            <DialogTitle>Please fill up the detials for new channel.</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              chassName='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
              defaultOptions={allContacts}
              placeholder='Search Contact'
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">No result found</p>
              }
            >
            </MultipleSelector>
          </div>
          <div>
            <Button
              chassName='w-full bg-purple-700 hover:bg-purple-900 transition-alll duration-300'
              onClick={CreateChannel}
            >
              Ctrate Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default CreateChannel