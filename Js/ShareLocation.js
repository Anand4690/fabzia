const CITY_ICONS = {
    'Mumbai': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-office-2.svg',
    'Delhi-NCR': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-library.svg',
    'Bengaluru': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-office.svg',
    'Hyderabad': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-storefront.svg',
    'Chandigarh': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/flag.svg',
    'Ahmedabad': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-library.svg',
    'Pune': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-office.svg',
    'Chennai': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-office-2.svg',
    'Kolkata': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/building-library.svg',
    'Kochi': 'https://cdn.jsdelivr.net/npm/heroicons@2.1.2/24/outline/sun.svg'
  };

  const POPULAR_CITIES = Object.keys(CITY_ICONS);

  const OTHER_CITIES = [
    'Agra','Ajmer','Amritsar','Aurangabad','Bhopal','Coimbatore','Goa','Guwahati','Indore','Jaipur','Jodhpur','Kanpur','Lucknow','Ludhiana','Madurai','Nagpur','Nashik','Patna','Raipur','Ranchi','Srinagar','Surat','Trivandrum','Vadodara','Varanasi','Visakhapatnam'
  ];

  let selectedCity = null;
  const searchInput = document.getElementById('searchInput');
  const content = document.getElementById('content');
  const autoDetect = document.getElementById('autoDetect');

  function renderDefault() {
    autoDetect.style.display = 'block';
    content.innerHTML = `
      <div class="px-4 py-3"><h2 class="text-sm text-[#4D4D4D]">POPULAR CITIES</h2></div>
      <div class="grid grid-cols-4 border-t border-b border-[#D7D7D7]">
        ${POPULAR_CITIES.map(city => `
          <button onclick="selectCity('${city}')" class="tap-item flex flex-col items-center justify-center gap-2 p-3 border border-[#D7D7D7] min-h-[78px]">
            <img src="${CITY_ICONS[city]}" class="w-6 h-6 tap-icon" />
            <div class="flex items-center gap-1">
              ${selectedCity === city ? '<span class="w-2 h-2 bg-[#07A348] rounded-full"></span>' : ''}
              <span class="text-xs text-[#4D4D4D]">${city}</span>
            </div>
          </button>`).join('')}
      </div>
      <div class="px-4 py-3"><h2 class="text-sm text-[#4D4D4D]">OTHER CITIES</h2></div>
      <div class="flex-1 px-4 overflow-y-auto">
        ${OTHER_CITIES.map(city => `
          <button onclick="selectCity('${city}')" class="tap-item flex w-full py-3 border-b border-[#D7D7D7]">
            <span class="text-sm font-medium text-[#0F0F0F]">${city}</span>
          </button>`).join('')}
      </div>`;
  }

  function renderSearch(q) {
    autoDetect.style.display = 'none';
    const query = q.toLowerCase();
    const results = [...POPULAR_CITIES, ...OTHER_CITIES].filter(c => c.toLowerCase().includes(query));
    content.innerHTML = `
      <div class="flex-1 px-4 overflow-y-auto">
        ${results.length ? results.map(city => `
          <button onclick="selectCity('${city}')" class="tap-item flex w-full py-3 border-b border-[#D7D7D7]">
            <span class="text-sm font-medium text-[#0F0F0F]">${city}</span>
          </button>`).join('') : `<div class="py-8 text-center text-[#4D4D4D]">No cities found matching "${q}"</div>`}
      </div>`;
  }

  function selectCity(city) {
    selectedCity = city;
    renderDefault();
  }

  searchInput.addEventListener('input', e => {
    const v = e.target.value.trim();
    v ? renderSearch(v) : renderDefault();
  });

  renderDefault();