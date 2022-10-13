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
        'de': 'IFC-Wert aktualisieren',
        'en': 'Update IFC Value',
    }
}

const RESULT_MESSAGE = {
    CPLACE: {
        'de': 'IFC-Wert aktualisiert',
        'en': 'IFC Value Updated',
    },
    ERROR: {
        'de': 'There are no active pages to perform this action',
        'en': 'There are no active pages to perform this action'
    }
}

const ICON = {
    CPLACE: 'fa-pencil-square-o'
}

const INTERNAL_COST_FACTOR = {
    TYPE: 'cf.cplace.fpfs.costFactor',
    ATTR: {
        CENTER: 'cf.cplace.center',
        DEPARTMENT: 'cf.cplace.department',
        YEAR: 'cf.cplace.year',
        VALUE_IN: 'cf.cplace.value'
    }
}

const OP = {
    TYPE: 'cf.cplace.fpfs.operationalPlanning',
    ATTR: {
        OP_CENTER: 'cf.cplace.center',
        OP_DEPARTMENT: 'cf.cplace.opDepartment',
        OP_YEAR: 'cf.cplace.year',
        INTERNAL_COST_FACTOR_VALUE: 'cf.cplace.internalCapacityValue',
        IFC_VALUE: 'cf.cplace.ifcValue'
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
 * @param {Page} int_cost_factor 
 * @returns {Object}
 */
function doBusinessAction(int_cost_factor) {
    timeSinceStart('start')
    /**
     *  Adding  Internal Cost Factor Type to search Filter 'ICF'.   
     */
    let ICF = new Search();
    ICF.add(Filters.type(INTERNAL_COST_FACTOR.TYPE));

    if (ICF.getHitCount() == 0) {
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.ERROR
        }
    }
        /**
         *  Getting values Department and year from OP Type.
         */
    var vorbanf_op_Depaerment = int_cost_factor.get(OP.ATTR.OP_DEPARTMENT).getId();
    var vorbanf_op_year = int_cost_factor.get(OP.ATTR.OP_YEAR).getId();
    var all_Internal_cost_factor = ICF.findAllPages();

    cplace.each(all_Internal_cost_factor, (item) => {
       /**
        * Fetching Department and Year from internal cost factor type
        */
        let dept = item.get(INTERNAL_COST_FACTOR.ATTR.DEPARTMENT).getId();
        let yer = item.get(INTERNAL_COST_FACTOR.ATTR.YEAR).getId();
        let value = item.get(INTERNAL_COST_FACTOR.ATTR.VALUE_IN);

        let updateIfc = (dept == vorbanf_op_Depaerment && yer == vorbanf_op_year) ? ture : false;
        
        if (updateIfc) {
            cplace.log(dept + " " + yer + " " + item.getName());
            let customAttributes = {};
            customAttributes[OP.ATTR.IFC_VALUE] = value;
            /**
             * invoking IFC value method
             */
            updateIFCValue(int_cost_factor, customAttributes);
            return false;
        } 

    });
    timeSinceStart('final')
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

/**
 * updateIFCValue method 
 * @param {Page} page 
 * @param {Object} customAttributes
 */
function updateIFCValue(page, customAttributes) {
    cplace.log(page + " " + JSON.stringify(customAttributes));
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