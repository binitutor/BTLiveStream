import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, Line, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line as LineChart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const chartData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [
      {
        label: 'Active Participants',
        data: [120, 150, 210, 180, 230, 200],
        borderColor: '#234756',
        backgroundColor: 'rgba(35, 71, 86, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#c66f3d',
      },
      {
        label: 'Bandwidth (Mbps)',
        data: [80, 95, 140, 130, 160, 150],
        borderColor: '#c66f3d',
        backgroundColor: 'rgba(198, 111, 61, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#234756',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#234756',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#234756' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#234756' },
        grid: { color: 'rgba(35, 71, 86, 0.1)' },
      },
    },
  };

  return (
    <section id="dashboard" className="section">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <h2 className="section-title">Live Call Analytics</h2>
            <p className="text-muted">
              Monitor active rooms and quality metrics. ChartJS highlights engagement and
              bandwidth usage by hour.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="text-primary fw-bold">38</h3>
                <p className="mb-0 text-muted">Active Rooms</p>
              </div>
              <div className="stat-card">
                <h3 className="text-primary fw-bold">214</h3>
                <p className="mb-0 text-muted">Participants</p>
              </div>
              <div className="stat-card">
                <h3 className="text-primary fw-bold">4.8/5</h3>
                <p className="mb-0 text-muted">Call Quality</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="chart-card">
              <LineChart data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
