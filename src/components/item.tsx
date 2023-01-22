import React from "react";

interface Props {
  title: string;
  dragOverlay?: boolean;
}

const Item = ({ title, dragOverlay }: Props) => {
  return (
    <div
      className={"w-64 p-2 bg-white rounded-md shadow-md"}
      style={{
        cursor: dragOverlay ? "grabbing" : "grab",
      }}
    >
      <h3 className="text-lg">{title}</h3>
    </div>
  );
};

export default Item;
