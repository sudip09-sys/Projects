"""Package Sudip Lab source and runnable builds; excludes Git, dependencies and downloads."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE = {'.git', 'node_modules', '.angular', '__pycache__', 'downloads', 'dist'}

def package(output):
    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in ROOT.rglob('*') if p.is_file() and not p.is_symlink()
                   and not (set(p.relative_to(ROOT).parts) & EXCLUDE) and p.resolve() != output)
    with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
        for file in files:
            archive.write(file, 'sudip-lab/' + file.relative_to(ROOT).as_posix())
    with ZipFile(output) as archive:
        names = archive.namelist()
        assert len(names) == len(set(names)), 'Duplicate package entries'
        for app in ['memory-match', 'melody-studio', 'signal-chat']:
            assert f'sudip-lab/projects/{app}/index.html' in names, f'Missing project: {app}'
        assert not any(Path(name).suffix.lower() in {'.pdf', '.mp3', '.mp4', '.pptx'} for name in names), 'Unexpected lecture media'
    print(f'Packaged {len(files)} files: {output}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT/'downloads'/'sudip-lab-code.zip')
    package(parser.parse_args().output)
