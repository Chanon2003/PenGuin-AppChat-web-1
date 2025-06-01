import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Lottie from "react-lottie"
import { animateionDefaultOptions, getColor } from "@/utils/colors"
import Axios from "@/utils/Axios"
import SummaryApi from "@/common/SummaryApi"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { useAppStore } from "@/store"

const NewDM = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState([]);

  const setSelectedChatType = useAppStore((s) => s.setSelectedChatType)
  const setSelectedChatData = useAppStore((s) => s.setSelectedChatData)


  const handleSearchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await Axios({
          ...SummaryApi.search_contacts_routes,
          data: { searchTerm }
        })
        if (response.status = 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([])
      }
    } catch (error) {
      console.log({ error });
    }
  }

  const selecNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([])
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
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewContactModel}
        onOpenChange={setOpenNewContactModel}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please selecat a contact.</DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => handleSearchContacts(e.target.value)}
            />
          </div>
          {
            searchedContacts.length > 0 && <ScrollArea className="h-[250px] overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selecNewContact(contact)}
                  >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                      {
                        contact.image ? (
                          <AvatarImage
                            src={contact.image}
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                            {contact.firstName
                              ? contact.firstName[0]
                              : contact.email?.charAt(0)?.toUpperCase()
                            }
                          </div>
                        )
                      }
                    </Avatar>
                    <div className="flex flex-col max-w-[180px]">
                      <span className="truncate">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs truncate">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          }
          {
            searchedContacts.length <= 0 && (
              <div className="flex-1 md:flex mt-5 md:mt-0 flex-col justify-center items-center duration-1000 transition-all">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animateionDefaultOptions}
                />
                <div className="text-opacity-89 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    H1 <span className="text-purple-500">!</span> Search new
                    <span className="to-purple-500"> </span>
                    <span className="text-purple-500">Contact</span>.
                  </h3>
                </div>
              </div>
            )
          }
        </DialogContent>
      </Dialog>
    </>
  )
}
export default NewDM