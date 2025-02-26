import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import MenuDropdown from "./MenuDropdown";
import OptionItem from "./OptionItem";

const QuestionItem = ({ question, onAction }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full p-3 text-left bg-gray-200 flex justify-between items-center">
            <span>
              {question.content_type === "image" ? (
                <img
                  src={question.content}
                  alt="Question"
                  className="w-full h-auto"
                />
              ) : (
                question.content
              )}
            </span>
            <div className="flex items-center">
              <MenuDropdown type="question" onAction={onAction} />
              <ChevronDownIcon
                className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="p-3 bg-white">
            {question.options.map((option, index) => (
              <OptionItem key={index} option={option} onAction={onAction} />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default QuestionItem;
