import { useState } from "react";
import { motion } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-3 flex justify-between items-center focus:outline-none"
      >
        <span className="font-medium">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="py-2 text-gray-600">{answer}</p>
      </motion.div>
    </div>
  );
};

export default function FAQ() {
  const faqData = [
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building UIs.",
    },
    {
      question: "What is Vite?",
      answer: "Vite is a fast frontend tooling for modern web projects.",
    },
    {
      question: "What is Tailwind CSS?",
      answer: "Tailwind CSS is a utility-first CSS framework.",
    },
  ];

  return (
    <div className="max-w-md mx-auto mt-5 p-4 border rounded-lg shadow">
      {faqData.map((faq, index) => (
        <FAQItem key={index} {...faq} />
      ))}
    </div>
  );
}
