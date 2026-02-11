(function() {
    // --- State ---
    const state = {
        phoneNumber: "",
        otp: ["", "", "", "", "", ""],
        isOtpSent: false,
        resendTimer: 30,
        timerInterval: null
    };

    // --- Elements ---
    const phoneSection = document.getElementById('phoneSection');
    const otpSection = document.getElementById('otpSection');
    const phoneInput = document.getElementById('phoneInput');
    const phoneError = document.getElementById('phoneError');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const phoneDisplay = document.getElementById('phoneDisplay');
    const otpInputs = [
        document.getElementById('otp1'),
        document.getElementById('otp2'),
        document.getElementById('otp3'),
        document.getElementById('otp4'),
        document.getElementById('otp5'),
        document.getElementById('otp6')
    ];
    const otpError = document.getElementById('otpError');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendLink = document.getElementById('resendLink');
    const timerDisplay = document.getElementById('timer');

    // --- Initialization ---
    function init() {
        setupEventListeners();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Phone input
        phoneInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            state.phoneNumber = e.target.value;
            
            // Clear error on input
            if (state.phoneNumber.length > 0) {
                hidePhoneError();
            }
            
            updateSendOtpButton();
        });

        // Send OTP button
        sendOtpBtn.addEventListener('click', handleSendOtp);

        // OTP inputs
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => handleOtpInput(e, index));
            input.addEventListener('keydown', (e) => handleOtpKeydown(e, index));
            input.addEventListener('paste', handleOtpPaste);
        });

        // Verify OTP button
        verifyOtpBtn.addEventListener('click', handleVerifyOtp);

        // Resend link
        resendLink.addEventListener('click', handleResendOtp);
    }

    // --- Phone Number Functions ---
    function updateSendOtpButton() {
        const isValid = state.phoneNumber.length === 10;
        sendOtpBtn.disabled = !isValid;
    }

    function validatePhone() {
        if (state.phoneNumber.length !== 10) {
            showPhoneError();
            return false;
        }
        hidePhoneError();
        return true;
    }

    function showPhoneError() {
        phoneInput.classList.add('error');
        phoneError.classList.add('show');
    }

    function hidePhoneError() {
        phoneInput.classList.remove('error');
        phoneError.classList.remove('show');
    }

    function handleSendOtp() {
        if (!validatePhone()) return;

        // UI only - Backend will handle actual OTP sending
        console.log("UI: Phone number entered:", state.phoneNumber);
        
        sendOtpBtn.textContent = "Sending...";
        sendOtpBtn.disabled = true;

        setTimeout(() => {
            // Switch to OTP section
            phoneSection.classList.add('hidden');
            otpSection.classList.remove('hidden');
            otpSection.classList.add('flex');
            
            phoneDisplay.textContent = `+91 ${state.phoneNumber}`;
            otpInputs[0].focus();
            startResendTimer();
            state.isOtpSent = true;
        }, 800);
    }

    // --- OTP Functions ---
    function handleOtpInput(e, index) {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        state.otp[index] = value;

        if (value) {
            hideOtpError();
            e.target.classList.add('filled');
            e.target.classList.remove('error');
        } else {
            e.target.classList.remove('filled');
        }

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs[index + 1].focus();
        }

        updateVerifyOtpButton();
    }

    function handleOtpKeydown(e, index) {
        // Handle backspace
        if (e.key === 'Backspace' && !state.otp[index] && index > 0) {
            otpInputs[index - 1].focus();
        }
    }

    function handleOtpPaste(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        
        if (pastedData.length === 6) {
            pastedData.split('').forEach((digit, index) => {
                if (index < 6) {
                    otpInputs[index].value = digit;
                    state.otp[index] = digit;
                    otpInputs[index].classList.add('filled');
                }
            });
            updateVerifyOtpButton();
            otpInputs[5].focus();
        }
    }

    function updateVerifyOtpButton() {
        const isComplete = state.otp.every(digit => digit !== "");
        verifyOtpBtn.disabled = !isComplete;
    }

    function validateOtp() {
        const otpString = state.otp.join('');
        // UI only - Accept 123456 for demo, backend will handle real validation
        return otpString === "123456";
    }

    function showOtpError() {
        otpInputs.forEach(input => {
            input.classList.add('error');
            input.classList.remove('filled');
        });
        otpError.classList.add('show');
    }

    function hideOtpError() {
        otpInputs.forEach(input => {
            input.classList.remove('error');
        });
        otpError.classList.remove('show');
    }

    function handleVerifyOtp() {
        if (!validateOtp()) {
            showOtpError();
            // Clear OTP inputs
            state.otp = ["", "", "", "", "", ""];
            otpInputs.forEach(input => {
                input.value = "";
                input.classList.remove('filled');
            });
            updateVerifyOtpButton();
            otpInputs[0].focus();
            return;
        }

        // Show success feedback
        verifyOtpBtn.textContent = "Verified!";
        verifyOtpBtn.disabled = true;

        setTimeout(() => {
            // Navigate to Register page
            console.log("NAVIGATING TO: Register.html");
            window.location.href = 'Register.html';
        }, 800);
    }

    // --- Resend Timer Functions ---
    function startResendTimer() {
        state.resendTimer = 30;
        resendLink.classList.add('disabled');
        
        state.timerInterval = setInterval(() => {
            state.resendTimer--;
            timerDisplay.textContent = state.resendTimer;
            
            if (state.resendTimer <= 0) {
                clearInterval(state.timerInterval);
                resendLink.classList.remove('disabled');
                resendLink.textContent = 'Resend OTP';
            }
        }, 1000);
    }

    function handleResendOtp() {
        if (resendLink.classList.contains('disabled')) return;
        
        console.log("UI: Resend OTP clicked");
        
        // Clear current OTP
        state.otp = ["", "", "", "", "", ""];
        otpInputs.forEach(input => {
            input.value = "";
            input.classList.remove('filled', 'error');
        });
        hideOtpError();
        updateVerifyOtpButton();
        
        // Restart timer
        resendLink.innerHTML = 'Resend in <span id="timer">30</span>s';
        startResendTimer();
        
        otpInputs[0].focus();
    }

    // Run init
    init();

})();

