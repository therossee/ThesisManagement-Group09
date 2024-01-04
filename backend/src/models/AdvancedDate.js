const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/utc'));
const InvalidNewVirtualOffsetError = require("../errors/InvalidNewVirtualOffsetError");
const configuration = require('../dao/configuration_dao');

class VirtualClock {
    static get offsetMs() {
        return configuration.getIntegerValue(configuration.KEYS.VIRTUAL_OFFSET_MS) ?? 0;
    }

    /**
     * @param {number|string} offsetOrDateStr The offset in milliseconds or a date string in ISO 8601 format
     */
    static setNewOffset(offsetOrDateStr) {
        let newOffsetMs;
        if (typeof offsetOrDateStr === 'number') {
            newOffsetMs = offsetOrDateStr;
        } else {
            const date = dayjs.utc(offsetOrDateStr);
            const now = dayjs();

            newOffsetMs = date.valueOf() - now.valueOf();
        }

        if (newOffsetMs < this.offsetMs) {
            throw new InvalidNewVirtualOffsetError();
        }

        configuration.setValue(configuration.KEYS.VIRTUAL_OFFSET_MS, newOffsetMs);
    }

    /**
     * Return a dayjs instance with the offset applied
     *
     * @param {dayjs.Dayjs} [date]
     */
    static getVirtualDate(date) {
        if (!date) {
            date = dayjs.utc();
        }

        return date.add(this.offsetMs, 'millisecond');
    }
}

class AdvancedDate {
    static virtual = VirtualClock;

    /**
     * Create a new AdvancedDate instance, if no date string is provided, the current date is used.
     * The date is returned with the virtual offset applied
     *
     * @param {string} [dateStr]
     */
    constructor(dateStr) {
        if (dateStr) {
            /**
             * @type {dayjs.Dayjs}
             */
            Object.defineProperty(this, 'date', { value: dayjs.utc(dateStr) });
        } else {
            /**
             * @type {dayjs.Dayjs}
             */
            Object.defineProperty(this, 'date', { value: AdvancedDate.virtual.getVirtualDate() });
        }
    }

    /**
     * Format a date in ISO 8601 format
     *
     * @return {string}
     */
    toISOString() {
        return this.date.toISOString();
    }

    /**
     * Return the Unix timestamp (in seconds)
     *
     * @return {number}
     */
    unix() {
        return this.date.unix();
    }

    /**
     * Return the unix timestamp (in milliseconds)
     *
     * @return {number}
     */
    valueOf() {
        return this.date.valueOf();
    }

    /**
     * Indicate if the current date is before the given date
     *
     * @param {AdvancedDate | dayjs.Dayjs} date
     */
    isBefore(date) {
        const dayjsDate = date instanceof AdvancedDate ? date.date : date;

        return this.date.isBefore(dayjsDate);
    }
}

module.exports = AdvancedDate;
