import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data: { labels, values } }) => {
    const chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
        },
      ],
    };
  

  return (
    <div>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
