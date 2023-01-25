import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-500 border-r-gray-500 animate-spin"
        aria-label="Loading..."
      ></div>
    </div>
  );
};

export default Loader;
