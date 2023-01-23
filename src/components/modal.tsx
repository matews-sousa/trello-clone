import { Dialog } from "@headlessui/react";
import React, { useRef } from "react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ onClose, children }: Props) => {
  const overlayRef = useRef();

  return (
    <Dialog
      as="div"
      static
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        className="fixed inset-0 bg-gray-800/60"
      />

      <div className="relative flex items-center justify-center w-1/2">
        {children}
      </div>
    </Dialog>
  );
};

export default Modal;
