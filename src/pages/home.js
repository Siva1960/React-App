import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const universities = {
  labels: [
    "Annamalai University",
    "Andhra University",
    "Ahmedabad University",
    "Periyar University",
    "Sree Rama Krishna Degree College",
  ],
  datasets: [
    {
      label: "No of students per University",
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [5000, 1505, 2001, 3233, 4100],
    },
  ],
};

const state = {
  labels: ["Kerala", "Tamil Nadu", "Karnataka", "Andra", "Goa"],
  datasets: [
    {
      label: "No of students per State",
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [10000, 13300, 9000, 5598, 3220],
    },
  ],
};

function Home(props) {
  return (
    <div className="main">
      <div>
        <Bar
          data={universities}
          options={{
            title: {
              display: true,
              text: "No of students per University",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>

      <div>
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: "No of students per State",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Home;
