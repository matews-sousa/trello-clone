import React from "react";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";
import {
  BiBold,
  BiChevronDown,
  BiDotsHorizontal,
  BiItalic,
  BiListUl,
  BiStrikethrough,
} from "react-icons/bi";
import { BsCode } from "react-icons/bs";
import { GrBlockQuote } from "react-icons/gr";
import { Menu } from "@headlessui/react";

type MenuBarToggleFunction =
  | "toggleBold"
  | "toggleItalic"
  | "toggleStrike"
  | "toggleCode"
  | "toggleBulletList"
  | "toggleOrderedList"
  | "toggleBlockquote";

const buttons = [
  {
    name: "bold",
    icon: <BiBold />,
    command: "toggleBold",
  },
  {
    name: "italic",
    icon: <BiItalic />,
    command: "toggleItalic",
  },
];

const textOptions = [
  {
    name: "strike",
    icon: <BiStrikethrough />,
    command: "toggleStrike",
  },
  {
    name: "code",
    command: "toggleCode",
  },
  {
    name: "blockquote",
    command: "toggleBlockquote",
    icon: <GrBlockQuote />,
  },
  {
    name: "codeBlock",
    command: "toggleCodeBlock",
    icon: <BsCode />,
  },
];

const listOptions = [
  {
    name: "bulletList",
    command: "toggleBulletList",
  },
  {
    name: "orderedList",
    command: "toggleOrderedList",
  },
];

const formattingOptions = [
  {
    format: "paragraph",
    name: "Paragraph",
    command: "setParagraph",
  },
  {
    format: "heading",
    name: "Heading 1",
    command: "toggleHeading",
    args: { level: 1 },
  },
  {
    format: "heading",
    name: "Heading 2",
    command: "toggleHeading",
    args: { level: 2 },
  },
  {
    format: "heading",
    name: "Heading 3",
    command: "toggleHeading",
    args: { level: 3 },
  },
  {
    format: "heading",
    name: "Heading 4",
    command: "toggleHeading",
    args: { level: 4 },
  },
  {
    format: "heading",
    name: "Heading 5",
    command: "toggleHeading",
    args: { level: 5 },
  },
  {
    format: "heading",
    name: "Heading 6",
    command: "toggleHeading",
    args: { level: 6 },
  },
];

const EditorMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-300 rounded-t-sm flex divide-x py-2 divide-gray-400">
      <Menu as="div" className="relative px-2">
        <Menu.Button className="editor-btn flex items-center gap-1 text-sm font-bold">
          <span>Aa</span>
          <BiChevronDown />
        </Menu.Button>
        <Menu.Items className="absolute bg-white border border-gray-400 shadow rounded-sm z-30 flex flex-col w-44">
          {formattingOptions.map((option) => {
            const { format, name, command, args } = option;
            const isActive = editor.isActive(format, args);
            return (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        [command as "setParagraph" | "toggleHeading"](
                          args as { level: Level },
                        )
                        .run()
                    }
                    className={`text-left py-4 px-2 ${
                      active && "bg-gray-200"
                    } ${isActive && "bg-gray-300"}`}
                    aria-label={name}
                  >
                    {name}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Menu>
      <div className="flex items-center px-2 gap-2">
        {buttons.map((button) => {
          const { name, icon, command } = button;
          const isActive = editor.isActive(name);
          return (
            <button
              key={button.name}
              onClick={() =>
                editor.chain().focus()[command as MenuBarToggleFunction]().run()
              }
              className={`editor-btn ${isActive && "is-active"}`}
              aria-label={name}
            >
              {icon || name}
            </button>
          );
        })}
        <Menu as="div" className="relative">
          <Menu.Button className="editor-btn flex items-center gap-1 font-bold">
            <BiDotsHorizontal />
          </Menu.Button>
          <Menu.Items className="absolute bg-white border border-gray-400 shadow rounded-sm z-30 flex flex-col w-44">
            {textOptions.map((option) => {
              const { name, command } = option;
              const isActive = editor.isActive(name);
              return (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          [command as MenuBarToggleFunction]()
                          .run()
                      }
                      className={`text-left py-4 px-2 ${
                        active && "bg-gray-200"
                      } ${isActive && "bg-gray-300"}`}
                      aria-label={name}
                    >
                      {name.toUpperCase()}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
      <div className="flex items-center px-2">
        <Menu as="div" className="relative">
          <Menu.Button className="editor-btn flex items-center gap-1 font-bold">
            <BiListUl />
          </Menu.Button>
          <Menu.Items className="absolute bg-white border border-gray-400 shadow rounded-sm z-30 flex flex-col w-44">
            {listOptions.map((option) => {
              const { name, command } = option;
              const isActive = editor.isActive(name);
              return (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          [command as MenuBarToggleFunction]()
                          .run()
                      }
                      className={`text-left py-4 px-2 ${
                        active && "bg-gray-200"
                      } ${isActive && "bg-gray-300"}`}
                      aria-label={name}
                    >
                      {name.toUpperCase()}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default EditorMenu;
