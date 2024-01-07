const { CronJob } = require('cron');
const thesisDao = require('../dao/thesis_dao');
const NotificationService = require("./NotificationService");

class CronTasksService {
    /** @type {{ "THESIS_EXPIRED": CronJob }} */
    static _cronJobs = { };

    static JOB_NAMES = {
        THESIS_EXPIRED: "THESIS_EXPIRED"
    };

    static init() {
        this._setupCronJobForCancelingApplicationOnExpiredThesis();
    }
    static stop() {
        for (const job of Object.values(this._cronJobs)) {
            job.stop();
        }
    }

    static _setupCronJobForCancelingApplicationOnExpiredThesis() {
        this._cronJobs[this.JOB_NAMES.THESIS_EXPIRED] = new CronJob("0 0 * * *", () => {
            thesisDao.cancelWaitingApplicationsOnExpiredThesis()
                .then(async updated => {
                    if (updated.length === 0) {
                        return;
                    }

                    for (const application of updated) {
                        await NotificationService.emitThesisApplicationStatusChange(
                            application.student_id,
                            application.proposal_id,
                            application.status,
                            "The thesis you applied for has expired."
                        )
                    }

                    console.log(`Successfully canceled ${updated.length} waiting applications on expired theses.`);
                })
                .catch((err) => {
                    console.error('Failed to cancel waiting applications on expired theses.');
                    console.error(err);
                });
        }, undefined, true, 'utc', undefined, true);
    }

    /**
     * @param {JOB_NAMES} jobName
     */
    static fireJob(jobName) {
        if (this._cronJobs[jobName]) {
            this._cronJobs[jobName].fireOnTick();
        }
    }
}

module.exports = CronTasksService;
