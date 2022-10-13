// From date
let fromDate = page.get('cf.cplace.validFrom');
let toDate = page.get('cf.cplace.validTo');
let today_Date = new DateTime();

cplace.log("#########");
cplace.log(fromDate);
cplace.log(toDate);
cplace.log(today_Date);
cplace.log("11111111111111111111111");
  
if(!fromDate || !toDate){
  return null;
}

if(fromDate.isAfter(toDate)){
  return messages.get('fromDate');
}

let fyear = fromDate.year().get();             
let fmonth = fromDate.monthOfYear().get();     
let fdayOfMonth = fromDate.dayOfMonth().get(); 
let tyear = today_Date.year().get();            
let tmonth = today_Date.monthOfYear().get();    
let tdayOfMonth = today_Date.dayOfMonth().get();

if(fyear == tyear && fmonth == tmonth && fdayOfMonth < tdayOfMonth){
 return messages.get('currentDate');
}

// toDate
let fromDate = page.get('cf.cplace.validFrom');
let toDate = page.get('cf.cplace.validTo');

if(!fromDate || !toDate){
  return null;
}

if(toDate.isBefore(fromDate) || fromDate.isAfter(toDate)){
  return messages.get('toDate');
}

let fromYear = fromDate.year().get();
let toYear = toDate.year().get();
  
 if(fromYear != toYear){
   return messages.get('fromYear');
}