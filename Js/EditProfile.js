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
        selectedSports: [], // Changed to array for multi-select
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
    const selectedSportsChips = document.getElementById('selectedSportsChips');
    const whatsappCheckbox = document.getElementById('whatsappCheckbox');
    const instagramCheckbox = document.getElementById('instagramCheckbox');
    const updateBtn = document.getElementById('updateBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const backBtn = document.getElementById('backBtn');
    
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const addressInput = document.getElementById('addressInput');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const nameInputGroup = document.getElementById('nameInputGroup');
    const emailInputGroup = document.getElementById('emailInputGroup');


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
            btn.className = 'dropdown-option w-full px-4 py-3 text-left text-[var(--text-body)] font-inter text-[16px] font-medium hover:bg-gray-50 transition-colors';
            btn.textContent = sport;
            btn.dataset.sport = sport;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSportSelection(sport);
            });
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
                 if (input === nameInput) {
                     state.name = e.target.value;
                     if (state.name.trim().length > 0) hideFieldError('name');
                 }
                 if (input === emailInput) {
                     state.email = e.target.value;
                     if (state.email.trim().length > 0) hideFieldError('email');
                 }
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

    function toggleSportSelection(sport) {
        const index = state.selectedSports.indexOf(sport);
        
        if (index > -1) {
            // Remove sport
            state.selectedSports.splice(index, 1);
        } else {
            // Add sport
            state.selectedSports.push(sport);
        }

        updateSportsUI();
    }

    function removeSport(sport) {
        const index = state.selectedSports.indexOf(sport);
        if (index > -1) {
            state.selectedSports.splice(index, 1);
            updateSportsUI();
        }
    }

    function updateSportsUI() {
        // Update dropdown button text
        if (state.selectedSports.length === 0) {
            selectedSportText.textContent = "Sports Preference";
            selectedSportText.classList.remove('text-[var(--text-heading)]');
        } else if (state.selectedSports.length === 1) {
            selectedSportText.textContent = state.selectedSports[0];
            selectedSportText.classList.add('text-[var(--text-heading)]');
        } else {
            selectedSportText.textContent = `${state.selectedSports.length} Sports Selected`;
            selectedSportText.classList.add('text-[var(--text-heading)]');
        }

        // Update dropdown options to show selected state
        const allOptions = sportDropdownList.querySelectorAll('.dropdown-option');
        allOptions.forEach(option => {
            const sport = option.dataset.sport;
            if (state.selectedSports.includes(sport)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });

        // Update chips display
        if (state.selectedSports.length > 0) {
            selectedSportsChips.classList.remove('hidden');
            selectedSportsChips.innerHTML = '';
            
            state.selectedSports.forEach(sport => {
                const chip = createSportChip(sport);
                selectedSportsChips.appendChild(chip);
            });
        } else {
            selectedSportsChips.classList.add('hidden');
        }
    }

    function createSportChip(sport) {
        const chip = document.createElement('div');
        chip.className = 'sport-chip';
        
        const sportName = document.createElement('span');
        sportName.textContent = sport;
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSport(sport);
        });
        
        chip.appendChild(sportName);
        chip.appendChild(removeBtn);
        
        return chip;
    }

    function updateCheckboxUI(btnElement, isChecked) {
        const box = btnElement.querySelector('.checkbox-box');
        const tick = btnElement.querySelector('.checkbox-tick');
        
        if (isChecked) {
            box.style.backgroundColor = 'var(--green)';
            box.style.borderColor = 'var(--green)';
            tick.classList.remove('hidden');
        } else {
            box.style.backgroundColor = '';
            box.style.borderColor = '';
            tick.classList.add('hidden');
        }
    }

    function handleUpdate() {
        // Validate fields
        let valid = true;
        
        if (!state.name || state.name.trim().length === 0) {
            showFieldError('name');
            valid = false;
        }
        
        if (!state.email || state.email.trim().length === 0) {
            const emailErrorText = emailError ? emailError.querySelector('.error-text') : null;
            if (emailErrorText) emailErrorText.textContent = 'Email is required';
            showFieldError('email');
            valid = false;
        } else if (!isValidEmail(state.email)) {
            const emailErrorText = emailError ? emailError.querySelector('.error-text') : null;
            if (emailErrorText) emailErrorText.textContent = 'Please enter a valid email';
            showFieldError('email');
            valid = false;
        }
        
        if (!valid) return;
        
        console.log("Updating Profile:", state);
        
        // Visual feedback
        const originalText = updateBtn.querySelector('span').textContent;
        updateBtn.querySelector('span').textContent = "Saved!";
        updateBtn.classList.add('bg-green-700');
        
        setTimeout(() => {
            updateBtn.querySelector('span').textContent = originalText;
            updateBtn.classList.remove('bg-green-700');
        }, 1500);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(field) {
        if (field === 'name' && nameError && nameInputGroup) {
            nameError.classList.add('show');
            nameInputGroup.classList.add('error');
        } else if (field === 'email' && emailError && emailInputGroup) {
            emailError.classList.add('show');
            emailInputGroup.classList.add('error');
        }
    }
    
    function hideFieldError(field) {
        if (field === 'name' && nameError && nameInputGroup) {
            nameError.classList.remove('show');
            nameInputGroup.classList.remove('error');
        } else if (field === 'email' && emailError && emailInputGroup) {
            emailError.classList.remove('show');
            emailInputGroup.classList.remove('error');
        }
    }

    // Run init
    init();

})();

