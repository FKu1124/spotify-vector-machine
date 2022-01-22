### Spotify Vector Machine

***Test Prod Integration of Frontend & Backend***

Change line 35 from `npm run dev` to `npm run di-dev`

Note however that the frontend will be build on every change/save and both frontend & backend are affected by the changes and will reload. \
Further the built files will be minified, i.e. yielding no useful console output when debugging. 

## Docker Dev

***Start Project***

```console
docker-compose up
```

***Make & Apply Migrations***
Ensure that postgres container is running

```console
docker-compose run backend python manage.py makemigrations

docker-compose run backend python manage.py migrate
```

***Attach to running container***
```console
docker exec -it [container_name] bash
```

***Force Recreate Container***
```console
docker-compose up --build --force-recreate --no-deps [service_name]
```