

//getting selected table pages.
let tableStep = wizard.getStep('purchaseRequisitionHead.copyHeadTable');
let PrechaseRequisitionselectedEntities = tableStep.getSelectedEntities();
//getting form attributes.
let getFormData = wizard.getStep('purchaseRequisitionHead.copyForm');
let purchaseRequisitionPage = getFormData.getPage('cf.cplace.fpfs.preBanfHead');

let applicant = purchaseRequisitionPage.get('cf.cplace.team');
let orderType = purchaseRequisitionPage.get('cf.cplace.orderType');
let supplier = purchaseRequisitionPage.get('cf.cplace.supplier');
let yearAttr = purchaseRequisitionPage.get('cf.cplace.year');
let invoiceReceiver = purchaseRequisitionPage.get('cf.cplace.invoiceReceiver');

cplace.each(PrechaseRequisitionselectedEntities, (page) => {
  
  copyVorbanf(page);
}); // selected op's loop end

function copyVorbanf(page) {

  cplace.log('copy and created new');
 	let intYearAttr = parseInt(yearAttr);
  	let intYear = parseInt(page.get('cf.cplace.year'));
  if(intYear != intYearAttr){
     let pageData = {
    customAttributes: {
        'cf.cplace.team': applicant,
        'cf.cplace.year': yearAttr,
        'cf.cplace.orderType': orderType,
        'cf.cplace.supplier': supplier,
        'cf.cplace.invoiceReceiver': invoiceReceiver,
        'cf.cplace.status': 'entwurf'
    }
  }
  cplace.actions().copyPage(page, pageData);
  }
}
cplace.actions().refresh();