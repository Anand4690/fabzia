 (function () {
        const phone = document.getElementById('phone');
        const cont = document.getElementById('continueBtn');

        function setEnabled(enabled) {
          if (enabled) {
            cont.classList.remove('bg-[#DEDEDE]', 'text-[#4D4D4D]', 'opacity-80');
            cont.classList.add('bg-[var(--btn-background-primary)]', 'text-white');
            cont.setAttribute('aria-disabled', 'false');
            cont.disabled = false;
          } else {
            cont.classList.remove('bg-[#0F0F0F]', 'text-white');
            cont.classList.add('bg-[#DEDEDE]', 'text-[#4D4D4D]', 'opacity-80');
            cont.setAttribute('aria-disabled', 'true');
            cont.disabled = true;
          }
        }

        // sanitize input to digits only
        phone.addEventListener('input', function (e) {
          const digits = this.value.replace(/\D/g, '');
          if (this.value !== digits) this.value = digits;
          setEnabled(digits.length === 10);
        });

        // optional: handle click of continue
        cont.addEventListener('click', function () {
          if (cont.disabled) return;
          // implement your continue flow here (e.g., navigate to OTP screen)

          alert('Continue clicked with phone: ' + phone.value);
        });

        // skip button (example behavior)
        document.getElementById('skipBtn').addEventListener('click', function () {
          // implement skip behavior (e.g., navigate to home)
          alert('Skipped');
        });

        // initialize state
        setEnabled(false);
      })();