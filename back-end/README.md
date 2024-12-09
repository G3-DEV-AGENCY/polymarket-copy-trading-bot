# Pump.fun Backend

## Run tests

### Prepare local MongoDb

1. The local MongoDb is run via docker-compose with secrets. You need to create two files:

- mongo-docker/db_root_username.txt
- mongo-docker/db_root_password.txt

you can choose whatever username and password for your local MongoDb.

2. Start MongoDb

You can start MongoDb locally via Docker: `docker-compose -f mongo-docker/docker-compose.yml up -d`

3. Setup local Mongo URI env

The Mongo URI for connection is fairly simple. It looks like this: `mongodb://<username>:<password>@localhost:27017/`

### Start your local Solana chain

You will need to setup your Solana test validator yourself along with your deployed program.

### Run API tests

```bash
# run all tests
yarn test

# Run a single test
yarn test -t "test-create-a-new-coin"
```
