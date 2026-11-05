/* V0.5.2 assessments are derived views. They never change saved data or game rules. */
const N52={
 assessment:L('任期的兩種評價','Two views of the term','Deux bilans du mandat','Twee beoordelingen van de termijn'),
 industry:L('產業成果','Industrial outcome','Résultat industriel','Industrieel resultaat'),
 politics:L('政治承諾','Political commitment','Engagement politique','Politieke belofte'),
 coexist:L('機場與 AI 共存','Airport and AI coexist','Aéroport et IA coexistent','Luchthaven en AI bestaan samen'),
 mixed:L('縮減機場的 AI 轉型','AI transition with a smaller airport','Transition IA et aéroport réduit','AI-transitie met kleinere luchthaven'),
 replacement:L('停飛後的 AI 成果','AI results after flights stop','Résultats IA après l’arrêt des vols','AI-resultaat na het stoppen van vluchten'),
 growing:L('AI 設施正在累積成果','AI facilities are building results','Les équipements IA produisent des résultats','AI-voorzieningen bouwen resultaat op'),
 policyOnly:L('有政策實績，尚無 AI 產出','Policy progress, no operating AI output','Progrès politiques, sans production IA effective','Beleidsvoortgang zonder werkelijke AI-productie'),
 green:L('綠地優先的轉型','A green-space-first transition','Transition axée sur les espaces verts','Transitie met voorrang voor groen'),
 airportOnly:L('機場營運保留','Airport operations retained','Activité aéroportuaire préservée','Luchthavenactiviteiten behouden'),
 stalled:L('服務與新產業仍待銜接','Services and new industry need a bridge','Services et nouvelle industrie restent à relier','Diensten en nieuwe industrie missen aansluiting'),
 shortage:L('供電不足，產出受限','Power shortage limits output','La pénurie limite la production','Stroomtekort beperkt de productie'),
 publicity:L('宣傳先行，實際產出待補','Publicity leads; output must follow','La publicité devance la production','Publiciteit loopt voor op productie'),
 industryHelp:L('依目前營運、實績與供電判讀；不等於真實就業或碳排放。','Based on current operations, score and power; not a count of real jobs or emissions.','Selon l’activité, les résultats et l’électricité ; ni emplois ni émissions réels.','Gebaseerd op exploitatie, score en stroom; geen telling van echte banen of uitstoot.'),
 retained:L('關場宣示已轉彎','The closure announcement was reversed','L’annonce de fermeture a été révisée','Het sluitingsvoornemen is teruggedraaid'),
 partial:L('關場宣示尚未完全執行','The closure announcement is only partly implemented','La fermeture annoncée reste partielle','De aangekondigde sluiting is gedeeltelijk uitgevoerd'),
 closed:L('航班已停止，代價仍須交代','Flights stopped; the costs still need an account','Les vols ont cessé ; les coûts restent à expliquer','Vluchten gestopt; de kosten vragen uitleg'),
 politicsHelp:L('原關場宣示與三項量化政見分開檢驗。產業有成果，不會自動消除改口、債務或民意代價。','The closure announcement and three measurable pledges are assessed separately. Results do not erase a reversal, promise debt or public concern.','La fermeture annoncée et les trois objectifs sont évalués séparément. Les résultats n’effacent ni revirement, ni dette électorale, ni inquiétudes.','Het sluitingsvoornemen en drie meetbare beloften worden apart beoordeeld. Resultaat wist een ommezwaai, belofteschuld of zorgen niet uit.'),
 verified:L('可核實目標','Verifiable targets','Objectifs vérifiables','Verifieerbare doelen'),
 financeUnknown:L('財務承諾缺少完整歷史，無法核實','The financial pledge lacks a complete history and cannot be verified','Historique financier incomplet : promesse invérifiable','De financiële belofte is door ontbrekende historie niet te verifiëren'),
 revised:L('已公開修正不出錢的宣示；仍按原量化門檻列出審計結果。','The no-spending statement was publicly revised; the audit still applies its original measurable threshold.','La déclaration de dépense nulle a été révisée ; l’audit conserve le seuil quantifié initial.','De uitspraak over geen uitgaven is herzien; de controle gebruikt nog de oorspronkelijke meetbare grens.'),
 m4Coexist:L('第 4 回合：機場本體保留，其他地塊的 AI 設施已投入運作。','Turn 4: the airport itself remained; AI facilities on other plots were operating.','Tour 4 : l’aéroport était préservé ; des équipements IA fonctionnaient sur d’autres parcelles.','Ronde 4: de luchthaven bleef behouden; AI-voorzieningen op andere percelen draaiden.'),
 m4Airport:L('第 4 回合：機場地塊已改建，工作與服務銜接仍須追蹤。','Turn 4: airport plots were redeveloped; the transition of workers and services still needed tracking.','Tour 4 : des parcelles aéroportuaires étaient reconverties ; salariés et services restaient à suivre.','Ronde 4: luchthavenpercelen waren herontwikkeld; werknemers en diensten vroegen opvolging.'),
 m4Other:L('第 4 回合：其他地塊已有建設，機場尚未改建；AI 產出仍待證明。','Turn 4: other plots had construction; the airport was unchanged and AI output still needed proof.','Tour 4 : d’autres parcelles étaient aménagées ; aéroport inchangé, production IA à démontrer.','Ronde 4: elders was gebouwd; de luchthaven was ongewijzigd en AI-productie moest nog blijken.'),
 m4None:L('第 4 回合：機場本體保留，尚無運作中的 AI 設施。','Turn 4: the airport remained; no AI facilities were operating.','Tour 4 : l’aéroport était préservé, sans équipement IA en activité.','Ronde 4: de luchthaven bleef behouden; er draaiden geen AI-voorzieningen.'),
 m8NoOutput:L('第 8 回合：政策實績分已記錄，尚無運作中的 AI 設施。','Turn 8: policy progress was recorded, but no AI facilities were operating.','Tour 8 : des progrès politiques étaient consignés, sans équipement IA en activité.','Ronde 8: beleidsvoortgang stond genoteerd, maar er draaiden geen AI-voorzieningen.'),
 m8Short:L('第 8 回合：供電不足限制實際產出，累計實績不能代替當期供電。','Turn 8: insufficient power limited output; the accumulated score could not replace working power.','Tour 8 : l’électricité insuffisante limitait la production ; le score cumulé ne la remplaçait pas.','Ronde 8: stroomtekort beperkte de productie; de totaalscore verving geen werkende voeding.'),
 m8Working:L('第 8 回合：AI 設施正在運作，累計目標、資金與服務代價分別核對。','Turn 8: AI facilities were operating; targets, funding and service costs were checked separately.','Tour 8 : les équipements IA fonctionnaient ; objectifs, financement et services étaient vérifiés séparément.','Ronde 8: AI-voorzieningen draaiden; doelen, financiering en diensten werden apart getoetst.'),
 historyUnknown:L('檢驗點已記錄；舊歷史不足，無法還原當時全部建設情境。','The checkpoint is recorded; incomplete history cannot reconstruct all construction at that time.','Le bilan est consigné ; l’historique incomplet ne permet pas de reconstituer tous les travaux.','Het meetmoment is vastgelegd; onvolledige historie kan de toenmalige bebouwing niet volledig reconstrueren.'),
 checkpoint4Coexist:L('「我看得到其他地塊已經動工。機場仍在運作，轉職與服務承諾要分開追蹤。」','“I can see the work on other plots. The airport is operating; retraining and service commitments still need separate follow-up.”','« Je vois les travaux ailleurs. L’aéroport fonctionne ; reconversion et services restent à suivre séparément. »','“Ik zie de werkzaamheden elders. De luchthaven draait; omscholing en diensten vragen nog eigen opvolging.”'),
 checkpoint4Other:L('「不能說完全沒有建設；但這些工地如何帶來 AI 成果，還要交代。」','“There is construction. How these sites will deliver AI results still needs an answer.”','« Il y a des travaux. Il reste à expliquer comment ils donneront des résultats IA. »','“Er wordt gebouwd. Hoe die locaties AI-resultaat opleveren vraagt nog uitleg.”'),
 checkpoint8NoOutput:L('「實績分與在運作的設備是兩件事。我會把兩者都放進驗收報告。」','“A progress score and working facilities are different things. The inspection will report both.”','« Un score et des équipements en activité sont deux choses différentes. Le bilan présentera les deux. »','“Een voortgangsscore en werkende voorzieningen zijn verschillende dingen. Het verslag toont beide.”'),
 checkpointHistoryUnknown:L('「當時的完整紀錄不在，我只能確認已保存的檢驗點，不替過去補故事。」','“The full record is missing. I can confirm the saved checkpoint, without inventing its past.”','« Le dossier complet manque. Je confirme le bilan conservé, sans inventer son passé. »','“Het volledige dossier ontbreekt. Ik bevestig het bewaarde meetmoment, zonder het verleden in te vullen.”')
};
const nt=k=>N52[k][lang];
function configureV052(){for(const [k,value] of Object.entries(N52))F51[k]=value;M.revised=N52.revised}
function physical52(g){const m=metrics(g);return {m,actual:m.demand>m.supply?Math.floor(m.ai/2):m.ai,hasConstruction:g.tiles.some(t=>t.type!=='original')}}
function industryKey52(g){const {m,actual}=physical52(g);
 if(m.demand>m.supply)return 'shortage';
 if(actual>0&&g.ai>=50)return m.traffic===80?'coexist':m.traffic>0?'mixed':'replacement';
 if(actual>0)return 'growing';if(m.parks>=2)return 'green';
 if(g.hype>=45&&g.hype>g.ai*1.3)return 'publicity';if(g.ai>0)return 'policyOnly';return m.traffic>0?'airportOnly':'stalled';
}
function assessment52(g=game){const {m,actual}=physical52(g),p=promises(g);return {industry:industryKey52(g),politics:m.traffic===80?'retained':m.traffic>0?'partial':'closed',traffic:m.traffic,ai:g.ai,actual,power:m.supply-m.demand,parks:m.parks,verified:g.finance.legacy?2:3,met:(g.finance.legacy?p.slice(0,2):p).filter(Boolean).length,financeUnknown:g.finance.legacy,pop:g.pop,debt:g.debt}}
function pledgeSummary52(g=game){const a=assessment52(g);return a.met+'/'+a.verified+(a.financeUnknown?' · '+nt('financeUnknown'):'')}
function historyState52(g,e){
 if(g.story.incomplete)return {known:false};let end=g.story.events.indexOf(e);
 if(end<0)end=g.story.events.findIndex(x=>x.kind==='milestone'&&x.key===e.key&&x.turn===e.turn);
 if(end<0)return {known:false};
 const view={known:true,ai:0,hype:0,tiles:initialTiles.map(([icon,name,traffic])=>({icon,name,traffic,type:'original'}))};
 for(const x of g.story.events.slice(0,end+1)){
  if(x.kind==='policy'){const d=cards[x.card][2][x.option][2];view.ai=Math.max(0,view.ai+(d.ai||0));view.hype=Math.max(0,view.hype+(d.hype||0))}
  if(x.kind==='admin'){const d=municipal[x.key];view.ai=Math.max(0,view.ai+(d.ai||0));view.hype=Math.max(0,view.hype+(d.hype||0))}
  if(x.kind==='build'){const b=builds[x.type];view.tiles[x.plot]={type:x.type,name:b.name,icon:b.icon,traffic:0,level:1};view.hype+=b.hype}
  if(x.kind==='upgrade'){const t=view.tiles[x.plot];if(t.type!=='original')t.level=2;if(t.type==='show')view.hype+=5}
  if(x.kind==='settlement')view.ai+=x.production;
  if(x.kind==='consequence'&&x.card!==null){const d=cards[x.card][2][x.option][3]?.[1];if(d){view.ai=Math.max(0,view.ai+(d.ai||0));view.hype=Math.max(0,view.hype+(d.hype||0))}}
 }return view;
}
function milestoneText52(g,e){const view=historyState52(g,e);if(!view.known)return nt('historyUnknown');const {m,actual,hasConstruction}=physical52(view);
 if(e.turn===4)return nt(m.redeveloped>0?'m4Airport':actual>0?'m4Coexist':hasConstruction?'m4Other':'m4None');
 if(e.turn===8)return nt(m.demand>m.supply?'m8Short':actual>0?'m8Working':'m8NoOutput');return msg('milestone12');
}
function milestoneReaction52(g,e){const role=e.turn===4?'employee':e.turn===8?'engineer':'reporter',view=historyState52(g,e);if(!view.known)return [role,'checkpointHistoryUnknown'];const {m,actual,hasConstruction}=physical52(view);
 if(e.turn===4)return [role,m.redeveloped>0?'checkpoint4a':actual>0?'checkpoint4Coexist':hasConstruction?'checkpoint4Other':'checkpoint4b'];
 if(e.turn===8)return [role,actual===0?'checkpoint8NoOutput':m.demand>m.supply?'checkpoint8b':'checkpoint8a'];return [role,'checkpoint12'];
}
function assessmentPanel52(){const a=assessment52(),facts=[[VIS[lang].traffic,a.traffic+'/80'],VIS[lang].ai?[VIS[lang].ai,a.ai+'/50']:[],[UX[lang].production,a.actual],[UX[lang].grid,a.power]].filter(x=>x.length);
 return '<section class="v052-assessment" aria-labelledby="v052-assessment-title"><h3 id="v052-assessment-title">'+esc(nt('assessment'))+'</h3><div class="v052-assessment-grid"><article data-industry="'+a.industry+'"><small>'+esc(nt('industry'))+'</small><h4>'+esc(nt(a.industry))+'</h4><p>'+esc(nt('industryHelp'))+'</p><dl>'+facts.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl></article><article data-politics="'+a.politics+'"><small>'+esc(nt('politics'))+'</small><h4>'+esc(nt(a.politics))+'</h4><p>'+esc(nt('politicsHelp'))+'</p><dl>'+[[nt('verified'),pledgeSummary52()],[VIS[lang].pop,a.pop],[msg('debt'),a.debt]].map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl></article></div></section>';
}
