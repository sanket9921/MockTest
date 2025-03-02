import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import MenuDropdown from "./MenuDropdown";
import OptionItem from "./OptionItem";

const QuestionItem = ({ question, onAction }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton className="w-full p-3 text-left bg-gray-200 flex justify-between items-center">
            <span>
              {question.content_type === "image" ? (
                <img src={question.content} alt="Question" />
              ) : (
                question.content
              )}
            </span>
            <div className="flex items-center">
              <MenuDropdown
                type="question"
                onAction={(action) => onAction(action, question)}
              />
              <ChevronDownIcon
                className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
              />
            </div>
          </DisclosureButton>

          <DisclosurePanel className="p-3 bg-white">
            {question.options.map((option, index) => (
              <OptionItem key={index} option={option} onAction={onAction} />
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default QuestionItem;
