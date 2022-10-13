// fromDate validator & toDate validator

let result = null;
let fromDate = page.get('cf.cplace.validFrom');
let toDate = page.get('cf.cplace.validTo');

if(fromDate > toDate){
  result = messages.get('toDate');
}
return result;


// another way to test validators
// fromDate validator
let result = null;
let fromDate = page.get('cf.cplace.validFrom');

if (fromDate !== null && !fromDate.isBeforeNow()){
   result = messages.get('fromDate'); // fromDate and message name should be same then message will come
}
return result;



// toDate validator 
let result = null;
let toDate = page.get('cf.cplace.validTo');

if (toDate !== null && toDate.isBeforeNow()){
   result = messages.get('toDate'); // toDate and message name should be same then message will come
}
return result;



