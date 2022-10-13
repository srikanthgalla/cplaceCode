cplace.log("updated selected pages with new year.");
//getting selected table pages.
let tableStep = wizard.getStep('purchaseRequisitionHead.updateTable');
let selectedEntities = tableStep.getSelectedEntities();
//getting form attributes.
let getFormData = wizard.getStep('purchaseRequisitionHead.updateForm');
let purchaseRequisitionPage = getFormData.getPage('cf.cplace.fpfs.preBanfHead');

let applicant = purchaseRequisitionPage.get('cf.cplace.team');
let orderType = purchaseRequisitionPage.get('cf.cplace.orderType');
let supplier = purchaseRequisitionPage.get('cf.cplace.supplier');
let yearAttr = purchaseRequisitionPage.get('cf.cplace.year');
let invoiceReceiver = purchaseRequisitionPage.get('cf.cplace.invoiceReceiver');

cplace.each(selectedEntities, (page) => {
    updateOP(page);
}); // selected op's loop end

function updateOP(page) {

    let pageData = {
        customAttributes: {
            'cf.cplace.team': applicant,
        'cf.cplace.year': yearAttr,
        'cf.cplace.orderType': orderType,
        'cf.cplace.supplier': supplier,
        'cf.cplace.invoiceReceiver': invoiceReceiver
        }
    }
    cplace.actions().updatePage(page, pageData);
}
cplace.actions().refresh();