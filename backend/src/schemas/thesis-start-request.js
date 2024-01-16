'use strict';

const z = require('zod');
const usersDao = require("../dao/users_dao");
const thesisProposalDao = require("../dao/thesis_proposal_dao");
const thesisApplicationDao = require("../dao/thesis_application_dao");
const AdvancedDate = require("../models/AdvancedDate");

const APIThesisStartRequestSchema = z.object({
    title: z.string().min(1).max(1000),
    description: z.string().min(1).max(10000),
    supervisor_id: z.string().min(1).max(100).superRefine(async(supervisor_id, ctx) => {
        const supervisor = await usersDao.getTeacherById(supervisor_id);
        if (!supervisor) {
            ctx.addIssue({ code: z.ZodIssueCode.invalid_arguments, message: `Supervisor with id ${supervisor_id} not found.`, fatal: true});
            return z.NEVER;
        }
        return supervisor;
    }),
    application_id: z.number().optional().superRefine(async(application_id, ctx) => {
        if (!application_id) {
            return null;
        }
        const application = await thesisApplicationDao.getApplicationById(application_id);
        if (!application) {
            ctx.addIssue({ code: z.ZodIssueCode.invalid_arguments, message: `Application with id ${application_id} not found.`, fatal: true});
            return z.NEVER;
        }
        return application;
    }),
    proposal_id: z.number().optional().superRefine(async(proposal_id, ctx) => {
        if (!proposal_id) {
            return null;
        }
        const proposal = thesisProposalDao.getThesisProposalById(proposal_id);
        if (!proposal) {
            ctx.addIssue({ code: z.ZodIssueCode.invalid_arguments, message: `Thesis proposal with id ${proposal_id} not found.`, fatal: true});
            return z.NEVER;
        }
        if (proposal.is_archived === 1) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Thesis proposal with id ${proposal_id} is archived.`, fatal: true});
            return z.NEVER;
        }

        const currentDate = new AdvancedDate();
        const expiration = new AdvancedDate(proposal.expiration);
        const creationDate = new AdvancedDate(proposal.creation_date);

        if (expiration.isBefore(currentDate)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Thesis proposal with id ${proposal_id} is expired.`, fatal: true});
            return z.NEVER;
        }

        if (currentDate.isBefore(creationDate)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Thesis proposal with id ${proposal_id} is not yet available.`, fatal: true});
            return z.NEVER;
        }
        return proposal;
    }),
    internal_co_supervisors_ids: z.array(z.string()).default([]).superRefine(async(internal_co_supervisors_ids, ctx) => {
        for (const id of internal_co_supervisors_ids) {
            const internal_co_supervisor = await usersDao.getTeacherById(id);
            if (!internal_co_supervisor) {
                ctx.addIssue({ code: z.ZodIssueCode.invalid_arguments, message: `Internal co-supervisor with id ${id} not found.`, fatal: true});
                return z.NEVER;
            }
        }
        return internal_co_supervisors_ids;
    })
});

module.exports = {
    APIThesisStartRequestSchema
};
