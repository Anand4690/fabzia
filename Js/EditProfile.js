(function() {
    // --- Data ---
    const SPORTS_LIST = [
        "Football",
        "Basketball",
        "Cricket",
        "Tennis",
        "Baseball",
        "Badminton",
        "Volleyball",
        "Table Tennis",
        "Swimming",
        "Golf",
        "Hockey",
        "Rugby",
        "Boxing",
        "Athletics",
        "Cycling",
    ];

    // --- State ---
    const state = {
        name: "Anand",
        email: "anand@gmail.com",
        phone: "+91 12345-54321",
        selectedSport: "",
        address: "",
        whatsappCommunity: false,
        instagramCommunity: false,
        isDropdownOpen: false
    };

    // --- Elements ---
    const phoneInputContainer = document.getElementById('phoneInputContainer');
    const phoneAlert = document.getElementById('phoneAlert');
    const sportDropdownBtn = document.getElementById('sportDropdownBtn');
    const dropdownArrow = document.getElementById('dropdownArrow');
    const sportDropdownList = document.getElementById('sportDropdownList');
    const selectedSportText = document.getElementById('selectedSportText');
    const whatsappCheckbox = document.getElementById('whatsappCheckbox');
    const instagramCheckbox = document.getElementById('instagramCheckbox');
    const updateBtn = document.getElementById('updateBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const backBtn = document.getElementById('backBtn');
    
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const addressInput = document.getElementById('addressInput');


    // --- Initialization ---
    function init() {
        populateSportsDropdown();
        setupEventListeners();
        
        // Init input values
        nameInput.value = state.name;
        emailInput.value = state.email;
    }

    // --- Logic ---

    function populateSportsDropdown() {
        SPORTS_LIST.forEach(sport => {
            const btn = document.createElement('button');
            btn.className = 'w-full px-4 py-3 text-left text-[var(--text-body)] font-inter text-[16px] font-medium hover:bg-gray-50 transition-colors';
            btn.textContent = sport;
            btn.addEventListener('click', () => selectSport(sport));
            sportDropdownList.appendChild(btn);
        });
    }

    function setupEventListeners() {
        // Phone Alert
        phoneInputContainer.addEventListener('click', () => {
            phoneAlert.classList.remove('hidden');
            // Trigger reflow for transition
            void phoneAlert.offsetWidth; 
            phoneAlert.classList.remove('opacity-0');
            
            setTimeout(() => {
                phoneAlert.classList.add('opacity-0');
                setTimeout(() => {
                    phoneAlert.classList.add('hidden');
                }, 300);
            }, 3000);
        });

        // Dropdown Toggle
        sportDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from closing immediately
            toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (state.isDropdownOpen && !sportDropdownBtn.contains(e.target) && !sportDropdownList.contains(e.target)) {
                toggleDropdown(false);
            }
        });

        // Checkboxes
        whatsappCheckbox.addEventListener('click', () => {
            state.whatsappCommunity = !state.whatsappCommunity;
            updateCheckboxUI(whatsappCheckbox, state.whatsappCommunity);
        });

        instagramCheckbox.addEventListener('click', () => {
            state.instagramCommunity = !state.instagramCommunity;
            updateCheckboxUI(instagramCheckbox, state.instagramCommunity);
        });

        // Buttons
        updateBtn.addEventListener('click', handleUpdate);
        
        cancelBtn.addEventListener('click', () => {
            window.history.back();
        });
        
        backBtn.addEventListener('click', () => {
            window.history.back();
        });

        // Input Listeners to update state and scroll into view
        const inputs = [nameInput, emailInput, addressInput];
        inputs.forEach(input => {
            if (!input) return;
            input.addEventListener('input', (e) => {
                 if (input === nameInput) state.name = e.target.value;
                 if (input === emailInput) state.email = e.target.value;
                 if (input === addressInput) state.address = e.target.value;
            });
            
            // Scroll into view on focus to avoid keyboard hiding it
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300); // delay to allow keyboard animation
            });
        });
    }

    function toggleDropdown(forceState = null) {
        if (forceState !== null) {
            state.isDropdownOpen = forceState;
        } else {
            state.isDropdownOpen = !state.isDropdownOpen;
        }

        if (state.isDropdownOpen) {
            sportDropdownList.classList.remove('hidden');
            dropdownArrow.classList.add('rotate-180');
        } else {
            sportDropdownList.classList.add('hidden');
            dropdownArrow.classList.remove('rotate-180');
        }
    }

    function selectSport(sport) {
        state.selectedSport = sport;
        selectedSportText.textContent = sport;
        toggleDropdown(false);
        // Optional: Add visual feedback for selection if desired
        selectedSportText.classList.add('text-[var(--text-heading)]');
    }

    function updateCheckboxUI(btnElement, isChecked) {
        const indicator = btnElement.querySelector('.indicator');
        const circle = btnElement.querySelector('div:first-child'); // The outer circle container
        
        if (isChecked) {
            indicator.classList.remove('scale-0');
            // Make border green if selected? Design usually keeps border or changes it. React code kept border-#0F172A.
            // Let's keep it consistent with React code: border is present, checkmark appears.
            // Actually React code: w-5 h-5 rounded-full border-[1.5px] border-[#0F172A] ...
            // The checkmark is a green dot.
        } else {
            indicator.classList.add('scale-0');
        }
    }

    function handleUpdate() {
        console.log("Updating Profile:", state);
        
        // Visual feedback
        const originalText = updateBtn.querySelector('span').textContent;
        updateBtn.querySelector('span').textContent = "Saved!";
        updateBtn.classList.add('bg-green-700');
        
        setTimeout(() => {
            updateBtn.querySelector('span').textContent = originalText;
            updateBtn.classList.remove('bg-green-700');
            // Assuming navigation back or stay? User didn't specify.
            // Usually updates stay or show toast. I'll show toast-like behavior on button.
        }, 1500);
    }

    // Run init
    init();

})();
