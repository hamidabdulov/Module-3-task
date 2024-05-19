const options = { method: 'GET', headers: { accept: 'application/json' } };

let exchangeRates = {};

fetch('https://api.fastforex.io/fetch-all?api_key=d0397fe669-3b73bc8f9d-sdfc74', options)
  .then(response => response.json())
  .then(data => {
    const rates = data.results;
    exchangeRates = {
      "EUR_USD": rates.USD / rates.EUR,
      "USD_EUR": rates.EUR / rates.USD,
      "EUR_RUB": rates.RUB / rates.EUR,
      "RUB_EUR": rates.EUR / rates.RUB,
      "EUR_GBP": rates.GBP / rates.EUR,
      "GBP_EUR": rates.EUR / rates.GBP,
      "USD_RUB": rates.RUB / rates.USD,
      "RUB_USD": rates.USD / rates.RUB,
      "USD_GBP": rates.GBP / rates.USD,
      "GBP_USD": rates.USD / rates.GBP,
      "RUB_GBP": rates.GBP / rates.RUB,
      "GBP_RUB": rates.RUB / rates.GBP,
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

document.addEventListener('DOMContentLoaded', () => {
  updateButtonStyles();
  document.getElementById('amount1').addEventListener('input', convert);
});
