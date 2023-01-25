import React from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ onClose, children }: Props) => {
  return (
    <Dialog
      as="div"
      static
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-auto"
    >
      <Dialog.Overlay className="fixed inset-0 bg-gray-800/60" />

      <Dialog.Panel className="relative flex justify-center w-full p-5">
        {children}
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
