const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "mcq", label: "MCQ" },
    { id: "msq", label: "MSQ" },
    { id: "fill", label: "Fill in the Blank" },
    { id: "passage", label: "Passage" },
  ];

  return (
    <ul className="nav nav-tabs border-bottom ">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.id}>
          <button
            className={`nav-link text-dark ${
              activeTab === tab.id ? "fw-bold border-bottom-2" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabNavigation;
