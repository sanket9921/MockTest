import { motion } from "framer-motion";

const ActionModal = ({ data, onClose, children }) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
      style={{ backdropFilter: "blur(6px)", zIndex: 1050 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded shadow-lg d-flex flex-column"
        style={{
          width: "95%", // Default for small screens (mobile)
          maxWidth: "800px", // Larger width for big screens
          maxHeight: "90vh", // Prevents overflow
        }}
      >
        {/* Modal Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="m-0 text-capitalize">
            {data.action.replace(/([A-Z])/g, " $1")}
          </h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Modal Body with Scroll */}
        <div
          className="flex-grow-1 p-3 overflow-auto"
          style={{ maxHeight: "75vh", overflowY: "auto" }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ActionModal;
