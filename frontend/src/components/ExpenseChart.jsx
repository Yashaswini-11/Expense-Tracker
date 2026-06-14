import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({ expenses }) {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += Number(
      expense.amount
    );
  });

  const data = {
    labels: Object.keys(categoryTotals),

    datasets: [
      {
        data: Object.values(categoryTotals),
      },
    ],
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "20px auto",
      }}
    >
      <Pie data={data} />
    </div>
  );
}

export default ExpenseChart;