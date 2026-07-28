"""Structural audit for the generated navigable SEMANTIAR manual."""
import re
import sys
import zipfile
from pathlib import Path


path = Path(sys.argv[1])
with zipfile.ZipFile(path) as package:
    xml = package.read("word/document.xml").decode("utf-8")
    anchors = re.findall(r'w:hyperlink[^>]+w:anchor="([^"]+)', xml)
    bookmarks = set(re.findall(r'w:bookmarkStart[^>]+w:name="([^"]+)', xml))
    contextual = [anchor for anchor in anchors if anchor.startswith("xref_")]
    missing = sorted(set(contextual) - bookmarks)
    media = [name for name in package.namelist() if name.startswith("word/media/")]

result = {
    "hyperlinks": len(anchors),
    "contextualXrefs": len(contextual),
    "xrefBookmarks": sum(name.startswith("xref_") for name in bookmarks),
    "missingTargets": missing,
    "mediaFiles": len(media),
}
print(result)
if missing:
    raise SystemExit(1)
