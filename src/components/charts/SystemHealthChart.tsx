'use client'

import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface HealthDataPoint {
  time: string
  overall: number
  cpu: number
  memory: number
  disk: number
  network: number
}

interface SystemHealthChartProps {
  data: {
    timeline: HealthDataPoint[]
  }
}

export default function SystemHealthChart({ data }: SystemHealthChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null)

  const chartData = {
    labels: data?.timeline?.map(point => 
      new Date(point.time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ) || [],
    datasets: [
      {
        label: 'Overall Health',
        data: data?.timeline?.map(point => point.overall) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'CPU Usage',
        data: data?.timeline?.map(point => point.cpu) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Memory Usage',
        data: data?.timeline?.map(point => point.memory) || [],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Network I/O',
        data: data?.timeline?.map(point => point.network) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (Last 24 Hours)',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Percentage (%)',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'System Health & Resource Utilization',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time System Metrics</h3>
          <p className="text-sm text-gray-600">Live monitoring across all managed servers</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 font-medium">Live</span>
        </div>
      </div>
      
      <div className="h-80">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        {[
          { label: 'Avg Health', value: '94.2%', color: 'text-blue-600' },
          { label: 'Peak CPU', value: '78.9%', color: 'text-red-600' },
          { label: 'Avg Memory', value: '62.3%', color: 'text-orange-600' },
          { label: 'Network I/O', value: '15.4%', color: 'text-green-600' }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
