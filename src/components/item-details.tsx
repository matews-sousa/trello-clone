import { db } from "@/lib/firebase";
import { IItem } from "@/types/IBoard";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import { MdOutlineDescription } from "react-icons/md";
import SelectCoverPopover from "./select-cover-popover";
import TextEditor from "./text-editor";

interface Props {
  id: string;
}

const ItemDetails = ({ id }: Props) => {
  const router = useRouter();
  const [data, setData] = useState<IItem | null>(null);
  const [cover, setCover] = useState<string>("");
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  console.log(data);

  const updateCover = async () => {
    const docRef = doc(db, "items", id);
    await updateDoc(docRef, {
      cover,
    });
  };

  const updateDescription = async (description?: string) => {
    const docRef = doc(db, "items", id);
    await updateDoc(docRef, {
      description,
    });
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);
      setData(docSnap.data() as IItem);
    };
    getData();
  }, [id]);

  useEffect(() => {
    if (cover.length > 0) {
      updateCover();
    }
  }, [cover]);

  return (
    <div className="relative bg-gray-100 min-h-[90vh] w-full max-w-3xl rounded-sm p-5">
      <button
        className="btn w-10 h-10 absolute right-2 top-2 p-0 z-20"
        onClick={() => router.push(router.asPath.split("?")[0])}
      >
        <HiOutlineX className="w-6 h-6" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {(data?.cover || cover) && (
          <div className="relative col-span-4 w-full h-44 mb-2">
            <img
              src={data?.cover || cover}
              alt=""
              className="w-full h-44 object-cover rounded-md"
            />
            <div className="absolute bottom-2 right-2">
              <SelectCoverPopover selectImage={setCover} />
            </div>
          </div>
        )}
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">{data?.title}</h2>
          <p className="text-gray-500">
            in list{" "}
            <span className="text-black font-semibold">
              {router.query.list}
            </span>
          </p>

          <div className="mt-12">
            <div className="flex items-start gap-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                <MdOutlineDescription />
                <span>Description</span>
              </h3>
              {!isEditingDescription && data?.description && (
                <button
                  className=""
                  onClick={() => setIsEditingDescription(true)}
                >
                  Edit
                </button>
              )}
            </div>
            {data?.description && !isEditingDescription ? (
              <article
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></article>
            ) : (
              <TextEditor
                setIsEditing={setIsEditingDescription}
                description={data?.description}
                updateDescription={updateDescription}
              />
            )}
          </div>
        </div>
        <div className="col-span-1 mt-20">
          <h4 className="font-semibold">Actions</h4>
          <div className="mt-4">
            {(!data?.cover || cover.length !== 0) && (
              <SelectCoverPopover selectImage={setCover} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
