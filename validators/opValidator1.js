let result = null;
let budgetType = page.get('cf.cplace.budgetType');
let awardType = page.get('cf.cplace.awardType');

if (awardType && awardType) {
    if (budgetType == 'int.' && awardType != 'Eigenleistung') {
        result = messages.get('int.', awardType);
    }

    if ((budgetType == 'ext.' && awardType == 'Eigenleistung') || (budgetType == 'ext.' && awardType == 'Einnahmen')) {
        cplace.log('gaaaaaaaa');
        result = messages.get('ext.', awardType);
    }

    if (budgetType == 'income' && awardType != 'Einnahmen') {
        result = messages.get('income', awardType);
    }
} else {
    result = 'please fill the budgetType &  awardType';
}
return result;

let result = null;
let budgetType = page.get('cf.cplace.budgetType');
let costObject = page.get('cf.cplace.costObject');

if (budgetType) {
    if ((costObject == null && budgetType != 'int.') || (costObject == null && budgetType != 'ext.')) {
        result = messages.get('costObject');
    }
}
return result;



let result = null;
let Dept = page.get('cf.cplace.opDepartment');
let yar = page.get('cf.cplace.year');
let ICF_value = page.get('cf.cplace.internalCapacityValue');

if (Dept != null) {
    if (yar != null) {
        if (ICF_value == null) {
            result = messages.get('ICFvalue');
        }
    }
}
return result;