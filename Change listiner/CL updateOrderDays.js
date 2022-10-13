var page = changeEvent.getEntity();

const fromDate = page.get('cf.cplace.validFrom');
const toDate = page.get('cf.cplace.validTo');
let orderDays = page.get('cf.cplace.orderDays');

let from_date = new Date(fromDate);
let to_date = new Date(toDate);

orderDays = (to_date - from_date) / (1000 * 3600 * 24);

cplace.log(from_date);
cplace.log(to_date);
cplace.log(orderDays);

let obj = {
    customAttributes: {
        ['cf.cplace.orderDays']: orderDays
    }
};

cplace.actions().updatePage(page, obj);

page.registerAttributeForRefresh('cf.cplace.orderDays');