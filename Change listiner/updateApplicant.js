const PRE_BANF = {
    TYPE: 'cf.cplace.fpfs.preBanfHead',
    ATTR: {
        APPLICANT: 'cf.cplace.team',

    }
}
const BANF_ITEMS = {
    TYPE: 'cf.cplace.fpfs.purchaseRequisitionItem',
    ATTR: {
        PRE_BANF_HEAD: 'cf.cplace.purchaseRequisitionHead',
        TEAM_APPLICANT: 'cf.cplace.team'
    }
}

var page = changeEvent.getEntity();
cplace.log(page);
let teamApplicant = page.get(PRE_BANF.ATTR.APPLICANT);
cplace.log(teamApplicant);
let obj = {};

let banfItems = page.getIncomingPages(BANF_ITEMS.TYPE, BANF_ITEMS.ATTR.PRE_BANF_HEAD);
cplace.log(banfItems.length);

if (banfItems.length == 0 || banfItems.length < 0) {
    cplace.log("no more items");
    return;
}

cplace.each(banfItems, (item) => {
    obj[BANF_ITEMS.ATTR.TEAM_APPLICANT] = teamApplicant;
    cplace.log(item.get(BANF_ITEMS.ATTR.TEAM_APPLICANT));
    updateApplicant(item, obj);
});


function updateApplicant(page, customAttributes) {
    cplace.log('update function called');
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
cplace.actions().refresh();

