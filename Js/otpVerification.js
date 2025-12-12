
    (function () {
      // Demo correct OTP
      const CORRECT_OTP = "123456";

      // Elements
      const otpRow = document.getElementById('otpRow');
      const continueBtn = document.getElementById('continueBtn');
      const countdownEl = document.getElementById('countdown');
      const retryArea = document.getElementById('retryArea');
      const phoneText = document.getElementById('phoneText');
      const backBtn = document.getElementById('backBtn');
      const toastRoot = document.getElementById('toastRoot');

      // Get phone from query params if present
      const params = new URLSearchParams(window.location.search);
      const phoneNumber = params.get('phone') || '63619-81038';
      phoneText.textContent = `+91 ${phoneNumber}`;

      // state
      let otp = ["", "", "", "", "", ""];
      let isError = false;
      let isSuccess = false;
      let countdown = 59;
      let inputEls = [];

      // render 6 inputs
      function createInputs() {
        otpRow.innerHTML = '';
        inputEls = [];
        for (let i = 0; i < 6; i++) {
          const input = document.createElement('input');
          input.type = 'text';
          input.inputMode = 'numeric';
          input.maxLength = 1;
          input.setAttribute('aria-label', `OTP digit ${i+1}`);
          input.className = 'w-12 h-[48px] text-center text-lg font-semibold rounded-lg border bg-white focus:outline-none transition-colors border-[#B2B2B2]';
          input.value = otp[i];
          input.addEventListener('input', (e) => onChange(i, e));
          input.addEventListener('keydown', (e) => onKeyDown(i, e));
          if (i === 0) {
            input.addEventListener('paste', onPaste);
          }
          otpRow.appendChild(input);
          inputEls.push(input);
        }
      }

      function updateInputStyles() {
        inputEls.forEach((el, i) => {
          el.classList.remove('border-green-500', 'border-red-500', 'border-[#0F0F0F]', 'border-[#B2B2B2]');
          if (isSuccess && otp[i]) el.classList.add('border-green-500');
          else if (isError && otp[i]) el.classList.add('border-red-500');
          else if (otp[i]) el.classList.add('border-[#0F0F0F]');
          else el.classList.add('border-[#B2B2B2]');
        });
      }

      function onChange(index, e) {
        const val = e.target.value.replace(/\D/g, '').slice(0,1); // only single digit
        // reflect value
        otp[index] = val;
        e.target.value = val;

        // move focus
        if (val && index < 5) {
          inputEls[index+1].focus();
        }

        // update styles + continue button
        updateInputStyles();
        updateContinueState();

        // auto verify if all 6 filled
        if (otp.join('').length === 6) {
          verifyOtp(otp.join(''));
        }
      }

      function onKeyDown(index, e) {
        if (e.key === 'Backspace') {
          e.preventDefault();
          if (!otp[index] && index > 0) {
            inputEls[index-1].focus();
            otp[index-1] = '';
            inputEls[index-1].value = '';
          } else {
            otp[index] = '';
            inputEls[index].value = '';
          }
          updateInputStyles();
          updateContinueState();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          inputEls[index-1].focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
          e.preventDefault();
          inputEls[index+1].focus();
        } else if (/\d/.test(e.key) && e.key.length === 1) {
          // allow digit and replace current value (handled in input event)
          // but we let input event handle it
        }
      }

      function onPaste(e) {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0,6);
        if (!pasted) return;
        for (let i = 0; i < 6; i++) {
          otp[i] = pasted[i] || '';
        }
        // re-render values to inputs
        inputEls.forEach((el, i) => el.value = otp[i] || '');
        updateInputStyles();
        updateContinueState();

        if (pasted.length === 6) {
          verifyOtp(pasted);
        } else {
          // focus after last pasted digit
          const lastIndex = Math.min(pasted.length, 5);
          inputEls[lastIndex].focus();
        }
      }

      function updateContinueState() {
        const all = otp.join('');
        if (all.length === 6) {
          continueBtn.disabled = false;
          continueBtn.classList.remove('bg-[#DEDEDE]', 'text-[#4D4D4D]', 'opacity-80');
          continueBtn.classList.add('bg-[#07A348]', 'text-[#E6E5E5]');
        } else {
          continueBtn.disabled = true;
          continueBtn.classList.remove('bg-[#07A348]', 'text-[#E6E5E5]');
          continueBtn.classList.add('bg-[#DEDEDE]', 'text-[#4D4D4D]', 'opacity-80');
        }
      }

      function verifyOtp(otpString) {
        if (otpString === CORRECT_OTP) {
          isSuccess = true;
          isError = false;
          showToast('OTP verified');
          updateInputStyles();
          // simulate navigation after 2s
          setTimeout(() => {
            // window.location.href = '/dashboard'; // enable when needed
          }, 2000);
        } else {
          isError = true;
          isSuccess = false;
          updateInputStyles();
          // brief shake / error feedback and reset
          setTimeout(() => {
            otp = ["","","","","",""];
            inputEls.forEach(el => el.value = '');
            inputEls[0].focus();
            isError = false;
            updateInputStyles();
            updateContinueState();
          }, 1500);
        }
      }

      // Continue button manual click (optional)
      continueBtn.addEventListener('click', () => {
        if (continueBtn.disabled) return;
        verifyOtp(otp.join(''));
      });

      // back button
      backBtn.addEventListener('click', () => {
        window.history.back();
      });

      // Countdown timer
      function startCountdown() {
        countdownEl.textContent = countdown;
        const interval = setInterval(() => {
          if (countdown > 0) {
            countdown--;
            countdownEl.textContent = countdown;
          } else {
            clearInterval(interval);
            // switch to Retry now button
            renderRetryNow();
          }
        }, 1000);
      }

      function renderRetryNow() {
        retryArea.innerHTML = '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'font-inter text-sm font-semibold leading-5 tracking-[0.04px] text-[#07A348] underline';
        btn.textContent = 'Retry now';
        btn.addEventListener('click', handleRetry);
        retryArea.appendChild(btn);
      }

      function handleRetry() {
        if (countdown === 0) {
          countdown = 59;
          countdownEl.textContent = countdown;
          // restore text
          retryArea.innerHTML = 'Retry in <span id="countdown">'+countdown+'</span> sec';
          // restart countdown
          startCountdown();
          showToast('OTP resent successfully');
        }
      }

      // simple toast
      function showToast(message, duration = 1600) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = message;
        toastRoot.appendChild(t);
        setTimeout(() => t.remove(), duration);
      }

      // initialize
      createInputs();
      updateInputStyles();
      updateContinueState();
      inputEls[0].focus();
      startCountdown();
    })();
