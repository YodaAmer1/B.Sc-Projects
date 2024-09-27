export function removeTrailingZeros(number, fractionDigits = 10) {
  // Convert to string and use a regex to remove trailing zeros
  return parseFloat(
    number.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1"),
  ).toLocaleString("en-US", {
    maximumFractionDigits: fractionDigits,
  });
}
//0.21156100000000000000 => 0.211561

function formatNumber(number, decimalPlaces = 2) {
  return number.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// export function removeTrailingZeros(number) {
//   let superatedNumber = number.toString().split(".");
//   console.log(superatedNumber);
//   const firstPart = superatedNumber[0]
//     .toString()
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   const secondPart = superatedNumber[1]
//     ? superatedNumber[1].replace(/0+$/, "")
//     : "";

//   // Convert to string and use a regex to remove trailing zeros
//   return firstPart + (secondPart ? "." + secondPart : "");
// }
