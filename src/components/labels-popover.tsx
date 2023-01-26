import React from "react";
import { Popover } from "@headlessui/react";
import { HiTag } from "react-icons/hi";
import { ILabel } from "@/types/IBoard";

interface Props {
  labels?: ILabel[];
}

const LabelsPopover = ({ labels }: Props) => {
  return (
    <Popover className="relative">
      <Popover.Button className="p-2 rounded-sm bg-gray-200 hover:bg-gray-300 w-full shadow flex items-center gap-2">
        <HiTag />
        <span>Labels</span>
      </Popover.Button>
      <Popover.Panel className="absolute mt-2 bg-white ring-1 ring-gray-300 shadow rounded-sm p-2 w-72 divide-y-2 divide-gray-300 z-50">
        <h5 className="text-center mb-2">Labels</h5>
        <div className="flex py-2">
          {labels?.map((label) => (
            <div
              className="rounded-full mr-2 bg-[#000000] bg-opacity-75 px-2 py-1 text-sm text-white"
              style={{ backgroundColor: label.color }}
              key={label.id}
            >
              {label.name}
            </div>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default LabelsPopover;
