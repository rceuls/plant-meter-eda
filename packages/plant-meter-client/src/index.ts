import { Logger, Model, Config } from 'plant-meter-shared';
import mqtt from 'async-mqtt';

// Some types we need to create our testdata
type CreatePlantWateringEvent = (payload: Model.WateringPayload) => Model.WateringEvent;
type CreateLocationChangeEvent = (payload: Model.LocationChangePayload) => Model.LocationChangeEvent;
// Notice that SendEvent says exactly what it does. It sends an Event, regardless of the actual content.
type SendEvent = (event: Model.Event) => Promise<void>;

const createPlantWateringEvent: CreatePlantWateringEvent = (payload: Model.WateringPayload) => {
  return {
    eventType: 'Watering',
    payload,
  };
};

const createLocationChangeEvent: CreateLocationChangeEvent = (payload: Model.LocationChangePayload) => {
  return {
    eventType: 'LocationChange',
    payload,
  };
};

const sendEvent: SendEvent = async (event: Model.Event) => {
  switch (event.eventType) {
    case 'LocationChange':
      await client.publish(Config.TOPIC_LOCATION, JSON.stringify(event));
      break;
    case 'Watering':
      await client.publish(Config.TOPIC_WATERING, JSON.stringify(event));
      break;
    default:
      break;
  }
};

// start the client, normally you'd do some lifecycle management but this is pretty fire and forget.
const client = mqtt.connect(Config.MQTT_URL);
client.on('error', (ex) => Logger.logError(ex));
client.on('connect', () => {
  for (let x = 0; x < 100; x++) {
    sendEvent(createLocationChangeEvent({ newLocation: 'hallway_upstairs', when: new Date() })).catch(Logger.logError);
  }

  for (let x = 0; x < 100; x++) {
    sendEvent(createPlantWateringEvent({ amountInML: x * 100, when: new Date() })).catch(Logger.logError);
  }
  Logger.logDebug({ msg: 'Wrote data to mqtt.' });
  client.end();
});
