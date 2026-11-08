from pathlib import Path
import json
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parent.parent
package_root = root / "release" / "weather-widget"
dist = root / "dist"
manifest = root / "plugin.json"
version = json.loads(manifest.read_text(encoding="utf-8"))["version"]
output = root / "release" / f"iracing-weather-widget-v{version}.zip"

package_root.mkdir(parents=True, exist_ok=True)
(package_root / "dist").mkdir(parents=True, exist_ok=True)
(package_root / "plugin.json").write_bytes(manifest.read_bytes())
for asset in dist.iterdir():
    if asset.is_file():
        (package_root / "dist" / asset.name).write_bytes(asset.read_bytes())

with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    for file in sorted(package_root.rglob("*")):
        if file.is_file():
            archive.write(file, file.relative_to(root / "release"))

print(f"Created {output}")
