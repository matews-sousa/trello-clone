import React from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

const Modal = ({ open, onClose, children }: Props) => {
  return (
    <Dialog
      as="div"
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-auto"
    >
      <Dialog.Overlay className="fixed inset-0 bg-gray-800/60" />

      <Dialog.Panel className="relative flex items-center justify-center h-screen w-full p-5">
        {children}
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
