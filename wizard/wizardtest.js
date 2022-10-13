cplace.log('Srikanth-130-start');
//getting selected table pages.
let tableStep = wizard.getStep('purchaseRequisitionHead.copyHeadTable');
let PrechaseRequisitionselectedEntities = tableStep.getSelectedEntities();
//getting form attributes.
let getFormData = wizard.getStep('purchaseRequisitionHead.editForm');
let purchaseRequisitionPage = getFormData.getPage('cf.cplace.fpfs.preBanfHead');
let yearAttr = purchaseRequisitionPage.get('cf.cplace.year');
let invoiceReceiver = purchaseRequisitionPage.get('cf.cplace.invoiceReceiver');
// let editFormStep = wizard.getStep('cf.cplace.wizard.createPurchaseRequisitionItem.priEditForm');
// let priPage = editFormStep.getPage('cf.cplace.fpfs.purchaseRequisitionItem');
// let formValues = {
//     'cf.cplace.title': priPage.get('cf.cplace.title'),
//     'cf.cplace.team': priPage.get('cf.cplace.team'),
//     'cf.cplace.invoiceReceiver': priPage.get('cf.cplace.invoiceReceiver'),
//     'cf.cplace.orderType': priPage.get('cf.cplace.orderType'),
//     'cf.cplace.status': priPage.get('cf.cplace.status'),
//     'cf.cplace.supplier': priPage.get('cf.cplace.supplier'),
//     'cf.cplace.year': priPage.get('cf.cplace.year'),
//     'cf.cplace.orderNumber': priPage.get('cf.cplace.orderNumber'),
//     'cf.cplace.remarks': priPage.get('cf.cplace.remarks'),
//     'cf.cplace.identifier': priPage.get('cf.cplace.identifier'),
//     'cf.cplace.department': priPage.get('cf.cplace.department'),
//     'cf.cplace.center': priPage.get('cf.cplace.center'),
//     'cf.cplace.sumOfValues': priPage.get('cf.cplace.sumOfValues'),
//     'cf.cplace.orderNr': priPage.get('cf.cplace.orderNr')
// }

let copiedPages = [];
cplace.each(PrechaseRequisitionselectedEntities, (item) => {
    let pageData = {
        customAttributes: {
            'cf.cplace.year':yearAttr,
            'cf.cplace.invoiceReceiver':invoiceReceiver
        }
    }
    copiedPages.push(cplace.actions().copyPage(item, pageData));
});

cplace.log("Number of pages copied");
cplace.log(copiedPages.length);
cplace.log("Srikanth-130-end");


// HELPER FUNCTIONS
function checkAndAddToCustomAttribute() {
    let nonNullValuesObject = {};
    cplace.log(Object.keys(formValues));
    Object.keys(formValues).forEach((key) => {
        if (formValues[key]) {
            nonNullValuesObject[key] = value;
        }
    });
    return nonNullValuesObject;
}



