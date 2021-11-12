### Title tbd

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