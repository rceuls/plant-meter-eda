import { Logger, Model } from 'plant-meter-shared';
import { IDatabase, LocationChangeDatabaseHandler, WateringDatabaseHandler } from './dataAccess';

export type HandleIncomingEvent = (params: { event: Model.Event; database: IDatabase }) => Promise<void>;

export const handleIncomingEvent: HandleIncomingEvent = async ({
  event,
  database,
}: {
  event: Model.Event;
  database: IDatabase;
}) => {
  switch (event.eventType) {
    case 'LocationChange':
      await database.locationChange(event.payload);
      break;
    case 'Watering':
      await database.waterChange(event.payload);
      break;
    default:
      // impossible to trigger, especially when using stuff like io-ts that makes it impossible
      // to accidentaly deserialize the wrong kind of events.
      Logger.logDebug({ msg: 'Non-supported event, skipping', data: event });
      break;
  }
};
