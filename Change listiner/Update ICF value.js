//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//
const OP = {
    TYPE: 'cf.cplace.fpfs.operationalPlanning',
    ATTR: {
        OP_CENTER: 'cf.cplace.center',
        OP_DEPARTMENT: 'cf.cplace.opDepartment',
        OP_YEAR: 'cf.cplace.year',
        INTERNAL_COST_FACTOR_VALUE: 'cf.cplace.internalCapacityValue',
        INTERNAL_COST_FACTOR:'cf.cplace.costFactor'
    }
  }
  const INTERNAL_COST_FACTOR = {
    TYPE: 'cf.cplace.fpfs.costFactor',
    ATTR: {
        CENTER: 'cf.cplace.center',
        DEPARTMENT: 'cf.cplace.department',
        YEAR: 'cf.cplace.year',
        VALUE_IN: 'cf.cplace.value'
    }
  }
  //--------------------------------------------------------------------------------------//
  //                                       INITIALIZATION                                 //
  //--------------------------------------------------------------------------------------//
  var page = changeEvent.getEntity();
  cplace.log(page.getName());
  const department = page.get(OP.ATTR.OP_DEPARTMENT);
  const year = page.get(OP.ATTR.OP_YEAR);
  
  let internalCostFactor = page.get(OP.ATTR.INTERNAL_COST_FACTOR);
  
  const icfs = department.getIncomingPages(INTERNAL_COST_FACTOR.TYPE,INTERNAL_COST_FACTOR.ATTR.DEPARTMENT);
  let isValid = false;
  cplace.each(icfs,(icf)=>{
    let yr = icf.get(INTERNAL_COST_FACTOR.ATTR.YEAR).getId(); 
    if(year.getId() == yr){
     internalCostFactor = icf;
      isValid = true;
     return false; 
    }
  });
  if(!isValid){
    cplace.log("not found");
   return messages.get('invalid', department,year);
  }

  let obj = {};
  obj[OP.ATTR.INTERNAL_COST_FACTOR] = internalCostFactor;
  
  updatePage(page, obj)
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