const dateSelector = document.getElementById("dateSelector");
const amountInput = document.getElementById("amount");
const amountSpan = document.getElementById("amountSpan");
const dateSpan = document.getElementById("dateSpan");
const newAmountSpan = document.getElementById("newAmountSpan");
const button = document.getElementById("submitButton");

let currentValue;
let oldValue;
let amount;
let date;

let newAmount = 0;

button.addEventListener("click", function () {
    amount = amountInput.value;
    date = dateSelector.value;

    if (amount && date) {
        amountSpan.innerText = "$" + amount;
        dateSpan.innerText = dateSelector.value;

        currentPriceRequest();
        oldPriceRequest(date);

        newAmountSpan.innerText = "Checking...";
        setTimeout(function () {
            calculateNewAmount();
            setNewAmountText();
        }, 1000);
    }
});

function setNewAmountText()  {
    if (newAmount >= amount) {
        newAmountSpan.classList.remove("bad");
        newAmountSpan.classList.add("good");
    } else {      
        newAmountSpan.classList.remove("good");
        newAmountSpan.classList.add("bad");
    }
    newAmountSpan.innerText = "$" + newAmount.toFixed(2);
} 
            

function calculateNewAmount() {
    amount = parseFloat(amount);
    oldValue = parseFloat(oldValue);
    currentValue = parseFloat(removeCommas(currentValue));
    newAmount = amount / oldValue * currentValue;
}
            
// send request for current bitcoin price
function currentPriceRequest() {
    request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            currentValue = JSON.parse(request.responseText).bpi.USD.rate;
        }
    };
    request.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json");
    request.send();
}
            
// send request for bitcoin price at date     
function oldPriceRequest(date) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
        oldValue = JSON.parse(request.responseText).bpi[date];
     }
    };
    request.open("GET", "https://api.coindesk.com/v1/bpi/historical/close.json?start=" + date + "&end=" + date);
    request.send();
}

function removeCommas(str) {
    return(str.replace(/,/g,''));
}
