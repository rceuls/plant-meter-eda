# Plant Meter Event Driven Architecture

## Running

1. `yarn install`
2. `yarn lerna bootstrap`
3. `yarn build`
4. `cd docker` and `docker-compose up`

You can either run tests (`yarn test`), or run the client/server.

> Notice that this a POC. No way that this is ok with regards to project structure, dependencies, ... .

### Flow

To start the application you need to start both service (to consume) and to start the client (to produce).

1. `cd packages\plant-meter-service`
2. `yarn run build:run:service`

1. `cd packages\plant-meter-client`
2. `yarn run build:run:client`

Behold! The database folder starts filling up. 

1. Create a bunch of messages.
2. Send the messages over to mqtt.
3. Consume the messages from mqtt.
4. Persist those message contents to the local filesystem. Two files are persisted - `overview.json` and a file containing the latest data (in either `locations/` or `waters/`).
