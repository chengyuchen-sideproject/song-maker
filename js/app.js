/**
 * 歌曲製造機 Pro (Song Maker Pro)
 * 功能：
 * 1. 解析 YouTube 參考歌曲網址曲風基因 (預設：ICE & 李榮浩《王牌冤家》Live 版 lEKuorDbaCQ)
 * 2. 結合近期台股與美股話題 (輝達黃仁勳回歸、台積電 CoWoS、暴漲暴跌極致洗盤、關稅與聯準會、限空令多空對決)
 * 3. 一鍵生成 Suno AI 直接可用 Prompt (Style of Music, Title, Exclude, Custom Meta-Tag Lyrics)
 * 4. 支援 中文版 / 英文版 / 中英雙語對照 切換
 * 5. 生成 YouTube 高點閱建議標題、完整描述、時間軸與 SEO Hashtags
 * 6. 內建 Web Audio API 即時合成該曲風 Groove 伴奏預覽
 */

const KNOWN_YT_REFS = {
  "MywfB-ZXe8o": {
    title: "福克斯 FOX《慶功酒 (Jungle Juice)》國風戲腔江湖說唱",
    bpm: 95,
    preset: "fox-victorywine",
    vibe: "京劇老生戲腔取樣開場 × 古箏竹笛融合現代 Trap 808 (95 BPM) × 武俠豪傑傲骨敘事 Flow × 豪邁舉杯旋律副歌 (Turn it up / Drink up)",
    dna: ["🎭 京劇老生戲腔開場", "🪕 古箏/竹笛 × Trap 808", "⚔️ 武俠豪傑江湖敘事 Flow", "🍶 豪邁舉杯副歌 (Turn it up!)"]
  },
  GNPZZ55pBck: {
    title: "法老 PHARAOH《Ghost Face》硬核敘事技術流快嘴",
    bpm: 93,
    preset: "pharaoh-ghostface",
    vibe: "自傳敘事意識說唱 (Conscious Boom-Bap, 93 BPM) × 憂鬱古典鋼琴迴圈 × 層層堆疊窒息式多押快嘴 × 靈魂排比催淚高潮",
    dna: ["🎹 憂鬱古典鋼琴 Boom-Bap", "⚡ 窒息感技術流雙倍速快嘴", "🎭 No way 直到戴上 Ghost Face", "🔥 小散戶以紀律對抗巨鱷資本"]
  },
  VslVrOUnJX0: {
    title: "瘦子E.SO & 歐陽靖 & 李佳隆 & 小春《在Cypher裏》",
    bpm: 98,
    preset: "cypher-fourkings",
    vibe: "四人接力王牌 Cypher (98 BPM) × 雙語傳奇 OG × 台式江湖氣口 × 旋律快嘴 T0 × 低音壓軸神主牌 Punchline",
    dna: ["🎤 四人四色接力 Cypher", "🌐 歐陽靖式雙語切換開場", "⚡ 李佳隆式 T0 旋律快嘴", "👑 瘦子 E.SO 式低音壓軸山難 Punchline"]
  },
  "Qey0V-UtK6U": {
    title: "《中國說唱巔峰對決》張震嶽 & 熱狗《離開》Live 版",
    bpm: 88,
    preset: "leave-raprock",
    vibe: "滄桑抒情搖滾說唱 (Melodic Rap Rock) × 犀利剖析螢幕成癮寫實饒舌 × 張震嶽式靈魂吶喊副歌 × 機械呢喃 Outro",
    dna: ["🎸 木吉他轉破音搖滾電吉他", "🎤 張震嶽式滄桑搖滾副歌", "📱 盯盤成癮寫實批判饒舌", "🤖 開盤/收盤/待機/當機 Outro"]
  },
  IjltoDcgtV0: {
    title: "MC HotDog 熱狗《除了說唱我什麼都不會》Live 版",
    bpm: 94,
    preset: "hotdog-oldschool",
    vibe: "黃金年代 Old School Jazz Boom Bap × 蛋堡式微醺爵士鋼琴與刷碟 × 幽默自嘲卻霸氣自豪的 OG 敘事 Punchline",
    dna: ["🎷 90s 爵士銅管 & 鋼琴採樣", "💿 經典 DJ 刷碟 (Turntable)", "🐕 熱狗式幽默自嘲 Punchline", "🗣️ 洗腦大合唱 Hook"]
  },
  "z-4GQPIxppw": {
    title: "《中國新說唱》潘瑋柏 & 鄧紫棋 & 艾熱《攀登》Live 版",
    bpm: 90,
    preset: "climb-anthem",
    vibe: "史詩級體育館聖歌 Hip-Hop Pop-Rock × 高亢穿透力女聲 Diva 副歌 × 高密度多押熱血勵志說唱",
    dna: ["🎹 史詩鋼琴 & 管弦樂", "👩‍🎤 鄧紫棋式高音女聲 Hook", "🔥 高密度雙押/三押勵志 Flow", "🏟️ 萬人體育館大合唱氛圍"]
  },
  lEKuorDbaCQ: {
    title: "《中國新說唱》ICE & 李榮浩《王牌冤家》Live 改編版",
    bpm: 96,
    preset: "ace-rivals",
    vibe: "慵懶都會 R&B / Pop Rock 旋律 × 強勢俐落 Melodic Trap 說唱 × 結尾高張力交錯對唱 (Call & Response)",
    dna: ["🎸 Funky 電吉他 Riff", "🥁 現場真鼓 + 808", "🎤 雙男聲反差對唱", "⚡ Bridge 交錯疊句"]
  },
  FqRiJA8KOO0: {
    title: "寶石Gem《槍火 (相對那就針鋒相對)》港片江湖說唱",
    bpm: 92,
    preset: "gunfire-hk",
    vibe: "90年代港產警匪片電影感 Boom Bap × 機關槍密集連押 Flow × 滄桑熱血港風旋律副歌",
    dna: ["🔫 港片江湖銅管 & 電吉他", "🥁 硬派 Boom Bap 重鼓點", "🔥 八連押韻機關槍 Flow", "🎬 熱血港風旋律副歌"]
  }
};

const STYLE_PRESETS = {
  "fox-victorywine": {
    nameZh: "福克斯《慶功酒》風：京劇戲腔開場 × 古箏國風 Trap × 豪邁舉杯慶功副歌",
    defaultBpm: 95,
    sunoStyleZh:
      "Chinese traditional opera sample intro, guzheng and dizi flute fused with hard-hitting modern trap 808 drums, {BPM} BPM, heroic wuxia chivalrous mandarin hip-hop, theatrical and confident male rapper with crisp articulation, anthemic celebratory melodic vocal hook with English hype ad-libs (Turn it up, Drink up), triumphant banquet energy",
    sunoStyleEn:
      "East-meets-West cinematic wuxia trap hip-hop, {BPM} BPM, traditional Chinese opera vocal sample and guzheng plucks fused with heavy modern 808 trap drums, heroic charismatic male rapper, anthemic celebratory melodic chorus with hype ad-libs (Turn it up, Drink up), victorious banquet energy",
    sunoExclude: "sad acoustic ballad, western country, lo-fi whisper, heavy metal screaming",
    dnaTags: ["🎭 京劇老生戲腔開場", "🪕 古箏/竹笛 × Trap 808", "⚔️ 武俠豪傑江湖敘事 Flow", "🍶 豪邁舉杯副歌 (Turn it up!)"]
  },
  "pharaoh-ghostface": {
    nameZh: "法老《Ghost Face》風：憂鬱鋼琴 Boom-Bap × 底層逆襲敘事 × 窒息技術流快嘴",
    defaultBpm: 93,
    sunoStyleZh:
      "Mandarin conscious storytelling boom-bap hip-hop, {BPM} BPM, melancholic classical piano loop, heavy gritty boom bap drums, deep upright bass, raw emotional male rapper building from calm narrative into explosive rapid-fire technical fast flow, intense dramatic delivery, underground hardcore rap masterpiece",
    sunoStyleEn:
      "Conscious storytelling hardcore boom-bap hip-hop, {BPM} BPM, melancholic classical piano loop, heavy dusty boom bap drums, raw emotional male rapper building from gritty narrative into breathless double-time technical fast flow, Eminem Stan meets 90s East Coast underground intensity",
    sunoExclude: "happy dance pop, EDM, autotune mumble rap, country, trap cowbell",
    dnaTags: ["🎹 憂鬱古典鋼琴 Boom-Bap", "⚡ 窒息感技術流雙倍速快嘴", "🎭 No way 直到戴上 Ghost Face", "🔥 小散戶以紀律對抗巨鱷資本"]
  },
  "cypher-fourkings": {
    nameZh: "《在Cypher裏》四人接力風：歐陽靖雙語 × 小春江湖 × 李佳隆旋律 × 瘦子壓軸",
    defaultBpm: 98,
    sunoStyleZh:
      "Mandarin hardcore hip-hop cypher, {BPM} BPM, heavy West Coast boom-bap meets modern trap 808s, brass horn stabs, four distinct male rappers trading bars: bilingual OG rapper, gritty Taiwanese street gangster rapper, autotune melodic fast-flow rapper, and deep-voice charismatic final boss rapper, stadium cipher energy",
    sunoStyleEn:
      "Hardcore hip-hop posse cut cypher, {BPM} BPM, heavy West Coast boom-bap meets modern trap 808 bass, brass stabs, four distinct male rappers trading verses: witty East Coast OG, gritty street brawler, melodic autotune fast-flow artist, and deep baritone final boss rapper, stadium energy",
    sunoExclude: "soft ballad, country, EDM, techno, gentle acoustic folk",
    dnaTags: ["🎤 四人四色接力 Cypher", "🌐 歐陽靖式雙語切換開場", "⚡ 李佳隆式 T0 旋律快嘴", "👑 瘦子 E.SO 式低音壓軸山難 Punchline"]
  },
  "leave-raprock": {
    nameZh: "張震嶽&熱狗《離開》風：滄桑搖滾吶喊副歌 × 盯盤成癮寫實饒舌",
    defaultBpm: 88,
    sunoStyleZh:
      "Mandarin rap rock and alternative hip-hop duet, {BPM} BPM, melancholic acoustic guitar intro building into heavy distorted rock electric guitar and live acoustic drums, gritty realistic storytelling male rapper in verses, raspy emotional rock male vocalist belting the anthemic chorus, raw live stadium emotion",
    sunoStyleEn:
      "Alternative rap rock duet, {BPM} BPM, melancholic acoustic guitar intro building into heavy distorted rock electric guitar and live drums, gritty conscious storytelling male rapper in verses, raspy soulful rock male vocalist belting the emotional chorus, Linkin Park meets 90s indie rock energy",
    sunoExclude: "happy bubblegum pop, EDM, dance, cute female vocal, fast trap",
    dnaTags: ["🎸 木吉他轉破音搖滾電吉他", "🎤 張震嶽式滄桑搖滾副歌", "📱 盯盤成癮寫實批判饒舌", "🤖 開盤/收盤/待機/當機 Outro"]
  },
  "hotdog-oldschool": {
    nameZh: "熱狗《除了說唱我什麼都不會》風：Old School 爵士 Boom Bap × 自嘲狂妄 OG 說唱",
    defaultBpm: 94,
    sunoStyleZh:
      "90s golden era old school jazz hip-hop, classic boom bap drums, {BPM} BPM, warm jazzy Rhodes piano sample, soulful brass and saxophone horn stabs, turntable DJ scratches, witty charismatic OG male rapper with laid-back conversational yet punchy delivery, catchy sing-along gang vocal hook, live concert cypher vibe",
    sunoStyleEn:
      "90s golden era East Coast jazz hip-hop, classic boom bap drums, {BPM} BPM, warm Rhodes piano loop, soulful saxophone and brass horn stabs, turntable DJ scratches, witty charismatic OG male rapper with conversational punchlines, catchy crowd sing-along hook",
    sunoExclude: "autotune trap, EDM, heavy metal, sad slow ballad, dubstep",
    dnaTags: ["🎷 90s 爵士銅管 & 鋼琴採樣", "💿 經典 DJ 刷碟 (Turntable)", "🐕 熱狗式幽默自嘲 Punchline", "🗣️ 洗腦大合唱 Hook"]
  },
  "climb-anthem": {
    nameZh: "《攀登》史詩聖歌風：高亢女聲 Diva 副歌 × 熱血多押勵志說唱",
    defaultBpm: 90,
    sunoStyleZh:
      "Mandarin stadium anthem hip-hop pop rock, {BPM} BPM, grand piano and orchestral brass intro, soaring powerhouse female vocal chorus with angelic high notes, passionate melodic and hard-hitting male rap verses, epic live concert energy, uplifting and triumphant vibe",
    sunoStyleEn:
      "Stadium anthem hip-hop pop rock, {BPM} BPM, grand piano and gospel choir intro, soaring powerhouse female diva chorus, passionate multi-syllable male rap verses, Coldplay Hymn for the Weekend inspired live band production, triumphant and uplifting energy",
    sunoExclude: "mumble rap, lo-fi whisper, monotone, heavy metal screaming, country",
    dnaTags: ["🎹 史詩鋼琴 & 管弦樂", "👩‍🎤 高音穿透力女聲 Diva Hook", "🔥 高密度雙押/三押勵志 Flow", "🏟️ 萬人體育館大合唱氛圍"]
  },
  "gunfire-hk": {
    nameZh: "寶石Gem《槍火》風：90年代港片江湖 Boom Bap × 密集連押 × 熱血港風副歌",
    defaultBpm: 92,
    sunoStyleZh:
      "90s Hong Kong action movie soundtrack hip-hop, cinematic gangster boom bap rap, {BPM} BPM, gritty brass stabs, melancholic vintage electric guitar, heavy punchy drums, aggressive rapid-fire rhyming male rapper in verse, dramatic anthemic retro HK pop-rock vocal chorus, intense street battle energy",
    sunoStyleEn:
      "90s cinematic crime thriller hip-hop, gritty East Coast boom bap meets Hong Kong action movie score, {BPM} BPM, dramatic brass hits, vintage tremolo guitar, hard-hitting drums, aggressive rapid-fire internal rhyme male rapper, anthemic heroic rock-soul chorus",
    sunoExclude: "bubblegum pop, EDM, techno, cute female vocal, acoustic country",
    dnaTags: ["🔫 港片江湖銅管 & 電吉他", "🥁 硬派 Boom Bap 重鼓點", "🔥 八連押韻機關槍 Flow", "🎬 熱血港風旋律副歌"]
  },
  "ace-rivals": {
    nameZh: "王牌冤家風：慵懶都會 R&B × 強勢 Melodic Rap 對唱",
    defaultBpm: 96,
    sunoStyleZh:
      "Mandarin hip-hop duet, R&B pop rock fusion, {BPM} BPM, groovy live drums, slap bass, funky electric guitar riff, sharp melodic trap rap verse by confident male rapper, lazy soulful R&B vocal chorus by male singer, intense call and response bridge, live concert stadium energy",
    sunoStyleEn:
      "English hip-hop duet, R&B pop rock fusion, {BPM} BPM, groovy live drums, slap bass, funky electric guitar riff, sharp melodic trap rap verse by confident male rapper, lazy soulful R&B vocal chorus by male singer, intense call and response bridge, live concert stadium energy",
    sunoExclude: "female vocal, EDM, techno, country, acoustic ballad, screaming heavy metal, low fidelity",
    dnaTags: ["🎸 Funky 電吉他 Riff", "🥁 現場真鼓 + Slap Bass", "🎤 強勢 Rap × 慵懶 R&B", "⚡ 結尾一搭一唱交錯對唱"]
  },
  "wallstreet-drill": {
    nameZh: "華爾街狼性 Drill：重低音滑音 808 × 疾速三連音硬核饒舌",
    defaultBpm: 142,
    sunoStyleZh:
      "Mandarin UK drill hip-hop, aggressive sliding 808 bass, {BPM} BPM, dark cinematic strings, crisp hi-hat rolls, hard-hitting triplet flow male rapper, anthemic gang vocal hook, high energy trading floor vibe",
    sunoStyleEn:
      "NY & UK drill hip-hop, aggressive sliding 808 bass, {BPM} BPM, dark orchestral strings, rapid hi-hat rolls, hard-hitting triplet flow male rapper, stadium chant hook",
    sunoExclude: "soft acoustic, country, slow ballad, jazz, bubble-gum pop",
    dnaTags: ["🔊 Sliding 808 重低音", "🥁 密集 Drill Hi-Hats", "🐺 狼性進攻三連音 Flow", "🔥 交易室高壓炸場感"]
  },
  "cyber-phonk": {
    nameZh: "矽谷 AI 狂潮 Phonk：賽博合成器 × 狂暴 Cowbell 軋空節奏",
    defaultBpm: 130,
    sunoStyleZh:
      "Mandarin drift phonk rap, distorted 808 cowbell melody, {BPM} BPM, cyberpunk synth bass, fast aggressive rap delivery, vocoder hook, adrenaline rush",
    sunoStyleEn:
      "Drift phonk hip-hop, distorted 808 cowbell lead, {BPM} BPM, dark synthwave bass, fast aggressive rap delivery, high octane electronic production",
    sunoExclude: "acoustic guitar, folk, slow R&B, classical piano",
    dnaTags: ["🔔 808 Cowbell 主旋律", "🤖 賽博合成器低音", "⚡ 極速軋空衝刺節奏", "🚀 AI 算力狂飆氛圍"]
  },
  "lofi-chill-rap": {
    nameZh: "凌晨夜盤 Lo-Fi Rap：微醺爵士鋼琴 × 敘事靈魂說唱",
    defaultBpm: 85,
    sunoStyleZh:
      "Mandarin jazz hip-hop, lofi boom bap drums, {BPM} BPM, warm Rhodes electric piano, upright bass, vinyl crackle, laid-back storytelling male rapper, soulful neo-soul R&B chorus",
    sunoStyleEn:
      "Jazz hop lofi boom bap, {BPM} BPM, warm Rhodes piano chords, mellow saxophone sample, laid-back storytelling rap verse, smooth neo-soul vocal hook",
    sunoExclude: "heavy distortion, metal, screaming, fast techno, EDM drop",
    dnaTags: ["🎹 微醺 Rhodes 爵士電鋼琴", "🥁 Boom Bap 經典鼓點", "🌙 凌晨夜盤盯盤敘事感", "☕ 慵懶 Neo-Soul 副歌"]
  }
};

let currentState = {
  lang: "zh", // 'zh' | 'en' | 'bilingual'
  preset: "fox-victorywine",
  bpm: 95,
  topics: new Set([
    "nvda",
    "tsmc",
    "whipsaw",
    "tariff",
    "squeeze",
    "daytrade",
    "margincall",
    "wick",
    "options"
  ]),
  customHook: "",
  customKeywords: ""
};

const TRADING_KEYWORD_ENGINE = {
  etf: {
    zh: "高股息 ETF 溢價破發，00940 的自救會在股版排隊買單",
    en: "High-dividend ETFs breaking below NAV, retail bagholders praying at the close",
    tagZh: "#高股息ETF #00940",
    tagEn: "#DividendETF #RetailBagholder"
  },
  daytrade: {
    zh: "無本當沖搶那幾個 tick 的價差，撮合排隊在九點零一分生死交叉",
    en: "Zero-capital day-trading scalping every tick, queue orders clashing at 9:01 AM",
    tagZh: "#無本當沖 #搶帽子",
    tagEn: "#DayTrading #TickScalping"
  },
  margincall: {
    zh: "融資維持率跌破一百三的追繳令，清晨的簡訊比鬧鐘還要無情",
    en: "Margin maintenance crashing under 130 percent, liquidation SMS colder than the winter rain",
    tagZh: "#融資維持率 #斷頭追繳",
    tagEn: "#MarginCall #Liquidation"
  },
  settlement: {
    zh: "T加2 交割款還差幾十萬，營業員的奪命連環叩讓人手心流汗",
    en: "T-plus-2 settlement clock ticking down, broker's phone calls ringing off the hook",
    tagZh: "#違約交割 #營業員",
    tagEn: "#SettlementDefault #BrokerCall"
  },
  limitlock: {
    zh: "開盤一字線漲停鎖死買不到，隔天跌停關門直接請你吃碗大滷麵",
    en: "Limit-up locked tight at the open bell, limit-down trap door slamming straight to hell",
    tagZh: "#漲停鎖死 #跌停吃麵",
    tagEn: "#LimitUp #LimitDownTrap"
  },
  wick: {
    zh: "那根天地針長下影線剛掃掉我的停損點，馬上假跌破真穿頭拉上雲端",
    en: "That nasty stop-hunt lower wick swept my exit clean, fake breakdown into a vertical green machine",
    tagZh: "#長下影線 #假跌破",
    tagEn: "#StopHuntWick #FakeBreakdown"
  },
  ma: {
    zh: "五線合一均線糾結了一整季，帶量突破年線黃金交叉直接噴出天際",
    en: "Five moving averages coiled tight for a quarter, golden cross breakout ripping through the border",
    tagZh: "#均線糾結 #黃金交叉",
    tagEn: "#GoldenCross #Breakout"
  },
  macd: {
    zh: "高檔 KD 鈍化不要隨便猜頂，MACD 柱狀體底背離才是反轉的訊號",
    en: "Stochastic staying overbought while bears get burned, MACD bullish divergence shows the tide has turned",
    tagZh: "#KD鈍化 #MACD背離",
    tagEn: "#MACDDivergence #TechnicalAnalysis"
  },
  fibonacci: {
    zh: "費波南希零點六一八的黃金回撤位，艾略特波浪推升到主升段第三波",
    en: "Fibonacci 0.618 golden pocket retracement held, Elliott Wave Three impulse ringing the bell",
    tagZh: "#費波南希 #主升段",
    tagEn: "#Fibonacci #ElliottWave"
  },
  orderbook: {
    zh: "五檔委買掛著幾千張假單瞬間抽走，內外盤搓合全是演算法的障眼法",
    en: "Level-2 order book spoofing thousand-lot bids then pulling the rug, HFT algos playing tug-of-war",
    tagZh: "#五檔報價 #主力抽單",
    tagEn: "#Level2OrderBook #AlgoSpoofing"
  },
  options: {
    zh: "台指夜盤多空雙巴洗到脫皮，選擇權莊家精算著最大痛點收割權利金",
    en: "Night session futures chopping both sides raw, options market makers pinning Max Pain by law",
    tagZh: "#台指夜盤 #選擇權最大痛點",
    tagEn: "#IndexFutures #MaxPainOptions"
  },
  ZeroDTE: {
    zh: "週三結算日買方樂透翻了十倍倒莊，賣方吃完歸零膏卻在一根長紅裡破產",
    en: "Wednesday 0DTE lotto calls going ten-bagger gamma squeeze, option sellers blown out on their knees",
    tagZh: "#週選結算 #倒莊歸零膏",
    tagEn: "#0DTEOptions #GammaSqueeze"
  },
  inst: {
    zh: "外資借券賣出幾萬張壓著盤面，投信季底作帳結帳在尾盤神仙打架",
    en: "Foreign funds short-lending millions of shares while local trusts window-dress the quarter-end close",
    tagZh: "#三大法人 #投信作帳",
    tagEn: "#InstitutionalFlow #QuarterEnd"
  },
  broker: {
    zh: "盤後分點看到凱基台北跟隔日沖大軍鎖漲停，明天早盤開高九點半準備倒貨",
    en: "Broker-branch data shows overnight-flip whales locking the limit-up, ready to dump at 9:30 AM sharp",
    tagZh: "#隔日沖 #主力分點",
    tagEn: "#BrokerFlow #OvernightFlip"
  },
  fomo: {
    zh: "每次賣飛就是主升段起漲點，砍在阿呆谷底只能去公園搶最後一個紙箱",
    en: "Every time I sell the stock goes parabolic, panic-sold the exact bottom now I'm shopping for a cardboard box",
    tagZh: "#賣飛 #砍在阿呆谷 #睡公園",
    tagEn: "#PaperHands #SoldTheBottom"
  }
};

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderAll();
  drawIdleVisualizer();
});

function bindEvents() {
  // 語言切換
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentState.lang = btn.dataset.lang;
      renderAll();
    });
  });

  // 解析 YouTube URL
  document.getElementById("btn-analyze-url").addEventListener("click", analyzeYoutubeUrl);

  // 曲風模板切換
  const presetEl = document.getElementById("style-preset");
  presetEl.addEventListener("change", () => {
    currentState.preset = presetEl.value;
    const p = STYLE_PRESETS[currentState.preset];
    currentState.bpm = p.defaultBpm;
    document.getElementById("custom-bpm").value = p.defaultBpm;
    document.getElementById("bpm-val").textContent = p.defaultBpm;
    document.getElementById("ref-bpm-display").textContent = `${p.defaultBpm} BPM`;
    renderAll();
  });

  // 話題 Chip 切換 (支援所有分類區塊)
  document.querySelectorAll(".topic-chips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const topic = chip.dataset.topic;
      if (currentState.topics.has(topic)) {
        if (currentState.topics.size > 1) {
          currentState.topics.delete(topic);
          chip.classList.remove("active");
        }
      } else {
        currentState.topics.add(topic);
        chip.classList.add("active");
      }
      renderAll();
    });
  });

  document.getElementById("btn-select-all-tags").addEventListener("click", () => {
    document.querySelectorAll(".topic-chips .chip").forEach((chip) => {
      currentState.topics.add(chip.dataset.topic);
      chip.classList.add("active");
    });
    renderAll();
    showToast("🔥 已全選 20 項台美股實戰操作關鍵字！");
  });

  const clearBtn = document.getElementById("btn-clear-tags");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const defaults = new Set(["nvda", "tsmc", "whipsaw", "tariff", "squeeze", "daytrade", "margincall", "wick"]);
      currentState.topics = new Set(defaults);
      document.querySelectorAll(".topic-chips .chip").forEach((chip) => {
        if (defaults.has(chip.dataset.topic)) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });
      currentState.customKeywords = "";
      const kwInput = document.getElementById("custom-keywords");
      if (kwInput) kwInput.value = "";
      renderAll();
      showToast("🔄 已重置為核心實戰預設關鍵字！");
    });
  }

  const customKwInput = document.getElementById("custom-keywords");
  if (customKwInput) {
    customKwInput.addEventListener("input", (e) => {
      currentState.customKeywords = e.target.value.trim();
      renderAll();
    });
  }

  // BPM & 自訂副歌
  const bpmSlider = document.getElementById("custom-bpm");
  bpmSlider.addEventListener("input", () => {
    currentState.bpm = parseInt(bpmSlider.value, 10);
    document.getElementById("bpm-val").textContent = currentState.bpm;
    document.getElementById("ref-bpm-display").textContent = `${currentState.bpm} BPM`;
    renderAll();
  });

  document.getElementById("custom-hook").addEventListener("input", (e) => {
    currentState.customHook = e.target.value.trim();
    renderAll();
  });

  document.getElementById("btn-generate").addEventListener("click", () => {
    renderAll();
    showToast("⚡ 已重新編譯中英文歌詞、Suno Prompt 與 YouTube 文案！");
  });

  // 複製按鈕
  document.querySelectorAll("[data-copy-el]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-el");
      const text = document.getElementById(targetId).innerText;
      copyToClipboard(text, "已複製該欄位內容！");
    });
  });

  document.getElementById("btn-copy-clean-lyrics").addEventListener("click", () => {
    const raw = document.getElementById("out-lyrics").innerText;
    const clean = raw
      .split("\n")
      .filter((line) => !line.trim().startsWith("["))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    copyToClipboard(clean, "📄 已複製無標籤純字幕版歌詞！");
  });

  document.querySelector('[data-copy-target="all-suno"]').addEventListener("click", () => {
    const songData = injectExtraTradingBars(buildSongPackage());
    const activeData = currentState.lang === "en" ? songData.en : songData.zh;
    const bundle = [
      `【Song Title】\n${activeData.title}`,
      `【Style of Music】\n${activeData.sunoStyle}`,
      `【Exclude Styles】\n${activeData.sunoExclude}`,
      `【Custom Lyrics】\n${activeData.lyrics}`
    ].join("\n\n");
    copyToClipboard(bundle, "📋 已複製完整 Suno AI 設定包！");
  });

  document.querySelector('[data-copy-target="all-yt"]').addEventListener("click", () => {
    const songData = injectExtraTradingBars(buildSongPackage());
    const activeData = currentState.lang === "en" ? songData.en : songData.zh;
    const bundle = `【YouTube 建議標題】\n${activeData.ytTitles.join("\n")}\n\n【YouTube 影片描述】\n${activeData.ytDesc}`;
    copyToClipboard(bundle, "📋 已複製 YouTube 標題與完整描述！");
  });

  document.getElementById("btn-export-json").addEventListener("click", exportFullMarkdown);

  // 節奏預覽器
  document.getElementById("btn-play-beat").addEventListener("click", startBeatPreview);
  document.getElementById("btn-stop-beat").addEventListener("click", stopBeatPreview);
}

function analyzeYoutubeUrl() {
  const urlInput = document.getElementById("yt-url").value.trim();
  const match = urlInput.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : "lEKuorDbaCQ";

  const thumbImg = document.getElementById("ref-thumb-img");
  thumbImg.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (KNOWN_YT_REFS[videoId]) {
    const ref = KNOWN_YT_REFS[videoId];
    document.getElementById("ref-title").textContent = ref.title;
    document.getElementById("ref-vibe").textContent = ref.vibe;
    document.getElementById("url-status").textContent = "已精準匹配《王牌冤家》曲風基因";
    currentState.preset = ref.preset;
    currentState.bpm = ref.bpm;
    document.getElementById("style-preset").value = ref.preset;
    document.getElementById("custom-bpm").value = ref.bpm;
    document.getElementById("bpm-val").textContent = ref.bpm;
    document.getElementById("ref-bpm-display").textContent = `${ref.bpm} BPM`;
  } else {
    const p = STYLE_PRESETS[currentState.preset];
    document.getElementById("ref-title").textContent = `YouTube 參考曲目 (ID: ${videoId})`;
    document.getElementById("ref-vibe").textContent = `已提取律動架構並套用【${p.nameZh}】進行台美股主題曲風整改`;
    document.getElementById("url-status").textContent = `已載入 ID: ${videoId}`;
  }

  renderAll();
  showToast("🔍 已完成 YouTube 參考網址曲風基因提取與整改！");
}

function buildGunfirePackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "在盤中得我一個";
  const hookLineEn = currentState.customHook || "Standing alone in the storm tonight";

  const lyricsZh = `[Intro]
[Cinematic 90s Hong Kong thriller string tension, metallic gun-cocking sound effect, heavy boom bap drums drop]
[Rapper]
Yeah... 九點鐘開盤鈴聲一響，這條街沒有人講情面
外資、主力、散戶，籌碼上膛
開盤那就針鋒相對！Let's go!

[Verse 1: Aggressive Male Rapper, tight rapid-fire quadruple rhyme scheme, gritty street delivery]
對決那就針鋒相對
台北華爾街夜盤相會
所有籌碼就一步到位
我敲下買單讓成交清脆
這盤面難免人心向背
空頭當道有大戶作祟
那嗜血禿鷹的他們都想洗退
就集中火力我將空單報廢

這喋血盤面在滋養慣犯
在開盤瞬間也會遭到暗算
我逢低地加碼讓空軍癱瘓
就算滿倉槓桿也把他軋爆
你看跌停板都拉不住我
筆筆抄底我滿腔怒火
${flags.hasTsmc ? "讓台積電打開漲停鎖" : "讓主力鎖碼打開漲停鎖"}
看這漫天的銀彈都無處躲

[Chorus: Anthemic Retro Hong Kong Cinema Vocal, dramatic and heroic melody]
${hookLineZh}
紅Ｋ一片穿過
任震盪激發璀璨真我
就不應得過且過
把空單頂起撕破
用雙手打拚一世槍火

[Verse 2: Aggressive Male Rapper, bouncy confident gangster flow]
${flags.hasNvda ? "當我高喊皮衣男回歸會有大事發生\n先把輝達加上兩倉再配幾杯美式" : "當我高喊突破頸線會有大事發生\n先把槓桿加上兩倍再配幾杯美式"}
${flags.hasWhipsaw ? "趁著跳空就發瘋準備軋空\n看我暴拉三千點教訓這些空頭" : "趁著拉回就發瘋準備搶攻\n看我旱地拔蔥教訓這些空頭"}
穿上防彈衣哥們準備狙你
不得猶豫從來不得虛你
華爾街算老幾想跟我再洗一局
我們必須和韭菜保持距離

Yeah 四線合一隨時出發
${flags.hasTariff ? "關稅利空是隨機觸發" : "黑天鵝利空是隨機觸發"}
我停利按下是零點三八
把做空渣滓就地正法
你是真多是假多拉出來遛遛
惹誰不好你惹到護國神山
跪下來求求我別對你軋空
給你回補也不中用啊都不用在意

[Chorus: Anthemic Retro Hong Kong Cinema Vocal, full orchestral brass & electric guitar]
${hookLineZh}
紅Ｋ一片穿過
任震盪激發璀璨真我
就不應得過且過
把空單頂起撕破
用雙手打拚一世槍火

[Bridge: Intense rapid-fire rap over stripped-down heavy drums]
[Rapper]
昨天暴漲三千三，今天重挫一千九
這場槍火沒有退路，只有贏家能出走
CoWoS 產能全開，AI 算力是我的左輪手槍
限空令的街頭，看誰能站到最後收盤！

[Outro: Vintage HK movie guitar solo fades out with echo]
[Vocal]
${hookLineZh}……
用雙手打拚一世槍火……
[Rapper]
開盤那就針鋒相對。收盤！
[End]`;

  const lyricsEn = `[Intro]
[Cinematic 90s crime thriller string tension, metallic click sound, heavy boom bap drums drop]
[Rapper]
Yeah... Opening bell rings out, no mercy on this street
Wall Street to Taipei, liquidity locked and loaded
Eye for an eye, tick for tick! Let's go!

[Verse 1: Aggressive Male Rapper, tight rapid-fire rhyme scheme, gritty street delivery]
Face to face, we go tick for tick
Taipei and Wall Street orders click
All my margin deployed so quick
I pull the trigger and the candle sticks
This market turns on a dime so cold
Hedge fund vultures tryna shake the hold
All those greedy bears acting way too bold
Concentrate the fire till their shorts all fold

Blood on the trading floor breeds the crime
Ambush waiting at the opening chime
Reloading my bids every single time
Squeeze 'em to the top while the tickers climb
Ten circuit breakers couldn't hold me back
Headshot precision on the counter-attack
TSMC breaking through the ceiling track
Bullets in the order book, fading to black

[Chorus: Anthemic Cinematic Rock-Soul Vocal, dramatic and heroic melody]
${hookLineEn}
Green candles blazing through the firelight
Let the volatility ignite my soul
Never backing down, taking full control
Rip through the shorts, break the resistance line
Fighting with my hands in this crossfire grind

[Verse 2: Aggressive Male Rapper, bouncy confident gangster flow]
When the leather jacket walks back in, you know it's going down
Load up on Nvidia shares before we run the town
Gap up in the morning, watch the short sellers drown
Three thousand points rally, yeah we wearing the crown
Put the trench coat on, I'm sniping the dip
Never hesitate, never let the leverage slip
Who do Wall Street suits think they playing today
Keep the paper hands a hundred miles away

Yeah, four screens glowing, ready to ride
Tariff headlines hitting from the blindside
Fibonacci locked at zero-three-eight
Liquidating bears at the Pearly Gate
Show me your conviction, put your cards on the table
Messing with the silicon king, you ain't able
Begging for a pullback while the rockets ignite
Too late to cover now, kiss your margin goodnight

[Chorus: Anthemic Cinematic Rock-Soul Vocal, full orchestral brass & electric guitar]
${hookLineEn}
Green candles blazing through the firelight
Let the volatility ignite my soul
Never backing down, taking full control
Rip through the shorts, break the resistance line
Fighting with my hands in this crossfire grind

[Outro: Vintage crime movie guitar solo fades out]
[Vocal]
${hookLineEn}...
Fighting with my hands in this crossfire grind...
[Rapper]
Tick for tick. Market closed.
[End]`;

  return {
    zh: {
      title: "籌碼槍火 (開盤那就針鋒相對)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI饒舌】《籌碼槍火》｜開盤那就針鋒相對！致敬寶石Gem〈槍火〉港片江湖風 × 台股美股極致大洗盤 (Official Audio)`,
        `《籌碼槍火（開盤那就針鋒相對）》｜台積電、輝達多空喋血街頭｜港風江湖硬派說唱 (${bpm} BPM)`,
        `台股暴漲3300點又重挫？這首《籌碼槍火》把股市唱成港產警匪大片！「讓台積電打開漲停鎖！」🔥`
      ],
      ytDesc: `🔫「對決那就針鋒相對，台北華爾街夜盤相會！所有籌碼就一步到位，我敲下買單讓成交清脆！」
當台股與美股的史詩級多空洗盤，遇上 90 年代港產警匪電影《槍火》的江湖硬派說唱！
這首《籌碼槍火》以 ${bpm} BPM 緊湊的八連押韻機關槍 Flow 搭配熱血滄桑的港風副歌，把輝達（NVIDIA）黃仁勳回歸、台積電（2330）護國神山、外資禿鷹洗盤、關稅利空突襲與限空令軋空大戰，譜成一場喋血街頭的金融江湖大片。

🎧 曲風與編曲亮點：
• 90 年代港片黑幫電影配樂感 (${bpm} BPM) + 硬派 Boom Bap 重鼓點與復古銅管
• 機關槍式密集押韻主歌 (相對 / 相會 / 到位 / 清脆 / 向背 / 作祟 / 洗退 / 報廢)
• 熱血港風旋律副歌：「${hookLineZh}，紅Ｋ一片穿過！」

💬 這場台美股槍火大戰，你手上的籌碼還握得住嗎？留言刷一排「開盤那就針鋒相對」！

#台股 #美股 #槍火 #寶石Gem #中文饒舌 #台積電 #輝達 #NVIDIA #SunoAI #AI音樂 #港風說唱 #股票饒舌 #軋空 #多空對決`
    },
    en: {
      title: "Margin Crossfire (Tick for Tick)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Margin Crossfire (Tick for Tick) | Cinematic Crime-Thriller Stock Market Rap (NVDA, TSMC, Wall Street)`,
        `When Trading Feels Like a 90s Action Movie 🔫 "Margin Crossfire" | Gritty Boom Bap × Anthemic Hook`,
        `"Tick for Tick!" The Ultimate Short-Squeeze Anthem | Margin Crossfire (${bpm} BPM Official AI Audio)`
      ],
      ytDesc: `🔫 "Face to face, we go tick for tick! Taipei and Wall Street orders click!"
Inspired by 90s Hong Kong action cinema and gritty East Coast boom-bap, "Margin Crossfire (Tick for Tick)" turns the high-stakes volatility of NVDA, TSMC, tariff whipsaws, and short squeezes into a ${bpm} BPM cinematic street-battle anthem.

🎧 Track Highlights:
• ${bpm} BPM cinematic crime-thriller boom-bap production with brass stabs & vintage guitar
• Rapid-fire multi-syllable rhyme schemes in the verses
• Heroic, anthemic chorus built for traders holding through the storm

#StockMarketRap #WallStreet #TSMC #NVDA #BoomBap #CinematicRap #SunoAI #AIMusic #ShortSqueeze #TradingAnthem`
    }
  };
}

function buildClimbPackage(p, bpm, flags) {
  const hookChant = currentState.customHook || "Oh AI, oh AI, oh AI";

  const lyricsZh = `[Intro: Grand Piano Chords and Atmospheric Strings, Stadium Crowd Ambience]
[Powerhouse Female Vocal, soulful and soaring]
有時候我會問自己，到底為了什麼盯緊
翻過幾座山才叫贏，你曾否問自己
我們明白每次震盪，當你醒來渴望破浪
但盤面總變幻，並不是你想像的模樣

[Verse 1: Male Rapper A, melodic high-density internal rhyme flow]
有人在暴跌中蛻變，想在反彈中兌現
畫過的趨勢線，更多的時候，都被洗盤成碎片
是因為信仰要繼續，想在恐慌裡獲得驚喜
要更多要定力，更精細更盡力
讓籌碼跟算力，更親密更凝聚
這就是我想要的，在歷史高點被銘記
想忘記那些，華爾街浮誇的看空預言
滑稽的利空裡，藏著洗盤卻又很莊嚴

[Pre-Chorus: Male Rapper A, building intensity]
Do what I do，是因為不想停止邁步
不是不在乎，而是我看穿主力的意圖
回檔的幅度，可能大到讓人牴觸
但時間的複利，就是你最大的禮物
別畏懼，${flags.hasTariff ? "哪怕關稅風暴再次密佈" : "哪怕黑天鵝烏雲再次密佈"}
讓紅Ｋ徹底照亮你，每一寸帳戶

[Chorus: Powerhouse Female Vocal, explosive stadium anthem with choir backing]
${hookChant}
Got the market flying high
So high, so high
${hookChant}
From Taipei to New York sky
So high, so high

[Verse 2: Male Rapper B, powerful old-school stadium flow]
I trade for myself, I hold for my hood
價值藏在晶片裡，Keep real for my world
我為我自己買單，不會砍在阿呆谷底
我自己對抗震盪，哪怕跌破所有均線壓力
我曾經如此隨和，跟著散戶的規則
新聞說什麼就信什麼，看著帳面卻是綠色，沉睡著
多努力追上，市場太看重的短線訊號
我逐一對抗，空頭在煽動的做空報告，根本都不重要
${flags.hasNvda && flags.hasTsmc ? "皮衣男再登高，每當我動搖，撐著我是台積的護城河道" : "基本面再登高，每當我動搖，撐著我是核心的護城河道"}
我的忠告別追高殺低覆轍重蹈
一切的回報，來自${flags.hasWhipsaw ? "暴跌三千點時" : "恐慌殺盤那刻"}依然沒放手的驕傲

[Verse 3: Female Rapper & Male Rappers trading bars, fiery fast flow]
Yo shout out to Jensen, shout out to TSMC
Put your hands up, so just bounce if you feel me
不要放肆，學著紀律像個戰士，勇往向前去
回撤再痛不要放棄，CoWoS 的時代才剛開始而已
為了什麼意義，不就是為了見證新高破頂的奇蹟
We spit fire on the chart，帶整個世代飛向 higher
證明晶圓代工跟 AI 算力本身就是個傳奇
現在可以好好入睡，因為世界都是算力的詞彙

[Chorus: Powerhouse Female Vocal & All Rappers, maximum stadium climax]
有時候我會問自己，到底為了什麼努力
穿過多少黑夜才見黎明，現在我能告訴你
${hookChant}
Got the market flying high
So high, so high
${hookChant}
From Taipei to New York sky
So high, so high

[Outro: Soaring Female High Note Ad-libs, Grand Piano and Live Drums Finale]
So high... 破頂攀登，創下歷史新高！
So high, so high!
[End]`;

  const lyricsEn = `[Intro: Grand Piano Chords and Atmospheric Strings, Stadium Crowd Ambience]
[Powerhouse Female Vocal, soulful and soaring]
Sometimes I ask myself at night, what are we fighting for
How many crashes must we climb before we reach the shore
We know the market breaks our hearts when morning bells collide
When reality turns red and leaves us nowhere left to hide

[Verse 1: Male Rapper A, melodic high-density internal rhyme flow]
Some people transform in the crash, waiting to cash the rebound flash
Every trendline that we drew got shattered into ashes fast
Gotta keep the vision alive, looking for light inside the dive
Need more patience, need more grit, refining every single bit
Let the silicon and the code come together and explode
That's the legacy I want when we hit the all-time high road
Forget the Wall Street pundits preaching doom on TV screens
Behind their solemn warnings lies a shakeout machine

[Pre-Chorus: Male Rapper A, building intensity]
Do what I do, 'cause I refuse to stop the climb
Not that I'm blind, I see the market maker's mind
The drawdown depth might feel too heavy to endure
But compounding through the storm is the only proven cure
Don't be afraid when tariff clouds block out the view
Let the green breakout candles shine right through to you

[Chorus: Powerhouse Female Vocal, explosive stadium anthem with choir backing]
${hookChant}
Got the market flying high
So high, so high
${hookChant}
From Taipei to New York sky
So high, so high

[Verse 2: Male Rapper B, powerful old-school stadium flow]
I trade for myself, I hold for my hood
Value etched in wafers, keep it real for my world
I pay my own dues, never panic at the bottom floor
Standing tall against the margin call when bears begin to roar
I used to follow every headline, trading by the herd's design
Watching portfolios turn grey while waiting for a sign
Chasing every noisy rumor that the algos amplify
Fighting short-seller reports that were built upon a lie
When my conviction starts to shake, the silicon shield holds me tight
Learn from the past, never sell the bottom in the night
Every reward comes from the courage when the index dropped three grand

[Verse 3: Female Rapper & Male Rappers trading bars, fiery fast flow]
Yo shout out to Jensen, shout out to TSMC
Put your hands up, so just bounce if you feel me
Stay disciplined like a warrior marching through the fire
No matter how deep the pullback, CoWoS takes us higher
What are we doing this for? To witness history on the chart
Spitting fire on the floor, taking this era to the stars
Now we can finally sleep tonight, the future's written in the light

[Chorus: Powerhouse Female Vocal & All Rappers, maximum stadium climax]
Sometimes I ask myself at night, what are we fighting for
Through every dark correction, now we're knocking on heaven's door
${hookChant}
Got the market flying high
So high, so high
${hookChant}
From Taipei to New York sky
So high, so high

[Outro: Soaring Female High Note Ad-libs, Grand Piano and Live Drums Finale]
So high... Scaling the peak, all-time high!
So high, so high!
[End]`;

  return {
    zh: {
      title: "破頂攀登 (Scaling the Peak)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI饒舌】《破頂攀登》｜致敬《攀登》潘瑋柏×鄧紫棋×艾熱曲風！獻給在台股美股暴跌洗盤中依然堅定的你 (Official Audio)`,
        `《破頂攀登》Scaling the Peak｜Oh AI, Got the Market Flying High!｜台積電×輝達史詩級勵志說唱 (${bpm} BPM)`,
        `被洗盤到懷疑人生？聽完這首《破頂攀登》重燃信仰！高音女聲 Hook × 雙男聲燃炸饒舌 🔥`
      ],
      ytDesc: `🏔️「有人在暴跌中蛻變，想在反彈中兌現；畫過的趨勢線，更多的時候都被洗盤成碎片……」
當台股與美股歷經單日三千點的史詩級暴漲暴跌，你是否也曾在凌晨夜盤問自己：到底為了什麼努力？
這首《破頂攀登 (Scaling the Peak)》致敬經典舞台《攀登》的宏大格局，以 ${bpm} BPM 莊嚴的鋼琴與管弦樂鋪陳，結合穿透力十足的女高音副歌（"${hookChant}, got the market flying high, so high!"）與高密度雙押熱血饒舌，獻給每一位在輝達（NVIDIA）、台積電（2330）與 AI 浪潮中穿越震盪、堅持到底的投資人！

🎧 曲風與編曲亮點：
• ${bpm} BPM 體育館聖歌級 Hip-Hop Pop-Rock（宏大鋼琴 + 管弦銅管 + 炸裂真鼓）
• 高亢穿透力女聲 Diva 副歌 × 雙男聲高密度連珠炮勵志饒舌
• 結尾三人交錯飆詞 + 萬人大合唱高音收尾

💬 哪一句歌詞最戳中你的看盤心聲？在留言區寫下你的信仰標的，我們山頂見！

#台股 #美股 #攀登 #鄧紫棋 #潘瑋柏 #艾熱 #台積電 #輝達 #NVIDIA #TSMC #AI音樂 #SunoAI #中文饒舌 #勵志說唱 #投資信仰`
    },
    en: {
      title: "Scaling the Peak (So High)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Scaling the Peak (So High) | Epic Stadium Rap × Powerhouse Female Vocal Anthem (NVDA, TSMC, AI Bull Run)`,
        `"Oh AI, Got the Market Flying High!" 🏔️ Scaling the Peak | Uplifting Wall Street & Taipei Trader Anthem`,
        `Hold Through the Storm: "Scaling the Peak" (${bpm} BPM Official AI Audio) | Hip-Hop Pop-Rock Stadium Duet`
      ],
      ytDesc: `🏔️ "Some people transform in the crash, waiting to cash the rebound flash..."
Inspired by stadium hip-hop anthems and Coldplay-style piano-rock hooks, "Scaling the Peak (So High)" combines a powerhouse female chorus with passionate, multi-syllable rap verses about surviving market shakeouts, tariff volatility, and riding the NVDA & TSMC AI revolution to all-time highs.

🎧 Track Highlights:
• ${bpm} BPM grand piano, orchestral strings & stadium live drums
• Soaring female diva hook ("${hookChant}, got the market flying high, so high!")
• Dual male & female rap verses packed with internal rhymes and trader conviction

#StockMarketRap #WallStreet #TSMC #NVDA #StadiumAnthem #AIMusic #SunoAI #HipHopRock #TradingMotivation #AllTimeHigh`
    }
  };
}

function buildHotdogPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "除了看盤我什麼都不會";
  const hookLineEn = currentState.customHook || "I don't know nothing but the charts all day";

  const lyricsZh = `[Intro: Classic 90s Vinyl Crackle, Jazzy Piano Loop, Turntable DJ Scratching]
[Rapper, laid-back witty OG conversational tone]
Let's back to the old school
那些看財報只看本益比的，別來吃我豆腐
Yeah... 早上九點台股，晚上九點半美股
女友問我除了盯著紅紅綠綠的Ｋ線，你還會幹嘛？
我想了想…… 欸，還真的不會。Let's go!

[Verse 1: Charismatic OG Male Rapper, witty punchlines, classic boom bap bounce]
Let's back to the old school
我不聽投顧老師畫大餅也不吃主力的豆腐
Only you，也只有我能抓到起漲的 punchline
${flags.hasTsmc ? "在我心中台積電永遠不會被別的晶圓廠取代" : "在我心中龍頭股永遠不會被雜毛股取代"}
我從來沒有自己煮過一頓飯，連微波爐都不會按
我連出門搭捷運都會迷路，像活在侏儸紀公園裡打轉
但只要打開五檔報價，連外資操盤手都去 Google me
都說十個散戶九個賠，偏偏我就是留著那一口氣
我不懂怎麼談戀愛，不懂怎麼哄妳睡
妳問我紀念日是哪天，我只記得聯準會哪天開會
${flags.hasWhipsaw ? "昨天台股暴漲三千點，今天又重挫一千九百點" : "昨天大盤跳空創高點，今天又殺破月線支撐點"}
別人嚇到把軟體刪掉，我一邊剔牙一邊逢低撿

[Chorus: Catchy Sing-along Hook with Crowd Gang Vocals, bouncy jazz horns]
${hookLineZh}
已經三天沒睡我怎麼都不累
這頭老牛的部位怎麼還不退
都說追高會跪，你看我廢不廢，廢不廢
${hookLineZh}
從台北盯到美股我怎麼都不累
${flags.hasTariff ? "不管關稅怎麼吹，看我會不會，會不會" : "不管利空怎麼吹，看我會不會，會不會"}

[Verse 2: Charismatic OG Male Rapper, humorous self-deprecating yet confident flow]
他們笑我是個生活白癡，連水電費都會忘記繳
但我一眼就能看出那根長下影線是主力在洗盤還是逃跑
${flags.hasNvda ? "看那穿皮衣的男人閃電回歸，輝達單日暴衝三十個百分點\n當全世界還在懷疑 AI 是不是泡沫，我的買單早就已經成交在起點" : "看那算力狂潮席捲華爾街，科技股單日暴衝幾十個百分點\n當全世界還在懷疑行情是不是泡沫，我的買單早就已經成交在起點"}
我不會修電腦，不會換燈泡，不會拼 IKEA 的衣櫃
但我算得出 CoWoS 的產能，算得出選擇權莊家的最大痛點位
那些西裝筆挺的華爾街分析師，講話像在唸經文
不如聽我這首 Old School，一針見血直接幫你開天門
把一件事做到極致，就算生活廢到笑也無所謂
當收盤鐘聲敲響，看著對帳單上的微笑曲線，這杯冰美式才夠味

[Chorus: Catchy Sing-along Hook with Crowd Gang Vocals, full brass & DJ scratches]
${hookLineZh}
已經三天沒睡我怎麼都不累
這頭老牛的部位怎麼還不退
都說追高會跪，你看我廢不廢，廢不廢
${hookLineZh}
從台北盯到美股我怎麼都不累
不管關稅怎麼吹，看我會不會，會不會

[Bridge: Stripped back jazzy bassline and crisp snare, OG talking style]
[Rapper]
有人會煮飯，有人會修車，有人會講甜言蜜語
我什麼都不會，我只會在暴跌三千點的時候，把別人的恐慌撿起來放進口袋裡
Keep it old school, keep it real.
Put your hands up!

[Outro: Turntable DJ Scratch Solo, Jazzy Saxophone riff fades out]
[Rapper]
${hookLineZh}……
明天早上九點，我們盤中見。Peace!
[End]`;

  const lyricsEn = `[Intro: Classic 90s Vinyl Crackle, Jazzy Piano Loop, Turntable DJ Scratching]
[Rapper, laid-back witty OG conversational tone]
Let's take it back to the old school
All those TV gurus drawing lines on a whiteboard, man, quit playing
Yeah... 9 AM in Taipei, 9:30 PM Wall Street open
My girl asked me: "Besides staring at red and green candles all day, what else do you even know how to do?"
I thought about it... and honestly? Nothing at all. Let's go!

[Verse 1: Charismatic OG Male Rapper, witty punchlines, classic boom bap bounce]
Let's back to the old school
I don't buy the hedge fund hype or play the market maker's fool
Only you get the real alpha in my punchline
In my book, TSMC will never be replaced on the silicon frontline
I've never cooked a real meal, barely know how the microwave works
I get lost taking the subway like a dinosaur wandering in the dark
But when the level-two order book lights up, even Wall Street quants Google me
They say nine out of ten retail traders go broke, guess I'm the one anomaly
I don't know how to be romantic, don't know how to buy a bouquet
Ask me when our anniversary is, I only know FOMC meeting day
Three thousand points rally yesterday, two thousand points crash today
While everybody's panic-deleting their apps, I'm picking up shares on the dip, okay

[Chorus: Catchy Sing-along Hook with Crowd Gang Vocals, bouncy jazz horns]
${hookLineEn}
Three days no sleep and I'm still wide awake
This old bull's conviction never fades away
They say chasing tops will break you, look at me making plays
${hookLineEn}
From Taipei to Nasdaq I'm still wide awake
No matter what the tariff headlines say, watch me make it pay

[Verse 2: Charismatic OG Male Rapper, humorous self-deprecating yet confident flow]
They call me hopeless at life, forgetting to pay the electric bill
But I can spot a liquidity sweep on a five-minute wick before the orders fill
Watch the leather jacket walk back on stage, Nvidia surging thirty percent in a day
While the pundits debate if AI is a bubble, my limit orders already locked in the play
I can't fix a leaky faucet, can't assemble an IKEA shelf
But I can model CoWoS capacity and max-pain gamma all by myself
All those suits on CNBC talking fancy macro jargon on the screen
Need a dose of this old school boom-bap just to keep their portfolio green
Master one thing to the limit, who cares if the rest is a mess
When the closing bell rings and the equity curve smiles, that iced coffee tastes the best

[Chorus: Catchy Sing-along Hook with Crowd Gang Vocals, full brass & DJ scratches]
${hookLineEn}
Three days no sleep and I'm still wide awake
This old bull's conviction never fades away
They say chasing tops will break you, look at me making plays
${hookLineEn}
From Taipei to Nasdaq I'm still wide awake
No matter what the tariff headlines say, watch me make it pay

[Outro: Turntable DJ Scratch Solo, Jazzy Saxophone riff fades out]
[Rapper]
Nothing but the charts...
See you at the opening bell tomorrow. Peace!
[End]`;

  return {
    zh: {
      title: "除了看盤我什麼都不會 (Nothing But The Charts)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI饒舌】《除了看盤我什麼都不會》｜致敬熱狗 MC HotDog 曲風！把台股美股當老學校 Boom Bap 唱 (Official Audio)`,
        `《除了看盤我什麼都不會》｜已經三天沒睡我怎麼都不累！台積電、輝達老司機自嘲神曲 (${bpm} BPM Old School Jazz Hip-Hop)`,
        `女友問我除了看股票還會幹嘛？聽完這首《除了看盤我什麼都不會》全網股民笑著流淚！🔥`
      ],
      ytDesc: `🐕「我不會修電腦、不會換燈泡、連紀念日都忘記，但只要打開五檔報價與Ｋ線圖，我三天沒睡怎麼都不累！」
致敬華語嘻哈 OG 熱狗 MC HotDog 與蛋堡 Soft Lipa 的經典老學校爵士說唱曲風（Old School Jazz Boom Bap），這首《除了看盤我什麼都不會》以 ${bpm} BPM 用最幽默自嘲卻又霸氣滿滿的 Punchline，唱出全職投資人與股市老司機的日常：生活上可以像個侏儸紀白癡，但在台股暴漲暴跌三千點、輝達（NVIDIA）皮衣男回歸、台積電（2330）CoWoS 與美股夜盤的戰場上，我們把「看盤」這件事做到極致！

🎧 曲風與編曲亮點：
• ${bpm} BPM 黃金 90 年代 Old School Jazz Boom Bap（微醺爵士鋼琴 + 薩克斯風銅管 + 經典 DJ 刷碟）
• 幽默自嘲又句句暴擊的 OG 敘事 Flow（「妳問我紀念日是哪天，我只記得聯準會哪天開會」）
• 超洗腦全場大合唱副歌：「${hookLineZh}，已經三天沒睡我怎麼都不累！」

💬 你身邊也有這種「生活白癡、看盤天才」的朋友嗎？快把這首歌分享給他！

#台股 #美股 #熱狗 #MCHotDog #除了說唱我什麼都不會 #OldSchool #爵士嘻哈 #台積電 #輝達 #NVIDIA #SunoAI #AI音樂 #股票饒舌 #投資日常 #中文饒舌`
    },
    en: {
      title: "Nothing But The Charts (Old School Trader)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Nothing But The Charts | 90s Old School Jazz Hip-Hop Trader Anthem (NVDA, TSMC, Wall Street Boom Bap)`,
        `"Three Days No Sleep & I'm Still Wide Awake!" 🐕 Nothing But The Charts | Witty Stock Market Rap`,
        `When Your Girlfriend Asks What You Do Besides Trading Stocks 😂 "Nothing But The Charts" (${bpm} BPM Official Audio)`
      ],
      ytDesc: `🐕 "Ask me when our anniversary is, I only know FOMC meeting day!"
Bringing back the golden-era 90s Jazz Boom-Bap vibe (${bpm} BPM) with turntable scratches, warm Rhodes piano, and witty OG punchlines, "Nothing But The Charts" is the ultimate self-deprecating yet ultra-confident anthem for dedicated Taipei & Wall Street traders.

🎧 Track Highlights:
• ${bpm} BPM classic Old School Jazz Hip-Hop beat with saxophone horns & DJ scratches
• Hilarious, relatable trader punchlines meeting sharp market alpha (NVDA, TSMC CoWoS, Fed days, tariff dips)
• Catchy crowd-chant chorus: "${hookLineEn}!"

#StockMarketRap #OldSchoolHipHop #JazzHop #BoomBap #WallStreet #TSMC #NVDA #SunoAI #AIMusic #DayTraderLife #TradingHumor`
    }
  };
}

function buildLeavePackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "離開我的盤面，離開我的世界";
  const hookLineEn = currentState.customHook || "Walk away from the market, walk away from the game";

  const lyricsZh = `[Intro: Melancholic Acoustic Guitar Strumming, Distant City Traffic and Notification Pings, Heavy Boom Bap Rock Drums Enter]
[Raspy Rock Male Vocal, emotional and raw]
${hookLineZh}
離開我的槓桿，離開我的貪婪，離開我的自己……

[Verse 1: Gritty Storytelling Male Rapper, realistic and piercing delivery]
我忘了怎麼生活，甚至忘了怎麼睡覺
如果沒有Ｋ線跳動，我連呼吸都找不到訊號
在真實世界我對家人說我投資都很穩健
在股版裡面我用匿名帳號問天台還有沒有空位
沒有人要抬頭看風景，大家都在滑手機
紅的綠的數字閃爍，無聊的散戶擠爆了討論區
${flags.hasNvda ? "看那皮衣男人閃電回歸，輝達昨晚又噴了三十個百分點" : "看那科技巨頭財報開出，美股昨晚又噴了十幾個百分點"}
你的多單早就洗出場，只能在螢幕前面流著悔恨的眼淚
${flags.hasTsmc ? "我被關在五吋的螢幕裡，看著台積電的 ADR 決定今天的心情" : "我被關在五吋的螢幕裡，看著期貨夜盤的點數決定今天的心情"}
以為掌握了全世界的算力，其實只是演算法手裡的一枚棋

[Chorus: Raspy Rock Male Vocal, soaring emotional rock guitar and crashing drums]
我永遠不知道，明天開盤會發生什麼事
結果到底會如何，要怎麼去面對
我是個散戶，我不堅強，我沒有內線
偶爾夜盤跳水，會流下莫名的淚水
住在擁擠的Ｋ線裡，卻迷失在籌碼堆
而我愛的人愛我的人，卻被我冷落在電腦後面
${hookLineZh}
離開我的融資，離開我的執念，離開我的虧損
現在就要離開，現在就要離開

[Verse 2: Gritty Storytelling Male Rapper, building urgency and frustration]
${flags.hasWhipsaw ? "昨天暴漲三千三百點，每個人都覺得自己是股神轉世\n今天關稅新聞一出來，重挫一千九百點像世界末日" : "昨天跳空大漲創高，每個人都覺得自己是股神轉世\n今天利空新聞一出來，長黑灌破月線像世界末日"}
我們活在聯準會的嘴裡，活在鮑爾每一個字句的標點符號
為了零點幾趴的殖利率，把大好青春全部拿去抵押燃燒
到底是多少的未平倉，才能填滿心裡的空虛
到底要設幾條均線，才不會在震盪裡面失去自己
你笑別人追高殺低是韭菜，卻沒發現自己也離不開這座賭場
${flags.hasSqueeze ? "當限空令的紅燈亮起，誰還記得當初進場只是想過更好的日常" : "當維持率的警鈴響起，誰還記得當初進場只是想過更好的日常"}

[Chorus: Raspy Rock Male Vocal, maximum rock band explosion with emotional grit]
我永遠不知道，明天開盤會發生什麼事
結果到底會如何，要怎麼去面對
我是個散戶，我不堅強，我沒有內線
偶爾夜盤跳水，會流下莫名的淚水
住在擁擠的Ｋ線裡，卻迷失在籌碼堆
而我愛的人愛我的人，卻被我冷落在電腦後面
${hookLineZh}
離開我的融資，離開我的執念，離開我的自己
現在就要離開，現在就要離開

[Bridge: Robotic rhythmic chant with glitching synth and heavy bass]
[Rapper]
開盤、收盤、夜盤、洗盤
追高、殺低、滿倉、斷頭
開機、關機、待機、當機
開盤、收盤、夜盤、當機……
我們都被關在這個框框裡，出不去，也捨不得出去。

[Outro: Emotional Electric Guitar Solo, Raspy Rock Vocal fading out]
[Raspy Rock Vocal]
${hookLineZh}……
關掉螢幕吧，就算只是一天也好……
[End]`;

  const lyricsEn = `[Intro: Melancholic Acoustic Guitar Strumming, Notification Pings, Heavy Rock Drums Enter]
[Raspy Rock Male Vocal, emotional and raw]
${hookLineEn}
Walk away from the leverage, walk away from the greed, walk away from myself...

[Verse 1: Gritty Storytelling Male Rapper, realistic and piercing delivery]
I forgot how to live my life, I even forgot how to sleep
Without the candlesticks flashing red and green, my pulse doesn't even beat
In the real world I tell my family my portfolio is safe and sound
On anonymous forums I'm asking strangers why my margin just hit the ground
Nobody looks up at the sky anymore, everybody's glued to the glass
Refreshing pre-market tickers while the best years of our lives just pass
Watch the leather jacket walk back on stage, Nvidia up thirty percent overnight
Your stop-loss got wicked out yesterday, now you're staring at the screen in spite
Trapped inside a six-inch display, letting TSMC ADR decide my mood
Thinking we control the AI revolution, while the algos eat us for food

[Chorus: Raspy Rock Male Vocal, soaring emotional rock guitar and crashing drums]
I never know what the opening bell is gonna bring tomorrow
How the candles will close, or how to face the sorrow
I'm just a retail trader, I'm not that strong, I got no inside line
Sometimes when the futures crash at midnight, tears fall down without a sign
Living in a crowded order book, yet lost inside the ticker stream
Leaving the ones who truly love me behind a glowing monitor screen
${hookLineEn}
Walk away from the margin call, walk away from the shame
I gotta walk away right now, gotta walk away right now

[Verse 2: Gritty Storytelling Male Rapper, building urgency and frustration]
Three thousand points rally yesterday, everybody felt like a genius king
Two thousand points tariff crash today, now the margin bells begin to ring
We live inside the Federal Reserve's mouth, hanging onto Powell's every word
Trading away our peace of mind for a volatility dream that's absurd
How much open interest does it take to fill the emptiness inside
How many moving averages must we draw before we got nowhere left to hide
You laugh at the crowd for chasing the top, yet you're chained to the very same chair
When the circuit breaker flashes red, do you remember why you even went there

[Chorus: Raspy Rock Male Vocal, maximum rock band explosion with emotional grit]
I never know what the opening bell is gonna bring tomorrow
How the candles will close, or how to face the sorrow
I'm just a retail trader, I'm not that strong, I got no inside line
Sometimes when the futures crash at midnight, tears fall down without a sign
Living in a crowded order book, yet lost inside the ticker stream
Leaving the ones who truly love me behind a glowing monitor screen
${hookLineEn}
Walk away from the margin call, walk away from the shame
I gotta walk away right now, gotta walk away right now

[Bridge: Robotic rhythmic chant with glitching synth and heavy bass]
[Rapper]
Open, close, pre-market, shakeout
Buy the top, sell the drop, full margin, wipeout
Power on, power off, standby, system crash
Open, close, night session, system crash...
We're all locked inside this glowing box.

[Outro: Emotional Electric Guitar Solo, Raspy Rock Vocal fading out]
[Raspy Rock Vocal]
${hookLineEn}...
Turn off the monitors tonight...
[End]`;

  return {
    zh: {
      title: "離開盤面 (Log Off The Market)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI饒舌搖滾】《離開盤面》｜致敬張震嶽&熱狗〈離開〉！獻給每個被台股美股夜盤綁架的靈魂 (Official Audio)`,
        `《離開盤面》Log Off The Market｜「我是個散戶我不堅強我沒有內線…」聽哭全網股民的搖滾說唱神曲 (${bpm} BPM)`,
        `每天滑手機看台積電ADR、輝達夜盤到失眠？這首《離開盤面》唱出股民最深沉的吶喊！🎸`
      ],
      ytDesc: `🎸「在真實世界我對家人說我投資都很穩健，在股版裡面我用匿名帳號問天台還有沒有空位……」
致敬張震嶽與熱狗 MC HotDog 的經典搖滾說唱神曲〈離開〉，這首《離開盤面 (Log Off The Market)》以 ${bpm} BPM 滄桑的木吉他與破音電吉他，搭配直白犀利的社會觀察饒舌，深刻剖析當代投資人被看盤軟體、台股暴漲暴跌三千點、輝達（NVIDIA）與台積電（2330）夜盤跳動、以及聯準會與關稅推播通知徹底綁架的焦慮與掙扎。

🎧 曲風與編曲亮點：
• ${bpm} BPM 華語搖滾說唱（Melodic Rap Rock / Alternative Hip-Hop）
• 熱狗式犀利寫實主歌 × 張震嶽式滄桑搖滾吶喊副歌（「我永遠不知道，明天開盤會發生什麼事…」）
• 結尾經典機械式迷失呢喃：「開盤、收盤、夜盤、洗盤；開機、關機、待機、當機…」

💬 今晚收盤後，給自己一點時間關掉螢幕、陪陪身邊重要的人吧。哪一句歌詞最戳中你？歡迎留言分享。

#台股 #美股 #離開 #張震嶽 #熱狗 #MCHotDog #搖滾說唱 #台積電 #輝達 #NVIDIA #SunoAI #AI音樂 #股票音樂 #投資心聲 #散戶日常`
    },
    en: {
      title: "Log Off The Market (Walk Away)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Log Off The Market (Walk Away) | Emotional Rap Rock Trader Anthem (NVDA, TSMC, Wall Street Burnout)`,
        `"I'm Just a Retail Trader, I Got No Inside Line..." 🎸 Log Off The Market | Alternative Rap Rock Duet`,
        `Trapped in the Candlesticks: "Log Off The Market" (${bpm} BPM Official AI Audio) | Gritty Hip-Hop × Rock Ballad`
      ],
      ytDesc: `🎸 "In the real world I tell my family my portfolio is safe and sound; on anonymous forums I'm asking why my margin hit the ground..."
Blending raw, observational hip-hop verses with a soaring, raspy rock chorus (${bpm} BPM), "Log Off The Market (Walk Away)" captures the emotional toll of 24/7 stock trading, late-night Nasdaq & TSMC futures, NVDA FOMO, and tariff whipsaws.

🎧 Track Highlights:
• ${bpm} BPM Alternative Rap-Rock production (acoustic guitar intro building into heavy distorted rock guitars)
• Piercing storytelling rap verses × emotional rock vocal chorus
• Haunting glitch-chant bridge: "Open, close, pre-market, shakeout / Power on, power off, standby, system crash"

#StockMarketRap #RapRock #WallStreet #TraderLife #TSMC #NVDA #SunoAI #AIMusic #AlternativeHipHop #RetailTrader`
    }
  };
}

function buildCypherPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "在盤中 Cypher 裏，我們籌碼從不見底";
  const hookLineEn = currentState.customHook || "In the trading cypher, our liquidity never runs dry";

  const lyricsZh = `[Intro: Heavy West Coast Brass Hits, Crisp Boom-Bap Snare and Deep 808 Bass Drop]
[All Rappers]
Yeah! 小跑豬主力聯盟 in the building!
從台北早盤殺到華爾街夜盤，歡迎來到我們的 Cypher！Let's go!

[Verse 1: Bilingual OG Male Rapper (MC Jin style), playful bilingual English-Mandarin switch, sharp rhythm]
The legend from the Wall Street floor is back
Buying up the dip while the bears all crack
For example, 看我怎麼切換美股跟台股的節奏
我知道你知道誰是大戶，我敲下鍵盤買單就等於梅西準備踢球
${flags.hasNvda ? "皮衣男閃電回歸，Nvidia back inside the game\n三十趴的單日漲幅，讓空軍全部記住我的 name" : "科技巨頭滿血回歸，Nasdaq back inside the game\n史詩級的單日漲幅，讓空軍全部記住我的 name"}
就算偶爾被洗出場，我都停損得比你更帥
在這個盤中 Cypher 裏，傳奇永遠不會被淘汰

[Verse 2: Gritty Street Male Rapper (Kenzy style), fierce Taiwanese street attitude, aggressive punchy flow]
沒在吃你這套，別把我當韭菜
全部都來比籌碼，試試看我的能耐
外資禿鷹想要洗盤，看我怎麼把你反手買回來
一步一腳印打拚，主力兄弟結拜
別想踩在我的均線頭頂，我直接掀掉莊家的底牌
我出生就打赤腳，沒在怕華爾街穿皮鞋的
${flags.hasWhipsaw ? "昨天暴跌一千九，今天暴拉三千三，這局我們拿定了！" : "任你盤中上下洗，尾盤照樣拉漲停，這局我們拿定了！"}

[Chorus: All Rappers Gang Vocal Chant, heavy bass and brass]
${hookLineZh}
從台積電到輝達，看多軍插旗到底
在盤中 Cypher 裏，把空單全部清理
${flags.hasTariff ? "不管關稅怎麼洗，這場遊戲我們主宰自己" : "不管利空怎麼洗，這場遊戲我們主宰自己"}

[Verse 3: Melodic Fast-Flow Male Rapper (JelloRio style), stylized autotune melodic bounce and rapid triplets]
我只需要打開螢幕，綠色的買單掉落就像雨滴
${flags.hasTsmc ? "別的晶圓廠還在 T1，但是台積電的 CoWoS 排行 T0" : "別的標的還在 T1，但是我們手裡的核心持股排行 T0"}
看盤看得太累，把空頭結束再會
你會的技術分析我大概會，你不敢抄的底部由我帶隊
拉高了尾盤的斜率，軋空像呼吸一樣隨意
聯準會的鷹派發言，在我耳裡只是背景的旋律

[Verse 4: Deep-Voice Charismatic Boss Male Rapper (E.SO style), laid-back low baritone, lethal punchlines, beat switches to heavy sub-bass]
Young OG Trader, let's go，讓我打醒那些放空的山寨
你後悔進場參賽，當代的操盤手都知道我的能耐
看你拿著做空報告想要登上巔峰參拜，我是你山難
暴漲三千點軋到你斷頭，你最好待在原地等著搜救隊來
不要跟我談什麼本益比，在 AI 的時代算力就是真理
${flags.hasSqueeze ? "限空令的大門已經關上，這根長紅Ｋ線直接送給不信邪的你" : "軋空令的號角已經吹響，這根長紅Ｋ線直接送給不信邪的你"}

[Chorus: All Rappers Gang Vocal Chant, maximum stadium cypher energy]
${hookLineZh}
從台積電到輝達，看多軍插旗到底
在盤中 Cypher 裏，把空單全部清理
不管關稅怎麼洗，這場遊戲我們主宰自己

[Outro: Heavy 808 Beat Ride Out, Rappers Ad-libbing]
[Boss Rapper]
你最好待在原地等著搜救隊……
在盤中 Cypher 裏，收盤！Peace!
[End]`;

  const lyricsEn = `[Intro: Heavy West Coast Brass Hits, Crisp Boom-Bap Snare and Deep 808 Bass Drop]
[All Rappers]
Yeah! Four Kings Trading Alliance in the building!
From Taipei morning session to Wall Street closing bell, step into the cypher! Let's go!

[Verse 1: Witty OG Male Rapper, sharp rhythmic bounce and veteran swagger]
The legend from the first bull run is back
I'm the reason your portfolio's on the track
For example, watch how I switch it from Nasdaq to Taipei
You know who the big whale is when I step inside the play
Me clicking the buy button is like Messi stepping to the penalty spot
Leather jacket back at Nvidia, thirty percent rally on the dot
Even if I hit a stop-loss, I take the exit cleaner than your crew
In this trading cypher, old school alpha always comes through

[Verse 2: Gritty Street Male Rapper, fierce aggressive delivery]
I ain't buying your fake news, don't treat me like a fool
Put your liquidity on the table, let's see who runs the pool
Wall Street vultures tryna shake the tree, I sweep their orders off the floor
Step by step with my trading brotherhood, kicking down the door
Don't try to short above my moving average, I'll flip your whole deck
Grew up trading barefoot, never feared a suit with a blank check!

[Chorus: All Rappers Gang Vocal Chant, heavy bass and brass]
${hookLineEn}
From TSMC to Nvidia, watch the bull flag fly
In the trading cypher, squeezing every short goodbye
No matter how the tariffs hit, we own the market sky

[Verse 3: Melodic Fast-Flow Male Rapper, stylized autotune bounce and rapid triplets]
All I gotta do is tap the keys, green limit orders falling like the rain
Other foundries stuck in Tier-1, TSMC CoWoS sitting on the Tier-0 throne
Watching tickers got me tired, wave the bears goodbye
What you chart I already know, where you fear to buy I lead the tribe
Steepening the breakout angle, short squeeze flowing like a breeze
Hawkish Fed speeches sounding like background melodies

[Verse 4: Deep-Voice Charismatic Boss Male Rapper, laid-back low baritone, lethal punchlines]
Young OG Trader, let's go, waking up the copycat bears today
You regret stepping in the arena, every market maker knows my play
You brought a short report tryna climb the mountain peak? I'm your avalanche
Three thousand points gap-up, better stay right there and wait for the rescue ambulance
Don't lecture me on P/E ratios when AI compute is the only law
Margin call bells ringing loud, that giant green candle is the final straw

[Chorus: All Rappers Gang Vocal Chant, maximum stadium cypher energy]
${hookLineEn}
From TSMC to Nvidia, watch the bull flag fly
In the trading cypher, squeezing every short goodbye
No matter how the tariffs hit, we own the market sky

[Outro: Heavy 808 Beat Ride Out, Rappers Ad-libbing]
[Boss Rapper]
Better stay right there and wait for the rescue team...
In the trading cypher. Market closed!
[End]`;

  return {
    zh: {
      title: "在盤中Cypher裏 (In The Trading Cypher)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI饒舌Cypher】《在盤中Cypher裏》｜致敬瘦子E.SO×歐陽靖×李佳隆×小春！台股美股四大主力接力炸場 (Official Audio)`,
        `《在盤中Cypher裏》｜「你想抄底參拜，我是你山難！」台積電T0、輝達回歸最強四人接力說唱 (${bpm} BPM)`,
        `當股市四大高手圍圈開唱！《在盤中Cypher裏》雙語OG×台式江湖×旋律快嘴×低音男神一次聽爽 🔥`
      ],
      ytDesc: `🔥「別的晶圓廠還在 T1，但是台積電的 CoWoS 排行 T0！」
🔥「你想放空登上巔峰參拜，我是你山難，你最好待在原地等著搜救隊來！」
致敬《中國說唱巔峰對決2023》最炸裂的四人神曲《在Cypher裏》（瘦子 E.SO、歐陽靖 MC Jin、李佳隆 JelloRio、小春 Kenzy），這首《在盤中Cypher裏》以 ${bpm} BPM 的重拍西岸 Boom-Bap 結合 Trap 808，讓四位風格截然不同的操盤 Rapper 輪番接力，把輝達（NVIDIA）黃仁勳回歸、台積電（2330）T0 霸主地位、台股單日三千點暴漲暴跌與限空令軋空大戰一次唱到炸裂！

🎧 四大段落亮點：
• Verse 1 (雙語傳奇 OG 風)：中英流利切換，「我敲下鍵盤買單就等於梅西準備踢球」
• Verse 2 (台式江湖街頭風)：硬派氣口，「我出生就打赤腳，沒在怕華爾街穿皮鞋的」
• Verse 3 (旋律快嘴 Melodic 風)：「別的晶圓廠在 T1，但台積電 CoWoS 排行 T0」
• Verse 4 (低音壓軸神主牌 E.SO 風)：「你想登上巔峰參拜，我是你山難，你最好待在原地等著搜救隊」

💬 四段 Verse 你最愛哪一棒的 Flow？在留言區投出你的 MVP！

#台股 #美股 #在Cypher裏 #瘦子ESO #歐陽靖 #小春 #李佳隆 #台積電 #輝達 #NVIDIA #TSMC #SunoAI #AI音樂 #中文饒舌 #Cypher #股票饒舌`
    },
    en: {
      title: "In The Trading Cypher (Four Kings)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `In The Trading Cypher (Four Kings) | Epic 4-Rapper Stock Market Posse Cut (NVDA, TSMC Tier-0, Wall Street)`,
        `"You Tryna Short the Peak? I'm Your Avalanche!" 🔥 In The Trading Cypher | Hardcore Hip-Hop Cypher`,
        `4 Distinct Flows, 1 Massive Bull Run: "In The Trading Cypher" (${bpm} BPM Official AI Audio) | Boom-Bap × Trap`
      ],
      ytDesc: `🔥 "Other foundries stuck in Tier-1, TSMC CoWoS sitting on the Tier-0 throne!"
🔥 "You brought a short report tryna climb the peak? I'm your avalanche—wait for the rescue team!"
"In The Trading Cypher (Four Kings)" brings a heavyweight ${bpm} BPM posse-cut cypher where four distinct rap styles—the witty OG, the street brawler, the melodic triplet speedster, and the deep-voice final boss—trade bars over a West Coast Boom-Bap & Trap beat about NVDA, TSMC, and crushing short sellers.

#StockMarketRap #HipHopCypher #TSMC #NVDA #WallStreet #PosseCut #SunoAI #AIMusic #BoomBapTrap #TradingAnthem`
    }
  };
}

function buildGhostfacePackage(p, bpm, flags) {
  const hookEndZh = currentState.customHook || "Just no way, no way，直到我戴上了 Ghost Face!";
  const hookEndEn = currentState.customHook || "Just no way, no way, until I put on the Ghost Face!";

  const lyricsZh = `[Intro: Melancholic Classical Piano Loop, Vinyl Crackle, Heavy Boom-Bap Drums Slowly Drop]
[Rapper, calm, deep, reflective storytelling tone]
從我開戶那天，我就想要戰勝這市場
因為我租屋處的桌上，擺著幾本泛黃的波浪理論與Ｋ線圖表
一部財經紀錄片，關於華爾街之狼，關於矽谷與信義區的霓虹燈光
我慢慢地走入了自己佈的槓桿，開始相信天上真的會掉下財富自由的聖杯……

[Verse 1: Emotional Storytelling Male Rapper, steady gritty boom-bap cadence, dense rhymes]
一張交割單帶我駛向夢想中的聖地
開始在紅綠跳動中維持我的生計
冷風吹進凌晨三點盯著夜盤的衛衣
融資維持率的警訊刺骨般的鋒利
想過銷戶，但卻滿身骨氣
表面看似隨意，實則背地悲寂
老媽問我今年賺沒，Yeah maybe, maybe
一個散戶挺直背脊，與外資巨鱷對立

[Verse 2: Hardcore Male Rapper, aggressive tone, accelerating into technical rapid-fire double-time flow]
所以那些曬假對帳單的老師別來和我比慘
老子的交割紀錄他媽的滿是遺憾
沒有內線的籍貫，滿倉操作極端
眼看停損被掃穿，但卻無法阻攔
你們只懂在股版裡面鍵盤避難
討論區裡你可以是一個少年股神
可以是巴菲特，可以沒有負擔
可以走上神壇，也可以在隔天徹底輸慘
${flags.hasWhipsaw ? "昨天台股暴漲三千三百點你高喊財富自由\n今天關稅重挫一千九百點你連呼吸都在發抖" : "昨天跳空創高你高喊財富自由\n今天長黑殺破支撐你連呼吸都在發抖"}
我在斷頭的邊緣把每一根分時Ｋ線刻進骨頭
${flags.hasNvda ? "看皮衣男人閃電回歸，輝達的算力刺穿空頭的胸口" : "看科技龍頭強勢回歸，多頭的算力刺穿空頭的胸口"}

[Chorus: Intense Emotional Male Rapper, explosive rapid-fire climax with haunting piano]
你是否想過跌停板可以鎖死你的退路呢？
你是否想過超商便當可以配著夜盤微波爐熱？
你是否見過男人因為一根長下影線在深夜裡哭了？
當三次斷頭一個人在承受，他還怎麼輸呢？
不過 No way, no way, no way, no way, know?
當你沒有主力籌碼一切就 No way, no way, know?
${flags.hasTsmc ? "除了握緊你的台積電跟信仰你 No way, no way, no" : "除了握緊你的核心部位跟紀律你 No way, no way, no"}
${hookEndZh}

[Verse 3: Technical Fast-Flow Male Rapper, breathless machine-gun rhyme density, triumphant grit]
一個小散戶生活在全自動演算法的城市
嘗試用鋼鐵般的紀律去對抗資本的物質
我受夠了洗盤，受夠了踏空
受夠了追高被套在山頂吹著冷風
受夠了禿鷹的做空報告，你不懂
我受夠了做夠了功課算盡了 CoWoS 產能的一切
卻在聯準會一句話後換來帳戶的撕裂
所以我戴上面具，把情緒全部抽離
像個沒有感情的幽靈在恐慌殺盤裡逢低扣扳機
直到我又默默站上績效榜單的第一
打敗心裡的貪婪與恐懼，才是我賦予這場交易的意義！

[Outro: Piano Loop Solo Fades Out with Distant Rain and Heartbeat]
[Rapper, quiet resolute whisper]
一個小散戶，在巨鱷的城市……
戴上 Ghost Face，砍掉情緒，我們盤中見。
[End]`;

  const lyricsEn = `[Intro: Melancholic Classical Piano Loop, Vinyl Crackle, Heavy Boom-Bap Drums Slowly Drop]
[Rapper, calm, deep, reflective storytelling tone]
From the day I funded my first account, I wanted to conquer Wall Street
Because on the desk of my tiny studio apartment sat a stack of worn-out candlestick charts
A documentary playing about the trading floor, neon lights reflecting off the glass
I slowly walked into the leverage trap I built myself, believing the market owed me a miracle...

[Verse 1: Emotional Storytelling Male Rapper, steady gritty boom-bap cadence, dense rhymes]
One wire transfer took me to the promised land of greed
Trying to survive inside the red and green ticker feed
Cold wind blowing through my hoodie at three AM watching futures bleed
Margin maintenance warnings cutting deeper than a blade indeed
Thought about quitting, but my pride wouldn't let me fold
Acting calm on the outside, fighting a lonely war untold
Mom asks if I made money this year, yeah maybe, maybe
One retail kid standing tall against the hedge fund navy

[Verse 2: Hardcore Male Rapper, aggressive tone, accelerating into technical rapid-fire double-time flow]
So all those fake gurus flexing paper accounts don't talk to me about pain
My brokerage statements are written in blood and pouring rain
No insider pedigree, trading on the ragged edge
Watching my stop-loss get hunted right off the cliff's ledge
You only know how to hide behind a keyboard on Reddit threads
Online you can pretend to be a billionaire oracle in your head
Can be a legend, can trade without a single scar
Can climb the altar or lose everything inside a single bar
Three thousand points rally yesterday, everybody screaming we made it
Two thousand points tariff crash today, now your conviction faded
Carving every five-minute wick into my bones on the brink of ruin
Leather jacket returns to Nvidia, AI compute is the storm we're brewing

[Chorus: Intense Emotional Male Rapper, explosive rapid-fire climax with haunting piano]
Have you ever seen a limit-down lock every exit door in sight?
Have you ever heated up cheap instant noodles watching Nasdaq at midnight?
Have you ever seen a grown man cry over a long lower wick in the dark?
When a man survives three wipeouts alone, how can he lose his spark?
But it's no way, no way, no way, no way, you know?
When you ain't got institutional money it's no way, no way, you know?
Except holding onto TSMC and your iron discipline, no way, no way, no
${hookEndEn}

[Verse 3: Technical Fast-Flow Male Rapper, breathless machine-gun rhyme density, triumphant grit]
A broke kid living in a city ruled by high-frequency machines
Trying to use spiritual discipline to fight a billion-dollar regime
I'm sick of the shakeouts, sick of missing the run
Sick of buying the top and freezing when the dump has begun
Sick of the short-seller hit pieces, you don't understand the grind
I did all the CoWoS research, left every retail excuse behind
Only to watch a single Fed sentence tear my equity curve apart
So I put on the Ghost Face, drained every drop of emotion from my heart
Moving like a phantom sniper buying the blood when the panic peaks
Until I quietly climbed to the top of the leaderboard after all those weeks
Defeating my own fear and greed is the only meaning I seek!

[Outro: Piano Loop Solo Fades Out with Distant Rain]
[Rapper, quiet resolute whisper]
A retail kid in a city of Wall Street giants...
Put on the Ghost Face. Kill the emotion. See you at the bell.
[End]`;

  return {
    zh: {
      title: "操盤假面 (Ghost Face Trader)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI硬核饒舌】《操盤假面 Ghost Face》｜致敬法老PHARAOH快嘴神作！講述散戶底層逆襲台股美股的催淚史詩 (Official Audio)`,
        `《操盤假面 Ghost Face》｜「你是否見過男人因為一根下影線哭了？當一切一個人在承受他還怎麼輸呢！」(${bpm} BPM 技術流說唱)`,
        `一個小散戶在巨鱷的城市，用信仰對抗資本！聽完這首《操盤假面》技術流快嘴直接起雞皮疙瘩 🔥`
      ],
      ytDesc: `🎭「你是否想過超商便當可以配著夜盤微波爐熱？你是否見過男人因為一根長下影線在深夜裡哭了？當一切一個人在承受，他還怎麼輸呢！」
致敬華語硬核敘事說唱神作——法老 PHARAOH《Ghost Face》，這首《操盤假面 (Ghost Face Trader)》以 ${bpm} BPM 憂鬱深沉的古典鋼琴採樣與厚重 Boom-Bap 鼓點，講述一個沒有內線、沒有背景的普通散戶，在經歷融資斷頭、台股單日三千點暴漲暴跌洗盤、外資演算法獵殺後，決定戴上沒有情緒的「操盤假面（Ghost Face）」，緊握台積電（2330）與輝達（NVIDIA）核心信仰，從底層完成絕地逆襲的技術流快嘴詩篇。

🎧 曲風與技術流亮點：
• ${bpm} BPM 意識敘事說唱 (Conscious Storytelling Boom-Bap)
• 從壓抑低語層層推進至中後段窒息感十足的「超高密度連珠炮快嘴」
• 直擊靈魂的催淚排比高潮：「No way, no way... 直到我戴上了 Ghost Face！」

💬 這首歌獻給每一個在深夜獨自扛下虧損、卻依然沒有放棄精進自己的交易者。哪一句最觸動你？留言告訴我們。

#台股 #美股 #法老 #GhostFace #硬核說唱 #技術流快嘴 #台積電 #輝達 #NVIDIA #SunoAI #AI音樂 #中文饒舌 #散戶逆襲 #股票饒舌`
    },
    en: {
      title: "Ghost Face Trader (Against The Algos)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Ghost Face Trader (Against The Algos) | Technical Fast-Flow Storytelling Stock Market Rap (NVDA, TSMC)`,
        `"When a Man Survives Three Wipeouts Alone, How Can He Lose?" 🎭 Ghost Face Trader | Hardcore Boom-Bap`,
        `A Retail Trader in a City of Wall Street Giants | "Ghost Face Trader" (${bpm} BPM Official AI Audio)`
      ],
      ytDesc: `🎭 "Have you ever heated up cheap instant noodles watching Nasdaq at midnight? Have you ever seen a grown man cry over a long lower wick in the dark?"
"Ghost Face Trader (Against The Algos)" is a ${bpm} BPM conscious storytelling boom-bap epic. Over a haunting classical piano loop, it builds from a raw, autobiographical narrative of retail trading struggle into a breathless, double-time technical fast flow about killing emotion, putting on the "Ghost Face," and riding TSMC & NVDA conviction against Wall Street algorithms.

#StockMarketRap #StorytellingRap #FastFlow #BoomBap #TSMC #NVDA #WallStreet #RetailTrader #SunoAI #AIMusic #ConsciousHipHop`
    }
  };
}

function buildVictoryWinePackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "舉杯痛飲這碗慶功酒";
  const hookLineEn = currentState.customHook || "Raise the glass and drink this bowl of victory wine";

  const lyricsZh = `[Intro: Vintage Peking Opera Laosheng High-Pitched Vocal Sample, Guzheng Plucks and Dizi Flute, Heavy Trap 808 Bass Drops]
[Traditional Opera Vocal]
今日痛飲慶功酒，壯志未酬誓不休！
來日方長顯身手，甘灑熱血寫春秋——！
[Rapper]
Yeah! 漲停鎖死！開香檳、倒滿這碗慶功酒！Turn it up! Let's go!

[Verse 1: Heroic Chivalrous Male Rapper, crisp theatrical articulation, bouncy wuxia trap flow]
我舉杯喝下這碗漲停慶功酒
瀟灑地滿倉跨上多頭向四萬點大路走
君子在此立誓，主升段絕不回頭
直到空軍彈盡糧絕，也絕不會輕易收手
我曾在股版面前斷言
這世間身懷信仰的人都值得被時刻關注
我們抄底在別人不敢進場的阿呆谷路
懷揣著翻倍的目標，台北與華爾街共同呼吸
卻擁有不可一世的定力，從不畏懼洗盤躲避
度過每一個早盤與夜盤的更替
這盤面沒你想的那麼完美
被融資維持率追繳壓住，也沒機會還嘴
但它未曾讓我害怕，熬過了外資陰險狡詐的假跌破
也看破了天地針長下影線背後被掩蓋住的贏家
${flags.hasTsmc ? "我是單槍匹馬鎖定台積電的孤勇者" : "我是單槍匹馬鎖定龍頭股的孤勇者"}
${flags.hasNvda ? "看皮衣男黃仁勳橫刀向天笑，輝達算力震蒼穹" : "看科技巨頭橫刀向天笑，AI 算力震蒼穹"}
${flags.hasTariff ? "不畏懼任何關稅風暴，買單握緊在手中" : "不畏懼任何利空風暴，買單握緊在手中"}
笑我衝動、笑我滿倉做著財富自由的白日夢
五線合一黃金交叉，伴我同行生死與共！

[Chorus: Anthemic Heroic Melodic Male Vocal, Guzheng and 808 Bass Full Drop]
${hookLineZh}
不扶牆再邁開大步，迎著紅Ｋ向前走
Turn it up!
你我共飲這杯慶功酒
軋空之際看我如何為你顯身手
Drink up!
${hookLineZh}
不扶牆再邁開大步，迎著紅Ｋ向前走
Turn it up!
你我共飲這杯慶功酒
破頂之際看我如何為你顯身手

[Verse 2: Heroic Chivalrous Male Rapper, rapid-fire internal rhymes with Peking opera cadence]
能結出複利的果，摩擦出軋空的花火
驀然回首，那些看空的過客早已斷頭斑駁
而我依然是鎮住空妖的護國神山寶塔
與莊家鬥、與演算法鬥、與時間價值奮力去爭奪
擦亮我手中的鍵盤，上一炷開盤的清香
風蕭蕭兮易水寒，我帶著京劇的腔
嘆空軍無際的荒涼，融券回補的傷
${flags.hasWhipsaw ? "風水輪流轉，一天暴漲三千三百點斷了多少空頭念想" : "風水輪流轉，一根旱地拔蔥長紅斷了多少空頭念想"}
震盪未免惆悵跌宕，但你不可失去信仰
就像是 CoWoS 產能流暢、獨特有樣才越拉越爽
我們用多頭正能量，擊潰做空負能量
懂行的戰友都能跟著加碼、跟著上，掃平那些隔日沖蝦兵蟹將
我身居散戶之群，卻心懷主力之志
這一張張紅通通的對帳單，全部發自內心來源於真實
華爾街操盤手看後，都會敬我是條漢子
誰上岸、誰期盼，週三結算背水一戰，我樂意之至！

[Chorus: Anthemic Heroic Melodic Male Vocal, Maximum Banquet Celebration Energy]
${hookLineZh}
不扶牆再邁開大步，迎著紅Ｋ向前走
Turn it up!
你我共飲這杯慶功酒
軋空之際看我如何為你顯身手
Drink up!

[Outro: Peking Opera String & Guzheng Finale with 808 Sub-Bass]
[Traditional Opera Vocal]
甘灑熱血寫春秋——！
[Rapper]
漲停鎖死！乾了這碗慶功酒！Turn it up!
[End]`;

  const lyricsEn = `[Intro: Vintage Chinese Opera High-Pitched Vocal Sample, Guzheng Plucks and Bamboo Flute, Heavy Trap 808 Bass Drops]
[Traditional Opera Vocal]
Raise the cup of victory wine tonight, our ambition burns through the sky!
[Rapper]
Yeah! Limit-up locked! Pop the bottles, pour the victory wine! Turn it up! Let's go!

[Verse 1: Heroic Charismatic Male Rapper, crisp theatrical articulation, bouncy wuxia trap flow]
I raise my cup and drink this bowl of limit-up victory wine
Riding the bull trend saddle straight past the all-time high line
A warrior takes an oath right here, never looking back in the run
Until the short-sellers run out of ammo, my mission isn't done
I called the bottom in front of the crowd when everyone was shaking
True conviction traders deserve the history we're making
We bought the blood on the streets where nobody dared to tread
Breathing the same volatility from Taipei to Wall Street's fed
Unstoppable courage in our chest, never hiding from the storm
Watching day session turn to night session as the breakout starts to form
This market ain't as gentle as a fairytale dream
Crushed by 130 percent margin maintenance, couldn't even scream
But I never flinched, survived the hedge fund stop-hunt wicked traps
Saw right through the fake breakdowns on the candlestick maps
Riding solo like a kung-fu master holding TSMC to the core
While leather-jacket Jensen laughs at the sky, Nvidia compute begins to roar
Fists clenched tight against the tariff winds blowing in the night
Five moving averages golden-crossed, we ride together in this fight!

[Chorus: Anthemic Heroic Melodic Male Vocal, Guzheng and 808 Bass Full Drop]
${hookLineEn}
Marching forward into the green candles, leaving the bears behind
Turn it up!
You and I toast this cup of victory wine
Watch me show my kung-fu when the short squeeze crosses the line
Drink up!
${hookLineEn}
Marching forward into the green candles, leaving the bears behind
Turn it up!
You and I toast this cup of victory wine
At the moment of breakout, watch the diamond hands shine

[Verse 2: Heroic Charismatic Male Rapper, rapid-fire internal rhymes with theatrical cadence]
Compounding bears the fruit, friction sparks the gamma flame
Looking back, all the bearish doubters got liquidated out the game
And I still stand tall like the Silicon Shield tower on the hill
Fighting the algos, fighting the theta decay with an iron will
Polish my mechanical keyboard, light an incense for the opening bell
Cold wind blowing across the floor, I bring that opera swell
Mourning the barren wasteland of the short-sellers' margin call
Three thousand points in a single day, watch their empire fall
A retail warrior walking among the crowd with an institutional mind
Every green brokerage statement earned from the realest grind
Even Wall Street hedge fund bosses salute the way I hold the line
Wednesday 0DTE final battle, pour another cup of victory wine!

[Chorus: Anthemic Heroic Melodic Male Vocal, Maximum Banquet Celebration Energy]
${hookLineEn}
Marching forward into the green candles, leaving the bears behind
Turn it up!
You and I toast this cup of victory wine
Watch me show my kung-fu when the short squeeze crosses the line
Drink up!

[Outro: Guzheng & Flute Finale with 808 Sub-Bass]
[Rapper]
Limit-up locked! Drink up the victory wine! Turn it up!
[End]`;

  return {
    zh: {
      title: "漲停慶功酒 (Limit-Up Victory Wine)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI國風饒舌】《漲停慶功酒》｜致敬福克斯〈慶功酒〉京劇戲腔×江湖說唱！台股美股軋空破頂必聽神曲 (Official Audio)`,
        `《漲停慶功酒》Limit-Up Victory Wine｜「舉杯痛飲這碗慶功酒，迎著紅Ｋ向前走！」台積電×輝達多軍戰歌 (${bpm} BPM)`,
        `熬過暴跌洗盤、迎來暴漲三千點！開盤播放這首《漲停慶功酒》直接氣勢拉滿！🍶🔥`
      ],
      ytDesc: `🍶「今日痛飲慶功酒，壯志未酬誓不休！我舉杯喝下這碗漲停慶功酒，瀟灑地滿倉跨上多頭向四萬點大路走！」
致敬福克斯 FOX 經典國風江湖說唱神曲〈慶功酒 (Jungle Juice)〉，這首《漲停慶功酒》以 ${bpm} BPM 將高亢激昂的京劇老生戲腔、古箏與竹笛民樂，完美融合現代重低音 Trap 808 節拍！
獻給每一位熬過融資維持率追繳、天地針長下影線假跌破、外資借券洗盤與關稅黑天鵝，最終在台積電（2330）CoWoS 與輝達（NVIDIA）AI 算力狂潮中迎來史詩級長紅漲停的股市俠客！

🎧 曲風與編曲亮點：
• ${bpm} BPM 國風戲曲江湖 Trap（京劇老生《智取威虎山》戲腔開場 + 古箏/竹笛 + 炸裂 808）
• 武俠豪傑敘事主歌：「我是單槍匹馬鎖定台積電的孤勇者，五線合一黃金交叉伴我同行生死與共！」
• 豪氣干雲慶功副歌：「${hookLineZh}，不扶牆再邁開大步迎著紅Ｋ向前走！Turn it up! Drink up!」

💬 今天帳面收紅的戰友們，在留言區刷一排「乾了這碗漲停慶功酒 🍶」！

#台股 #美股 #慶功酒 #福克斯 #中國風說唱 #戲腔 #台積電 #輝達 #NVIDIA #TSMC #漲停 #軋空 #SunoAI #AI音樂 #中文饒舌 #股票戰歌`
    },
    en: {
      title: "Limit-Up Victory Wine (Jungle Juice)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Limit-Up Victory Wine (Jungle Juice) | Chinese Opera × Wuxia Trap Stock Market Anthem (NVDA, TSMC)`,
        `"Raise the Glass & Drink This Victory Wine!" 🍶 Limit-Up Victory Wine | Epic Bull Run Celebration Rap`,
        `When Guzheng & Peking Opera Meet Wall Street Short Squeeze 🔥 "Limit-Up Victory Wine" (${bpm} BPM Official Audio)`
      ],
      ytDesc: `🍶 "I raise my cup and drink this bowl of limit-up victory wine, riding the bull trend saddle straight past the all-time high line!"
Fusing a traditional Peking Opera vocal sample, ancient guzheng & bamboo flute melodies with hard-hitting ${bpm} BPM modern trap 808s, "Limit-Up Victory Wine (Jungle Juice)" is a wuxia-style celebration anthem for traders who survived the stop-hunt wicks and margin calls to ride the TSMC & NVDA bull run.

#StockMarketRap #ChineseTrap #WuxiaRap #TSMC #NVDA #WallStreet #ShortSqueeze #SunoAI #AIMusic #VictoryAnthem`
    }
  };
}

function buildSongPackage() {
  const p = STYLE_PRESETS[currentState.preset];
  const bpm = currentState.bpm;
  const hasNvda = currentState.topics.has("nvda");
  const hasTsmc = currentState.topics.has("tsmc");
  const hasWhipsaw = currentState.topics.has("whipsaw");
  const hasTariff = currentState.topics.has("tariff");
  const hasSqueeze = currentState.topics.has("squeeze");
  const hasOptions = currentState.topics.has("options");

  if (currentState.preset === "fox-victorywine") {
    return buildVictoryWinePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "pharaoh-ghostface") {
    return buildGhostfacePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "cypher-fourkings") {
    return buildCypherPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "leave-raprock") {
    return buildLeavePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "hotdog-oldschool") {
    return buildHotdogPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "climb-anthem") {
    return buildClimbPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "gunfire-hk") {
    return buildGunfirePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  const hookWordZh = currentState.customHook || "就是冤家";
  const hookWordEn = currentState.customHook || "We're born rivals";

  // 動態組合 Verse 1 (台美股亮點)
  const verse1LinesZh = [
    "別再用那種眼神看盤，像要把莊家拆穿",
    "承認吧你的停損，在跳空面前早就癱瘓",
    "我的直覺從不轉彎，逢低抄底從不手軟",
    "那些恐慌的賣單，全被我一筆勾銷買斷"
  ];
  if (hasNvda) {
    verse1LinesZh.push("看那皮衣男人閃電回歸，輝達算力再次點燃");
  }
  if (hasTsmc) {
    verse1LinesZh.push("台積電的晶圓護城河，CoWoS 產能排到爆滿");
  }
  if (hasWhipsaw || hasTariff) {
    verse1LinesZh.push("我不是要跟你講基本面，消息在盤裡太善變");
    verse1LinesZh.push("昨天暴漲三千三百點，今天關稅又讓你失眠");
  }
  if (hasOptions) {
    verse1LinesZh.push("夜盤選擇權買方賣方，莊家精算著最大痛點");
  }

  const verse1LinesEn = [
    "Stop staring at the ticker like you got the market figured out",
    "Your stop-loss got triggered before you even heard the shout",
    "My conviction never bends, buying dips until the end",
    "All those panic selling orders, watch me sweep 'em round the bend"
  ];
  if (hasNvda) {
    verse1LinesEn.push("Leather jacket back on stage, Nvidia lighting up the flame");
  }
  if (hasTsmc) {
    verse1LinesEn.push("TSMC silicon shield, CoWoS running up the game");
  }
  if (hasWhipsaw || hasTariff) {
    verse1LinesEn.push("I ain't talking fundamentals when the headlines shift the tide");
    verse1LinesEn.push("Three thousand points up yesterday, tariff rumors killed the ride");
  }
  if (hasOptions) {
    verse1LinesEn.push("Zero-day options on the screen, market makers pricing in the pain");
  }

  const verse3StartZh = hasSqueeze
    ? "Yeah，收起你的空單，限空令下我才是行情的解藥\n每次洗盤後的拉抬，比軋空情節還要高調"
    : "Yeah，收起你的猶豫，動能突破才是唯一的解藥\n每次拉回後的創高，比電影情節還要高調";

  const verse3StartEn = hasSqueeze
    ? "Yeah, cover up your shorts, short-squeeze rally is the only cure\nEvery shakeout before the breakout hits harder than before"
    : "Yeah, drop the hesitation, momentum breakout is the only cure\nEvery pullback before the rally hits harder than before";

  const lyricsZh = `[Intro]
[Funky electric guitar riff, groovy slap bass and live drums kick in]
[Rapper]
Yeah... 台北時間九點整，紐約那邊剛收盤
你把Ｋ線當作信仰，我把籌碼當作子彈
Listen up, traders... Let's go.

[Verse 1: Male Rapper, sharp rhythmic melodic trap flow]
${verse1LinesZh.join("\n")}

[Pre-Chorus: Male Rapper, melodic flow]
Oh baby, baby, baby，別再問底部在哪裡
這場博弈沒有結局，從我滿倉鎖定你

[Verse 2: Soulful Male Singer, lazy R&B narrative vocal]
美式咖啡加了冰塊慢慢融化
像聯準會嘴硬說的反話，最後都變成笑話
如果說刪掉看盤軟體就能瀟灑
那為何夜盤一跳動，心跳還是會不聽話

[Chorus: Soulful Male Singer, full live band rock R&B explosion]
${hookWordZh}，認了吧認了認了唄
我們多空相隨，殺過台股美股
${hookWordZh}，認了吧認了認了唄
我們多空相隨，總會有人被軋

[Verse 3: Male Rapper, aggressive double-time flow]
${verse3StartZh}
華爾街不懂這種節奏，覺得散戶太過瘋狂
像熱錢碰上了 AI，燒光所有壓力的城牆
不用去猜誰贏誰輸，反正最後同個歸宿
你的留倉我來包覆，我的槓桿向趨勢臣服
把螢幕關掉，呼吸停住，這根尾盤我們都不認輸

[Bridge: Duet Call and Response, stripped back drums and bass]
[Rapper] 盤整太久沒什麼動靜 (認了吧認了認了唄)
[Rapper] 讓籌碼變得太過擁擠 (我承認我追高)
[Rapper] 剩下是無盡的恐懼 (你承認你砍低)
[Rapper] 韭菜有小小的憧憬 (${hookWordZh})
[Rapper] 這Ｋ線太過的鋒利 (就算斷頭出場)
[Rapper] 是誰又吹起了行情 (明天還是一對)

[Guitar Solo: Soulful electric guitar solo with heavy live drum fills]

[Outro]
[Singer]
${hookWordZh}…… 認了吧認了認了唄……
[Rapper]
1, 2, 3, 4, 5, 6, 7, 8, 9
我們${hookWordZh}。
[End]`;

  const lyricsEn = `[Intro]
[Funky electric guitar riff, groovy slap bass and live drums kick in]
[Rapper]
Yeah... 9:30 AM Eastern time, Taipei just closed the bell
You treat the charts like religion, I ride the volatility wave
Listen up, Wall Street... Let's go.

[Verse 1: Male Rapper, sharp rhythmic melodic trap flow]
${verse1LinesEn.join("\n")}

[Pre-Chorus: Male Rapper, melodic flow]
Oh baby, baby, baby, don't ask me where the bottom lies
This casino never closes from the moment our margin collides

[Verse 2: Soulful Male Singer, lazy R&B narrative vocal]
Whiskey on the rocks melting slow inside the glass
Like the Fed's hawkish promises that never seem to last
If deleting trading apps could really set us free
Why does every pre-market alert still get the best of me

[Chorus: Soulful Male Singer, full live band rock R&B explosion]
${hookWordEn}, let it go, just let it fade away
Bull and bear until the end, from Taipei to Broadway
${hookWordEn}, let it go, just let it fade away
Bull and bear until the end, somebody's gotta pay

[Verse 3: Male Rapper, aggressive double-time flow]
${verse3StartEn}
Wall Street suits don't get the rhythm, call the retail crazy fools
Like hot money meeting AI, burning down the old-school rules
No need to guess who wins or loses, we end up in the same place
I'll hedge your wild temper while my leverage sets the pace
Turn the monitors off, hold your breath, we ain't folding at the close

[Bridge: Duet Call and Response, stripped back drums and bass]
[Rapper] Sideways chop for way too long (Let it go, just let it fade away)
[Rapper] Order books are getting crowded (I admit I chased the top)
[Rapper] Nothing left but FOMO fear (You admit you sold the drop)
[Rapper] Retail dreamers holding on (${hookWordEn})
[Rapper] Candlesticks are cutting deep (Even if we get margin called)
[Rapper] Who just sparked another rally (We're back at it tomorrow)

[Guitar Solo: Soulful electric guitar solo with heavy live drum fills]

[Outro]
[Singer]
${hookWordEn}... let it go, just let it fade away...
[Rapper]
1, 2, 3, 4, 5, 6, 7, 8, 9
${hookWordEn}.
[End]`;

  const sunoStyleZh = p.sunoStyleZh.replace("{BPM}", bpm);
  const sunoStyleEn = p.sunoStyleEn.replace("{BPM}", bpm);

  const ytTitlesZh = [
    `【AI饒舌】《多空冤家》｜當台股美股遇上《王牌冤家》曲風！致敬輝達、台積電與每天被洗盤的我們 (Official Audio)`,
    `《多空冤家》Bull & Bear Rivals｜台股美股極致洗盤神曲｜Melodic Rap × 慵懶都會 R&B (${bpm} BPM)`,
    `昨天暴漲三千點、今天重挫洗盤？聽完這首《多空冤家》瞬間釋懷！台積電 ADR、輝達 AI 行情真實寫照 🎵`
  ];

  const ytTitlesEn = [
    `Wall Street Rivals (Bull & Bear) | AI Stock Market Rap × Soulful R&B Duet (NVDA, TSMC, Nasdaq)`,
    `When Bulls & Bears Collide: "Wall Street Rivals" (Official Audio) | Melodic Hip-Hop & Live Band R&B`,
    `From Taipei to Wall Street: The Ultimate Stock Trader Anthem 🎵 "Wall Street Rivals" (${bpm} BPM)`
  ];

  const ytDescZh = `📈 每天盯著台股開盤、熬夜看美股那斯達克與台積電 ADR，我們與股市就像一對相愛相殺的「王牌冤家」！
這首《多空冤家 (Bull & Bear Rivals)》以 ${bpm} BPM 的慵懶都會 R&B 融合強勢俐落的 Melodic Trap 說唱，把近期台股與美股的史詩級大洗盤、AI 算力狂潮、輝達（NVIDIA）與台積電（2330）CoWoS 的護城河、以及聯準會與關稅消息面的雲霄飛車寫進歌裡。

🎧 曲風與編曲亮點：
• 復古 Funky 電吉他 Riff + 現場感爵士真鼓與 Slap Bass
• 雙男聲魅力對唱：強勢節奏饒舌 (Rapper) × 慵懶深情 R&B 副歌 (Vocal)
• 結尾高張力「多空交錯對唱 (Call & Response)」，完美還原追高砍低的真實心境

⏱️ 章節時間軸 (Chapters)：
00:00 Intro - 台北收盤、美股開盤的電吉他 Riff
00:18 Verse 1 - 輝達皮衣男回歸 × 台積電 CoWoS × 暴漲暴跌洗盤
00:52 Pre-Chorus & Verse 2 - 冰美式與聯準會的反話
01:18 Chorus - 就是冤家！多空相隨殺過台股美股
01:48 Verse 3 - 熱錢碰上 AI × 軋空與留倉的對決
02:18 Bridge - 高潮雙人交錯對唱（我承認我追高 / 你承認你砍低）
02:48 Guitar Solo & Outro - 123456789 我們就是冤家

💬 聽完你在哪一邊？留言告訴我們你是「堅定多軍 📈」還是「無情空軍 📉」！
喜歡這首歌曲請按讚、訂閱並分享給身邊一起看盤的朋友！

#台股 #美股 #饒舌 #台積電 #輝達 #NVIDIA #TSMC #AI音樂 #SunoAI #多空冤家 #王牌冤家 #股票音樂 #投資日常 #中文饒舌 #MelodicRap`;

  const ytDescEn = `📈 From late-night Nasdaq futures and NVDA rallies to TSMC's CoWoS dominance and sudden tariff whip-saws—every trader knows the love-hate relationship between Bulls and Bears.
"Wall Street Rivals (Bull & Bear)" blends a ${bpm} BPM groovy live-band R&B/Pop-Rock hook with sharp melodic trap verses and an explosive call-and-response bridge.

🎧 Track Highlights:
• Vintage funky electric guitar riff + live acoustic drums & slap bass
• Dynamic vocal duo: Sharp melodic rap verses × lazy, soulful R&B chorus
• High-voltage Call & Response bridge capturing the thrill of market volatility

⏱️ Chapters:
00:00 Intro - Taipei Close to Wall Street Open (Funky Guitar Riff)
00:18 Verse 1 - NVDA Leather Jacket Return, TSMC Silicon Shield & Tariff Whipsaws
00:52 Pre-Chorus & Verse 2 - Whiskey on the Rocks & Hawkish Fed Talk
01:18 Chorus - We're Born Rivals (Bull & Bear Until the End)
01:48 Verse 3 - Short Squeeze vs. Retail FOMO
02:18 Bridge - Call & Response Duet (Chased the Top / Sold the Drop)
02:48 Guitar Solo & Outro - 1 to 9 We're Born Rivals

💬 Are you riding with the Bulls 📈 or shorting with the Bears 📉? Drop a comment below!
Don't forget to Like, Subscribe, and share this with your trading squad.

#StockMarketRap #WallStreet #NVDA #TSMC #AIMusic #SunoAI #MelodicRap #RnB #TradingLife #BullAndBear #Taiex #Nasdaq`;

  return {
    zh: {
      title: `多空冤家 (Bull & Bear Rivals)`,
      sunoStyle: sunoStyleZh,
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: ytTitlesZh,
      ytDesc: ytDescZh
    },
    en: {
      title: `Wall Street Rivals (Bull & Bear)`,
      sunoStyle: sunoStyleEn,
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: ytTitlesEn,
      ytDesc: ytDescEn
    }
  };
}

function formatLyricsHtml(text) {
  return text
    .split("\n")
    .map((line) => {
      const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (escaped.trim().startsWith("[") && escaped.trim().endsWith("]")) {
        return `<span class="lyric-tag">${escaped}</span>`;
      }
      if (escaped.includes("[Rapper]") && escaped.includes("(")) {
        return escaped
          .replace("[Rapper]", '<span class="lyric-call">[Rapper]</span>')
          .replace(/\(([^)]+)\)/g, '<span class="lyric-response">($1)</span>');
      }
      return escaped;
    })
    .join("\n");
}

function injectExtraTradingBars(pkg) {
  const extraZh = [];
  const extraEn = [];
  const extraTagsZh = [];
  const extraTagsEn = [];

  Object.keys(TRADING_KEYWORD_ENGINE).forEach((key) => {
    if (currentState.topics.has(key)) {
      const item = TRADING_KEYWORD_ENGINE[key];
      extraZh.push(item.zh);
      extraEn.push(item.en);
      extraTagsZh.push(item.tagZh);
      extraTagsEn.push(item.tagEn);
    }
  });

  if (currentState.customKeywords) {
    const kws = currentState.customKeywords
      .split(/[,，、\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (kws.length > 0) {
      extraZh.push(`盤面鎖定 ${kws.join("、")} 的關鍵價位，籌碼與Ｋ線交織出我們的實戰態度`);
      extraEn.push(`Locked in on ${kws.join(", ")} at the key breakout level, conviction and volume setting the pace`);
      kws.forEach((k) => {
        extraTagsZh.push(`#${k.replace(/^#/, "")}`);
        extraTagsEn.push(`#${k.replace(/^#/, "")}`);
      });
    }
  }

  if (extraZh.length > 0) {
    const blockZh = `\n[Trading Alpha Breakdown: Rapid-fire stock operation bars]\n${extraZh.join("\n")}\n`;
    const blockEn = `\n[Trading Alpha Breakdown: Rapid-fire stock operation bars]\n${extraEn.join("\n")}\n`;

    // 插入在最後一個 [Outro 前方
    pkg.zh.lyrics = pkg.zh.lyrics.replace(/\n\[Outro/, `${blockZh}\n[Outro`);
    pkg.en.lyrics = pkg.en.lyrics.replace(/\n\[Outro/, `${blockEn}\n[Outro`);
  }

  if (extraTagsZh.length > 0) {
    pkg.zh.ytDesc += `\n${extraTagsZh.join(" ")}`;
    pkg.en.ytDesc += `\n${extraTagsEn.join(" ")}`;
  }

  return pkg;
}

function renderAll() {
  const pkg = injectExtraTradingBars(buildSongPackage());
  const p = STYLE_PRESETS[currentState.preset];

  // 更新 DNA tags
  const dnaContainer = document.getElementById("ref-dna-tags");
  dnaContainer.innerHTML = p.dnaTags.map((t) => `<span>${t}</span>`).join("");

  const titleEl = document.getElementById("out-song-title");
  const styleEl = document.getElementById("out-suno-style");
  const excludeEl = document.getElementById("out-suno-exclude");
  const lyricsEl = document.getElementById("out-lyrics");
  const ytTitlesEl = document.getElementById("out-yt-titles");
  const ytDescEl = document.getElementById("out-yt-desc");

  if (currentState.lang === "zh") {
    titleEl.textContent = pkg.zh.title;
    styleEl.textContent = pkg.zh.sunoStyle;
    excludeEl.textContent = pkg.zh.sunoExclude;
    lyricsEl.innerHTML = formatLyricsHtml(pkg.zh.lyrics);
    renderYtTitles(ytTitlesEl, pkg.zh.ytTitles);
    ytDescEl.textContent = pkg.zh.ytDesc;
  } else if (currentState.lang === "en") {
    titleEl.textContent = pkg.en.title;
    styleEl.textContent = pkg.en.sunoStyle;
    excludeEl.textContent = pkg.en.sunoExclude;
    lyricsEl.innerHTML = formatLyricsHtml(pkg.en.lyrics);
    renderYtTitles(ytTitlesEl, pkg.en.ytTitles);
    ytDescEl.textContent = pkg.en.ytDesc;
  } else {
    // 雙語並列模式
    titleEl.textContent = `${pkg.zh.title} / ${pkg.en.title}`;
    styleEl.textContent = `[中文版 Style]\n${pkg.zh.sunoStyle}\n\n[English Style]\n${pkg.en.sunoStyle}`;
    excludeEl.textContent = pkg.zh.sunoExclude;
    lyricsEl.innerHTML = `
      <div class="bilingual-grid">
        <div class="bilingual-col">
          <h4>🇹🇼 中文版歌詞 (Suno Meta Tags)</h4>
          <div>${formatLyricsHtml(pkg.zh.lyrics)}</div>
        </div>
        <div class="bilingual-col">
          <h4>🇺🇸 English Version Lyrics (Suno Meta Tags)</h4>
          <div>${formatLyricsHtml(pkg.en.lyrics)}</div>
        </div>
      </div>
    `;
    renderYtTitles(ytTitlesEl, [...pkg.zh.ytTitles.slice(0, 2), ...pkg.en.ytTitles.slice(0, 2)]);
    ytDescEl.textContent = `${pkg.zh.ytDesc}\n\n========================================\n\n${pkg.en.ytDesc}`;
  }
}

function renderYtTitles(container, titles) {
  container.innerHTML = "";
  titles.forEach((t) => {
    const div = document.createElement("div");
    div.className = "yt-title-item";
    div.innerHTML = `
      <span class="yt-title-text">${t}</span>
      <span class="yt-copy-hint">📋 點擊複製</span>
    `;
    div.addEventListener("click", () => copyToClipboard(t, "🔥 已複製 YouTube 標題！"));
    container.appendChild(div);
  });
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  });
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function exportFullMarkdown() {
  const pkg = injectExtraTradingBars(buildSongPackage());
  const md = `# 歌曲製造機 Pro — 台美股饒舌曲風整改全套企劃包

- **參考網址**：${document.getElementById("yt-url").value}
- **曲風設定**：${STYLE_PRESETS[currentState.preset].nameZh} (${currentState.bpm} BPM)

---

## 🇹🇼 中文版：${pkg.zh.title}

### Suno AI Style of Music Prompt
\`\`\`text
${pkg.zh.sunoStyle}
\`\`\`

### Suno AI Exclude Styles
\`\`\`text
${pkg.zh.sunoExclude}
\`\`\`

### 中文版歌詞 (Suno Custom Lyrics)
\`\`\`text
${pkg.zh.lyrics}
\`\`\`

### YouTube 建議標題 (中文)
${pkg.zh.ytTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### YouTube 建議描述 (中文)
\`\`\`text
${pkg.zh.ytDesc}
\`\`\`

---

## 🇺🇸 English Version: ${pkg.en.title}

### Suno AI Style of Music Prompt
\`\`\`text
${pkg.en.sunoStyle}
\`\`\`

### English Lyrics (Suno Custom Lyrics)
\`\`\`text
${pkg.en.lyrics}
\`\`\`

### YouTube Suggested Titles (English)
${pkg.en.ytTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### YouTube Suggested Description (English)
\`\`\`text
${pkg.en.ytDesc}
\`\`\`
`;

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "song-maker-taiex-wallstreet-rap.md";
  a.click();
  URL.revokeObjectURL(url);
  showToast("📥 已匯出中英文全套企劃 (.md)！");
}

/* =========================================================================
   Web Audio API 即時曲風 Groove 合成器 (Funky Guitar + Slap Bass + Drums)
   ========================================================================= */
let audioCtx = null;
let beatTimer = null;
let stepIndex = 0;

function startBeatPreview() {
  if (beatTimer) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();

  document.getElementById("btn-play-beat").disabled = true;
  document.getElementById("btn-stop-beat").disabled = false;
  const statusEl = document.getElementById("beat-status");
  statusEl.textContent = `PLAYING ${currentState.bpm} BPM`;
  statusEl.classList.add("playing");

  stepIndex = 0;
  scheduleNextStep();
}

function scheduleNextStep() {
  const stepMs = (60 / currentState.bpm / 4) * 1000; // 16分音符
  playStep(stepIndex);
  drawBeatVisualizer(stepIndex);
  stepIndex = (stepIndex + 1) % 16;
  beatTimer = setTimeout(scheduleNextStep, stepMs);
}

function stopBeatPreview() {
  if (beatTimer) {
    clearTimeout(beatTimer);
    beatTimer = null;
  }
  document.getElementById("btn-play-beat").disabled = false;
  document.getElementById("btn-stop-beat").disabled = true;
  const statusEl = document.getElementById("beat-status");
  statusEl.textContent = "STOPPED";
  statusEl.classList.remove("playing");
  drawIdleVisualizer();
}

function playStep(step) {
  const now = audioCtx.currentTime;
  // Kick: 0, 3, 8, 10
  if ([0, 3, 8, 10].includes(step)) {
    triggerKick(now);
  }
  // Snare: 4, 12
  if ([4, 12].includes(step)) {
    triggerSnare(now);
  }
  // Hi-hat: 偶數拍 + 切分
  if (step % 2 === 0 || step === 7 || step === 15) {
    triggerHiHat(now, step === 7 || step === 15 ? 0.12 : 0.06);
  }
  // Funky Slap Bass & Guitar Riff
  const bassNotes = { 0: 82.41, 3: 98.0, 6: 110.0, 8: 82.41, 11: 123.47, 14: 110.0 };
  if (bassNotes[step]) {
    triggerBass(now, bassNotes[step]);
  }
}

function triggerKick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(135, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.19);
}

function triggerSnare(time) {
  const bufferSize = audioCtx.sampleRate * 0.12;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 900;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start(time);
}

function triggerHiHat(time, duration) {
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6000;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.14, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start(time);
}

function triggerBass(time, freq) {
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, time);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(950, time);
  filter.frequency.exponentialRampToValueAtTime(220, time + 0.14);
  gain.gain.setValueAtTime(0.28, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.17);
}

function drawIdleVisualizer() {
  const canvas = document.getElementById("beat-visualizer");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / 16;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(i * barWidth + 4, canvas.height - 14, barWidth - 8, 8);
  }
}

function drawBeatVisualizer(activeStep) {
  const canvas = document.getElementById("beat-visualizer");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / 16;
  for (let i = 0; i < 16; i++) {
    const isHit = i === activeStep;
    const h = isHit ? 44 : [0, 4, 8, 12].includes(i) ? 22 : 12;
    ctx.fillStyle = isHit ? "#f59e0b" : [0, 4, 8, 12].includes(i) ? "#3b82f6" : "#1e293b";
    ctx.fillRect(i * barWidth + 4, canvas.height - h - 6, barWidth - 8, h);
  }
}
