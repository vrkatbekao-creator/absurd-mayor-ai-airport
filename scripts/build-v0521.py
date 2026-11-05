"""Build V0.5.2.1 from the immutable V0.5.2 release; presentation only."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'荒謬市長_v0.5.2.html').read_text(encoding='utf8')
s=s.replace('V0.5.2','V0.5.2.1')
before="if(a==='close'){document.getElementById('modal').innerHTML='';document.querySelector('[data-v2=\"policy\"]')?.focus()}"
after="if(a==='close'){document.getElementById('modal').innerHTML='';document.querySelector('[data-v2=\"policy\"]')?.focus();return}"
assert before in s
s=s.replace(before,after)
before="if(a==='restart'&&confirm(msg('confirm'))){game=newGame();"
after="if(a==='restart'){if(!confirm(msg('confirm')))return;game=newGame();"
assert before in s
s=s.replace(before,after)
before="const buttons=[...dialog.querySelectorAll('button:not([disabled]),summary,a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')];"
after=before[:-1]+".filter(dialogFocusable521);"
assert before in s
s=s.replace(before,after)
s=s.replace("select.value=lang;select.addEventListener", "select.value=lang;select.setAttribute('aria-label',languageName521());select.addEventListener")
s=s.replace("lang=select.value;let active=", "lang=select.value;select.setAttribute('aria-label',languageName521());let active=")
code=(root/'assets/v0521-accessibility.js').read_text(encoding='utf8')
anchor="const VKEY='absurd-mayor-v51'"
assert s.count(anchor)==1
s=s.replace(anchor,code+'\n'+anchor)
reading=root/'assets/v0521-reading.js'
if reading.exists():
    s=s.replace(anchor,reading.read_text(encoding='utf8')+'\n'+anchor)
    a=s.index('function showEnd(){');b=s.index('function showIntro',a)
    s=s[:a]+"function showEnd(){showReadingEnd521()}\n"+s[b:]
css=root/'assets/v0521.css'
if css.exists():s=s.replace('</style>',css.read_text(encoding='utf8')+'\n</style>')
(root/'荒謬市長_v0.5.2.1.html').write_bytes(s.encode('utf8'))
print('Built V0.5.2.1:',len(s.encode('utf8')),'bytes')
