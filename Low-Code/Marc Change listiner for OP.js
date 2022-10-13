const page = changeEvent.getEntity();

const OPERATIONALPLANNING = {
  TYPE: 'cf.cplace.fpfs.operationalPlanning',
  ATTR: {
    BUDGET_TYPE:'cf.cplace.budgetType',
    VALUE: 'cf.cplace.value'
  }
}
const budgetType = page.get(OPERATIONALPLANNING.ATTR.BUDGET_TYPE);
const value = page.get(OPERATIONALPLANNING.ATTR.VALUE);

if (!value || value === 0) {
  return;
}

if( (budgetType == 'income' && value > 0) || (budgetType !== 'income' && value < 0)){
  page.registerAttributeForRefresh(OPERATIONALPLANNING.ATTR.VALUE);
  cplace.actions().updatePage(page, {
    customAttributes: {
      'cf.cplace.value': (-value)
    }
  });
}