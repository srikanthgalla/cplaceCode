const ITEMS = {
    TYPE: 'cf.cplace.fpfs.purchaseRequisitionItem',
    ATTR: {
        VORBANF : 'cf.cplace.purchaseRequisitionHead',
        STATUS : 'cf.cplace.itemStatus',
        VALUE:'cf.cplace.value'
    }
};

var page = changeEvent.getEntity();

let itemStatus = page.get(ITEMS.ATTR.STATUS);

let Mandanten_Administratoren = cplace.utils().findGroupByName('Mandanten-Administratoren');
let freDaNext_All_Users = cplace.utils().findGroupByName('FreDaNext all Users');

if (itemStatus == null || itemStatus == undefined) {
    return
}

if (itemStatus == 'Draft' || itemStatus == 'Überarbeiten') {
    cplace.log(itemStatus);
    cplace.actions().updatePage(page, {
        writers: {
            'additiveInheritance': true,
            '+': [freDaNext_All_Users,Mandanten_Administratoren] // add these users to the Writers
        }
    });
}else{
    cplace.log(itemStatus);
    cplace.actions().updatePage(page, {
        writers: {
            'additiveInheritance': true,
            '-':[freDaNext_All_Users], //remove permissions
            
        }
    });
}

