document.addEventListener("DOMContentLoaded", () => {
    /**
     * - If the image is not working please kindly open this
     * https://github.com/Switcheo/token-icons/blob/main/tokens/1INCH.svg
     * - Right click on the image and open the image in a new tab
     * - Then copy paste the link here until tokens/
     * - Then the image should display properly afterwards
     *  */ 
    const iconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/221f4f0d6b885dfa71ac57c88965c31a1884afd6/tokens/`;
    const app = document.getElementById('app');
  
    // Helper function to display error message
    const displayError = (message) => {
      const errorElement = document.getElementById('error');
      errorElement.innerHTML = `<p style="color:red;">${message}</p>`;
    };
  
    // Helper function to clear error message
    const clearError = () => {
      document.getElementById('error').innerHTML = '';
    };
  
    // Function to populate the dropdown with data
    const populateDropdown = (data, type) => {
      const dropdown = document.getElementById(`dropdown-${type}`);
      const dropdownSelect = document.getElementById(`dropdown-select-${type}`);
      const dropdownOptions = document.getElementById(`dropdown-options-${type}`);
  
      data.forEach(item => {
        const option = document.createElement('div');
        option.classList.add(`dropdown-option-${type}`);
        option.setAttribute('data-value', item.price);
  
        option.innerHTML = `
          <div style="display: flex;padding: 4px;align-items:center;">
            <img style="margin-right:4px;" src="${iconUrl}${item.currency}.svg" alt="${item.currency}" onerror="this.style.display='none';">
            ${item.currency}
          </div>
        `;
  
        dropdownOptions.appendChild(option);
      });
  
      // Toggle dropdown visibility when clicked
      dropdownSelect.addEventListener('click', () => {
        dropdown.classList.toggle('open');
      });
  
      // Handle selecting an option
      dropdown.querySelectorAll(`.dropdown-option-${type}`).forEach(option => {
        option.addEventListener('click', () => {
          const selectedValue = option.getAttribute('data-value');
          const selectedText = option.textContent.trim();
          const selectedImg = option.querySelector('img').src;
  
          dropdownSelect.innerHTML = `
            <img style="margin-right:4px;" src="${selectedImg}" alt="${selectedText}" onerror="this.style.display='none';">
            ${selectedText}
          `;
          dropdownSelect.value = selectedValue;
  
          updateConvertedPrice(type);
          dropdown.classList.remove('open');
        });
      });
    };
  
    // Function to handle price conversion
    const updateConvertedPrice = (type) => {
      const fromCurrency = parseFloat(document.getElementById('dropdown-select-send').value);
      const toCurrency = parseFloat(document.getElementById('dropdown-select-receive').value);
      const fromAmountInput = document.getElementById('input-amount');
      const toAmountInput = document.getElementById('output-amount');
  
      clearError();
  
      if (type === 'send') {
        const fromAmount = parseFloat(fromAmountInput.value);
  
        if (isNaN(fromAmount) || fromAmount <= 0) {
          toAmountInput.value = '';
          if (fromAmount !== '') {
            displayError('Please kindly enter the correct amount');
          }
          return;
        }
  
        if (fromAmount && toCurrency && fromCurrency) {
          const convertedAmount = (fromAmount * fromCurrency) / toCurrency;
          toAmountInput.value = convertedAmount.toFixed(2);
        }
      } else {
        const toAmount = parseFloat(toAmountInput.value);
  
        if (isNaN(toAmount) || toAmount <= 0) {
          fromAmountInput.value = '';
          if (toAmount !== '') {
            displayError('Please kindly enter the correct amount');
          }
          return;
        }
  
        if (toAmount && toCurrency && fromCurrency) {
          const convertedAmount = (toAmount * toCurrency) / fromCurrency;
          fromAmountInput.value = convertedAmount.toFixed(2);
        }
      }
    };
  
    // Function to handle form submission
    const submitCurrencySwap = () => {
      const fromAmount = parseFloat(document.getElementById('input-amount').value);
      const toAmount = parseFloat(document.getElementById('output-amount').value);
      const loadingSpinner = document.getElementById('loading-spinner');
      const submitButton = document.getElementById('submit-button');
  
      if (fromAmount && toAmount) {
        submitButton.style.display = 'none';
        loadingSpinner.style.display = 'flex';
  
        setTimeout(() => {
          submitButton.style.display = 'block';
          loadingSpinner.style.display = 'none';
  
          Toastify({
            text: "Success on swapping currencies",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)"
            }
          }).showToast();
        }, 500);
      } else {
        Toastify({
          text: "Please kindly enter the right amount",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "linear-gradient(to right, #f44336, #e91e63)"
          }
        }).showToast();
      }
    };
  
    // Fetch data and initialize the app
    const fetchData = async () => {
      try {
        const response = await fetch("https://interview.switcheo.com/prices.json");
        const data = await response.json();
        
        populateDropdown(data, 'send');
        populateDropdown(data, 'receive');
  
        const outputAmount = document.getElementById('output-amount');
        const inputAmount = document.getElementById('input-amount');
        const submitButton = document.getElementById('submit-button');
  
        outputAmount.addEventListener('input', () => updateConvertedPrice('receive'));
        inputAmount.addEventListener('input', () => updateConvertedPrice('send'));
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          submitCurrencySwap();
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        app.innerHTML = "<h1>Error loading data.</h1>";
      }
    };
  
    // Start fetching data and setting up the app
    fetchData();
  });
  