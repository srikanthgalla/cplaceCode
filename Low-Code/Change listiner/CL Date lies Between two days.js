var page = changeEvent.getEntity();

let startDate = new Date(page.get('cf.cplace.validFrom'));
let endDate = new Date(page.get('cf.cplace.validTo'));
let dateToday = new Date();
//cplace.log(startDate + ' start '+ endDate +"end Date")

var value = (dateToday >= startDate &&  endDate >= dateToday) ? true : false ;
//cplace.log(value + ' result');
cplace.actions().updatePage(page, {
            customAttributes: {
                ['cf.cplace.isValid']: value
            }
    });
page.registerAttributeForRefresh('cf.cplace.isValid');