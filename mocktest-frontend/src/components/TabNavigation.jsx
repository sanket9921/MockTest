const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "mcq", label: "MCQ" },
    { id: "msq", label: "MSQ" },
    { id: "fill", label: "Fill in the Blank" },
  ];

  return (
    <div className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-2 px-4 ${
            activeTab === tab.id ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
