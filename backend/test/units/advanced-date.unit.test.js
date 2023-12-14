require('jest');
// [i] This line load the environment variables + setup extension of "jest". DON'T (RE)MOVE IT
require('../integration_config');

const dayjs = require('dayjs');
const configuration = require('../../configuration_dao');
const AdvancedDate = require("../../AdvancedDate");
const InvalidNewVirtualOffsetError = require("../../errors/InvalidNewVirtualOffsetError");


jest.mock('../../configuration_dao', () => ({
    getIntegerValue: jest.fn(),
    setValue: jest.fn(),
    KEYS: {
        VIRTUAL_OFFSET_MS: 'virtual_offset_ms',
    },
}));

describe('AdvancedDate class', () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('Virtual clock changes', () => {
        test('should support offset changes with milliseconds', () => {
            configuration.getIntegerValue.mockReturnValueOnce(0);

            const offset = 1000;
            AdvancedDate.virtual.setNewOffset(offset);

            expect(configuration.setValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS, offset);
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });

        test('should support offset changes from a date string', () => {
            configuration.getIntegerValue.mockReturnValueOnce(0);

            const now = dayjs();
            const offset = 1000;
            const dateStr = now.add(offset, 'millisecond').toISOString();
            AdvancedDate.virtual.setNewOffset(dateStr);

            expect(configuration.setValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS, expect.toBeAnIntegerCloseTo(offset, 3));
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });

        test('should return virtual date based on the offset', () => {
            const offset = 1000;
            configuration.getIntegerValue.mockReturnValueOnce(offset);

            const dayjsDate = dayjs();
            const virtualDate = AdvancedDate.virtual.getVirtualDate();

            expect(virtualDate.valueOf()).toBeAnIntegerCloseTo(dayjsDate.valueOf() + offset, 3);
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
            expect(configuration.getIntegerValue).toHaveBeenCalledTimes(1);
        });

        test('should refuse to set an offset lower than the current one', () => {
            const offset = 1000;
            configuration.getIntegerValue.mockReturnValueOnce(offset);

            expect(() => AdvancedDate.virtual.setNewOffset(offset - 1)).toThrowError(InvalidNewVirtualOffsetError);
            expect(configuration.setValue).not.toHaveBeenCalled();
            expect(configuration.getIntegerValue).toBeCalledTimes(1);
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
            configuration.getIntegerValue.mockReturnValueOnce(offset);

            const str = '2023-01-01T00:00:00.000Z';
            const dayjsDate = dayjs(str);
            const advancedDate = new AdvancedDate(str);

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
            expect(advancedDate.unix()).toBe(dayjsDate.unix());
            expect(advancedDate.valueOf()).toBe(dayjsDate.valueOf());
            expect(advancedDate.isBefore(dayjsDate)).toBe(false);
        });
    });

    describe('No date in constructor (current date)', () => {
        test('should return the correct date in ISO format', () => {
            configuration.getIntegerValue.mockReturnValueOnce(0);

            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.toISOString()).toBe(dayjsDate.toISOString());
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });

        test('should return the correct unix timestamp', () => {
            configuration.getIntegerValue.mockReturnValueOnce(0);

            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.unix()).toBeAnIntegerCloseTo(dayjsDate.unix(), 1);
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });

        test('should return the correct valueOf', () => {
            configuration.getIntegerValue.mockReturnValueOnce(0);

            /**
             * @type {dayjs.Dayjs}
             */
            const dayjsDate = dayjs();
            const advancedDate = new AdvancedDate();

            expect(advancedDate.valueOf()).toBeAnIntegerCloseTo(dayjsDate.valueOf(), 3);
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });

        test('should apply offset to the current date', () => {
            const offset = 1000;
            configuration.getIntegerValue.mockReturnValueOnce(1000);

            /**
             * @type {dayjs.Dayjs}
             */
            const dayjsDateWithOffset = dayjs().add(offset, 'millisecond');
            const advancedDate = new AdvancedDate();

            // Check with a tolerance of 3 milliseconds
            expect(advancedDate.valueOf()).toBeAnIntegerCloseTo(dayjsDateWithOffset.valueOf(), 3);
            expect(configuration.getIntegerValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS);
        });
    });
});
