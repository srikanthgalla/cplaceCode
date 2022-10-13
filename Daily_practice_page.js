/// <reference path="../../typeDefinitions/globals.d.ts" />
/**
 * Description
 * @author 
 */
//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//

/**
 * Set to false to suspend logging
 * @type {Boolean}
 */

const DEBUG = true;

/**
 * Set to false, to disable this page action
 * @type {Boolean}
 */

const ENABLED = true;

/**
 * Get millisecond starting time of the script
 * @type {Number}
 */
const START_TIME = new Date().getTime()

/** @type {Number} */

let LAST_TIME = START_TIME;

/**
 * Hint: set a declarative name for all of your logs
 */
cplace.setLogName('pageaction-copy-op-items');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const ACTIONS = {
    CPLACE: 'CPLACE',
}

const LABEL = {
    CPLACE: {
        'de': 'Copy OP Items',
        'en': 'Copy OP Items',
    }
}

const RESULT_MESSAGE = {
    CPLACE: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    },
    ERROR: {
        'de': 'Es gibt keine aktiven Seiten, um diesen Vorgang auszuführen',
        'en': 'There are no active pages to perform this operation'
    }
}

const ICON = {
    CPLACE: 'fa-copy'
}

const OP = {
    TYPE: 'cf.cplace.fpfs.operationalPlanning',
    ATTR: {
        OP_IFC_VALUE: 'cf.cplace.internalCapacityValue',
        OP_INTERNAL_CAPACITY: 'cf.cplace.internalCapacity',
        OP_INTERNAL_VALUE: 'cf.cplace.internalValue',
        OP_BUDGET_TYPE: 'cf.cplace.budgetType',
        OP_BUDGET_RELAVENT: 'cf.cplace.type',
        OP_YEAR: 'cf.cplace.year'
    }
};

const COPYOP = {
    TYPE: 'cf.cplace.copyOP',
    ATTR: {
        COPYOP_FROM_YEAR: 'cf.cplace.copyOP.fromYear',
        COPYOP_TO_YEAR: 'cf.cplace.copyOP.toYear'
    }
}


//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

/**
 * TODO check which action should be performed.
 * For instance if you want a toggle like archive / restore, you can define both actions in one page action easily.
 */

const ACTION = ACTIONS.CPLACE;

return {
    checkAccess: function () {
        try {
            return ENABLED ? isActionAllowed(page) : false
        } catch (e) {
            cplace.error(e)
            return false;
        }
    },
    label: function () {
        return LABEL[ACTION]
    },
    icon: function () {
        return ICON[ACTION]
    },
    call: function () {
        try {
            return doBusinessAction(page)
        } catch (e) {
            cplace.error(e)
            if (DEBUG) {
                throw e
            }

            return {
                success: false,
                message: e
            }
        }
    }
}

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

/**
 * Return true if the action is allowed and visible
 * @param {Page} page 
 * @returns {Boolean}
 */
function isActionAllowed(page) {
    /**
     * TODO Add your code here and return false if the action should not be visible and executable
     */
    return true;
}
/**
 * Do the business function
 * @param {Page} 
 * @returns {Object}    
 */
function doBusinessAction(page) {
    timeSinceStart('start')
    /**
    	 1. Get all OP pages for the given year from OP type definition.
         2. 
     */
    const oPSearch = new Search();
    oPSearch.add(Filters.type(OP.TYPE));

    if (oPSearch.getHitCount() == 0) {
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.ERROR
        }
    }

    const opPageSet = oPSearch.findAllPages();
    let year = null;
    let copiedItems = [];
    let copyOPFromYear = page.get(COPYOP.ATTR.COPYOP_FROM_YEAR);
    let copyOPToYear = page.get(COPYOP.ATTR.COPYOP_TO_YEAR);
    cplace.log('before loop');
    cplace.each(opPageSet, (item) => {
        year = item.get(OP.ATTR.OP_YEAR);
        year = parseInt(year);
        if (year == copyOPFromYear) {
            cplace.log(year);
            cplace.actions().copyPage(item, {
                name: item.getName(),
                space: item.getSpaceId(),
            });
            copiedItems.push(item);
        }
    });
    let obj = {};
    cplace.each(copiedItems, (copyItem) => {
        obj[OP.ATTR.OP_YEAR] = copyOPToYear;
        updatePage(copyItem, obj);
    });
    cplace.log("after loop");
    timeSinceStart('final');
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}
/**
 * update page Function 
 * Updating to Attributes 
 * @param {Page} page 
 * @param {Object} attributes
 * @returns {Page}
 */
function updatePage(page, customAttributes) {
    cplace.log(page);
    let key = null;
    for (key in customAttributes) {
        if (customAttributes.hasOwnProperty(key)) {
            page.registerAttributeForRefresh(key)
        }
    }
    let valid = cplace.actions().validateUpdatePage(page, {
        customAttributes: customAttributes
    });
    if (!valid) {
        cplace.log('Cannot update page. Invalid object.')
    } else {
        return cplace.actions().updatePage(page, {
            customAttributes: customAttributes,
        }, {
                setGeneratedName: true
            }
        );
    }
}

//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//

/**
 * Log to cplace
 * @param {any} text 
 */
function log(text) {
    if (!DEBUG) {
        return
    }
    let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;

    cplace.log(logOutput);
}

function timeSinceStart(msg) {
    if (!DEBUG) {
        return
    }
    let now = new Date().getTime();
    cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
    LAST_TIME = now;
}