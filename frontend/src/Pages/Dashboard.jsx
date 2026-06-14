import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSignOutAlt } from "react-icons/fa";
import API from "../services/api";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses", {
        headers: {
          Authorization: token,
        },
      });

      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(
          `/expenses/${editId}`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setEditId(null);
      } else {
        await API.post(
          "/expenses",
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      setFormData({
        title: "",
        amount: "",
        category: "",
      });

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const editExpense = (expense) => {
    setEditId(expense._id);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const totalExpense = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  const categories = [
    "All",
    ...new Set(
      expenses.map(
        (expense) => expense.category
      )
    ),
  ];

  const filteredExpenses =
    expenses.filter((expense) => {
      const searchMatch =
        expense.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const categoryMatch =
        filterCategory === "All" ||
        expense.category ===
          filterCategory;

      return (
        searchMatch &&
        categoryMatch
      );
    });

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <h1>Expense Tracker</h1>

        <button
          onClick={logout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div
        style={{
          border:
            "2px solid green",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Total Expenses</h2>
        <h1>₹ {totalExpense}</h1>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          {editId
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </form>

      <hr />

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <select
        value={filterCategory}
        onChange={(e) =>
          setFilterCategory(
            e.target.value
          )
        }
      >
        {categories.map(
          (category) => (
            <option
              key={category}
            >
              {category}
            </option>
          )
        )}
      </select>

      <hr />

      {filteredExpenses.map(
        (expense) => (
          <div
            key={expense._id}
            style={{
              border:
                "1px solid #ddd",
              padding: "15px",
              marginBottom:
                "10px",
              borderRadius:
                "10px",
            }}
          >
            <h3>
              {expense.title}
            </h3>

            <p>
              ₹
              {
                expense.amount
              }
            </p>

            <p>
              {
                expense.category
              }
            </p>

            <button
              onClick={() =>
                editExpense(
                  expense
                )
              }
            >
              <FaEdit />
            </button>

            {" "}

            <button
              onClick={() =>
                deleteExpense(
                  expense._id
                )
              }
            >
              <FaTrash />
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;