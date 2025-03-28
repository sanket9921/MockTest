import { useState, useEffect } from "react";
import ActionModal from "../ActionModal";
import { createCategory, updateCategory } from "../../services/categoryService";

const CategoryForm = ({ data, onClose, refreshCategories }) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (data.action === "Edit Category" && data.category) {
      setCategoryName(data.category.category_name);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data.action === "Edit Category") {
        await updateCategory(data.category.id, { category_name: categoryName });
      } else {
        await createCategory({ category_name: categoryName });
      }
      refreshCategories();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <ActionModal data={data} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Category Name</label>
        <input
          className="form-control"
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            {data.action === "Edit Category" ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </ActionModal>
  );
};

export default CategoryForm;
