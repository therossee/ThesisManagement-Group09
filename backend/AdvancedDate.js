const dayjs = require('dayjs');

class VirtualClock {
    /**
     * The offset in milliseconds
     *
     * @type {number}
     * @private
     */
    static _offsetMs = 0;
    static get offsetMs() {
        return this._offsetMs;
    }

    /**
     * @param {number|string} offsetOrDateStr The offset in milliseconds or a date string in ISO 8601 format
     */
    static setNewOffset(offsetOrDateStr) {
        let offset;
        if (typeof offsetOrDateStr === 'number') {
            offset = offsetOrDateStr;
        } else {
            const date = dayjs(offsetOrDateStr);
            const now = dayjs();

            offset = date.valueOf() - now.valueOf();
        }

        this._offsetMs = offset;
    }

    /**
     * Return a dayjs instance with the offset applied
     *
     * @param {dayjs.Dayjs} [date]
     */
    static getVirtualDate(date) {
        if (!date) {
            date = dayjs();
        }

        return date.add(this._offsetMs, 'millisecond');
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
            Object.defineProperty(this, 'date', { value: dayjs(dateStr) });
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
