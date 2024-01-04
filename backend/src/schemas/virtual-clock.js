'use strict';

const z = require('zod');

const APIVirtualClockUpdateSchema = z.object({
    newDate: z.string().datetime().optional()
});

module.exports = {
    APIVirtualClockUpdateSchema
};
