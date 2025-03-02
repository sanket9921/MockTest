import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import MenuDropdown from "./MenuDropdown";
import QuestionItem from "./QuestionItem";

const PassageItem = ({ passage, onAction }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton className="w-full p-4 text-left bg-blue-100 flex justify-between items-center">
            <span>
              {passage.content_type === "image" ? (
                <img src={passage.content} alt="Passage" />
              ) : (
                passage.content
              )}
            </span>
            <div className="flex items-center">
              <MenuDropdown
                type="passage"
                onAction={(action) => onAction(action, passage)}
              />
              <ChevronDownIcon
                className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
              />
            </div>
          </DisclosureButton>

          <DisclosurePanel className="p-4 bg-gray-50">
            {passage.questions.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                onAction={onAction}
              />
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default PassageItem;
