import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from PIL import Image
from io import BytesIO

def compress_image(image, max_size_kb, quality=85, step=5):
    """Compresses an image to be under the specified size in KB"""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    original_buffer = BytesIO()
    image.save(original_buffer, format='JPEG', quality=100)  # save at best quality
    buffer_size = original_buffer.tell()  # get buffer size

    while buffer_size > max_size_kb * 1024 and quality > 0:
        buffer = BytesIO()
        image.save(buffer, format='JPEG', quality=quality)
        buffer_size = buffer.tell()
        quality -= step

    if quality <= 0:
        raise ValueError("Cannot compress image to the desired size")

    image = Image.open(buffer)
    return image, buffer

def get_all_images(url):
    """Returns all image URLs on a single `url` that end with .jpg and are not logos or icons"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    urls = []
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and src.endswith('.jpg'):
            full_url = urljoin(url, src)
            if not any(keyword in full_url.lower() for keyword in ['logo', 'icon']):
                urls.append(full_url)
    return urls

def crawl_and_download_images(start_url):
    """Crawl through the website and download all images that meet the criteria, and compress them"""
    visited_urls = set()
    pending_urls = {start_url}
    os.makedirs('club_monaco_images', exist_ok=True)

    while pending_urls:
        current_url = pending_urls.pop()
        print(f"Crawling: {current_url}")
        visited_urls.add(current_url)

        # Get all image URLs from the current page
        image_urls = get_all_images(current_url)

        # Download and compress images
        for img_url in image_urls:
            response = requests.get(img_url)
            img = Image.open(BytesIO(response.content))
            if img.width >= 300 and img.height >= 300:
                try:
                    img, buffer = compress_image(img, max_size_kb=500)
                    filename = os.path.join('club_monaco_images', os.path.basename(urlparse(img_url).path))
                    if not os.path.isfile(filename):  # avoid re-downloading
                        with open(filename, 'wb') as f:
                            f.write(buffer.getvalue())
                except ValueError as e:
                    print(f"Error compressing image: {e}")

        # Find all links on the current page and add them to the pending list
        response = requests.get(current_url)
        soup = BeautifulSoup(response.text, 'lxml')
        for link in soup.find_all('a'):
            href = link.get('href')
            if href and href.startswith('http'):
                url = urljoin(current_url, href)
                if url not in visited_urls:
                    pending_urls.add(url)

# Starting URL
start_url = 'https://www.clubmonaco.ca/en/women-clothing-sweaters?ab=lpca_sweaters_3.6_w'
crawl_and_download_images(start_url)
