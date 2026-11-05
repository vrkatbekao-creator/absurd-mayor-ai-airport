"""Build the offline V0.5.2 game from the immutable V0.5.1.1 release."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'荒謬市長_v0.5.1.1.html').read_text(encoding='utf-8')
start=s.index('function fresh(){')
end=s.index('</script><script>',start)
s=s[:start]+s[end:]
s=s.replace('<script>','<script id="v052-data">',1)
s=s.replace('</script><script>','</script><script id="v052-engine">',1)
marker="document.getElementById('v041-jump').addEventListener"
assert s.count(marker)==1
s=s.replace(marker,'/* V052_ENGINE_END: stable boundary before browser bootstrap. */\n'+marker)
s=s.replace('V0.5.1.1','V0.5.2')
# Subsequent checkpoints supply presentation-only extensions here.
addon=root/'assets/v052-narrative.js'
if addon.exists():
    code=addon.read_text(encoding='utf-8')
    anchor="const VKEY='absurd-mayor-v51'"
    assert s.count(anchor)==1
    s=s.replace(anchor,code+'\n'+anchor)
    s=s.replace('function mountV51(){configureV51();','function mountV51(){configureV51();configureV052();')
    s=s.replace('${epilogue51()}${promiseAudit()}','${assessmentPanel52()}${epilogue51()}${promiseAudit()}')
    s=s.replace('${promises().filter(Boolean).length}/3','${esc(pledgeSummary52(game))}')
    s=s.replace("document.getElementById('news').textContent=last?msg(last.key):msg('intro');","document.getElementById('news').textContent=last?milestoneText52(game,last):msg('intro');")
    s=s.replace("if(e.kind==='milestone')return msg(e.key);","if(e.kind==='milestone')return milestoneText52(game,e);")
    before="if(e.kind==='milestone')return [e.key.startsWith('milestone4')?'employee':e.key.startsWith('milestone8')?'engineer':'reporter',e.key.replace('milestone','checkpoint')];"
    after="if(e.kind==='milestone')return milestoneReaction52(game,e);"
    assert before in s
    s=s.replace(before,after)
    if 'function epilogue52(' in code:
        s=s.replace('${epilogue51()}${promiseAudit()}','${epilogue52()}${promiseAudit()}')
    if (root/'assets/v052.css').exists():
        s=s.replace('</style>',(root/'assets/v052.css').read_text(encoding='utf-8')+'\n</style>')
(root/'荒謬市長_v0.5.2.html').write_bytes(s.encode('utf-8'))
print('Built offline V0.5.2:',len(s.encode('utf-8')),'bytes')
