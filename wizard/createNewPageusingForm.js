let createFormStep = wizard.getPreviousStep();
let newOPPage = createFormStep.getPage('cf.cplace.fpfs.operationalPlanning');

wizard.persistNewPage(newOPPage);

cplace.log('Create new page step');

