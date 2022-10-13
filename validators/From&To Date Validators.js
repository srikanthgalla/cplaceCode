// fromDate validator & toDate validator
// fromDate validator
let result = null;
let fromDate = page.get('cf.cplace.validFrom');
let toDate = page.get('cf.cplace.validTo');

// toDate validator 
if(!fromDate || !toDate){
  return null;
}

if(toDate.isBefore(fromDate)){
  return messages.get('toDate');
}

// fromDate -> "2022-07-08T10:00Z00" > "2022-07-08T10:00Z00"
// isBefore() also exists
// https://www.joda.org/joda-time/apidocs/org/joda/time/DateTime.html
// fromDate validator

if(fromDate.isAfter(toDate)){
 return messages.get('fromDate');
}


let today = new Date();
if(fromDate.isAfter(toDate)){
  return messages.get('fromDate');
}
// valid from date must be greater that current date
if(fromDate.isBefore(today)){
 return messages.get('toDay');
}




