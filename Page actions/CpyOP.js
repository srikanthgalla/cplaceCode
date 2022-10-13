cplace.log("copy selected pages and create new pages with seleted year.");
let tableStep = wizard.getStep('cf.cplace.wizard.copyOP.step1.selectOP');
let selectedEntities = tableStep.getSelectedEntities();
let getFormStep = wizard.getStep('cf.cplace.wizard.copyOP.step3.selectYear');
let opPage = getFormStep.getPage('cf.cplace.fpfs.operationalPlanning');
let yearAttr = opPage.get('cf.cplace.year');

cplace.each(selectedEntities, (page) => {
  
  copyOP(page);
}); // selected op's loop end

function copyOP(page) {
  cplace.log('copy and created new');
 	let intYearAttr = parseInt(yearAttr);
  	let intYear = parseInt(page.get('cf.cplace.year'));
  if(intYear != intYearAttr){
    cplace.log(intYear + " bala12345 " + intYearAttr);
     let pageData = {
    customAttributes: {
      'cf.cplace.year': yearAttr
    }
  }
  cplace.actions().copyPage(page, pageData);
  }
}
cplace.actions().refresh();