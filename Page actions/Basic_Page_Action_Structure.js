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
        'de': 'TODO deutsche Aktion',
        'en': 'TODO english Action',
    }
}

const RESULT_MESSAGE = {
    CPLACE: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    }
}

const ICON = {
    CPLACE: 'cf-cplace'
}


const CHECKLIST = {
    TYPE: 'cf.cplace.checklist',
    ATTR: {
        VORBANF: 'cf.cplace.vorBanf',
        CHECKLIST_SET: 'cf.cplace.checklistSet',
        CHECKLIST_ATTACHMENT: 'cf.cplace.checklistAttachment',
        STATUS: 'cf.cplace.checklistStatus',
        TEXT_DUMMY: 'cf.cplace.textDummy'
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
 * @param {Page} page 
 * @returns {Object}
 */
function doBusinessAction(page) {
    timeSinceStart('start')

    /**
     * TODO Add your code here
     */



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
    }, {
        setGeneratedName: true
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