const configuration = require("../dao/configuration_dao");
const dayjs = require("dayjs");
const InvalidNewVirtualOffsetError = require("../errors/InvalidNewVirtualOffsetError");

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

module.exports = VirtualClock;
