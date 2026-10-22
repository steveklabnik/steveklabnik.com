"""Compare an original full-history build with a capped build.

Usage: python3 scripts/check-rss-build.py ORIGINAL_DIST [CAPPED_DIST]
No dependencies beyond Python's standard library. Prints measured byte sizes.
"""
import gzip
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

baseline = Path(sys.argv[1])
current = Path(sys.argv[2] if len(sys.argv) > 2 else "dist")
limit = 20


def tree(element):
    return (element.tag, sorted(element.attrib.items()), element.text or "",
            element.tail or "", tuple(tree(child) for child in element))


measurements = []
for original_file in sorted(baseline.rglob("feed.xml")):
    relative = original_file.relative_to(baseline)
    before = original_file.read_bytes()
    after = (current / relative).read_bytes()
    original = ET.fromstring(before)
    capped = ET.fromstring(after)
    old_items = original.findall("./channel/item")
    new_items = capped.findall("./channel/item")
    assert len(new_items) == min(limit, len(old_items)), relative
    # Compare every field, including GUID attributes and decoded full HTML.
    assert list(map(tree, new_items)) == list(map(tree, old_items[:limit])), relative
    dates = [parsedate_to_datetime(item.findtext("pubDate")) for item in new_items]
    assert dates == sorted(dates, reverse=True), relative
    guids = [item.findtext("guid") for item in new_items]
    assert len(set(guids)) == len(guids), relative
    assert capped.findtext("./channel/ttl") == "15", relative
    measurements.append({
        "path": str(relative), "originalItems": len(old_items),
        "cappedItems": len(new_items), "before": len(before), "after": len(after),
        "gzipBefore": len(gzip.compress(before, mtime=0)),
        "gzipAfter": len(gzip.compress(after, mtime=0)),
    })

old_paths = {p.relative_to(baseline) for p in baseline.rglob("*") if p.is_file()}
new_paths = {p.relative_to(current) for p in current.rglob("*") if p.is_file()}
assert old_paths == new_paths, "Generated file paths changed"
non_feed_paths = [path for path in old_paths if path.name != "feed.xml"]
changed = [str(path) for path in non_feed_paths
           if (baseline / path).read_bytes() != (current / path).read_bytes()]
assert not changed, f"Non-feed files changed: {changed}"
assert measurements, "No feeds found"
print(json.dumps({"feeds": measurements,
                  "nonFeedUnchanged": len(non_feed_paths)}, indent=2))
