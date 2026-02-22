// Availability Filter State Management
let availabilityFilterState = {
    date: null,
    startTime: null,
    endTime: null,
    duration: null
};

// Convert 24-hour time to 12-hour with AM/PM
function formatTime12Hour(time24) {
    if (!time24) return '0:00';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Generate time slots (30-minute intervals from 0:00 to 23:30)
function generateTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeStr);
        }
    }
    return slots;
}

const timeSlots = generateTimeSlots();

// Open Availability Filter Modal
function openAvailabilityFilter() {
    const modal = document.getElementById('availability-filter-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // Update display with current state
        updateFilterDisplay();
    }
}

// Close Availability Filter Modal
function closeAvailabilityFilter() {
    const modal = document.getElementById('availability-filter-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Reset Date
function resetDate() {
    availabilityFilterState.date = null;
    updateFilterDisplay();
    updateAvailabilityButton();
}

// Update filter display in modal
function updateFilterDisplay() {
    // Update date display
    const dateDisplay = document.getElementById('selected-date-display');
    const dateButton = document.getElementById('date-button');
    const dateResetText = document.getElementById('date-reset-text');
    
    if (availabilityFilterState.date) {
        const date = new Date(availabilityFilterState.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        if (dateDisplay) dateDisplay.textContent = formattedDate;
        if (dateButton) {
            const dateText = dateButton.querySelector('p:last-child');
            if (dateText) dateText.textContent = formattedDate;
        }
        if (dateResetText) dateResetText.classList.remove('hidden');
    } else {
        if (dateDisplay) dateDisplay.textContent = 'Select Date';
        if (dateButton) {
            const dateText = dateButton.querySelector('p:last-child');
            if (dateText) dateText.textContent = 'Select Date';
        }
        if (dateResetText) dateResetText.classList.add('hidden');
    }

    // Update time display - show time immediately when selected
    const startTimeDisplay = document.getElementById('start-time-display');
    const endTimeDisplay = document.getElementById('end-time-display');
    const timeContainer = document.getElementById('time-container');
    const binButton = document.getElementById('bin-button');
    
    // Show start time if selected
    if (availabilityFilterState.startTime) {
        if (startTimeDisplay) startTimeDisplay.textContent = formatTime12Hour(availabilityFilterState.startTime);
    } else {
        if (startTimeDisplay) startTimeDisplay.textContent = '0:00';
    }
    
    // Show end time if selected
    if (availabilityFilterState.endTime) {
        if (endTimeDisplay) endTimeDisplay.textContent = formatTime12Hour(availabilityFilterState.endTime);
    } else {
        if (endTimeDisplay) endTimeDisplay.textContent = '0:00';
    }
    
    // Enable container and show bin button if at least one time is selected
    if (availabilityFilterState.startTime || availabilityFilterState.endTime) {
        if (timeContainer) {
            timeContainer.classList.remove('opacity-50');
            timeContainer.classList.add('opacity-100');
        }
        if (binButton) binButton.classList.remove('hidden');
    } else {
        if (timeContainer) {
            timeContainer.classList.add('opacity-50');
            timeContainer.classList.remove('opacity-100');
        }
        if (binButton) binButton.classList.add('hidden');
    }

    // Update duration buttons - green bg and white text on select
    const durationButtons = document.querySelectorAll('.duration-btn');
    durationButtons.forEach(btn => {
        const duration = btn.getAttribute('data-duration');
        if (duration === availabilityFilterState.duration) {
            btn.classList.add('border-[var(--green)]', 'bg-[var(--green)]', 'text-white');
            btn.classList.remove('border-[#d7d7d7]', 'bg-white', 'text-[#1a1a1a]');
        } else {
            btn.classList.remove('border-[var(--green)]', 'bg-[var(--green)]', 'text-white');
            btn.classList.add('border-[#d7d7d7]', 'bg-white', 'text-[#1a1a1a]');
        }
    });
}

// Open Date Picker
function openDatePicker() {
    const datePicker = document.getElementById('date-picker-modal');
    if (datePicker) {
        datePicker.classList.remove('hidden');
        // Initialize if calendar is empty
        const calendarGrid = document.getElementById('calendar-grid');
        if (calendarGrid && !calendarGrid.innerHTML) {
            initializeDatePicker();
        } else {
            // Re-render with current state
            const today = new Date();
            currentMonth = availabilityFilterState.date ? new Date(availabilityFilterState.date).getMonth() : today.getMonth();
            currentYear = availabilityFilterState.date ? new Date(availabilityFilterState.date).getFullYear() : today.getFullYear();
            renderCalendar(currentMonth, currentYear);
            updateMonthYearDisplay(currentMonth, currentYear);
        }
    }
}

// Close Date Picker
function closeDatePicker() {
    const datePicker = document.getElementById('date-picker-modal');
    if (datePicker) {
        datePicker.classList.add('hidden');
    }
}

// Initialize Date Picker
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initializeDatePicker() {
    const today = new Date();
    currentMonth = availabilityFilterState.date ? new Date(availabilityFilterState.date).getMonth() : today.getMonth();
    currentYear = availabilityFilterState.date ? new Date(availabilityFilterState.date).getFullYear() : today.getFullYear();
    
    renderCalendar(currentMonth, currentYear);
    updateMonthYearDisplay(currentMonth, currentYear);
}

// Set up date picker navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.onclick = () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
            updateMonthYearDisplay(currentMonth, currentYear);
        };
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.onclick = () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
            updateMonthYearDisplay(currentMonth, currentYear);
        };
    }
});

// Render Calendar
function renderCalendar(month, year) {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const selectedDate = availabilityFilterState.date ? new Date(availabilityFilterState.date) : null;
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'w-12 h-12 flex items-center justify-center';
        calendarGrid.appendChild(cell);
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'w-12 h-12 flex items-center justify-center cursor-pointer';
        const cellDate = new Date(year, month, day);
        
        const isToday = cellDate.toDateString() === today.toDateString();
        const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();
        const isPast = cellDate < today && !isToday;
        
        if (isSelected) {
            cell.className += ' bg-[var(--green)] rounded-full text-white';
        } else if (isToday) {
            cell.className += ' border-2 border-[var(--green)] rounded-full';
        } else if (isPast) {
            cell.className += ' opacity-38';
        }
        
        cell.textContent = day;
        cell.onclick = () => selectDate(year, month, day);
        
        calendarGrid.appendChild(cell);
    }
}

// Update Month/Year Display
function updateMonthYearDisplay(month, year) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthDisplay = document.getElementById('month-display');
    const yearDisplay = document.getElementById('year-display');
    
    if (monthDisplay) monthDisplay.textContent = monthNames[month];
    if (yearDisplay) yearDisplay.textContent = year;
}

// Select Date
function selectDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    availabilityFilterState.date = selectedDate.toISOString().split('T')[0];
    updateFilterDisplay();
    updateAvailabilityButton();
    closeDatePicker();
}

// Open Time Picker - show dropdown below text field
function openTimePicker(type, event) {
    // Prevent default behavior and stop propagation
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Enable time container if disabled
    const timeContainer = document.getElementById('time-container');
    if (timeContainer && timeContainer.classList.contains('opacity-50')) {
        timeContainer.classList.remove('opacity-50');
        timeContainer.classList.add('opacity-100');
    }
    
    // Prevent body scroll when dropdown is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Close other dropdown if open
    const startDropdown = document.getElementById('start-time-dropdown');
    const endDropdown = document.getElementById('end-time-dropdown');
    
    if (type === 'start') {
        if (endDropdown) endDropdown.classList.add('hidden');
        if (startDropdown) {
            if (startDropdown.classList.contains('hidden')) {
                startDropdown.classList.remove('hidden');
                renderTimePicker('start', startDropdown);
            } else {
                startDropdown.classList.add('hidden');
                restoreBodyScroll(); // Restore scroll when closing
            }
        }
    } else {
        if (startDropdown) startDropdown.classList.add('hidden');
        if (endDropdown) {
            if (endDropdown.classList.contains('hidden')) {
                endDropdown.classList.remove('hidden');
                renderTimePicker('end', endDropdown);
            } else {
                endDropdown.classList.add('hidden');
                restoreBodyScroll(); // Restore scroll when closing
            }
        }
    }
}

// Restore body scroll
function restoreBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// Render Time Picker - show only 4 items at a time
function renderTimePicker(type, dropdownElement) {
    if (!dropdownElement) return;
    
    dropdownElement.innerHTML = '';
    const currentTime = type === 'start' ? availabilityFilterState.startTime : availabilityFilterState.endTime;
    
    // Show only 4 time slots at a time (160px height = 4 * 40px)
    timeSlots.forEach((time, index) => {
        const timeItem = document.createElement('div');
        timeItem.className = 'h-10 flex items-center justify-start px-2 cursor-pointer hover:bg-gray-100 text-sm font-semibold text-[#1a1a1a]';
        if (time === currentTime) {
            timeItem.className += ' bg-[var(--green)]/10';
        }
        timeItem.textContent = formatTime12Hour(time);
        timeItem.onclick = (e) => {
            e.stopPropagation();
            selectTime(type, time);
        };
        dropdownElement.appendChild(timeItem);
    });
    
    // Scroll to selected time
    if (currentTime) {
        const index = timeSlots.indexOf(currentTime);
        if (index !== -1) {
            // Scroll to show selected item in view (showing 4 items, center the selected one)
            const scrollPosition = Math.max(0, (index - 1) * 40);
            dropdownElement.scrollTop = scrollPosition;
        }
    }
}

// Close time picker when clicking outside
document.addEventListener('click', (e) => {
    const startDropdown = document.getElementById('start-time-dropdown');
    const endDropdown = document.getElementById('end-time-dropdown');
    const startButton = document.querySelector('button[onclick*="openTimePicker(\'start\')"]');
    const endButton = document.querySelector('button[onclick*="openTimePicker(\'end\')"]');
    
    if (startDropdown && !startDropdown.contains(e.target) && !startButton?.contains(e.target)) {
        startDropdown.classList.add('hidden');
        restoreBodyScroll(); // Restore scroll
    }
    if (endDropdown && !endDropdown.contains(e.target) && !endButton?.contains(e.target)) {
        endDropdown.classList.add('hidden');
        restoreBodyScroll(); // Restore scroll
    }
});

// Select Time
function selectTime(type, time) {
    if (type === 'start') {
        availabilityFilterState.startTime = time;
        // Ensure end time is after start time
        if (availabilityFilterState.endTime && time >= availabilityFilterState.endTime) {
            const startIndex = timeSlots.indexOf(time);
            if (startIndex < timeSlots.length - 1) {
                availabilityFilterState.endTime = timeSlots[startIndex + 1];
            }
        }
        // Close dropdown and restore scroll
        const startDropdown = document.getElementById('start-time-dropdown');
        if (startDropdown) startDropdown.classList.add('hidden');
        restoreBodyScroll();
    } else {
        availabilityFilterState.endTime = time;
        // Ensure start time is before end time
        if (availabilityFilterState.startTime && time <= availabilityFilterState.startTime) {
            const endIndex = timeSlots.indexOf(time);
            if (endIndex > 0) {
                availabilityFilterState.startTime = timeSlots[endIndex - 1];
            }
        }
        // Close dropdown and restore scroll
        const endDropdown = document.getElementById('end-time-dropdown');
        if (endDropdown) endDropdown.classList.add('hidden');
        restoreBodyScroll();
    }
    updateFilterDisplay();
    updateAvailabilityButton();
}

// Reset Time
function resetTime() {
    availabilityFilterState.startTime = null;
    availabilityFilterState.endTime = null;
    updateFilterDisplay();
    updateAvailabilityButton();
}

// Select Duration
function selectDuration(duration) {
    if (availabilityFilterState.duration === duration) {
        availabilityFilterState.duration = null;
    } else {
        availabilityFilterState.duration = duration;
    }
    updateFilterDisplay();
    updateAvailabilityButton();
}

// Reset All Filters
function resetAllFilters() {
    availabilityFilterState = {
        date: null,
        startTime: null,
        endTime: null,
        duration: null
    };
    updateFilterDisplay();
    updateAvailabilityButton();
}

// Update Availability Button in Home Screen
function updateAvailabilityButton() {
    const availabilityBtn = document.getElementById('availability-filter-btn');
    if (!availabilityBtn) return;
    
    const filterCount = getFilterCount();
    
    if (filterCount > 0) {
        // Update button to show active state with badge (using px-4 for consistent width)
        availabilityBtn.className = 'filter-btn flex items-center gap-1 px-4 h-10 rounded-lg border whitespace-nowrap flex-shrink-0 border-[var(--green)] bg-[var(--green)]/10 transition-colors duration-200';
        
        // Update or create badge
        let badge = availabilityBtn.querySelector('.filter-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'filter-badge bg-[var(--green)] text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center';
            availabilityBtn.appendChild(badge);
        }
        badge.textContent = filterCount;
        
        // Update text to show date if available, otherwise show 'Today'
        const btnText = availabilityBtn.querySelector('span:not(.filter-badge)');
        if (btnText) {
            if (availabilityFilterState.date) {
                const date = new Date(availabilityFilterState.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
                btnText.textContent = formattedDate;
            } else {
                btnText.textContent = 'Today';
            }
        }
    } else {
        // Reset to default state (using px-4 for consistent width)
        availabilityBtn.className = 'filter-btn flex items-center gap-1 px-4 h-10 rounded-lg border whitespace-nowrap flex-shrink-0 border-[var(--text-heading)] bg-[hsl(0,0%,6%,0.05)] shadow-sm';
        
        const badge = availabilityBtn.querySelector('.filter-badge');
        if (badge) badge.remove();
        
        const btnText = availabilityBtn.querySelector('span:not(.filter-badge)');
        if (btnText) btnText.textContent = 'Today';
    }
}

// Get Filter Count
function getFilterCount() {
    let count = 0;
    if (availabilityFilterState.date) count++;
    if (availabilityFilterState.startTime && availabilityFilterState.endTime) count++;
    if (availabilityFilterState.duration) count++;
    return count;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAvailabilityButton();
});
