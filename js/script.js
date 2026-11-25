// map.js
// Load data and displays hospitals, roads, and parks using Leaflet

// ============================================
// Step 1: Initialize the map
// ============================================

// Create a Leaflet map in the "map" div
// setView([lat, lon], zoom)
const map = L.map('map').setView([41.257, -95.99], 13);


// ============================================
// Step 2: Add a basemap
// ============================================

// Tile layer provides the visual background
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// ============================================
// Step 3: Add/Customize controls
// ============================================

// Move zoom buttons (default = topleft)
map.zoomControl.setPosition('topright');

// Add a scale bar
L.control.scale().addTo(map);


// ============================================
// Step 4: Create layer groups
// ============================================

// Layer groups allow toggling layers on/off
const lineLayer = L.layerGroup().addTo(map);
const pointLayer = L.layerGroup().addTo(map);
const polygonLayer = L.layerGroup().addTo(map);

// UI control to toggle layers
L.control.layers(null, {
    "Roads": lineLayer,
    "Traffic Signals": pointLayer,
    "Parks": polygonLayer
}).addTo(map);


// ============================================
// Step 5: Load point data (Traffic Signals)
// ============================================
fetch('data/Traffic_Signals.geojson')
    .then(res => res.json())
    .then(data => {L.geoSON(data, {

        // Style points as circle markers
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#d65454',
                color: '#ffffff',
                weight: 1,
                fillOpacity: 0.8
            });
        },
    
    // Add popups
    onEachFeature: function(feature, layer) {
        const name = feature.properties.name || "Traffic Signal";
        layer.bindPopup(`<strong>${name}</strong>`);
        }

    }).addTo(pointLayer);

  })
  .catch(err => console.error('Error loading traffic signals:', err));


// ============================================
// Step 6: Load line data (Roads & Centerlines)
// ============================================


fetch('data/Roads_Centerlines.geojson')
  .then(res => res.json())
  .then(data => {L.geoJSON(data, {

      // Style lines
      style: function(feature) {
        return {
          color: '#28312e',
          weight: 3
        };
      },
    }).addTo(lineLayer);

  })
  .catch(err => console.error('Error loading roads and centerlines:', err));


// ============================================
// Step 7: Load polygon data (Parks & Recreation)
// ============================================

fetch('data/Parks_&_Recreation.geojson')
  .then(res => res.json())
  .then(data => {

    // Add polygon and immediately fit to its bounds
    map.fitBounds(
      L.geoJSON(data, {
        style: function() {
          return {
            color: '#70b37f',
            weight: 3,
            fill: false
          };
        }
      })
      .addTo(polygonLayer)
      .getBounds()
    );

  })
  .catch(err => console.error('Error loading parks and recreation areas:', err));