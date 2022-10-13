const OP = {
    TYPE: 'cf.cplace.fpfs.operationalPlanning',
    ATTR: {
        OP_FREEZE: 'cf.cplace.freeze',
        OP_FREEZE_STATUS: 'cf.cplace.freezeStatus'
    }
};

var page = changeEvent.getEntity();
let opFreezeStatus = page.get('cf.cplace.freezeStatus');


let Mandanten_Administratoren = cplace.utils().findGroupByName('Mandanten-Administratoren');
let freDaNext_All_Users = cplace.utils().findGroupByName('freDaNext_All_Users');
let FredaNextTestArchiveGroup = cplace.utils().findGroupByName('FredaNextTestArchiveGroup');

if (opFreezeStatus == null || opFreezeStatus == undefined) {
    return
}

cplace.log(Mandanten_Administratoren);
cplace.log('page is' + page);
cplace.log(' Status is'+ opFreezeStatus);

if (opFreezeStatus == 'cf.cplace.freeStatusFreeze') {

    cplace.log("Freezed");
    cplace.actions().updatePage(page, {
        writers: {
            'additiveInheritance': true,
            '-': [freDaNext_All_Users] // remove these users to the readers
        }
    });
}
if (opFreezeStatus == 'cf.cplace.freeStatusArchived') {

    cplace.log("Archived");
    cplace.actions().updatePage(page, {
        readers: {
            'additiveInheritance': true,
            '-': [freDaNext_All_Users,FredaNextTestArchiveGroup] // Remove these users to the readers
        },
        writers: {
            'additiveInheritance': true,
            '-': [freDaNext_All_Users,FredaNextTestArchiveGroup] // remove these users to the readers
        }
    });
}