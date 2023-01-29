import Image from "next/image";
import React from "react";

interface Props {
  photoURL?: string | null;
  displayName: string;
}

const Avatar = ({ photoURL, displayName }: Props) => {
  return (
    <>
      {photoURL ? (
        <Image
          src={photoURL}
          alt={displayName}
          height={40}
          width={40}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-semibold">{displayName[0]}</span>
        </div>
      )}
    </>
  );
};

export default Avatar;
