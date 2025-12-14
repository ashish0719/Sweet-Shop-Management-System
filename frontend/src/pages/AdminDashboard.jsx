import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api";
import Header from "../components/Header";

function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [activeView, setActiveView] = useState("add");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const role = getRoleFromToken();
    if (role !== "admin") {
      navigate("/sweets");
      return;
    }

    fetchSweets();
  }, [navigate]);

  const fetchSweets = async () => {
    try {
      const response = await apiClient.get("/sweets");
      setSweets(response.data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      imageUrl: "",
    });
    setEditingSweet(null);
    setShowAddForm(true);
  };

  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      imageUrl: sweet.image || "",
    });
    setEditingSweet(sweet);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/sweets/${id}`);
      setShowDeleteConfirm(null);
      fetchSweets();
    } catch (error) {
      console.error("Failed to delete sweet:", error);
    }
  };

  const handleRestock = (sweet) => {
    setRestockingSweet(sweet);
    setRestockQuantity("");
    setShowRestockModal(true);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/sweets/${restockingSweet.id}/restock`, {
        quantity: parseInt(restockQuantity),
      });
      setRestockingSweet(null);
      setRestockQuantity("");
      setShowRestockModal(false);
      fetchSweets();
    } catch (error) {
      console.error("Failed to restock sweet:", error);
      setError(error.response?.data?.message || "Failed to restock sweet");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };
      if (formData.imageUrl) {
        payload.imageUrl = formData.imageUrl;
      }

      if (editingSweet) {
        await apiClient.put(`/sweets/${editingSweet.id}`, payload);
      } else {
        await apiClient.post("/sweets", payload);
      }

      setShowAddForm(false);
      setEditingSweet(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        imageUrl: "",
      });
      fetchSweets();
    } catch (error) {
      if (error.response?.status === 403) {
        setError(
          "Admin access only. You do not have permission to add sweets."
        );
        navigate("/sweets");
      } else {
        setError(error.response?.data?.message || "Failed to save sweet");
      }
    }
  };

  const role = getRoleFromToken();
  if (!role || role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">← Admin</h2>
            <button
              onClick={() => {
                handleAdd();
                setActiveView("add");
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold mb-4"
            >
              Add Sweet
            </button>
            <div className="space-y-2">
              <button
                onClick={() => setActiveView("add")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeView === "add"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Add Sweet
              </button>
              <button
                onClick={() => setActiveView("update")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeView === "update"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Update Sweet
              </button>
            </div>
          </div>

          <div className="flex-1">
            <>
              {showAddForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {editingSweet ? "Update Sweet" : "Add Sweet"}
                  </h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category
                        </label>
                        <input
                          id="category"
                          type="text"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Price
                        </label>
                        <input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quantity
                        </label>
                        <input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor="imageUrl"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Image URL
                        </label>
                        <input
                          id="imageUrl"
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      Submit Sweet
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sweets.map((sweet) => (
                  <div
                    key={sweet.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative mb-3">
                      {sweet.image ? (
                        <img
                          src={sweet.image}
                          alt={sweet.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-40 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🍬</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {sweet.name}
                    </h3>
                    <p className="text-primary-600 font-bold mb-3">
                      ${sweet.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          handleEdit(sweet);
                          setActiveView("add");
                        }}
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet)}
                        className="flex-1 px-3 py-2 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-sm"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(sweet)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          </div>
        </div>
      </div>

      {showRestockModal && restockingSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Restock {restockingSweet.name}
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="restockQuantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  id="restockQuantity"
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter quantity (e.g., 10 to add, -5 to decrease)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current stock: {restockingSweet.quantity}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRestockingSweet(null);
                    setRestockQuantity("");
                    setShowRestockModal(false);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Are you sure you want to delete {showDeleteConfirm.name}?
            </h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
