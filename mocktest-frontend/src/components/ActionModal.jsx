import { motion } from "framer-motion";

const ActionModal = ({ data, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-semibold capitalize">
          {data.action.replace(/([A-Z])/g, " $1")}
        </h2>
        <div className="mt-4">{children}</div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ActionModal;
