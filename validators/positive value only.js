
if ((budgetType == 'ext.' && budgetRelevance == 'Shift') || (budgetType == 'income' && budgetRelevance == 'Shift')) {
  /**
   * Check and allow positive values 
   */
  if (shiftValue != null) {
    if (shiftValue <= 0 ) {
      return messages.get('positiveValue');
    }
  }
}
// or 
if(budgetType == 'int.' && budgetRelevance == 'Budget Relevant'){
  /**
   * Check and allow positive values 
   */
  if(kappaValue != 0 && kappaValue < 0){
  return messages.get('positiveValue');
}
}