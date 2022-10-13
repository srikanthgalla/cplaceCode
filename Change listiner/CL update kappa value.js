const OP = {
    TYPE: 'cf.cplace.fpfs.operationalPlanning',
    ATTR: {
        OP_IFC_VALUE: 'cf.cplace.internalCapacityValue',
        OP_INTERNAL_CAPACITY: 'cf.cplace.internalCapacity',
        OP_INTERNAL_VALUE: 'cf.cplace.internalValue',
        OP_BUDGET_TYPE: 'cf.cplace.budgetType',
        OP_BUDGET_RELAVENT: 'cf.cplace.type'
    }
};
var page = changeEvent.getEntity();
let ifcValue = page.get(OP.ATTR.OP_IFC_VALUE);
let internal_Capacity = page.get(OP.ATTR.OP_INTERNAL_CAPACITY);
let internal_Value = page.get(OP.ATTR.OP_INTERNAL_VALUE);
let budget_Type = page.get(OP.ATTR.OP_BUDGET_TYPE);
let budget_Relavent = page.get(OP.ATTR.OP_BUDGET_RELAVENT);

let obj = {};
obj[OP.ATTR.OP_INTERNAL_VALUE] = ifcValue * internal_Capacity;
updatePage(page, obj);

function updatePage(page, customAttributes) {
    cplace.log(page + " " + JSON.stringify(customAttributes));
    let key = null;
    for (key in customAttributes) {
        if (customAttributes.hasOwnProperty(key)) {
            page.registerAttributeForRefresh(key)
        }
    }
    return cplace.actions().updatePage(page, {
        customAttributes: customAttributes,
    }, {
        setGeneratedName: true
    });
}

page.registerAttributeForRefresh('cf.cplace.internalValue');