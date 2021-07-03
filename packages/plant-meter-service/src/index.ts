import mqtt from 'async-mqtt';
import { Config, Logger } from 'plant-meter-shared';
import { LocationChangeEvent, WateringEvent } from 'plant-meter-shared/dist/model.types';
import {
  LocationChangeDatabaseHandler,
  locationChangeDatabaseHandlerFileImpl,
  WateringDatabaseHandler,
  wateringDatabaseHandlerFileImpl,
} from './dataAccess';
import { HandleIncomingEvent, handleIncomingEvent } from './eventHandler';

// you could also, for example, use some kind of IRepository interface. Notice that you do _not_ want to do lifecycle management
// of any kind inside of this method. This does one thing and does it well (i.e. subscribe to mqtt).
const subToMqtt = async (
  eventHandler: HandleIncomingEvent,
  changeLocation: LocationChangeDatabaseHandler,
  changeWater: WateringDatabaseHandler,
) => {
  const client = mqtt.connect(Config.MQTT_URL);
  client.on('error', (ex) => Logger.logError(ex));
  client.on('connect', async () => {
    await client.subscribe(Config.TOPIC_WATERING);
    await client.subscribe(Config.TOPIC_LOCATION);
    client.on('message', async (topic: string, payload: Buffer) => {
      // better use io-ts - we assume that the structure is always correct. Never hurts to double validate this.
      const parsedPayload = JSON.parse(payload.toString());
      switch (topic) {
        case Config.TOPIC_LOCATION:
          await eventHandler(parsedPayload as LocationChangeEvent, changeLocation, changeWater);
          break;
        case Config.TOPIC_WATERING:
          await eventHandler(parsedPayload as WateringEvent, changeLocation, changeWater);
          break;
        default:
          Logger.logError(`Unsupported topic ${topic}`);
          break;
      }
    });
  });
};

subToMqtt(handleIncomingEvent, locationChangeDatabaseHandlerFileImpl, wateringDatabaseHandlerFileImpl)
  .then(Logger.logDebug)
  .catch(Logger.logError)
  .finally(Logger.logDebug);
