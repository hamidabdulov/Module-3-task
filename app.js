const options = { method: 'GET', headers: { accept: 'application/json' } };

let exchangeRates = {};

fetch('https://api.fastforex.io/fetch-all?api_key=d0397fe669-3b73bc8f9d-sdfc74', options)
  .then(response => response.json())
  .then(data => {
    const rates = data.results;
    exchangeRates = {
      "EUR_USD": rates.USD / rates.EUR,
      "USD_EUR": rates.USD / rates.EUR,
      "EUR_RUB": rates.EUR / rates.RUB,
      "RUB_EUR": rates.RUB / rates.EUR,
      "EUR_GBP": rates.GBP / rates.EUR,
      "GBP_EUR": rates.EUR / rates.GBP,
      "USD_RUB": rates.USD / rates.RUB,
      "RUB_USD": rates.RUB / rates.USD,
      "USD_GBP": rates.USD / rates.GBP,
      "GBP_USD": rates.GBP / rates.USD,
      "RUB_GBP": rates.RUB / rates.GBP,
      "GBP_RUB": rates.GBP / rates.RUB,
      "RUB_RUB": rates.RUB / rates.RUB,
      "USD_USD": rates.USD / rates.USD,
      "EUR_EUR": rates.EUR / rates.EUR,
      "GBP_GBP": rates.GBP / rates.GBP,
    };
    updateButtonStyles();
    updateSelectedCurrencies();
    convert();
  })
  .catch(err => console.error(err));

let currency1 = 'RUB';
let currency2 = 'USD';

function setCurrency(target, currency) {
  if (target === 'currency1') {
    currency1 = currency;
  } else if (target === 'currency2') {
    currency2 = currency;
  }
  updateButtonStyles();
  updateSelectedCurrencies();
  convert();
}

function updateButtonStyles() {
  document.querySelectorAll('#currency1-buttons button').forEach(button => {
    button.style.backgroundColor = button.innerText.trim() === currency1 ? 'blueviolet' : '';
  });
  document.querySelectorAll('#currency2-buttons button').forEach(button => {
    button.style.backgroundColor = button.innerText.trim() === currency2 ? 'blueviolet' : '';
  });
}

function updateSelectedCurrencies() {
  let rate1 = exchangeRates[currency1 + "_" + currency2];
  let rate2 = exchangeRates[currency2 + "_" + currency1];
  if (rate1 && rate2) {
    document.getElementById('selected-currencies').innerText = `1 ${currency1} = ${rate1.toFixed(4)} ${currency2}`;
    document.getElementById('selected-currencies-duplicate').innerText = `1 ${currency2} = ${rate2.toFixed(4)} ${currency1}`;
  } else {
    document.getElementById('selected-currencies').innerText = `Курс для ${currency1} и ${currency2} недоступен`;
    document.getElementById('selected-currencies-duplicate').innerText = `Курс для ${currency2} и ${currency1} недоступен`;
  }
}

function convert() {
  let amount1 = parseFloat(document.getElementById('amount1').value);
  if (isNaN(amount1) || !exchangeRates[currency1 + "_" + currency2]) {
    document.getElementById('amount2').value = '';
    return;
  }

  let conversionKey = currency1 + "_" + currency2;
  let convertedAmount = amount1 * exchangeRates[conversionKey];
  document.getElementById('amount2').value = convertedAmount.toFixed(4);
}

function preventInvalidInput(event) {
  if (['e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault();
  }
}

function replaceCommaWithPeriod(event) {
  event.target.value = event.target.value.replace(/,/g, '.');
}

document.addEventListener('DOMContentLoaded', () => {
  updateButtonStyles();
  document.getElementById('amount1').addEventListener('input', convert);
  document.getElementById('amount1').addEventListener('keydown', preventInvalidInput);
  document.getElementById('amount1').addEventListener('input', replaceCommaWithPeriod);
  document.getElementById('amount2').addEventListener('keydown', preventInvalidInput);
  document.getElementById('amount2').addEventListener('input', replaceCommaWithPeriod);
});
