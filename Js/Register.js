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
        name: "",
        email: "",
        selectedSports: [], // Changed to array for multi-select
        isDropdownOpen: false,
        errors: {
            name: false,
            email: false,
            sports: false
        },
        whatsappCommunity: false,
        instagramCommunity: false
    };

    // --- Elements ---
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const sportDropdownBtn = document.getElementById('sportDropdownBtn');
    const dropdownArrow = document.getElementById('dropdownArrow');
    const sportDropdownList = document.getElementById('sportDropdownList');
    const selectedSportText = document.getElementById('selectedSportText');
    const selectedSportsChips = document.getElementById('selectedSportsChips');
    const continueBtn = document.getElementById('continueBtn');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const sportsError = document.getElementById('sportsError');
    const whatsappCheckbox = document.getElementById('whatsappCheckbox');
    const instagramCheckbox = document.getElementById('instagramCheckbox');

    // --- Initialization ---
    function init() {
        populateSportsDropdown();
        setupEventListeners();
        updateContinueButton();
    }

    // --- Logic ---

    function populateSportsDropdown() {
        SPORTS_LIST.forEach(sport => {
            const btn = document.createElement('button');
            btn.className = 'dropdown-option w-full px-4 py-3 text-left text-[var(--text-body)] text-[16px] font-normal hover:bg-gray-50 transition-colors';
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
        // Dropdown Toggle
        sportDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (state.isDropdownOpen && !sportDropdownBtn.contains(e.target) && !sportDropdownList.contains(e.target)) {
                toggleDropdown(false);
            }
        });

        // Input Listeners
        nameInput.addEventListener('input', (e) => {
            state.name = e.target.value.trim();
            // Clear error on input
            if (state.name.length > 0) {
                hideError('name');
            }
            updateContinueButton();
        });

        emailInput.addEventListener('input', (e) => {
            state.email = e.target.value.trim();
            // Clear error on input
            if (state.email.length > 0) {
                hideError('email');
            }
            updateContinueButton();
        });

        // Continue Button
        continueBtn.addEventListener('click', handleContinue);

        // Community Checkboxes
        if (whatsappCheckbox) {
            whatsappCheckbox.addEventListener('click', () => {
                state.whatsappCommunity = !state.whatsappCommunity;
                updateCheckboxUI(whatsappCheckbox, state.whatsappCommunity);
            });
        }
        
        if (instagramCheckbox) {
            instagramCheckbox.addEventListener('click', () => {
                state.instagramCommunity = !state.instagramCommunity;
                updateCheckboxUI(instagramCheckbox, state.instagramCommunity);
            });
        }
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

        // Clear sports error when user selects a sport
        if (state.selectedSports.length > 0) {
            hideError('sports');
        }

        updateSportsUI();
        updateContinueButton();
    }

    function removeSport(sport) {
        const index = state.selectedSports.indexOf(sport);
        if (index > -1) {
            state.selectedSports.splice(index, 1);
            updateSportsUI();
            updateContinueButton();
            
            // Show error if no sports selected
            if (state.selectedSports.length === 0) {
                showError('sports');
            }
        }
    }

    function updateSportsUI() {
        // Update dropdown button text
        if (state.selectedSports.length === 0) {
            selectedSportText.textContent = "Select Your Sports";
            selectedSportText.classList.remove('text-[var(--text-heading)]');
            selectedSportText.classList.add('text-[var(--text-body)]');
        } else if (state.selectedSports.length === 1) {
            selectedSportText.textContent = state.selectedSports[0];
            selectedSportText.classList.add('text-[var(--text-heading)]');
            selectedSportText.classList.remove('text-[var(--text-body)]');
        } else {
            selectedSportText.textContent = `${state.selectedSports.length} Sports Selected`;
            selectedSportText.classList.add('text-[var(--text-heading)]');
            selectedSportText.classList.remove('text-[var(--text-body)]');
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
        if (box && tick) {
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
    }

    // --- Validation Functions ---
    
    function validateName() {
        if (state.name.length === 0) {
            showError('name');
            return false;
        } else {
            hideError('name');
            return true;
        }
    }

    function validateEmail() {
        const emailErrorText = emailError.querySelector('.error-text');
        if (state.email.length === 0) {
            if (emailErrorText) emailErrorText.textContent = "Email is required";
            showError('email');
            return false;
        } else if (!isValidEmail(state.email)) {
            if (emailErrorText) emailErrorText.textContent = "Please enter a valid email address";
            showError('email');
            return false;
        } else {
            hideError('email');
            return true;
        }
    }

    function validateSports() {
        if (state.selectedSports.length === 0) {
            showError('sports');
            return false;
        } else {
            hideError('sports');
            return true;
        }
    }

    function showError(field) {
        state.errors[field] = true;
        
        if (field === 'name') {
            nameInput.classList.add('error');
            nameError.classList.add('show');
        } else if (field === 'email') {
            emailInput.classList.add('error');
            emailError.classList.add('show');
        } else if (field === 'sports') {
            sportsError.classList.add('show');
        }
    }

    function hideError(field) {
        state.errors[field] = false;
        
        if (field === 'name') {
            nameInput.classList.remove('error');
            nameError.classList.remove('show');
        } else if (field === 'email') {
            emailInput.classList.remove('error');
            emailError.classList.remove('show');
        } else if (field === 'sports') {
            sportsError.classList.remove('show');
        }
    }

    function updateContinueButton() {
        // Enable button only if name, email, and at least one sport are selected
        const isValid = state.name.length > 0 && 
                       state.email.length > 0 && 
                       isValidEmail(state.email) &&
                       state.selectedSports.length > 0;
        
        continueBtn.disabled = !isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function handleContinue() {
        // Validate all fields before continuing
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSportsValid = validateSports();

        if (!isNameValid || !isEmailValid || !isSportsValid) {
            return;
        }

        console.log("Registration Data:", {
            name: state.name,
            email: state.email,
            selectedSports: state.selectedSports
        });

        // Visual feedback
        const originalText = continueBtn.textContent;
        continueBtn.textContent = "Success!";
        
        setTimeout(() => {
            // Navigate to Select City page
            window.location.href = 'SelectCity.html';
        }, 1000);
    }

    // Scroll input into view when focused (for mobile keyboard)
    function scrollToInput(element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    // Make validation functions available globally for onblur events
    window.validateName = validateName;
    window.validateEmail = validateEmail;
    window.scrollToInput = scrollToInput;

    // Run init
    init();

})();

