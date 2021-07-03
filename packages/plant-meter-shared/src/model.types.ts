export type Location = 'kitchen' | 'living' | 'hallway' | 'hallway_upstairs';
export type PlantId = string;

export type WateringPayload = {
  amountInML: number;
  when?: Date;
};

export type LocationChangePayload = {
  newLocation: Location;
  when?: Date;
};

export type LocationChangeEvent = {
  eventType: 'LocationChange';
  payload: LocationChangePayload;
};

export type WateringEvent = {
  eventType: 'Watering';
  payload: WateringPayload;
};

export type Event = WateringEvent | LocationChangeEvent;
