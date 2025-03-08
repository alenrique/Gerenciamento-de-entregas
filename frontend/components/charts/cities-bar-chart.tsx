"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface CityData {
  city: string
  count: number
}

interface CitiesBarChartProps {
  data: CityData[]
}

export default function CitiesBarChart({ data }: CitiesBarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Sort data by count in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedData.map((item) => item.city),
        datasets: [
          {
            label: "Número de Entregas",
            data: sortedData.map((item) => item.count),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 24,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `${value} entregas`
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
            grid: {
              borderDash: [2, 4],
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} />
    </div>
  )
}

