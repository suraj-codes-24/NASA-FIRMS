import React from 'react';
import { Line } from 'react-chartjs-2';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#a0aec0',
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 6,
        padding: 20,
        font: { size: 11, family: 'Inter' }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#718096', font: { size: 10 } }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#718096', font: { size: 10 } },
      min: 0,
      max: 100
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};

const FrequencyChart = () => {
  const labels = ['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct', '11 Oct', '12 Oct', '13 Oct', '14 Oct'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Industrial Fires',
        data: [85, 45, 25, 45, 20, 60, 40, 25, 75, 45, 80, 45, 95, 55],
        borderColor: '#ff4757',
        backgroundColor: '#ff4757',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Forest Fires',
        data: [35, 10, 15, 25, 30, 85, 50, 48, 90, 30, 75, 35, 20, 15],
        borderColor: '#ffa502',
        backgroundColor: '#ffa502',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Total',
        data: [100, 55, 30, 50, 35, 95, 60, 55, 98, 55, 90, 60, 98, 65], // Simplified total
        borderColor: '#1e90ff',
        backgroundColor: '#1e90ff',
        tension: 0.4,
        pointRadius: 3,
      },
      // Adding a subtle green line for Agricultural
      {
        label: 'Agricultural',
        data: [5, 5, 5, 8, 10, 15, 12, 10, 20, 10, 15, 12, 5, 2],
        borderColor: '#2ed573',
        backgroundColor: '#2ed573',
        tension: 0.4,
        pointRadius: 3,
      }
    ],
  };

  return (
    <div className="glass-panel" style={{ height: '220px', padding: '15px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>Fire Frequency Over Time (Oct 2023)</h3>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Line options={chartOptions} data={data} />
      </div>
    </div>
  );
};

export default FrequencyChart;
