import os.path
import re

image_extensions = re.compile(r"\.(jpg|jpeg|png|gif|bmp|tiff|webp)$", re.IGNORECASE)

def validate_filename(filename):
    if os.path.isfile(filename):
        file_extension = os.path.splitext(filename)[1]
        if image_extensions.search(filename):
            return True
    return False

def update_carousel(html, folder_name, id_name):
    print(f"Populating {id_name} carousel with photos from images/{folder_name}:")

    # will grab all existing content in the carousel in a capturing group
    r = re.compile(rf'<section id="{id_name}".*?>.*?>(.*?)</div>', re.DOTALL)

    match = r.search(html)
    if not match:
        print(f"Failed to find {id_name} in index.html")
        return html

    start = match.start(1)
    end = match.end(1)

    newhtml = html[:start]
    newhtml += "\n<noscript>You need scripts enabled to load this content</noscript>\n<!-- Any images in here will become items of the carousel -->\n"

    for filename in os.listdir(f"images/{folder_name}"):
        filename = f"images/{folder_name}/" + filename
        if validate_filename(filename):
            newhtml += f'<img src="{filename}" alt="">\n'
            print(f"\tAdded {filename}")
    print()
    return newhtml + html[end:]

def update_photos():
    html = ""
    print("Reading index.html...\n")
    with open("index.html", "r") as f:
        html = f.read()
    
    html = update_carousel(html, "Family", "families")
    html = update_carousel(html, "Events", "events")

    with open("index.html", "w") as f:
        print("Writing changes to index.html...")
        f.write(html)
    print("Done!")


update_photos()