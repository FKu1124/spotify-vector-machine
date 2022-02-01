import os
import csv
import requests
from typing import Tuple
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
            writer.writerow(['genre',
                             'x_value',
                             'y_value',
                             'font_size',
                             'color_hex',
                             'color_R',
                             'color_G',
                             'color_B'])
            for genre in genres:
                genre_slug = genre.contents[0].strip().replace('-', ' ')
                x = y = 0
                styles = genre['style'].split('; ')
                for style in styles:
                    key, value = style.split(': ')
                    if key == 'top':
                        y = canvas_height - int(value[:-2])
                    elif key == 'left':
                        x = int(value[:-2])
                    elif key == 'color':
                        color_R, color_G, color_B = self._hex_to_rgb(value)
                        color_hex = value
                    else:
                        font_size = value[-5:-1]
                writer.writerow([genre.contents[0],
                                 x, y,
                                 font_size,
                                 color_hex, color_R, color_G, color_B])
        print(len(genres))

    def _hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
