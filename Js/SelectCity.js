(function() {
    // --- Data ---
    const POPULAR_CITIES = [
        { name: "Mumbai", state: "Maharashtra" },
        { name: "Delhi", state: "Delhi" },
        { name: "Bangalore", state: "Karnataka" },
        { name: "Hyderabad", state: "Telangana" },
        { name: "Chennai", state: "Tamil Nadu" },
        { name: "Pune", state: "Maharashtra" }
    ];

    const ALL_CITIES = [
        { name: "Ahmedabad", state: "Gujarat" },
        { name: "Bangalore", state: "Karnataka" },
        { name: "Bhopal", state: "Madhya Pradesh" },
        { name: "Chandigarh", state: "Chandigarh" },
        { name: "Chennai", state: "Tamil Nadu" },
        { name: "Coimbatore", state: "Tamil Nadu" },
        { name: "Delhi", state: "Delhi" },
        { name: "Gurgaon", state: "Haryana" },
        { name: "Hyderabad", state: "Telangana" },
        { name: "Indore", state: "Madhya Pradesh" },
        { name: "Jaipur", state: "Rajasthan" },
        { name: "Kochi", state: "Kerala" },
        { name: "Kolkata", state: "West Bengal" },
        { name: "Lucknow", state: "Uttar Pradesh" },
        { name: "Mumbai", state: "Maharashtra" },
        { name: "Nagpur", state: "Maharashtra" },
        { name: "Noida", state: "Uttar Pradesh" },
        { name: "Pune", state: "Maharashtra" },
        { name: "Surat", state: "Gujarat" },
        { name: "Vadodara", state: "Gujarat" },
        { name: "Visakhapatnam", state: "Andhra Pradesh" }
    ];

    // --- State ---
    const state = {
        selectedCity: null,
        searchQuery: "",
        filteredCities: [...ALL_CITIES]
    };

    // --- Elements ---
    const searchInput = document.getElementById('searchInput');
    const citiesGrid = document.getElementById('citiesGrid');
    const allCitiesList = document.getElementById('allCitiesList');
    const continueBtn = document.getElementById('continueBtn');

    // --- Initialization ---
    function init() {
        renderPopularCities();
        renderAllCities();
        setupEventListeners();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Search input
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            filterCities();
        });

        // Continue button
        continueBtn.addEventListener('click', handleContinue);
    }

    // --- Render Functions ---
    function renderPopularCities() {
        citiesGrid.innerHTML = '';
        
        POPULAR_CITIES.forEach(city => {
            const cityCard = createCityCard(city, true);
            citiesGrid.appendChild(cityCard);
        });
    }

    function renderAllCities() {
        allCitiesList.innerHTML = '';
        
        state.filteredCities.forEach(city => {
            const cityCard = createCityCard(city, false);
            allCitiesList.appendChild(cityCard);
        });

        // Show "No cities found" message if empty
        if (state.filteredCities.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'text-center py-8 text-[var(--text-body)]';
            noResults.innerHTML = `
                <svg class="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D7D7D7"/>
                    <path d="M11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#D7D7D7"/>
                </svg>
                <p class="text-[16px]">No cities found</p>
                <p class="text-[14px] mt-1">Try searching with a different name</p>
            `;
            allCitiesList.appendChild(noResults);
        }
    }

    function createCityCard(city, isPopular) {
        const card = document.createElement('div');
        const isSelected = state.selectedCity?.name === city.name;
        
        if (isPopular) {
            // Grid card for popular cities
            card.className = `city-card p-4 rounded-lg ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <h3 class="text-[var(--text-heading)] text-[16px] font-semibold">${city.name}</h3>
                        ${POPULAR_CITIES.some(pc => pc.name === city.name) ? '<span class="popular-badge">POPULAR</span>' : ''}
                    </div>
                    <p class="text-[var(--text-body)] text-[12px]">${city.state}</p>
                </div>
            `;
        } else {
            // List card for all cities
            card.className = `city-card p-4 rounded-lg ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <h3 class="text-[var(--text-heading)] text-[16px] font-semibold">${city.name}</h3>
                        <p class="text-[var(--text-body)] text-[12px]">${city.state}</p>
                    </div>
                </div>
            `;
        }

        card.addEventListener('click', () => selectCity(city));
        
        return card;
    }

    // --- Logic Functions ---
    function selectCity(city) {
        state.selectedCity = city;
        
        // Re-render both sections to update selected state
        renderPopularCities();
        renderAllCities();
        
        // Enable continue button
        continueBtn.disabled = false;
        
        console.log("Selected city:", city);
    }

    function filterCities() {
        if (state.searchQuery === "") {
            state.filteredCities = [...ALL_CITIES];
        } else {
            state.filteredCities = ALL_CITIES.filter(city => 
                city.name.toLowerCase().includes(state.searchQuery) ||
                city.state.toLowerCase().includes(state.searchQuery)
            );
        }
        
        renderAllCities();
    }

    function handleContinue() {
        if (!state.selectedCity) return;

        console.log("Continuing with city:", state.selectedCity);
        
        // Visual feedback
        const originalText = continueBtn.textContent;
        continueBtn.textContent = "Loading...";
        continueBtn.disabled = true;

        setTimeout(() => {
            // Navigate to Home page
            window.location.href = 'Home.html';
        }, 800);
    }

    // Run init
    init();

})();
