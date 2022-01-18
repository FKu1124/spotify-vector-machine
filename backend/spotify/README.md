## Fill up Database with json files

Get into the django shell  
```
docker exec -it django_backend python3 manage.py shell
```
Execute db_util.py

```
exec(open("spotify/services.py").read())
```