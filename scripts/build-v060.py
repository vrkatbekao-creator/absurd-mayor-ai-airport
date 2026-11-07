"""Build the map-first development snapshot from the immutable V0.5.2 release."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'荒謬市長_v0.5.2.html').read_text(encoding='utf8').replace('V0.5.2','V0.6.0')
patches={
 "let lang;try{lang=localStorage.getItem('absurd-mayor-language')||'zh'}catch(_){lang='zh'}if(!['zh','en','fr','nl'].includes(lang))lang='zh';":"""const languageKey='absurd-mayor-language';
const supportedLanguages=['zh','en','fr','nl'];
const browserLocale=globalThis.navigator?.languages?.[0]||globalThis.navigator?.language||'';
const browserLanguage=browserLocale.toLowerCase().split('-')[0];
let lang=supportedLanguages.includes(browserLanguage)?browserLanguage:'en';
try{const savedLanguage=localStorage.getItem(languageKey);if(supportedLanguages.includes(savedLanguage))lang=savedLanguage}catch(_){}""",
 "localStorage.setItem(VKEY,JSON.stringify(game));localStorage.setItem('absurd-mayor-language',lang)": "localStorage.setItem(VKEY,JSON.stringify(game))",
 "if(a==='close'){document.getElementById('modal').innerHTML='';document.querySelector('[data-v2=\"policy\"]')?.focus()}":"if(a==='close'){document.getElementById('modal').innerHTML='';document.querySelector('[data-v2=\"policy\"]')?.focus();return}",
 "if(a==='restart'&&confirm(msg('confirm'))){game=newGame();":"if(a==='restart'){if(!confirm(msg('confirm')))return;game=newGame();",
 "const buttons=[...dialog.querySelectorAll('button:not([disabled]),summary,a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')];":"const buttons=[...dialog.querySelectorAll('button:not([disabled]),summary,a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')].filter(dialogFocusable521);"
}
for before,after in patches.items():
 assert before in s,before
 s=s.replace(before,after)
s=s.replace("select.value=lang;select.addEventListener", "select.value=lang;select.setAttribute('aria-label',languageName521());select.addEventListener")
s=s.replace("lang=select.value;let active=", "lang=select.value;try{localStorage.setItem(languageKey,lang)}catch(_){}select.setAttribute('aria-label',languageName521());let active=")
anchor="const VKEY='absurd-mayor-v51'"
for name in ['v060-accessibility.js','v060-reading.js']:
 s=s.replace(anchor,(root/'assets'/name).read_text(encoding='utf8')+'\n'+anchor)
a=s.index('function showEnd(){');b=s.index('function showIntro',a)
s=s[:a]+'function showEnd(){showReadingEnd521()}\n'+s[b:]
for name in ['v060-reading.css','v060.css','v060-art.css']:
 s=s.replace('</style>',(root/'assets'/name).read_text(encoding='utf8')+'\n</style>')
city=(root/'assets/v060-city.js').read_text(encoding='utf8')
for marker,name in [('/* V060_FACILITIES */','v060-facilities.js'),('/* V060_ART */','v060-art.js'),('/* V060_LIFE */','v060-life.js')]:
 assert city.count(marker)==1,marker
 city=city.replace(marker,(root/'assets'/name).read_text(encoding='utf8'))
s=s.replace('</body>','<script id="v060-city">\n'+city+'\n</script></body>')
target=root/'荒謬市長_v0.6.0.html'
temporary=target.with_suffix('.building')
temporary.write_bytes(s.encode('utf8'))
temporary.replace(target)
print('Built V0.6.0 development snapshot:',len(s.encode('utf8')),'bytes')
