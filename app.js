const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';

let dropDowns = document.querySelectorAll('.drop-down select');
let btn = document.querySelector('button');
let fromCurr = document.querySelector('.from');
let toCurr = document.querySelector('.to');
let msg = document.querySelector('.msg');
let container = document.querySelector('.justify-between');

// from and to selects are iterated and then new option is added to select element
for(let select of dropDowns) {
    for(let currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = currCode;
        // default values of from and to are selected to US and IN
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
          } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
          }
        select.append(newOption);
    }
    // eventListener to update the country flag when we change the currency code
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// function to change the flag according to currency code
const updateFlag = (element) => {
   let currCode = element.value;
   let countryCode = countryList[currCode];
   let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
   let img = element.parentElement.querySelector("img");
   img.src = newSrc;
}

// calculate exchange rate with help of fetch api
const updateExchangeRate = async() => {
    let amount = document.querySelector('input');
    let amtVal = amount.value;
    // if amount entered is less than 1 then reset it to 1
    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    // get the exchange rate from the response body
    let rate = data[toCurr.value.toLowerCase()];
    let totalAmount = amtVal * rate;

    // update the text of the message
    msg.innerText = `${amtVal}${fromCurr.value} = ${totalAmount}${toCurr.value}`;
}

// function to update the exchange rate according to change in country
const updateRateInMsg = async() => {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    // get the exchange rate from the response body
    let rate = data[toCurr.value.toLowerCase()];
    // update the text of the message
    msg.innerText = `${1}${fromCurr.value} = ${rate}${toCurr.value}`;
};

// event listener to update the exchange rate according to change in country
container.addEventListener("change", () => {
    updateRateInMsg();
});

// event listener on button to display the result
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// default event listener, when the page is loaded this event listener is called
window.addEventListener("load", () => {
    updateExchangeRate();
})
