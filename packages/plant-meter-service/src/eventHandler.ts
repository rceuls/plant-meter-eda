import { Logger, Model } from 'plant-meter-shared';
import { LocationChangeDatabaseHandler, WateringDatabaseHandler } from './dataAccess';

export type HandleIncomingEvent = (
  event: Model.Event,
  changeLocation: LocationChangeDatabaseHandler,
  water: WateringDatabaseHandler,
) => Promise<void>;

export const handleIncomingEvent: HandleIncomingEvent = async (
  event: Model.Event,
  changeLocation: LocationChangeDatabaseHandler,
  water: WateringDatabaseHandler,
) => {
  switch (event.eventType) {
    case 'LocationChange':
      await changeLocation(event.payload);
      break;
    case 'Watering':
      await water(event.payload);
      break;
    default:
      // impossible to trigger, especially when using stuff like io-ts that makes it impossible
      // to accidentaly deserialize the wrong kind of events.
      Logger.logDebug({ msg: 'Non-supported event, skipping', event });
      break;
  }
};
