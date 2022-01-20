## Fill up Database with json files

Migrate DB first
```
docker exec django_backend python3 manage.py migrate
```

Get into the django shell  
```
docker exec -it django_backend python3 manage.py shell
```
Execute db_util.py

```
exec(open("spotify/services.py").read())
```