'use strict';

const z = require('zod');
const AdvancedDate = require("../models/AdvancedDate");

const APIThesisProposalSchema = z.object({
    title: z.string().min(1).max(1000),
    internal_co_supervisors_id: z.array( z.string() ),
    external_co_supervisors_id: z.array( z.number() ),
    type: z.string().min(1).max(1000),
    description: z.string().min(1).max(10000),
    required_knowledge: z.string().max(10000).nullable().optional(),
    notes: z.string().max(10000).nullable().optional(),
    level: z.string().min(1).max(1000),
    cds: z.array( z.string() ).min(1).max(1000),
    keywords: z.array( z.string() ).min(1).max(1000),
    expiration: z.string().transform( (expiration, ctx) => {
        const exp = new AdvancedDate(expiration);
        if (!exp.date.isValid()) {
            ctx.addIssue({ code: z.ZodIssueCode.invalid_date, message: 'Invalid date format', fatal: true });
            return z.NEVER;
        }

        const currentDate = new AdvancedDate();
        if (exp.isBefore(currentDate)) {
            ctx.addIssue({ code: z.ZodIssueCode.invalid_date, message: 'Expiration date must be in the future', fatal: true });
            return z.NEVER;
        }

        return exp.date.endOf('day').toISOString();
    })
});

module.exports = {
    APIThesisProposalSchema
};
