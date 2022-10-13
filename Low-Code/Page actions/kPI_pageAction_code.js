/// <reference path="../../typeDefinitions/globals.d.ts" />

/**
 * Update all current Evaluations of all KPI
 * ada: cf.cplace.prm.projects
 * type: cf.schedule
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-10-22
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//

/**
 * Set to false to suspend logging
 * @type {Boolean}
 */
const DEBUG = false;

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
cplace.setLogName('pageaction-schedule-update-currentevaluation');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//


const ACTIONS = {
    DEFAULT: 'DEFAULT',
}

const LABEL = {
    DEFAULT: {
        'de': 'Setze aktuelle Bewertung auf allen KPI',
        'en': 'Set current evaluation on all KPI',
    }
}

const RESULT_MESSAGE = {
    DEFAULT: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    }
}

const ICON = {
    DEFAULT: 'cf-cplace'
}


const KPI = {
    TYPE: 'cf.cplace.prm.kpi.criterion',
    ATTR: {
        CURRENT_EVALUATION: 'cf.cplace.prm.kpi.currentEvaluation',
        SCHEDULE: 'cf.cplace.prm.kpi.schedule'
    }
}

const EVALUATION = {
    TYPE: 'cf.cplace.prm.kpi.evaluation',
    ATTR: {
        RATING: 'cf.cplace.prm.kpi.forecastRating',
        RATING_DATE: 'cf.cplace.prm.kpi.kpiEvaluationDate',
        KPI: 'cf.cplace.prm.kpi.criterion'
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
 * @param {Page} page 
 * @returns {Object}
 */
function doBusinessAction(page) {
    timeSinceStart('start')

    /**
     * @type {Page[]|ArrayList<Page>} kpis
     */
    let kpis = page.getIncomingPages(KPI.TYPE, KPI.ATTR.SCHEDULE)
    cplace.each(kpis,
        /**
         * 
         * @param {Page} kpi 
         */
        function (kpi) {
            updateCurrentEvaluationForKpi(kpi)
        })

    timeSinceStart('final')
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

/**
 * 
 * @param {Page} kpi 
 * @returns {void}
 */
function updateCurrentEvaluationForKpi(kpi) {
    /**
             * @type {ArrayList<Page>} evaluations
             */
     let evaluations = kpi.getIncomingPages(EVALUATION.TYPE, EVALUATION.ATTR.KPI);

     /**
      * if there is no evaluation, do nothing
      */
     if (evaluations.isEmpty()) {
         return;
     }

     /**
      * If there is only one evaluation set this and ignore actual rating
      */
     let lastEvaluation = Iterables.getLast(evaluations)
     if (evaluations.size() == 1) {
         setCurrentEvaluation(kpi, lastEvaluation)
         return;
     }

     let evaluationArray = [];
     evaluations.forEach(function(page) {
         if (page !== null)
             evaluationArray.push(page)
     })

     /**
      * remove all unrated evaluations
      */
      evaluationArray = evaluationArray.filter(function (evaluation) {
         return (evaluation.get(EVALUATION.ATTR.RATING) && evaluation.get(EVALUATION.ATTR.RATING_DATE))
     })

     /**
      * if none is left (all evaluations are unrated) use the last from above
      */
     if (evaluationArray.length === 0) {
         setCurrentEvaluation(kpi, lastEvaluation);
         return;
     }

     if (evaluationArray.length > 1) {
         evaluationArray = sortArrayByDateAttribute(evaluationArray, EVALUATION.ATTR.RATING_DATE)
     }

     setCurrentEvaluation(kpi, evaluationArray[evaluationArray.length - 1])
}


/**
 * 
 * @param {Page} kpi 
 * @param {Page} evaluation 
 */
function setCurrentEvaluation(kpi, evaluation) {
    let attributes = {};
    attributes[KPI.ATTR.CURRENT_EVALUATION] = evaluation
    updatePage(kpi, attributes)
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
 * 
 * @param {Array<Page>|Page[]} list 
 * @param {String} attribute 
 * @returns {Page[]}
 */
function sortArrayByDateAttribute(list, attribute) {
    return list.sort(function (evaluation_a, evaluation_b) {
        let date_a = evaluation_a.get(attribute)
        let date_b = evaluation_b.get(attribute)
        if (date_a === null || date_b === null) {
            return 0
        }
        if (date_a.isBefore(date_b)) {
            return -1
        }
        if (date_b.isBefore(date_a)) {
            return 1
        }

        return 0
    })
}


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