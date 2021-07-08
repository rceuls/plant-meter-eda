import { Model } from 'plant-meter-shared';

// This is our "repository". Notice that you just need to implement the IDatabase.
export type LocationChangeDatabaseHandler = (payload: Model.LocationChangePayload) => Promise<void>;
export type WateringDatabaseHandler = (payload: Model.WateringPayload) => Promise<void>;

export interface IDatabase {
  locationChange: LocationChangeDatabaseHandler;
  waterChange: WateringDatabaseHandler;
}
