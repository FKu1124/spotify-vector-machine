import os
import csv
import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand

from spotify.models import Genre


class Command(BaseCommand):
    help = "Scrapes lastfm data for previously scraped spotify tracks."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started ENAO scraping command."))

        canvas_width = 1697
        canvas_height = 20671

        response = requests.get('https://everynoise.com/')
        html = response.content
        soup = BeautifulSoup(html, 'html.parser')
        genres = soup.find_all('div', class_='genre')

        with open('enao.csv', 'w') as file:
            writer = csv.writer(file)
            writer.writerow(['Genre','x_value', 'y_value'])
            for genre in genres:
                genre_slug = genre.contents[0].strip().replace('-', ' ')
                x = y = 0
                styles = genre['style'].split('; ')
                for style in styles:
                    key, value = style.split(': ')
                    if key == 'top':
                        y = canvas_height - int(value[:-2])
                    if key == 'left':
                        x = int(value[:-2])
                writer.writerow([genre_slug, x, y])

        print(len(genres))
