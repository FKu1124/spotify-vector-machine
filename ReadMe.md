### Spotify Vector Machine

***Test Prod Integration of Frontend & Backend***

Change line 35 from `npm run dev` to `npm run di-dev`

Note however that the frontend will be build on every change/save and both frontend & backend are affected by the changes and will reload. \
Further the built files will be minified, i.e. yielding no useful console output when debugging. 

*** Setting up the Recommender ****

Once the track & tag tables is filled, you can initialize the recommender with the following command. This creates the feature vectors for each song and maps the postion of feature vectors to spotify id's.

```console
docker exec -it django_backend python manage.py init_recommender
```

In order to receive personalized recommendations we have to create a user profile for the currently logged in user manually by calling the following endpoint: http://localhost:8000/accounts/profile

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