import Metamask from "./Metamask.js";
import abiUtil from "./abiUtil.js";

var DOMAIN_BSC = "https://bsc-dataseed.binance.org/";
var metamask = null;
const INT_10_POW_18 = 1000000000000000000;
const INT_10_POW_9 = 1000000000;
const address_default = "0x8e34433249C137ea9587a7d94C8DBf0C184a2d38";
var intervalCountdown = 0;
var addressInput = "";

function getValueDecimal(value, fixed_decimal, int_pow = INT_10_POW_18) {
  var result = parseFloat(parseFloat(value) / int_pow).toFixed(fixed_decimal);
  return Number(result);
}

function formatFloatNumber(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
}

function setValueElementId(IdElement, value, decimal = 2) {
  var el = document.getElementById(IdElement);
  if (el) {
    let data = parseFloat(value.toString()).toFixed(decimal).toString();
    el.innerText = formatFloatNumber(data);
  }
}

function setTimeElementId(IdElement, value) {
  var el = document.getElementById(IdElement);
  if (el) {
    let data = parseFloat(value.toString()).toFixed(0).toString();
    if (parseInt(data) < 10) data = '0' + data;
    el.innerText = formatFloatNumber(data);
  }
}

function setValueOfConvertToUSD(elementName, value, decimal = 2) {
  var element = document.getElementById("bnb_price");
  if (element) {
    var price = document.getElementById("bnb_price").textContent;
    var balanceUsd = parseFloat(value * parseFloat(price)).toFixed(decimal);
    setValueElementId(elementName, `${balanceUsd}`, decimal);
  }
}

function setValueCAKEToUSD(elementName, value, decimal = 2) {
  var element = document.getElementById("cake_price");
  if (element) {
    var price = document.getElementById("cake_price").textContent;
    var balanceUsd = parseFloat(value * parseFloat(price)).toFixed(decimal);
    setValueElementId(elementName, `${balanceUsd}`, decimal);
  }
}

async function mounted() {
  metamask = new Metamask(DOMAIN_BSC);

  loadValueDefault();
  // setInterval(loadValueDefault, 5000);

  document
    .getElementById("inputContractAddress")
    .addEventListener("change", listenInputContractAddress);
}

function listenInputContractAddress(evt) {
  if (evt.target) {
    addressInput = evt.target.value;
    loadValueInfoUser(addressInput);
    intervalCountdown = setInterval(countdown, 5000);
  }
}

function countdown() {
  let element = document.getElementById("inputContractAddress");
  if (element) {
    let value = element.value;
    if (value && value == addressInput) loadValueInfoUser(addressInput);
    else clearInterval(intervalCountdown);
  } else clearInterval(intervalCountdown);
}

function formatValue(value, decimal = 2) {
  return value
    .toString()
    .toLocaleString(undefined, { minimumFractionDigits: decimal });
}

async function loadValueInfoUser(contract_address) {
  try {
    var abiInfo = abiUtil.contract_BRUCELEE;
    var contract = await metamask.initContract(abiInfo.abi, abiInfo.address);
    var yourInchPunch = await contract.methods.balanceOf(contract_address).call();
    yourInchPunch = getValueDecimal(yourInchPunch, 2, INT_10_POW_9);
    setValueElementId("yourInchPunch", yourInchPunch, 0);

    abiInfo = abiUtil.contract_INCH;
    contract = await metamask.initContract(abiInfo.abi, abiInfo.address);
    var yourInch = await contract.methods.balanceOf(contract_address).call();
    yourInch = getValueDecimal(yourInch, 2);
    setValueElementId("yourInch", yourInch, 2);
  } catch (err) {}
}

async function loadValueDefault() {
  try {
    var abiInfo = abiUtil.contract_BRUCELEE;
    var contract = await metamask.initContract(abiInfo.abi, abiInfo.address);
    var totalInchDistributed = await contract.methods.balanceOf(address_default).call();
    // var abiInfo = abiUtil.contract_sub_BRUCELEE;
    // var contract = await metamask.initContract(abiInfo.abi, abiInfo.address);
    // var totalInchDistributed = await contract.methods.totalDistributed().call();
    totalInchDistributed = getValueDecimal(totalInchDistributed, 2);
    setValueElementId("totalInchDistributed", totalInchDistributed, 2);
  } catch (err) {
    console.log(err);
  }
}

mounted();
