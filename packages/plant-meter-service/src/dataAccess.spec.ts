import { LocationChangePayload, WateringPayload } from 'plant-meter-shared/dist/model.types';
import { locationChangeDatabaseHandlerFileImpl, wateringDatabaseHandlerFileImpl } from './dataAccess';
import fs from 'fs';

jest.mock('fs');

describe('GIVEN we have file handlers for location and watering changes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('SHOULD be able to handle watering events', async () => {
    const when = 1234567;
    const payload: WateringPayload = { amountInML: 1000, when: new Date(when) };
    fs.existsSync = jest.fn();
    await wateringDatabaseHandlerFileImpl(payload);
    expect(fs.existsSync).toBeCalledTimes(2);
    expect(fs.writeFileSync).toBeCalledTimes(2);
  });
  it('SHOULD be able to handle location change events', async () => {
    const when = 1234567;
    const payload: LocationChangePayload = { newLocation: 'kitchen', when: new Date(when) };
    fs.existsSync = jest.fn();
    await locationChangeDatabaseHandlerFileImpl(payload);
    expect(fs.existsSync).toBeCalledTimes(2);
    expect(fs.writeFileSync).toBeCalledTimes(2);
  });
});
