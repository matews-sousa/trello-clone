import React, { useState } from "react";
import { Popover } from "@headlessui/react";
import { HiPhotograph, HiSearch } from "react-icons/hi";
import api from "@/lib/api";
import { IPhoto } from "@/types/IPhoto";

interface Props {
  selectImage: (url: string) => void;
}

const SelectCoverPopover = ({ selectImage }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<IPhoto[]>([]);
  const searchImages = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await api.get("/search/photos", {
        params: {
          query: searchTerm,
          per_page: 10,
        },
      });
      setImages(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover className="relative">
      <Popover.Button className="p-2 rounded-sm bg-gray-200 hover:bg-gray-300 w-full shadow flex items-center gap-2">
        <HiPhotograph />
        <span>Cover</span>
      </Popover.Button>
      <Popover.Panel className="absolute mt-2 bg-white ring-1 ring-gray-300 shadow rounded-sm p-2 w-72 z-50">
        <h4 className="font-medium">Photo Search</h4>
        <p className="text-sm mb-2">Search Unsplash for photos</p>
        <form className="relative" onSubmit={searchImages}>
          <input
            type="text"
            className="input"
            placeholder="Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-500 rounded-xl px-3 text-white absolute right-1 inset-y-1">
            <HiSearch className="h-5 w-5" />
          </button>
        </form>
        <div className="grid grid-cols-3 gap-1 mt-4">
          {images?.map((image) => (
            <img
              key={image.id}
              src={image.urls.thumb}
              alt={image.description}
              className="w-full h-24 object-cover rounded-sm hover:ring-2 ring-blue-400 cursor-pointer"
              onClick={() => selectImage(image.urls.thumb)}
            />
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default SelectCoverPopover;
