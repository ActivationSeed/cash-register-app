let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const cashInDrawer = document.getElementById("cash-in-drawer");

const currencyUnit = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1.00,
  "FIVE": 5.00,
  "TEN": 10.00,
  "TWENTY": 20.00,
  "ONE HUNDRED": 100.00
};

purchaseBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const cash = parseFloat(document.getElementById("cash").value);
  let change = parseFloat((cash - price).toFixed(2));

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (cash === price) {
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }

  const totalCid = parseFloat(cid.reduce((sum, denom) => sum + denom[1], 0).toFixed(2));

  if (totalCid < change) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  const changeArr = [];
  let remainingChange = change;
  let reversedCid = [...cid].reverse();

  for (let [unit, amount] of reversedCid) {
    let unitValue = currencyUnit[unit];
    let unitAmount = 0;

    while (remainingChange >= unitValue && amount >= unitValue) {
      unitAmount = Math.round((unitAmount + unitValue) * 100) / 100;
      amount = Math.round((amount - unitValue) * 100) / 100;
      remainingChange = Math.round((remainingChange - unitValue) * 100) / 100;
    }

    if (unitAmount > 0) {
      changeArr.push([unit, parseFloat(unitAmount.toFixed(2))]);
    }
  }

  let readableChange = changeArr.map(([unit, amount]) => `${unit}: $${parseFloat(amount.toFixed(2))}`).join('\n');

  if (remainingChange > 0) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
  } 
  
  else if (change === totalCid) {
    const closedDisplay = cid.map(([unit, amount]) => [unit, parseFloat(amount.toFixed(2))]);
    changeDue.innerText = "Status: CLOSED " + closedDisplay
    .filter(([_, amount]) => amount > 0)
    .map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`)
    .join(' ');
    cid = cid.map(([unit, _]) => [unit, 0]);
    cashInDrawer.innerText = cid.map(([unit, amount]) => `${unit}: $${parseFloat(amount.toFixed(2))}`).join('\n');
  } 
  
  else {
    changeArr.forEach(([unit, amount]) => {
      for (let i = 0; i < cid.length; i++) {
        if (cid[i][0] === unit) {
          cid[i][1] = parseFloat((cid[i][1] - amount).toFixed(2));
          break;
        }
      }
    })
    changeDue.innerText = `Status: OPEN\n${readableChange}`;
    cashInDrawer.innerText = cid.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join('\n');
  }
  
});

document.getElementById("cash").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    purchaseBtn.click();
  }
});