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
      OP_INCOME: 'cf.cplace.incomeValue'
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

internal_Value = ifcValue * internal_Capacity;
cplace.log('result: ' + ifcValue + ' * ' + internal_Capacity + ' = ' + internal_Value);
/**
* checking all conditions 
*/
let case1 = (budget_Type == 'int.' && budget_Relavent == 'Budget Relevant') ? true : false;
let case2 = (budget_Type == 'int.' && budget_Relavent == 'Invest') ? true : false;
let case3 = (budget_Type == 'int.' && budget_Relavent == 'Shift') ? true : false;
let case4 = (budget_Type == 'ext.' && budget_Relavent == 'Budget Relevant') ? true : false;
let case5 = (budget_Type == 'ext.' && budget_Relavent == 'Invest') ? true : false;
let case6 = (budget_Type == 'ext.' && budget_Relavent == 'Shift') ? true : false;
let case7 = (budget_Type == 'income' && budget_Relavent == 'Budget Relevant') ? true : false;
let case8 = (budget_Type == 'income' && budget_Relavent == 'Invest') ? true : false;
let case9 = (budget_Type == 'income' && budget_Relavent == 'Shift') ? true : false;

let opAttributes = {};

if (case1) {
  // assigning attribute values to opAttributes object.
  opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = internal_Capacity;
  opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
  opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = null;
  opAttributes[OP.ATTR.OP_SHIFTS] = null;
  opAttributes[OP.ATTR.OP_INCOME] = null;
  // updating "cf.cplace.internalValue" attribute value
  if (ifcValue && internal_Capacity) {
      opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
      updateAllData(page, opAttributes);
      //updateInternalValue(page, internal_Value);
  } else {
      opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
      updateAllData(page, opAttributes);
      // updateInternalValue(page, internal_Value);
  }
  // Invoking updateAllData function.
  updateAllData(page, opAttributes);


} else if (case2 || case3 || case8) {
  cplace.log('case2:' + case2 + "  case3:" + case3 + " case7:" + case7);
  // assigning attribute values to opAttributes object.
  opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = null;
  opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
  opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = null;
  opAttributes[OP.ATTR.OP_SHIFTS] = null;
  opAttributes[OP.ATTR.OP_INCOME] = null;
  // Invoking updateAllData function.
  updateAllData(page, opAttributes);
} else if (case4 || case5) {
  // assigning attribute values to opAttributes object.
  opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = null;
  opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
  opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = extrenal_value;
  opAttributes[OP.ATTR.OP_SHIFTS] = null;
  opAttributes[OP.ATTR.OP_INCOME] = null;
  // Invoking updateAllData function.
  updateAllData(page, opAttributes);
} else if (case6 || case9) {
  // assigning attribute values to opAttributes object.
  opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = null;
  opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
  opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = null;
  opAttributes[OP.ATTR.OP_SHIFTS] = shifts;
  opAttributes[OP.ATTR.OP_INCOME] = null;
  // Invoking updateAllData function.
  updateAllData(page, opAttributes);
} else if (case7) {
  // assigning attribute values to opAttributes object.
  opAttributes[OP.ATTR.OP_INTERNAL_CAPACITY] = null;
  opAttributes[OP.ATTR.OP_INTERNAL_VALUE] = internal_Value;
  opAttributes[OP.ATTR.OP_EXTERNAL_VALUE] = null;
  opAttributes[OP.ATTR.OP_SHIFTS] = null;
  opAttributes[OP.ATTR.OP_INCOME] = income;
  // Invoking updateAllData function.
  updateAllData(page, opAttributes);
}

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