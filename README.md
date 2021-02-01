# Install instructions

## Create the python env

```
cd api
apt install python3-venv
python -m venv venv
source venv/bin/activate
pip install flask python-dotenv azure-storage-blob
```

## Set the storage accounts to use

Copy the `storage.json.tpl` to `storage.json` and include all the containers
you would like to expose.

## Build

```
yarn install
yarn build
```

## Run

To start the python server:

```
yarn start-api
```

To start the web server:

```
yarn start
```

Now go to `localhost:3000`

> Note: you can just start the python server and connect to `localhost:5000` for the production build.
