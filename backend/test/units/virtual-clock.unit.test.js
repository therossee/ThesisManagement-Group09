require('jest');
require('../integration_config');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // Import the utc plugin
dayjs.extend(utc); // Extend dayjs with the utc plugin
const configuration = require('../../src/dao/configuration_dao');
const VirtualClock = require('../../src/models/VirtualClock');
const AdvancedDate = require('../../src/models/AdvancedDate');
const InvalidNewVirtualOffsetError = require('../../src/errors/InvalidNewVirtualOffsetError');

jest.mock('../../src/dao/configuration_dao');

describe('VirtualClock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

describe('offsetMs', () => {
    test('should return offset from configuration', () => {
        configuration.getIntegerValue.mockReturnValue(1000); 
        const offset = VirtualClock.offsetMs;
    
        expect(offset).toEqual(1000);
    });

    test('should return 0 when offset is not found in configuration', () => {
        configuration.getIntegerValue.mockReturnValue(undefined); 
        const offset = VirtualClock.offsetMs;
    
        expect(offset).toEqual(0);
    });
});

describe('getVirtualDate', () => {
  test('should return virtual date with offset applied when date is provided', () => {
    configuration.getIntegerValue.mockReturnValue(1000); 
    const currentDate = dayjs.utc('2022-01-01T00:00:00Z');
    const virtualDate = VirtualClock.getVirtualDate(currentDate);

    expect(virtualDate).toEqual(currentDate.add(1000, 'millisecond'));
  });

  test('should return virtual date with offset applied when no date is provided', () => {
    configuration.getIntegerValue.mockReturnValue(2000); 
    const now = dayjs.utc();
    const virtualDate = VirtualClock.getVirtualDate();

    expect(virtualDate).toEqual(now.add(2000, 'millisecond'));
  });
});

describe('setNewOffset', () => {
  test('should set new offset when provided as a number', () => {
      configuration.getIntegerValue.mockReturnValue(0); 
      const newOffset = 3000;
      VirtualClock.setNewOffset(newOffset);

      expect(configuration.setValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS, newOffset);
  });

  test('should set new offset when provided as a date string', () => {
    configuration.getIntegerValue.mockReturnValue(0); 
    const newOffsetDateStr = new AdvancedDate().toISOString;
    VirtualClock.setNewOffset(newOffsetDateStr);

    const expectedNewOffset = dayjs.utc(newOffsetDateStr).valueOf();
    expect(configuration.setValue).toHaveBeenCalledWith(configuration.KEYS.VIRTUAL_OFFSET_MS, expectedNewOffset);
  });

  test('should throw InvalidNewVirtualOffsetError when new offset is less than current offset', () => {
    configuration.getIntegerValue.mockReturnValue(4000);
    const invalidNewOffset = 2000; 

    expect(() => VirtualClock.setNewOffset(invalidNewOffset)).toThrow(InvalidNewVirtualOffsetError);
  });
});
});
