## Fill up Database with json files

Migrate DB first
```
docker exec django_backend python3 manage.py migrate
```

Start scraping
```
docker exec -it django_backend python manage.py scrape_spotify
```
