/// <reference path="../../typeDefinitions/globals.d.ts" />

/**
 * Description
 * 
1. Do a search for all active checklists. (under BUSINESS FUNCTIONS)
2. For each active checklist, check if the rules match.
3. If all the conditions are satisfied, then create a new page of the type "checklist".
4. Go through all the checklists which are already created (check if they are still active or not).
if the status of checklist is green, then it should not be removed.
 * 
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
cplace.setLogName('srikanth-task-');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const ACTIONS = {
    DEFAULT: 'DEFAULT',
}

const LABEL = {
    DEFAULT: {
        'de': ' Ausschuss aktualisieren',
        'en': 'Update Committee',
    }
}

const RESULT_MESSAGE = {
    DEFAULT: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    },
    BANF_ITEM_NOT_fOUND: {
        'de': 'There are no Banf-Items found to perform this operation',
        'en': 'There are no Banf-Items found to perform this operation'
    },
    COMMITTEE_ERROR: {
        'de': 'There are no active Committees to perform Committees Generation',
        'en': 'There are no active Committees to perform Committees Generation'
    }
}

const ICON = {
    DEFAULT: 'fa-check-square-o'
}

const VORBANF = {
    TYPE: 'cf.cplace.fpfs.preBanfHead',
    ATTR: {
        RATING: 'cf.cplace.prm.kpi.forecastRating',
        TITLE: 'cf.cplace.title',
        ANTRAGSTELLER: 'cf.cplace.team',
        INVOICE_RECEIVER: 'cf.cplace.invoiceReceiver',
        ORDER_TYPE: 'cf.cplace.orderType',
        STATUS: 'cf.cplace.status',
        SUPPLIER: 'cf.cplace.supplier',
        YEAR: 'cf.cplace.year',
        BANF_PO_NR: 'cf.cplace.orderNumber',
        REMARKS: 'cf.cplace.remarks',
        VORBANF_ID: 'cf.cplace.identifier',
        DEPARTMENT: 'cf.cplace.department',
        CENTER: 'cf.cplace.center',
        SUM_OF_VALUES: 'cf.cplace.sumOfValues',
    }
}

const ITEM = {
    TYPE: 'cf.cplace.fpfs.purchaseRequisitionItem',
    ATTR: {
        VORBANF: 'cf.cplace.purchaseRequisitionHead',
        ITEM_TEXT: 'cf.cplace.itemText',
        ITEM_STATUS: 'cf.cplace.itemStatus',
        CONTRACT_TYPE: 'cf.cplace.contractType',
        PRICING: 'cf.cplace.pricing',
        PLANNING_OBJECT: 'cf.cplace.planningObject',
        AWARD_TYPE: 'cf.cplace.awardType',
        VALID_FROM: 'cf.cplace.validFrom',
        VALID_TO: 'cf.cplace.validTo',
        ORDER_DAYS: 'cf.cplace.orderDays',
        VALUE_IN_EURO: 'cf.cplace.value',
        DEPARTMENT: 'cf.cplace.department',
        ANTRAGSTELLER: 'cf.cplace.team',
        CO_NR: 'cf.cplace.costObject',
        OP: 'cf.cplace.operationalPlanning',
        WBS_ELEMENT: 'cf.cplace.pspElement',
        COST_CENTER: 'cf.cplace.costCenter',
        PROJECT: 'cf.cplace.project',
        COMMENT: 'cf.cplace.comment',
        YEAR: 'cf.cplace.year',
    }
}

const COMMITTEE_MASTER = {
    TYPE: 'cf.cplace.committee',
    ATTR: {
        COMMITTEE_NAME: 'cf.cplace.committee',
        MINIMUM_ORDER_VALUE: 'cf.cplace.minimumOrderValue',
        IS_ACTIVE: 'cf.cplace.active'
    }
}

const COMMITTEE = {
    TYPE: 'cf.cplace.fpfs.committee',
    ATTR: {
        COMMITTEES_MASTER: 'cf.cplace.gremium',
        VORBANF: 'cf.cplace.prePurchaseRequisition',
        CALENDER_WEEK: 'cf.cplace.calendarWeek',
        DATE_OF_SUBMISSION: 'cf.cplace.submissionDate',
        DATE_OF_RESPONSE: 'cf.cplace.responseDate',
        STATUS: 'cf.cplace.committeeStatus'

    }
}
//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

/**
 * TODO check which action should be performed.
 * For instance if you want a toggle like archive / restore, you can define both actions in one page action easily.
 */
const ACTION = ACTIONS.DEFAULT;

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
 * @param {Page} vorbanf 
 */
function doBusinessAction(vorbanf) {
    timeSinceStart('start')
    /**
     * 1 Do a search for all active Committees. (under BUSINESS FUNCTIONS)
     */
    const committeesSearch = new Search();
    committeesSearch.add(Filters.type(COMMITTEE_MASTER.TYPE));
    committeesSearch.add(Filters.customAttribute(COMMITTEE_MASTER.ATTR.IS_ACTIVE).eq(true));
    /**
     *   Search.getHitCount() will return 0 if no active checklist set data found.
     *   Will terminate the fucntion and show error if no active checklist set data found.
     */
    if (committeesSearch.getHitCount() == 0) {
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.COMMITTEE_ERROR
        }
    }

    /**
     * TODo a check if Banf-Items is == 0 Do not allow to generate committee.And display message No Banf-Items found
     */
    const banfItemSearch = new Search();
    banfItemSearch.add(Filters.type(ITEM.TYPE));
    banfItemSearch.add(Filters.customAttribute(ITEM.ATTR.VORBANF).references(vorbanf));

    if (banfItemSearch.getHitCount() == 0) {
        cplace.log("No More Banf Items");
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.BANF_ITEM_NOT_fOUND
        }
    }
    /**
     * Tracking all the existing committee records in already_generated_committees.
     */
    cplace.log(vorbanf.getIncomingPages(COMMITTEE.TYPE, COMMITTEE.ATTR.VORBANF));
    
    let all_generated_committees = [];
    cplace.each(vorbanf.getIncomingPages(COMMITTEE.TYPE, COMMITTEE.ATTR.VORBANF), (item) => {
        //cplace.log(item.get(CHECKLIST.ATTR.CHECKLIST_SET).getName());
        all_generated_committees.push(item);
    });

    cplace.log(all_generated_committees.length + " existing committee count");
    /*
    2. For each active Committee, check if the rules match.
    */
    const committeesets = committeesSearch.findAllPages();
    cplace.each(committeesets, (committeeset) => {
        cplace.log(committeeset.getName());
        /**
           TODO  Check if active committees is match with already generated committee record.
           If match found then storing the existing record in existingCommittee variable 
        */
        let existingCommittee = null;
        cplace.each(all_generated_committees, (item) => {
            // cplace.log(checklistSet.getId() + "  " + item.get(CHECKLIST.ATTR.CHECKLIST_SET).getId());
            if (committeeset.getId() == item.get(COMMITTEE.ATTR.COMMITTEES_MASTER).getId()) {
                existingCommittee = item;
            }
        }); // end all_generated_committees loop
        cplace.log(existingCommittee + " existing Committee ");
        /**
         * Start of rule set validation
         * Rule for BanfBoard minimumOrderValue.
         */
        let committeeAttributes = {}
        let generationDate = new DateTime();

        const ruleMinOrderValue = committeeset.get(COMMITTEE_MASTER.ATTR.MINIMUM_ORDER_VALUE);
        const sumOfOrders = vorbanf.get(VORBANF.ATTR.SUM_OF_VALUES);
        cplace.log(ruleMinOrderValue + " is the ruleMinOrderValue ");
        cplace.log(sumOfOrders + " is the sum of orders");

        if (committeeset.getName() == 'BanfBoard') {
            if (ruleMinOrderValue > sumOfOrders) {
                cplace.log("ruleMinOrderValue value is grather then the sumOfOrders");
                deleteExistingCommittees(vorbanf, existingCommittee);
                return;
            } else {
                /**
                 * TODO Adding rule here !!!
                 If all the conditions are satisfied, then "Committee" will generate.
                */
                cplace.log("ruleMinOrderValue value is lessthen then the sumOfOrders");
                committeeAttributes[COMMITTEE.ATTR.VORBANF] = vorbanf;
                committeeAttributes[COMMITTEE.ATTR.COMMITTEES_MASTER] = committeeset;
                committeeAttributes[COMMITTEE.ATTR.DATE_OF_SUBMISSION] = generationDate;
                createAndUpdateCommittee(vorbanf, committeeAttributes, existingCommittee, committeeset);
                return;
            }
        } // end 'BanfBoard' condition

        /**
         * Rule SourcingCommittee
         */
        let cumOrdValByYear = {}
        let numberOfYears = [];
        if (committeeset.getName() == 'SourcingCommittee') {
            const all_BanfItems = banfItemSearch.findAllPages();
            cplace.log(all_BanfItems + ' banf items');
            cplace.each(all_BanfItems, (item) => {
                let date = item.get(ITEM.ATTR.VALID_FROM);
                let orderVal = item.get(ITEM.ATTR.VALUE_IN_EURO);
                let year = date.year().get();

                if (cumOrdValByYear[year]) {
                    cumOrdValByYear[year] = cumOrdValByYear[year] + orderVal;
                } else {
                    cumOrdValByYear[year] = orderVal;
                    numberOfYears.push(year);
                }
            }); // end all banfItems loop

            cplace.each(numberOfYears, (item) => {
                cplace.log(item);
                cplace.log(cumOrdValByYear[item]);
                if (cumOrdValByYear[item] > 250000 || cumOrdValByYear[item] == 250000) {
                    committeeAttributes[COMMITTEE.ATTR.VORBANF] = vorbanf;
                    committeeAttributes[COMMITTEE.ATTR.COMMITTEES_MASTER] = committeeset;
                    committeeAttributes[COMMITTEE.ATTR.DATE_OF_SUBMISSION] = generationDate;
                    createAndUpdateCommittee(vorbanf, committeeAttributes, existingCommittee, committeeset);
                    return;
                } else {
                    deleteExistingCommittees(vorbanf, existingCommittee);
                }
            });

            cplace.log(JSON.stringify(cumOrdValByYear));

        } // end SourcingCommittee condition

    }); // end committees loop.

    timeSinceStart('final');
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

/**
 * Create and update Committee function 
 * @param {page} vorbanf 
 * @param {variable} existingCommittee 
 * @param {object} committeeAttributes
 * @param {Array element} committeeset 
 * If the entry exists and again passes the rules then we are updating the existing page with new generation date.
 *  If the entry not exists already and pass the rules then we are inserting a new record
 */

function createAndUpdateCommittee(vorbanf, committeeAttributes, existingCommittee, committeeset) {
    if (existingCommittee == null) {
        cplace.log(committeeset + ' generation');
        cplace.actions().createPage({
            name: committeeset.getName(),
            space: vorbanf.getSpaceId(),
            customType: COMMITTEE.TYPE,
            customAttributes: committeeAttributes
        });
    } else {
        cplace.log(committeeset + ' Updation');
        cplace.actions().updatePage(existingCommittee, {
            customAttributes: {
                // ['cf.cplace.confirmation']: false,
                [COMMITTEE.ATTR.DATE_OF_SUBMISSION]: new DateTime()
            }
        });
    }
} // end create and update function


/**
 * @param {current page} vorbanf 
 * @param {it will have value of existingChecklist obj if it is already exists in pre-Requisition checklist else it is null} existingChecklist 
 */

function deleteExistingCommittees(vorbanf, existingCommittee) {
    cplace.log("deleting " + existingCommittee);
    if (existingCommittee != null) {
        cplace.each(vorbanf.getIncomingPages(COMMITTEE.TYPE, COMMITTEE.ATTR.VORBANF), (item) => {
            cplace.log(item)
            if (item.get(COMMITTEE.ATTR.COMMITTEES_MASTER).getId() == existingCommittee.get(COMMITTEE.ATTR.COMMITTEES_MASTER).getId()) {
                cplace.actions().deletePage(item);
            }
        });
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