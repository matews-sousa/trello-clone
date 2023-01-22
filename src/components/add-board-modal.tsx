import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiPlus, HiOutlineX } from "react-icons/hi";

import SelectCoverPopover from "./select-cover-popover";
import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AddBoardModal = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [title, setTitle] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const addBoard = async () => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "boards"), {
        title,
        cover: imageSelected,
        ownerId: user.uid,
        createdAt: new Date(),
        lists: [],
      });
      closeModal();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <button type="button" onClick={openModal} className="btn">
        <HiPlus />
        <span>Add</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col items-end">
                  {imageSelected ? (
                    <>
                      <button
                        onClick={() => setImageSelected("")}
                        className="absolute top-2 right-2 btn p-0 w-10 h-10 bg-red-600 hover:bg-red-500"
                      >
                        <HiOutlineX className="h-6 w-6" />
                      </button>
                      <img
                        src={imageSelected}
                        className="w-full h-28 object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-full h-28"></div>
                  )}

                  <div className="mt-6 w-full">
                    <input
                      type="text"
                      className="input mb-4"
                      placeholder="Board title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <SelectCoverPopover
                      selectImage={(url: string) => {
                        setImageSelected(url);
                      }}
                    />
                  </div>

                  <div className="mt-4 space-x-4 flex">
                    <button
                      className="btn bg-gray-200 hover:bg-gray-300 text-black"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button className="btn" onClick={addBoard}>
                      Add
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddBoardModal;
