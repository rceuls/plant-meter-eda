import { LocationChangePayload, WateringPayload } from 'plant-meter-shared/dist/model.types';
import { handleIncomingEvent } from './eventHandler';

describe('GIVEN we have an eventhandler', () => {
  it('SHOULD handle watering events', async () => {
    const mockedWateringChange = jest.fn();
    const payload: WateringPayload = { when: new Date(), amountInML: 1200 };
    await handleIncomingEvent(
      {
        eventType: 'Watering',
        payload,
      },
      {
        locationChange: jest.fn(),
        waterChange: mockedWateringChange,
      },
    );
    expect(mockedWateringChange).toHaveBeenCalledTimes(1);
    expect(mockedWateringChange).toHaveBeenCalledWith(payload);
  });
  it('SHOULD handle location change events', async () => {
    const mockedHandleLocationChange = jest.fn();
    const payload: LocationChangePayload = { newLocation: 'hallway', when: new Date() };
    await handleIncomingEvent(
      {
        eventType: 'LocationChange',
        payload,
      },
      {
        locationChange: mockedHandleLocationChange,
        waterChange: jest.fn(),
      },
    );
    expect(mockedHandleLocationChange).toHaveBeenCalledTimes(1);
    expect(mockedHandleLocationChange).toHaveBeenCalledWith(payload);
  });
});
