let map;
let earthquakes = [];
let markers = {};

// Initialize map
function initMap() {
    map = L.map('map').setView([20, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

// Get magnitude color
function getMagnitudeColor(magnitude) {
    if (magnitude >= 7) return '#8B0000';
    if (magnitude >= 6) return '#FF0000';
    if (magnitude >= 5) return '#FF6600';
    if (magnitude >= 4) return '#FFFF00';
    return '#00FF00';
}

// Get magnitude badge class
function getMagnitudeBadgeClass(magnitude) {
    if (magnitude >= 7) return 'magnitude-7';
    if (magnitude >= 6) return 'magnitude-6';
    if (magnitude >= 5) return 'magnitude-5';
    if (magnitude >= 4) return 'magnitude-4';
    return 'magnitude-low';
}

// Load earthquakes from USGS
async function loadEarthquakes() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
        const data = await response.json();
        
        earthquakes = data.features.map(feature => ({
            id: feature.id,
            magnitude: feature.properties.mag,
            place: feature.properties.place,
            time: new Date(feature.properties.time),
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
            depth: feature.geometry.coordinates[2],
            url: feature.properties.url
        }));

        updateStats();
        renderTable();
        renderMap();
    } catch (error) {
        console.error('Error loading earthquakes:', error);
        document.getElementById('tableContent').innerHTML = 
            '<div class="empty-state"><p>Error al cargar los datos. Por favor, intenta nuevamente.</p></div>';
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalEarthquakes').textContent = earthquakes.length;
    document.getElementById('severeEarthquakes').textContent = 
        earthquakes.filter(e => e.magnitude >= 5).length;
    document.getElementById('moderateEarthquakes').textContent = 
        earthquakes.filter(e => e.magnitude >= 4 && e.magnitude < 5).length;
}

// Render map markers
function renderMap() {
    // Clear existing markers
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    markers = {};

    // Add new markers
    earthquakes.forEach(eq => {
        const color = getMagnitudeColor(eq.magnitude);
        const radius = Math.max(5, eq.magnitude * 3);

        const marker = L.circleMarker([eq.latitude, eq.longitude], {
            radius: radius,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.7
        }).addTo(map);

        marker.bindPopup(`
            <strong>${eq.place}</strong><br>
            Magnitud: ${eq.magnitude.toFixed(1)}<br>
            Profundidad: ${eq.depth.toFixed(1)} km<br>
            ${eq.time.toLocaleString()}
        `);

        marker.on('click', () => showDetails(eq));
        markers[eq.id] = marker;
    });
}

// Render table
function renderTable() {
    if (earthquakes.length === 0) {
        document.getElementById('tableContent').innerHTML = 
            '<div class="empty-state"><p>No hay sismos registrados</p></div>';
        return;
    }

    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Ubicación</th>
                        <th>Magnitud</th>
                        <th>Profundidad</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
    `;

    earthquakes.slice(0, 20).forEach(eq => {
        html += `
            <tr onclick="showDetails(earthquakes.find(e => e.id === '${eq.id}'))">
                <td>${eq.place}</td>
                <td><span class="magnitude-badge ${getMagnitudeBadgeClass(eq.magnitude)}">${eq.magnitude.toFixed(1)}</span></td>
                <td>${eq.depth.toFixed(1)} km</td>
                <td>${eq.time.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('tableContent').innerHTML = html;
}

// Show earthquake details
function showDetails(eq) {
    let html = `
        <div class="detail-item">
            <div class="detail-label">Ubicación</div>
            <div class="detail-value">${eq.place}</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Magnitud</div>
            <div class="detail-value large">${eq.magnitude.toFixed(1)}</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Profundidad</div>
            <div class="detail-value">${eq.depth.toFixed(1)} km</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Coordenadas</div>
            <div class="detail-value">${eq.latitude.toFixed(2)}°, ${eq.longitude.toFixed(2)}°</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Hora</div>
            <div class="detail-value">${eq.time.toLocaleString()}</div>
        </div>

        <div class="detail-item">
            <a href="${eq.url}" target="_blank" class="btn" style="width: 100%; text-align: center; display: block;">
                Ver en USGS
            </a>
        </div>
    `;

    document.getElementById('detailsContent').innerHTML = html;

    // Highlight marker
    Object.values(markers).forEach(m => m.setStyle({ weight: 1 }));
    if (markers[eq.id]) {
        markers[eq.id].setStyle({ weight: 3, color: '#0000FF' });
    }
}

// Tab navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        if (tabName === 'dashboard' && map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
});

// Initialize on load
window.addEventListener('load', () => {
    initMap();
    loadEarthquakes();
    
    // Refresh every 5 minutes
    setInterval(loadEarthquakes, 5 * 60 * 1000);
});

