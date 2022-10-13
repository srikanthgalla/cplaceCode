cplace.log("copy selected pages and create new from the seleted once from previous step.");
let tableStep = wizard.getStep('cf.cplace.wizard.copyOP.step1.selectOP');
let selectedEntities = tableStep.getSelectedEntities();
let yearFormStep = wizard.getStep('cf.cplace.wizard.copyOP.step3.selectYear');
let opPage = yearFormStep.getPage('cf.cplace.fpfs.operationalPlanning');
let yearAttr = opPage.get('cf.cplace.year');

let copiedPages = [];

cplace.each(selectedEntities, (page)=> {
  let pageData = {
	customAttributes: {
      'cf.cplace.year': yearAttr
    }
  }
  // GET THE LIST OF COPIED PAGES
  cplace.actions().copyPage(page, pageData);
});


// cplace.log(formStep + "form data");
cplace.log("galla");