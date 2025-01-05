// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('footprint-form');
    const resultDiv = document.getElementById('result');

    document.getElementById('toggleButton').addEventListener('click', function() {
        var advancedSettings = document.getElementById('advancedSettings');
        if (advancedSettings.classList.contains('hidden')) {
            advancedSettings.classList.remove('hidden');
            this.textContent = 'Hide Advanced Settings';
        } else {
            advancedSettings.classList.add('hidden');
            this.textContent = 'Show Advanced Settings';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading indicator with spinner
        resultDiv.innerHTML = `
            <div id="loading">
                <p>Calculating...</p>
                <div class="spinner"></div>
            </div>
        `;

        // Get form values
        const distanceLand = parseFloat(document.getElementById('distance-land').value);
        const distanceFlight = parseFloat(document.getElementById('distance-flight').value);
        const passengers = parseInt(document.getElementById('passengers').value);

        // Input validation
        if (passengers < 1) {
            resultDiv.innerHTML = `<p style="color:red;">Number of passengers must be at least 1.</p>`;
            return;
        }

        if (isNaN(distanceLand) || distanceLand < 0) {
            resultDiv.innerHTML = `<p style="color:red;">Please enter a valid distance for Car, Bus, and Train.</p>`;
            return;
        }

        if (isNaN(distanceFlight) || distanceFlight < 0) {
            resultDiv.innerHTML = `<p style="color:red;">Please enter a valid distance for Flight (Short-haul).</p>`;
            return;
        }

        // Get emission factors from advanced section
        const emissionCar = parseFloat(document.getElementById('emission-car').value);
        const emissionBus = parseFloat(document.getElementById('emission-bus').value);
        const emissionTrain = parseFloat(document.getElementById('emission-train').value);
        const emissionFlight = parseFloat(document.getElementById('emission-flight').value);

        if ([emissionCar, emissionBus, emissionTrain, emissionFlight].some(e => isNaN(e) || e < 0)) {
            resultDiv.innerHTML = `<p style="color:red;">Please enter valid CO₂ emissions per km in the advanced section.</p>`;
            return;
        }

        // Define emission factors with passenger dependency
        const emissionFactors = {
            car: { name: "Car", factor: emissionCar, perPassenger: false },     // kg CO2 per km for the entire car
            bus: { name: "Bus", factor: emissionBus, perPassenger: true },      // kg CO2 per km per passenger
            train: { name: "Train", factor: emissionTrain, perPassenger: true },  // kg CO2 per km per passenger
            flight_short: { name: "Flight (Short-haul)", factor: emissionFlight, perPassenger: true }, // kg CO2 per km per passenger
        };

        // Calculate emissions for all modes
        const emissionsResults = calculateAllEmissions(distanceLand, distanceFlight, passengers, emissionFactors);

        // Display results in a table
        displayResults(emissionsResults);
    });

    // Function to calculate emissions for all transportation modes
    function calculateAllEmissions(distanceLand, distanceFlight, passengers, emissionFactors) {
        const emissions = {};

        // Car
        emissions.car = (distanceLand * emissionFactors.car.factor) / passengers;

        // Bus
        emissions.bus = distanceLand * emissionFactors.bus.factor * passengers;

        // Train
        emissions.train = distanceLand * emissionFactors.train.factor * passengers;

        // Flight (Short-haul)
        emissions.flight_short = distanceFlight * emissionFactors.flight_short.factor * passengers;

        return emissions;
    }

    // Function to display results in a table
    function displayResults(emissions) {
        // Clear previous results
        resultDiv.innerHTML = '';

        // Create table
        const table = document.createElement('table');

        // Table Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Transportation Mode', 'Distance (km)', 'CO₂ Emissions (kg)'];

        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table Body
        const tbody = document.createElement('tbody');

        for (const mode in emissions) {
            const row = document.createElement('tr');

            // Transportation Mode Name
            const modeCell = document.createElement('td');
            modeCell.textContent = getModeName(mode);
            row.appendChild(modeCell);

            // Distance
            let distance;
            if (mode === 'flight_short') {
                distance = parseFloat(document.getElementById('distance-flight').value);
            } else {
                distance = parseFloat(document.getElementById('distance-land').value);
            }

            const distanceCell = document.createElement('td');
            distanceCell.textContent = distance.toFixed(2);
            row.appendChild(distanceCell);

            // Emissions
            const emissionsCell = document.createElement('td');
            emissionsCell.textContent = emissions[mode].toFixed(2);
            row.appendChild(emissionsCell);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        resultDiv.appendChild(table);
    }

    // Helper function to get mode name
    function getModeName(mode) {
        const modeNames = {
            car: "Car",
            bus: "Bus",
            train: "Train",
            flight_short: "Flight (Short-haul)"
        };
        return modeNames[mode] || mode;
    }

    // Function to display Amazon products
    function displayProducts() {
        const products = [
            {
                name: "Reusable Water Bottle",
                image: "https://images-na.ssl-images-amazon.com/images/I/71fYlRvUFDL._AC_SL1500_.jpg",
                link: "https://www.amazon.com/dp/B07QXV6N1B/?tag=yourAffiliateID",
            },
            {
                name: "Solar Charger",
                image: "https://images-na.ssl-images-amazon.com/images/I/71bL8bLpKIL._AC_SL1500_.jpg",
                link: "https://www.amazon.com/dp/B07D1XCKWW/?tag=yourAffiliateID",
            },
            {
                name: "Eco-Friendly Travel Utensil Set",
                image: "https://images-na.ssl-images-amazon.com/images/I/81pHAkIbVYL._AC_SL1500_.jpg",
                link: "https://www.amazon.com/dp/B07L5G8Z3X/?tag=yourAffiliateID",
            },
            // ... Add all 50 products similarly
        ];

        const productsDiv = document.querySelector('.product-list');

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <a href="${product.link}" target="_blank" rel="noopener noreferrer">Buy on Amazon</a>
            `;

            productsDiv.appendChild(productItem);
        });
    }
});
