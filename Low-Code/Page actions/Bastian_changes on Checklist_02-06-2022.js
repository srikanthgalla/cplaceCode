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
        'de': 'Update Checklists',
        'en': 'Update Checklists',
    }
}

const RESULT_MESSAGE = {
    DEFAULT: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    },
    ERROR: {
        'de': 'There are no active checklists to perform Checklist Generation',
        'en': 'There are no active checklists to perform Checklist Generation'
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

const CHECKLIST_SET = {
    TYPE: 'cf.cplace.fpfs.checklistSet',
    ATTR: {
        IS_ACTIVE: 'cf.cplace.active',
        TARGET_STATUS: 'cf.cplace.targetStatus',
        DEFAULT_STATUS: 'cf.cplace.defaultStatus',
        RULE_MIN_DAYS: 'cf.cplace.ruleMinimumOrderDays',
        RULE_MIN_ORDER_VALUE: 'cf.cplace.ruleMinimumOrderValue',
        ORDER_TYPE: 'cf.cplace.checklistOrderType',
        CONTRACT_TYPE: 'cf.cplace.checklistContractType',
        AWARD_TYPE: 'cf.cplace.checklistAwardType',
        EK_OPTION: 'cf.cplace.ekOptions'
    }
}

const CHECKLIST = {
    TYPE: 'cf.cplace.checklist',
    ATTR: {
        VORBANF: 'cf.cplace.vorBanf',
        CHECKLIST_SET: 'cf.cplace.checklistSet',
        CHECKLIST_ATTACHMENT: 'cf.cplace.checklistAttachment',
        STATUS: 'cf.cplace.checklistStatus',
        CHECKLIST_GENERATION_DATE: 'cf.cplace.checklistGenerationDate'
    }
}

const SUPPLIERS = {
    TYPE: 'cf.cplace.fpfs.suppliers',
    ATTR: {
        VORBANF_SUPPLIER: 'cf.cplace.supplier',
        SUPPLIER_NUMBER: 'cf.cplace.supplierNumber',
        EK_OPTION: 'cf.cplace.ekAbschlussAvailable'
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
 * @returns {Object}
 */
function doBusinessAction(vorbanf) {
    timeSinceStart('start')
    /**
     * TODO Add your code here
     */

    /**
  1. Do a search for all active checklists. (under BUSINESS FUNCTIONS)
  */
    const checklistSearch = new Search();
    checklistSearch.add(Filters.type(CHECKLIST_SET.TYPE))
    checklistSearch.add(Filters.customAttribute(CHECKLIST_SET.ATTR.IS_ACTIVE).eq(true))

    /**
     *   Search.getHitCount() will return 0 if no active checklists found.
     *   Will terminate the fucntion and show error if no active checklist found.
     */
    if (checklistSearch.getHitCount() == 0) {
        return {
            success: false, // default is true
            //job: jobId, //if your action starts a job and you want to show job modal
            message: RESULT_MESSAGE.ERROR
        }
    }
    // Search.findAllPages() will return all records which satisfies the given filter condition ( CHECKLIST_SET.ATTR.IS_ACTIVE should be true)
    const checklistSets = checklistSearch.findAllPages();

    /**
    Tracking all the existing Checklist records in already_generated_checklist.
  */
    let all_generated_checklist = [];
    cplace.each(vorbanf.getIncomingPages(CHECKLIST.TYPE, CHECKLIST.ATTR.VORBANF), (item) => {
        //cplace.log(item.get(CHECKLIST.ATTR.CHECKLIST_SET).getName());
        all_generated_checklist.push(item);
    })

    /*
    2. For each active checklist, check if the rules match.
    */
    cplace.each(checklistSets, (checklistSet) => {

        /**
        TODO  Check if active checklist is match with already generated checklist record.
        If match found then storing the existing record in existingChecklist variable 
        */
        let existingChecklist = all_generated_checklist.find((item) => (checklistSet.getId() == item.get(CHECKLIST.ATTR.CHECKLIST_SET).getId()));

        /**
         * Start of rule set validation.
         */

        /**
         * RULE_ORDER_TYPE: 'cf.cplace.orderType',
         */
        const ruleOrderType = vorbanf.get(VORBANF.ATTR.ORDER_TYPE);
        let isOrderTypeMatched = false;
        const verifyOrderType = checklistSet.get(CHECKLIST_SET.ATTR.ORDER_TYPE);
/**      cplace.each(verifyOrderType, (item) => {
        if (!isOrderTypeMatched && item == ruleOrderType) {
          isOrderTypeMatched = true;
          return false;
        }
      });
*/      
        if (verifyOrderType && verifyOrderType.length > 0) 
        {
            const orderType = verifyOrderType[0].split(',');
            /**
             * TODO Match Pre_Requisiton's order type with each orderType of active checklist
             * If found a match then proceed for the next Rule else Proceed for the next Ruleset.
             */
            cplace.each(orderType, (item) => {
                if (!isOrderTypeMatched && item == ruleOrderType) {
                    isOrderTypeMatched = true;
                }
            });
        }else{
            cplace.log("RULE_ORDER_TYPE not performed successfuly");
        }

        /**
         * TODO If no match found For Ordre Type Rule then Delete checklist record if already exists otherwise proceed with next Ruleset.
         */
        if (!isOrderTypeMatched) {
            deleteExistingChecklsit(vorbanf, existingChecklist);
            return;
        }
        /**
         *  RULE_EK_OPTION_TYPE: 'cf.cplace.ekAbschlussAvailable
          * TODO get vorbanf Supplier id
          * TODO Getting Supplier Id from Supplier Type which matches Pre-Purchase Requisition's Supplier Id 
          */
         cplace.log(checklistSet + ' rule for Ek Type');
         let vorbanf_supplier_Id = vorbanf.get(VORBANF.ATTR.SUPPLIER).getId();
         var suppliers = new Search();
         suppliers.add(Filters.type(SUPPLIERS.TYPE));
         let supplier_ek_option = null;
         const EkPages = suppliers.findAllPages();
         cplace.each(EkPages, (item) => {
             if (item.getId() == vorbanf_supplier_Id) {
                 supplier_ek_option = item.get(SUPPLIERS.ATTR.EK_OPTION);
                 return false;
             }
         });
         const verifyEKType = checklistSet.get(CHECKLIST_SET.ATTR.EK_OPTION);
         /**
          * TODO Deleting checklist if orderType is not matched
          */
         if (supplier_ek_option != verifyEKType) {
             deleteExistingChecklsit(vorbanf, existingChecklist);
             return;
         }
        /**
         * RULE_CONTRACT_TYPE: 'cf.cplace.checklistContractType',
         * TODO for each Contract Type, Check contract Type rule.  
         */
        let isContractTypeMatched = false;
        cplace.each(vorbanf.getIncomingPages(ITEM.TYPE, ITEM.ATTR.VORBANF), (item) => {
            let ruleContractType = item.get(ITEM.ATTR.CONTRACT_TYPE);
            const verifyContractType = checklistSet.get(CHECKLIST_SET.ATTR.CONTRACT_TYPE);
            if (verifyContractType && verifyContractType.length > 0) {
                const contactType = verifyContractType[0].split(',');
                cplace.each(contactType, (item) => {
                    if (!isContractTypeMatched && item == ruleContractType) {
                        isContractTypeMatched = true;
                    }
                });
            }
        })

        if (!isContractTypeMatched) {
            deleteExistingChecklsit(vorbanf, existingChecklist);
            return;
        }

        /**
          RULE_AWARD_TYPE: 'cf.cplace.cf.cplace.checklistAwardType'
        */
        let isAwaedTypeMatched = false;
        cplace.each(vorbanf.getIncomingPages(ITEM.TYPE, ITEM.ATTR.VORBANF), (item) => {
            let ruleAwardType = item.get(ITEM.ATTR.AWARD_TYPE);
            const verifyAwardType = checklistSet.get(CHECKLIST_SET.ATTR.AWARD_TYPE);
            if (verifyAwardType && verifyAwardType.length > 0) {
                const contactType = verifyAwardType[0].split(',');
                cplace.each(contactType, (item) => {
                    if (!isAwaedTypeMatched && item == ruleAwardType) {
                        isAwaedTypeMatched = true;
                    }
                });
            }
        })

        if (!isAwaedTypeMatched) {
            deleteExistingChecklsit(vorbanf, existingChecklist);
            return;
        }

        /**
          RULE_MIN_ORDER_VALUE: 'cf.cplace.ruleMinimumOrderValue',
        */

        const ruleMinOrderValue = checklistSet.get(CHECKLIST_SET.ATTR.RULE_MIN_ORDER_VALUE);
        const sumOfValues = vorbanf.get(VORBANF.ATTR.SUM_OF_VALUES);
        if (sumOfValues < ruleMinOrderValue) {
            deleteExistingChecklsit(vorbanf, existingChecklist);
            return;
        }

        /**
            RULE_MIN_DAYS: 'cf.cplace.ruleMinimumOrderDays',
        */
        const ruleMinDays = checklistSet.get(CHECKLIST_SET.ATTR.RULE_MIN_DAYS);
        let minDaysOfItems = 99999;

        /**
         loop through all items of the vorbanf and get the lowest number of Days for reference.
        */
        cplace.each(vorbanf.getIncomingPages(ITEM.TYPE, ITEM.ATTR.VORBANF), (item) => {
            const days = item.get(ITEM.ATTR.ORDER_DAYS)
            if (days < minDaysOfItems) {
                minDaysOfItems = days;
            }
        })
        if (minDaysOfItems < ruleMinDays) {
            deleteExistingChecklsit(vorbanf, existingChecklist);
            return;
        }

        /**
            TODO Add all other rules here !!!
         */

        /**
        3. If all the conditions are satisfied, then create a new page of the type "checklist".
        */
        let checklistAttributes = {}
        /*
            VORBANF: 'cf.cplace.vorBanf',
            CHECKLIST_SET: 'cf.cplace.checklistSet',
            CHECKLIST_ATTACHMENT: 'cf.cplace.checklistAttachment',
            STATUS: 'cf.cplace.checklistStatus',
            */
        let generationDate = new DateTime();
        checklistAttributes[CHECKLIST.ATTR.VORBANF] = vorbanf;
        checklistAttributes[CHECKLIST.ATTR.CHECKLIST_SET] = checklistSet;
        checklistAttributes[CHECKLIST.ATTR.CHECKLIST_GENERATION_DATE] = generationDate;

        /**
        If the entry exists and again passes the rules then we are updating the existing page with new generation date. 
        If the entry not exists alreadyss and passes the rules then we are inserting a new record
        */
        if (existingChecklist == null) {
            cplace.actions().createPage({
                name: checklistSet.getName(),
                space: vorbanf.getSpaceId(),
                customType: CHECKLIST.TYPE,
                customAttributes: checklistAttributes
            })
        } else {
            cplace.actions().updatePage(existingChecklist, {
                customAttributes: {
                    [CHECKLIST.ATTR.CHECKLIST_GENERATION_DATE]: generationDate
                }
            })
        }
    })
    /*
    4. Go through all the checklists which are already created (check if they are still active or not).
    if the status of checklist is green, then it should not be removed.
    */
    timeSinceStart('final')
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

/**

NOTICE BR: fix the typo, remove the vorbanf parameter

 * @param {current page} vorbanf 
 * @param {it will have value of existingChecklist obj if it is already exists in pre-Requisition checklist else it is null} existingChecklist 
 */
function deleteExistingChecklsit(vorbanf, existingChecklist) {
    // NOTICE BR: turn the condition around -> if (existingChecklist === null) return;
    if (existingChecklist === null) return;
  
  let attachments = existingChecklist.getBuiltinFeatureValue('documents');
	if (attachments === null || attachments.size() == 0) {
      cplace.actions().deletePage(existingChecklist);
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