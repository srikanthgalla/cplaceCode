const OP = {
  TYPE: 'cf.cplace.fpfs.operationalPlanning',
  ATTR: {
    OP_IFC_VALUE: 'cf.cplace.internalCapacityValue',
    OP_INTERNAL_CAPACITY: 'cf.cplace.internalCapacity',
    OP_INTERNAL_VALUE: 'cf.cplace.internalValue',
    OP_BUDGET_TYPE: 'cf.cplace.budgetType',
    OP_BUDGET_RELAVENT: 'cf.cplace.type',
    OP_EXTERNAL_VALUE: 'cf.cplace.ext.Value',
    OP_SHIFTS: 'cf.cplace.shift',
    OP_INCOME: 'cf.cplace.incomeValue',
    OP_AWARDTYPE : 'cf.cplace.awardType' 
  }
};
var page = changeEvent.getEntity();
let ifcValue = page.get(OP.ATTR.OP_IFC_VALUE);
let internal_Capacity = page.get(OP.ATTR.OP_INTERNAL_CAPACITY);
let internal_Value = page.get(OP.ATTR.OP_INTERNAL_VALUE);
let budget_Type = page.get(OP.ATTR.OP_BUDGET_TYPE);
let budget_Relavent = page.get(OP.ATTR.OP_BUDGET_RELAVENT);
let extrenal_value = page.get(OP.ATTR.OP_EXTERNAL_VALUE);
let shifts = page.get(OP.ATTR.OP_SHIFTS);
let income = page.get(OP.ATTR.OP_INCOME);
let awardType = page.get(OP.ATTR.OP_AWARDTYPE);
let opAttributes = {};
internal_Value = ifcValue * internal_Capacity;
cplace.log('result: ' + ifcValue + ' * ' + internal_Capacity + ' = ' + internal_Value);
/**
 * checking all conditions  
 */
opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = (budget_Type == 'int.' && budget_Relavent == 'Budget Relevant') ? internal_Capacity : null;
opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = ((budget_Type == 'int.' || budget_Type == 'ext.' || budget_Type == 'income.') && (budget_Relavent == 'Budget Relevant' || budget_Relavent == 'Invest' || budget_Relavent == 'Shift')) ? internal_Value : null;
opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = ((budget_Type == 'ext.') && (budget_Relavent == 'Budget Relevant' || budget_Relavent == 'Invest')) ? extrenal_value : null;
opAttributes[OP.ATTR.OP_SHIFTS] = ((budget_Type == 'ext.' || budget_Type == 'income.') && (budget_Relavent == 'Shift')) ? shifts : null;
opAttributes[OP.ATTR.OP_INCOME] = (budget_Type == 'income' && budget_Relavent == 'Budget Relevant') ? income : null;
updateAllData(page, opAttributes);

function updateAllData(page, customAttributes) {
  let key = null;
  for (key in customAttributes) {
    if (customAttributes.hasOwnProperty(key)) {
      page.registerAttributeForRefresh(key)
    }
  }
  cplace.actions().updatePage(page, {
    customAttributes: customAttributes,
  });
}
cplace.actions().refresh();