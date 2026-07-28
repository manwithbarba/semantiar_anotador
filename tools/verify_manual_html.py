"""Minimal structural verifier for the standalone manual HTML."""
import json
import sys
from html.parser import HTMLParser
from pathlib import Path


class ManualParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.headings = 0
        self.nav = False
        self.update = False
        self.images = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)
            self.update |= element_id == "actualizacion-interfaz-20260728"
        if tag in {"h1", "h2"}:
            self.headings += 1
        if tag == "a" and values.get("href", "").startswith("#"):
            self.links.append(values["href"][1:])
        if tag == "img" and values.get("src"):
            self.images.append(values["src"])
        if tag == "nav" and "manual-nav" in values.get("class", "").split():
            self.nav = True


source = Path(sys.argv[1])
parser = ManualParser()
parser.feed(source.read_text(encoding="utf-8"))
duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
missing = sorted({item for item in parser.links if item not in parser.ids})
missing_images = sorted(
    item for item in parser.images
    if not item.startswith(("http://", "https://", "data:")) and not (source.parent / item).is_file()
)
print(json.dumps({
    "headings": parser.headings,
    "internalLinks": len(parser.links),
    "missingTargets": missing,
    "duplicateIds": duplicates,
    "hasNavigation": parser.nav,
    "hasInterfaceUpdate": parser.update,
    "images": len(parser.images),
    "missingImages": missing_images,
}, ensure_ascii=False, indent=2))
