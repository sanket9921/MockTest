import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import MenuDropdown from "./MenuDropdown";
import QuestionItem from "./QuestionItem";

const PassageItem = ({ passage, onAction }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full p-4 text-left bg-blue-100 flex justify-between items-center">
            <span>
              {passage.content_type === "image" ? (
                <img
                  src={passage.content}
                  alt="Passage"
                  className="w-full h-auto"
                />
              ) : (
                passage.content
              )}
            </span>
            <div className="flex items-center">
              <MenuDropdown type="passage" onAction={onAction} />
              <ChevronDownIcon
                className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="p-4 bg-gray-50">
            {passage.questions.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                onAction={onAction}
              />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default PassageItem;
