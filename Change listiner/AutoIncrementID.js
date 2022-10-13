//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

   const PURCHASE_REQUISITION_ITEMS= {
    TYPE: 'cf.cplace.fpfs.purchaseRequisitionItem',
    ATTR: {
      PURCHASE_REQ: 'cf.cplace.purchaseRequisitionHead',
      CONTRACT_TYPE: 'cf.cplace.contractType',
      AWARD_TYPE: 'cf.cplace.awardType',
      ORDER_DAYS: 'cf.cplace.orderDays',
      VALUE : 'cf.cplace.value',
      ITEM_ID : 'cf.cplace.itemID'
    }
   }
   //--------------------------------------------------------------------------------------//
   //                                       INITIALIZATION                                 //
   //--------------------------------------------------------------------------------------//
   var page = changeEvent.getEntity();
  
   const perchase_requestion_items = page.getIncomingPages(PURCHASE_REQUISITION_ITEMS.TYPE,PURCHASE_REQUISITION_ITEMS.ATTR.PURCHASE_REQ);
   cplace.log(page.getName());
  
   let count = 1;
   let itemNuber = null;
  
if(perchase_requestion_items == null){
    return
}

   let obj = {};
   cplace.each(perchase_requestion_items, (item)=>{
  
    obj[PURCHASE_REQUISITION_ITEMS.ATTR.ITEM_ID] = count;
    updatePage(item, obj);
    count+
    cplace.log(count++);
   });
  
   function updatePage(page, customAttributes) {
    //cplace.log(page + " " + JSON.stringify(customAttributes));
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