from pathlib import Path
import zipfile
root=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(root/'dist/source.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in root.rglob('*'):
        rel=f.relative_to(root)
        if f.is_file() and not any(s.startswith('.') for s in rel.parts) and f.name!='source.zip':
            z.write(f,'ashby-health-check/'+str(rel))
print(root/'dist/source.zip')
