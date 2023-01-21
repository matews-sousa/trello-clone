import React, { useState } from "react";

interface Props {
  btnText: string;
  inputPlaceholder: string;
  addFn: (inputValue: string) => void;
}

const AddButton = ({ btnText, inputPlaceholder, addFn }: Props) => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      {isInputOpen ? (
        <div className="bg-white shadow rounded-lg p-2">
          <input
            type="text"
            placeholder={inputPlaceholder}
            autoFocus
            className="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex mt-2 space-x-2">
            <button
              className="btn"
              onClick={() => {
                addFn(inputValue);
                setIsInputOpen(false);
                setInputValue("");
              }}
            >
              Add
            </button>
            <button
              className="btn bg-gray-400 hover:bg-gray-300 text-black"
              onClick={() => setIsInputOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <button className="btn" onClick={() => setIsInputOpen(true)}>
          {btnText}
        </button>
      )}
    </div>
  );
};

export default AddButton;
