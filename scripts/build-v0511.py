"""Build V0.5.1.1 from preserved V0.5.1, changing only derived accounting and labels."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'荒謬市長_v0.5.1.html').read_text(encoding='utf-8')
for before,after in [('assets/v51-finance.js','assets/v0511-finance.js'),('assets/v51-presentation.js','assets/v0511-presentation.js')]:
    old=(root/before).read_text(encoding='utf-8')
    assert s.count(old)==1,before
    s=s.replace(old,(root/after).read_text(encoding='utf-8'))
(root/'荒謬市長_v0.5.1.1.html').write_bytes(s.encode('utf-8'))
print('Built offline V0.5.1.1:',len(s.encode('utf-8')),'bytes')
