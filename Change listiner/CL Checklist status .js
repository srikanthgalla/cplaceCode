

let page = changeEvent.getEntity();
let Attachment = page.get('cf.cplace.checklistAttachment');

cplace.actions().updatePage(page, {
    customAttributes: {
        'cf.cplace.checklistStatus': Attachment.length>0 ? 'Green' : 'Red'
    }
});
page.registerAttributeForRefresh('cf.cplace.checklistStatus');


let page = changeEvent.getEntity();

let conformation = page.get('cf.cplace.confirmation');
let Attachment = page.get('cf.cplace.checklistAttachment');

if(Attachment.length > 0){
cplace.actions().updatePage(page, {
    customAttributes: {
        ['cf.cplace.checklistStatus']: conformation == false ? 'Yellow' : 'Green'
    }
});
page.registerAttributeForRefresh('cf.cplace.checklistStatus');
}
