(() => {
  const locales = { zh: 'zh-Hant', en: 'en', fr: 'fr', nl: 'nl' };
  const translations = {
    zh: {
      description: '荒謬市長是一款四語、12 回合的開源城市策略小品。在機場、AI 園區和競選承諾之間，決定你要留下什麼樣的城市。',
      pageTitle: '荒謬市長｜AI 起飛，飛機停飛！',
      skip: '跳至主要內容',
      navigation: '網站導覽',
      navPlay: '怎麼玩',
      navScreens: '遊戲畫面',
      language: '頁面語言',
      edition: 'V0.6.0 · 開源城市策略小品',
      title: '荒謬市長',
      slogan: 'AI 起飛，飛機停飛！',
      intro: '機場明明還在營運，市府卻宣布要改建成 AI 園區。接下來 12 回合，機場要留下多少、城市要花多少、競選承諾要怎麼兌現，都由你決定。',
      playOnline: '線上試玩',
      download: '下載離線版',
      nightAlt: '遊戲夜景中，跑道旁蓋起數棟不同高度的建築，底部顯示市政操作列。',
      nightCaption: 'V0.6.0 實機畫面 · 第 12 回合的機場小城',
      term: '12 回合任期',
      turnTitle: '一回合，三個步驟',
      step1Title: '選一項政策',
      step1: '看清眼前收益、政治代價與延後影響，再從三個選項中決定。',
      step2Title: '做一項市政行動',
      step2: '建設、升級、執行行政措施，或暫緩行動。',
      step3Title: '結算並看城市變化',
      step3: '檢查航班、財政、民意與 AI 產業實績，再進入下一回合。',
      screensEdition: 'V0.6.0 實機畫面',
      screensTitle: '從地圖讀城市',
      screensText: '建築會逐層長高。手機上的政策與財政從底部浮出，圖示、數值先呈現重點，完整說明可展開。',
      dayAlt: '白天的等角城市地圖可見跑道、塔樓、園區與綠地。',
      dayCaption: '城市日景與底部市政操作列',
      mobileAlt: '手機上顯示跑道夜市政策和三個圖像化選項，各選項標出財政、民意或政見變化。',
      mobileCaption: '手機上的政策選擇',
      licenseTag: '公開原始碼 · MIT',
      projectTitle: '遊戲與原始碼都能帶走',
      projectText: '離線版只需一個 HTML 檔，下載後以瀏覽器開啟。遊戲進度儲存在瀏覽器，線上版和本機檔案的儲存空間可能不同。',
      source: '原始碼與專案說明',
      qa: 'V0.6.0 驗收記錄',
      license: 'MIT 授權',
      footer: '荒謬市長 · V0.6.0',
    },
    fr: {
      description: 'Un jeu de stratégie urbaine libre en 12 tours, entre un aéroport en activité, un quartier dédié à l’IA et des promesses électorales.',
      pageTitle: 'Maire absurde | L’IA décolle, les avions restent au sol !',
      skip: 'Aller au contenu principal',
      navigation: 'Navigation du site',
      navPlay: 'Comment jouer',
      navScreens: 'Captures d’écran',
      language: 'Langue de la page',
      edition: 'V0.6.0 · Jeu de stratégie urbaine libre',
      title: 'Maire absurde',
      slogan: 'L’IA décolle, les avions restent au sol !',
      intro: 'L’aéroport est toujours en activité, mais la mairie veut le transformer en quartier dédié à l’IA. En 12 tours, décidez quelle part de l’aéroport préserver, ce que la ville peut financer et quelles promesses électorales tenir.',
      playOnline: 'Jouer en ligne',
      download: 'Télécharger la version hors ligne',
      nightAlt: 'De nuit, des bâtiments de différentes hauteurs bordent la piste. Les commandes de la ville sont en bas de l’écran.',
      nightCaption: 'Capture de la V0.6.0 · La ville aéroportuaire au 12ᵉ tour',
      term: 'Un mandat de 12 tours',
      turnTitle: 'Trois étapes par tour',
      step1Title: 'Choisir une politique',
      step1: 'Comparez les gains immédiats, le coût politique et les effets différés des trois options.',
      step2Title: 'Mener une action municipale',
      step2: 'Construisez, améliorez un bâtiment, adoptez une mesure municipale ou reportez votre action.',
      step3Title: 'Faire le bilan',
      step3: 'Consultez les vols, les finances, le soutien de la population et les résultats du secteur de l’IA avant le tour suivant.',
      screensEdition: 'Captures de la V0.6.0',
      screensTitle: 'Lire la ville sur la carte',
      screensText: 'Les bâtiments grandissent étage par étage. Sur téléphone, les panneaux de politique et de finances s’ouvrent depuis le bas. Les icônes et les chiffres résument l’essentiel. Vous pouvez déplier les détails.',
      dayAlt: 'Vue isométrique de jour avec la piste, les tours, le quartier dédié à l’IA et les espaces verts.',
      dayCaption: 'La ville de jour et les commandes en bas de l’écran',
      mobileAlt: 'Sur téléphone, un projet de marché nocturne sur la piste est présenté avec trois choix illustrés et leurs effets.',
      mobileCaption: 'Choisir une politique sur téléphone',
      licenseTag: 'Code source ouvert · MIT',
      projectTitle: 'Emportez le jeu et son code source',
      projectText: 'Téléchargez le fichier HTML et ouvrez-le dans un navigateur pour jouer hors ligne. Votre progression est enregistrée dans le navigateur. Les versions en ligne et hors ligne peuvent avoir des sauvegardes distinctes.',
      source: 'Code source et présentation du projet',
      qa: 'Rapport de tests de la V0.6.0',
      license: 'Licence MIT',
      footer: 'Maire absurde · V0.6.0',
    },
    nl: {
      description: 'Een opensource-strategiespel in 12 rondes over een luchthaven in bedrijf, een AI-wijk en verkiezingsbeloften.',
      pageTitle: 'Absurd Burgemeester | AI stijgt op, vliegtuigen blijven aan de grond!',
      skip: 'Naar de hoofdinhoud',
      navigation: 'Sitenavigatie',
      navPlay: 'Speluitleg',
      navScreens: 'Spelbeelden',
      language: 'Taal van de pagina',
      edition: 'V0.6.0 · Opensource-strategiespel',
      title: 'Absurd Burgemeester',
      slogan: 'AI stijgt op, vliegtuigen blijven aan de grond!',
      intro: 'De luchthaven is nog in bedrijf, maar het stadsbestuur wil er een AI-wijk van maken. In 12 rondes bepaal je hoeveel van de luchthaven blijft, wat de stad kan betalen en welke verkiezingsbeloften je nakomt.',
      playOnline: 'Speel online',
      download: 'Download de offlineversie',
      nightAlt: 'Naast de landingsbaan staan ’s nachts gebouwen van verschillende hoogtes. Onderaan staan de knoppen voor het stadsbestuur.',
      nightCaption: 'Spelbeeld V0.6.0 · De luchthavenstad in ronde 12',
      term: 'Een ambtstermijn van 12 rondes',
      turnTitle: 'Drie stappen per ronde',
      step1Title: 'Kies een beleidsoptie',
      step1: 'Weeg de directe voordelen, politieke kosten en gevolgen op langere termijn van drie opties af.',
      step2Title: 'Neem een gemeentelijke actie',
      step2: 'Bouw, verbeter een gebouw, voer een maatregel in of stel een actie uit.',
      step3Title: 'Bekijk de resultaten',
      step3: 'Bekijk de vluchten, de financiën, het draagvlak en de resultaten van de AI-sector voordat je verdergaat.',
      screensEdition: 'Spelbeelden van V0.6.0',
      screensTitle: 'Bekijk hoe de stad groeit',
      screensText: 'Gebouwen groeien verdieping voor verdieping. Op je telefoon verschijnen beleidskeuzes en financiën onderaan. Pictogrammen en cijfers tonen de belangrijkste informatie. Je kunt de details uitklappen.',
      dayAlt: 'Isometrische stadskaart bij daglicht met de landingsbaan, torens, de AI-wijk en groenvoorzieningen.',
      dayCaption: 'De stad overdag met de bedieningsbalk onderaan',
      mobileAlt: 'Op een telefoon zie je een voorstel voor een avondmarkt op de landingsbaan met drie geïllustreerde keuzes en hun gevolgen.',
      mobileCaption: 'Een beleidskeuze op je telefoon',
      licenseTag: 'Open source · MIT',
      projectTitle: 'Neem het spel en de broncode mee',
      projectText: 'Download het HTML-bestand en open het in je browser om offline te spelen. Je voortgang wordt in de browser opgeslagen. De online- en offlineversie kunnen aparte opslag gebruiken.',
      source: 'Broncode en projectinformatie',
      qa: 'Testrapport van V0.6.0',
      license: 'MIT-licentie',
      footer: 'Absurd Burgemeester · V0.6.0',
    },
  };

  const storageKey = 'absurd-mayor-showcase-language';
  const selector = document.getElementById('site-language');
  const fields = Array.from(document.querySelectorAll('[data-i18n]'), element => {
    const attribute = element.dataset.i18nAttr;
    return {
      element,
      attribute,
      key: element.dataset.i18n,
      english: attribute ? element.getAttribute(attribute) : element.textContent,
    };
  });

  function render(language) {
    document.documentElement.lang = locales[language];
    selector.value = language;
    for (const { element, attribute, key, english } of fields) {
      const value = translations[language]?.[key] ?? english;
      if (attribute) element.setAttribute(attribute, value);
      else element.textContent = value;
    }
  }

  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem(storageKey);
  } catch {
    // The picker still works when browser storage is unavailable.
  }
  const browserLanguage = (navigator.languages?.[0] || navigator.language || '').toLowerCase().split('-')[0];
  const defaultLanguage = Object.hasOwn(locales, browserLanguage) ? browserLanguage : 'en';
  render(Object.hasOwn(locales, savedLanguage) ? savedLanguage : defaultLanguage);

  selector.hidden = false;
  selector.addEventListener('change', () => {
    render(selector.value);
    try {
      localStorage.setItem(storageKey, selector.value);
    } catch {
      // Keep the current selection even if it cannot be saved.
    }
  });
})();
