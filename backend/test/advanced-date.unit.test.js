require('jest');

const dayjs = require('dayjs');
const AdvancedDate = require("../AdvancedDate");

describe('AdvancedDate class', () => {
    let initialOffset;

    beforeAll(() => {
        initialOffset = AdvancedDate.virtual.offsetMs;
    });
    afterEach(() => {
        AdvancedDate.virtual.setNewOffset(initialOffset);
    });

    describe('Virtual clock changes', () => {
        test('should support offset changes with milliseconds', () => {
            const offset = 1000;
            AdvancedDate.virtual.setNewOffset(offset);

            const dayjsDate = dayjs();
            const virtualDate = AdvancedDate.virtual.getVirtualDate(dayjsDate);

            expect(virtualDate.valueOf()).toBe(dayjsDate.valueOf() + offset);
        });

        test('should support offset changes from a date string', () => {
            const now = dayjs();
            const offset = 1000;
            const dateStr = now.add(offset, 'millisecond').toISOString();
            AdvancedDate.virtual.setNewOffset(dateStr);

            const dayjsDate = dayjs('2021-01-01T00:00:00.000Z');
            const virtualDate = AdvancedDate.virtual.getVirtualDate(dayjsDate);

            expect(virtualDate.valueOf()).toBe(dayjsDate.valueOf() + offset);
        });

        test('should return virtual date based on the offset', () => {
            const offset = 1000;
            AdvancedDate.virtual.setNewOffset(offset);

            const dayjsDate = dayjs();
            const virtualDate = AdvancedDate.virtual.getVirtualDate();

            // Check with a tolerance of 3 milliseconds
            expect(virtualDate.valueOf()).toBeGreaterThanOrEqual(dayjsDate.valueOf() + offset);
            expect(virtualDate.valueOf()).toBeLessThanOrEqual(dayjsDate.valueOf() + offset + 3);
        });
    });

    describe('Fixed date in constructor', () => {
        test('should return the correct date in ISO format', () => {
            const str = '2021-01-01T00:00:00.000Z';

            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
        });

        test('should return the correct unix timestamp', () => {
            const str = '2021-01-01T00:00:00.000Z';

            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.unix()).toBe(dayjsDate.unix());
        });

        test('should return the correct valueOf', () => {
            const str = '2021-01-01T00:00:00.000Z';

            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.valueOf()).toBe(dayjsDate.valueOf());
        });

        test('should return the same date even if the virtual clock is changed', () => {
            const offset = 1000;
            AdvancedDate.virtual.setNewOffset(offset);

            const str = '2023-01-01T00:00:00.000Z';
            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
            expect(advancedDate.unix()).toBe(dayjsDate.unix());
            expect(advancedDate.valueOf()).toBe(dayjsDate.valueOf());
            expect(advancedDate.isBefore(dayjsDate)).toBe(false);
        });

        test('should return the same date even if the virtual clock is changed to a date in the past', () => {
            const offset = -1000;
            AdvancedDate.virtual.setNewOffset(offset);

            const str = '2022-01-01T00:00:00.000Z';
            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
            expect(advancedDate.unix()).toBe(dayjsDate.unix());
            expect(advancedDate.isBefore(dayjsDate)).toBe(false);
            expect(advancedDate.valueOf()).toBe(dayjsDate.valueOf());
        });
    });

    describe('No date in constructor (current date)', () => {
        test('should return the correct date in ISO format', () => {
            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
        });

        test('should return the correct unix timestamp', () => {
            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.unix()).toBe(dayjsDate.unix());
        });

        test('should return the correct valueOf', () => {
            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.valueOf()).toBe(dayjsDate.valueOf());
        });

        test('should apply offset to the current date', () => {
            const offset = 1000;
            AdvancedDate.virtual.setNewOffset(offset);

            /**
             * @type {dayjs.Dayjs}
             */
            const dayjsDateWithOffset = dayjs().add(offset, 'millisecond');
            const advancedDate = new AdvancedDate();

            // Check with a tolerance of 3 milliseconds
            expect(advancedDate.valueOf()).toBeGreaterThanOrEqual(dayjsDateWithOffset.valueOf());
            expect(advancedDate.valueOf()).toBeLessThanOrEqual(dayjsDateWithOffset.valueOf() + 3);
        });
    });
});
