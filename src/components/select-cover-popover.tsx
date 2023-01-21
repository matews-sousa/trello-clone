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
    <Popover className="relative z-50">
      <Popover.Button className="w-full btn">
        <HiPhotograph />
        <span>Cover</span>
      </Popover.Button>
      <Popover.Panel className="absolute p-4 top-12 bg-white border border-gray-400 rounded-2xl w-full max-w-sm ">
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
              src={image.urls.small}
              alt={image.description}
              className="w-full h-24 object-cover rounded-sm hover:ring-2 ring-blue-400 cursor-pointer"
              onClick={() => selectImage(image.urls.small)}
            />
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default SelectCoverPopover;
