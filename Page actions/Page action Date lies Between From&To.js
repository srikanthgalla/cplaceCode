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
cplace.setLogName('pageaction-task-');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const ACTIONS = {
    CPLACE: 'CPLACE',
}

const LABEL = {
    CPLACE: {
        'de': 'Planungsobjekt IsValid Aktion',
        'en': 'Planning Object IsValid Action',
    }
}

const RESULT_MESSAGE = {
    CPLACE: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    },
    ERROR: {
        'de': 'Es gibt keine Seiten, um diesen Vorgang auszuführen',
        'en': 'There are no pages to perform this operation'
    }
}

const ICON = {
    CPLACE: 'fa-pencil-square-o'
}


const PRODUCT_CLUSTER = {
    TYPE: 'cf.cplace.fpfs.productCluster',
    ATTR: {
        PC_VALID_FROM: 'cf.cplace.validFrom',
        PC_VALID_TO: 'cf.cplace.validTo',
        IS_VALID: 'cf.cplace.isValid'
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
 * Do the business action
 * 
 * @param {Page} productCluster
 * @returns {Object} .
 */
function doBusinessAction(productCluster) {
    cplace.log(productCluster.getName());
    cplace.log("#####################################");
    timeSinceStart('start');

    // Search object to add all pages of type product Cluster.
    var PC = new Search();
    PC.add(Filters.type(PRODUCT_CLUSTER.TYPE));
     /**
     *   Search.getHitCount() will return 0 if no pages found.
     *   Will terminate the fucntion and show error if no pages found.
     */
    if (PC.getHitCount() == 0) {
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.ERROR
        }
    }
    var count = new Search();
    count.add(Filters.type(PRODUCT_CLUSTER.TYPE));
    count.add(Filters.customAttribute(PRODUCT_CLUSTER.ATTR.IS_VALID).eq(true));
    cplace.log(count.getHitCount());

     /**
     * Fetching all .
     * Do check each page Current date is lies between validFrom and ValidTo dates isValid checkbox TRUE, if not FALSE.
     */
    var all_product_cluster = PC.findAllPages();
    var today = new Date();
    cplace.each(all_product_cluster, (item) => {
        cplace.log(item.getName());
        let fromDate = new Date(item.get(PRODUCT_CLUSTER.ATTR.PC_VALID_FROM));
        let toDate = new Date(item.get(PRODUCT_CLUSTER.ATTR.PC_VALID_TO));
        let value = (today >= fromDate &&  toDate >= today) ? true : false ;
           cplace.log(value);
             let customAttributes = {};
            cplace.log(item.getName());
            customAttributes[PRODUCT_CLUSTER.ATTR.IS_VALID] = value;
            updatePage(item, customAttributes)
    });
    cplace.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    timeSinceStart('final')
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

/**
 * update page with attributes and refresh
 * @param {Page} page 
 * @param {Object} attributes
 * @returns {Page}
 */
function updatePage(page, customAttributes) {
    let key = null;
    for (key in customAttributes) {
        if (customAttributes.hasOwnProperty(key)) {
            page.registerAttributeForRefresh(key)
        }
    }
    return cplace.actions().updatePage(page, {
        customAttributes: customAttributes,
    });
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