let page = changeEvent.getEntity();
let Attachment = page.get('cf.cplace.checklistAttachment');

cplace.actions().updatePage(page, {
    customAttributes: {
        'cf.cplace.checklistStatus': Attachment.length > 0 ? 'Green' : 'Red'
    }
});
page.registerAttributeForRefresh('cf.cplace.checklistStatus');



