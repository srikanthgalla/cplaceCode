const INTERNAL_COST_FACTOR = {
  TYPE: 'cf.cplace.fpfs.costFactor',
  ATTR: {
    DEPARTMENT: 'cf.cplace.department',
    YEAR: 'cf.cplace.year',
    VALUE: 'cf.cplace.value'
  }
};
const OP = {
  TYPE: 'cf.cplace.fpfs.operationalPlanning',
  ATTR: {
    BUDGET_TYPE: 'cf.cplace.budgetType',
    INTERNAL_CAPACITY: 'cf.cplace.internalCapacity',
    DEPARTMENT: 'cf.cplace.department',
    YEAR: 'cf.cplace.year',
    VALUE: 'cf.cplace.value'
  }
};

const page = changeEvent.getEntity();


const budgetType = page.get(OP.ATTR.BUDGET_TYPE);
const intCap = page.get(OP.ATTR.INTERNAL_CAPACITY);
if(budgetType != 'int.') return;
const department = page.get(OP.ATTR.DEPARTMENT);
if(department == null ) {
  updateValue(0, page);     
  return;
}
const icfPages = department.getIncomingPages(INTERNAL_COST_FACTOR.TYPE, INTERNAL_COST_FACTOR.ATTR.DEPARTMENT);
cplace.each(icfPages, (icfPage) => {
  let value = icfPage.get(INTERNAL_COST_FACTOR.ATTR.VALUE);
  let computedValue = value * intCap;
  cplace.log(computedValue);
  if(icfPage.get('cf.cplace.year').getName() == page.get('cf.cplace.year').getName()){
    updateValue(computedValue, page);
    return;
  }
}
           );
function updateValue(value, opPage){
  if(value == null) return;
  cplace.actions().updatePage(opPage, {
    customAttributes: {
      'cf.cplace.value': value
    }
  }
                             );
}