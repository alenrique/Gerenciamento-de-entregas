"use client"

import { useEffect, useRef } from "react"

interface MapPreviewProps {
  latitude: number
  longitude: number
  address: string
}

export default function MapPreview({ latitude, longitude, address }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return

    // In a real application, you would use the Google Maps JavaScript API
    // This is a simplified mock implementation
    const mapContainer = mapRef.current

    // Clear previous content
    mapContainer.innerHTML = ""

    // Create mock map elements
    const mapElement = document.createElement("div")
    mapElement.className = "relative w-full h-full bg-gray-200 rounded-md overflow-hidden"

    // Create a pin marker
    const marker = document.createElement("div")
    marker.className = "absolute w-6 h-6 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"
    marker.style.left = "50%"
    marker.style.top = "50%"
    marker.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.3)"

    // Create a pin dot
    const markerDot = document.createElement("div")
    markerDot.className = "absolute w-2 h-2 bg-white rounded-full"
    markerDot.style.left = "50%"
    markerDot.style.top = "50%"
    markerDot.style.transform = "translate(-50%, -50%)"

    // Create map info
    const mapInfo = document.createElement("div")
    mapInfo.className = "absolute bottom-0 left-0 right-0 bg-white p-2 text-xs"
    mapInfo.textContent = `${address} (${latitude}, ${longitude})`

    // Create map grid lines
    for (let i = 0; i < 5; i++) {
      const horizontalLine = document.createElement("div")
      horizontalLine.className = "absolute w-full h-px bg-gray-300"
      horizontalLine.style.top = `${20 * i}%`

      const verticalLine = document.createElement("div")
      verticalLine.className = "absolute h-full w-px bg-gray-300"
      verticalLine.style.left = `${20 * i}%`

      mapElement.appendChild(horizontalLine)
      mapElement.appendChild(verticalLine)
    }

    // Assemble the map
    marker.appendChild(markerDot)
    mapElement.appendChild(marker)
    mapElement.appendChild(mapInfo)
    mapContainer.appendChild(mapElement)
  }, [latitude, longitude, address])

  if (!latitude || !longitude) {
    return (
      <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
        Localização não disponível
      </div>
    )
  }

  return (
    <div ref={mapRef} className="w-full h-40 rounded-md overflow-hidden">
      {/* Map will be rendered here */}
    </div>
  )
}

