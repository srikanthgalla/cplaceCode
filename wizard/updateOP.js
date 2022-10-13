cplace.log("updated selected pages with new year.");
let tableStep = wizard.getStep('createOp.updateYearTable');

let selectedEntities = tableStep.getSelectedEntities();

let yearFormStep = wizard.getStep('createOP.updateYear');
let opPage = yearFormStep.getPage('cf.cplace.fpfs.operationalPlanning');
let yearAttr = opPage.get('cf.cplace.year');

cplace.each(selectedEntities, (page) => {
    updateOP(page);
}); // selected op's loop end

function updateOP(page) {

    let pageData = {
        customAttributes: {
            'cf.cplace.year': yearAttr
        }
    }
    cplace.actions().updatePage(page, pageData);

}