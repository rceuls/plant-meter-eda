import { Logger, Model } from 'plant-meter-shared';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

export type LocationChangeDatabaseHandler = (payload: Model.LocationChangePayload) => Promise<void>;
export type WateringDatabaseHandler = (payload: Model.WateringPayload) => Promise<void>;

// notice that 'when' is mandatory in these local-file-thingies.
type FSLocation = {
  when: number;
  location: string;
};

type FSWatering = {
  when: number;
  amount: number;
};

type FSLastState = {
  wateringId?: string;
  locationId?: string;
};

// bad practice city
const upgradeLastState = (fileId: string, type: 'Location' | 'Watering') => {
  const overviewPath = './database/overview.json';
  const lastStateFile = fs.existsSync(overviewPath)
    ? (JSON.parse(fs.readFileSync(overviewPath).toString()) as FSLastState) ?? {}
    : {};
  lastStateFile.locationId = type === 'Location' ? fileId : lastStateFile.locationId;
  lastStateFile.wateringId = type === 'Watering' ? fileId : lastStateFile.wateringId;
  fs.writeFileSync(overviewPath, JSON.stringify(lastStateFile, undefined, 2));
};

// bad practice city
export const locationChangeDatabaseHandlerFileImpl = (payload: Model.LocationChangePayload) => {
  try {
    const id = uuidv4();
    const when = payload.when ?? new Date();
    const toPersist: FSLocation = {
      when: when.valueOf(),
      location: payload.newLocation,
    };
    if (!fs.existsSync('./database/locations')) {
      fs.mkdirSync('./database/locations', { recursive: true });
    }
    fs.writeFileSync(`./database/locations/${id}.json`, JSON.stringify(toPersist, null, 2));
    upgradeLastState(id, 'Location');
  } catch (ex) {
    Logger.logError(ex);
  } finally {
    return Promise.resolve();
  }
};

// bad practice city
export const wateringDatabaseHandlerFileImpl = (payload: Model.WateringPayload) => {
  try {
    const id = uuidv4();
    const when = payload.when ?? new Date();
    const toPersist: FSWatering = {
      when: when.valueOf(),
      amount: payload.amountInML,
    };
    if (!fs.existsSync('./database/waters')) {
      fs.mkdirSync('./database/waters', { recursive: true });
    }
    fs.writeFileSync(`./database/waters/${id}.json`, JSON.stringify(toPersist, null, 2));
    upgradeLastState(id, 'Watering');
  } catch (ex) {
    Logger.logError(ex);
  } finally {
    return Promise.resolve();
  }
};
