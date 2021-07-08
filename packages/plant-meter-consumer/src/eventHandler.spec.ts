import { LocationChangePayload, WateringPayload } from 'plant-meter-shared/dist/model.types';
import { handleIncomingEvent } from './eventHandler';

describe('GIVEN we have an eventhandler', () => {
  it('SHOULD handle watering events', async () => {
    const mockedWateringChange = jest.fn();
    const mockedLocationChange = jest.fn();
    const payload: WateringPayload = { when: new Date(), amountInML: 1200 };
    await handleIncomingEvent({
      event: {
        eventType: 'Watering',
        payload,
      },
      database: {
        locationChange: mockedLocationChange,
        waterChange: mockedWateringChange,
      },
    });
    expect(mockedWateringChange).toHaveBeenCalledTimes(1);
    expect(mockedLocationChange).toHaveBeenCalledTimes(0);
    expect(mockedWateringChange).toHaveBeenCalledWith(payload);
  });
  it('SHOULD handle location change events', async () => {
    const mockedHandleLocationChange = jest.fn();
    const mockedWateringChange = jest.fn();

    const payload: LocationChangePayload = { newLocation: 'hallway', when: new Date() };
    await handleIncomingEvent({
      event: {
        eventType: 'LocationChange',
        payload,
      },
      database: {
        locationChange: mockedHandleLocationChange,
        waterChange: mockedWateringChange,
      },
    });

    expect(mockedWateringChange).toHaveBeenCalledTimes(0);
    expect(mockedHandleLocationChange).toHaveBeenCalledTimes(1);
    expect(mockedHandleLocationChange).toHaveBeenCalledWith(payload);
  });
});
