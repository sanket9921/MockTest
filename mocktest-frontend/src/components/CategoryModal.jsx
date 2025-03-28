import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";
import ActionModal from "./ActionModal";
import CategoryForm from "./Forms/CategoryForm";

const CategoryModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFormModal, setCategoryFormModal] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ActionModal data={{ action: "Manage Categories" }} onClose={onClose}>
        <div>
          <h5>Categories</h5>
          {loading ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="d-flex justify-content-between align-items-center p-2 border-bottom"
              >
                <span>{category.category_name}</span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    setCategoryFormModal({ action: "Edit Category", category })
                  }
                >
                  Edit
                </button>
              </div>
            ))
          )}
          <button
            className="btn btn-success mt-3"
            onClick={() => setCategoryFormModal({ action: "Add Category" })}
          >
            + Add Category
          </button>
        </div>
      </ActionModal>

      {categoryFormModal && (
        <CategoryForm
          data={categoryFormModal}
          onClose={() => setCategoryFormModal(null)}
          refreshCategories={fetchCategories}
        />
      )}
    </>
  );
};

export default CategoryModal;
