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
  "5NPBIwQyPWE": {
    title: "Avril Lavigne《Complicated》Y2K 滑板流行搖滾 × 叛逆女聲吐槽 × 雙倍速快嘴 Rap",
    bpm: 78,
    preset: "avril-complicated",
    vibe: "標誌性「Uh-huh, life's like this!」清脆木吉他刷弦與 Boom-Bap 搖滾鼓點 (78 BPM) × 艾薇兒式酷帥叛逆女聲吐槽裝模作樣的假股神 ×「Why'd you have to go and make things so complicated?」爆發力失真電吉他大合唱 × 156 BPM 雙倍速快嘴 Rap 交鋒",
    dna: ["🛹 \"Uh-huh, Market's Like This!\"", "🎸 Y2K 木吉他刷弦×流行龐克搖滾", "🙄 \"Why'd You Make It So Complicated?\"", "⚡ 叛逆酷女聲×雙倍速吐槽快嘴 Rap"]
  },
  dvgZkm1xWPE: {
    title: "Coldplay《Viva La Vida》史詩巴洛克交響弦樂 × 教堂鐘聲定音鼓 × 股神王朝史詩說唱",
    bpm: 138,
    preset: "coldplay-viva",
    vibe: "標誌性斷奏巴洛克交響小提琴與大提琴齊奏 × 138 BPM 磅礴定音鼓與教堂大鐘敲響 × 英倫搖滾史詩敘事男聲（「I used to rule the world...」）與激昂敘事快嘴 Rap ×「Whoa-oh-oh-oh-oh!」五萬人體育館聖歌大合唱",
    dna: ["🎻 標誌性巴洛克交響弦樂齊奏", "🔔 138 BPM 教堂大鐘×磅礴定音鼓", "👑 \"I Used To Rule The World!\"", "🏟️ \"Whoa-oh-oh-oh!\" 萬人聖歌大合唱"]
  },
  kXYiU_JCYtU: {
    title: "Linkin Park《Numb》千禧 Nu-Metal 合成器 × 撕裂嘶吼高音 × 雙主唱交錯 Rap-Rock",
    bpm: 110,
    preset: "lp-numb",
    vibe: "標誌性空靈電子合成器前奏 Loop × 110 BPM 厚重失真 Nu-Metal 電吉他音牆與炸裂真鼓 × Mike 式冷靜犀利快嘴 Rap 與 Chester 式靈魂撕裂高音嘶吼（「I've become so numb!」）雙軌交錯對撞",
    dna: ["🎹 標誌性空靈電子合成器 Riff", "🎸 110 BPM 厚重 Nu-Metal 吉他音牆", "🔥 \"I've Become So Numb!\" 撕裂嘶吼", "🎤 雙主唱 Mike 快嘴×Chester 高音交疊"]
  },
  bo_efYhYU2A: {
    title: "Lady Gaga & Bradley Cooper《Shallow》木吉他深情男女對唱 × 靈魂撕裂高音 × 走心股市說唱",
    bpm: 96,
    preset: "gaga-shallow",
    vibe: "溫暖指彈木吉他與現場萬人歡呼開場 × 96 BPM 粗獷滄桑男聲低語與深情女聲對話 × 走心敘事 Melodic Rap 主歌 × Bridge「Ah-ah-ah-ah, ah-aaaaah!」核爆級女高音嘶吼破頂 ×「We're far from the shallow now!」體育館大合唱",
    dna: ["🎸 溫暖指彈木吉他×鋼琴搖滾", "👩‍❤️‍👨 滄桑男聲×鐵肺女聲靈魂對唱", "🔥 \"Ah-ah-ah-aaaah!\" 核爆高音 Bridge", "🌊 \"We're Far From The Shallow Now!\""]
  },
  qrO4YZeyl0I: {
    title: "Lady Gaga《Bad Romance》暗黑歌劇電音 Synth-Pop × 股市虐戀雙人說唱",
    bpm: 119,
    preset: "gaga-badromance",
    vibe: "標誌性歌劇合成器前奏與「Oh-oh-oh-oh-oh, caught in a bad romance!」× 119 BPM 狂暴工業電音鋸齒 Bass 與四四拍重鼓 × 超洗腦「Rah-rah-ah-ah-ah, Roma-roma-ma」咒語 Hook × 女王低沉戲劇唸唱與硬派快嘴 Rapper 雙軌對撞",
    dna: ["👑 \"Rah-rah-ah-ah-ah!\" 洗腦咒語", "🎹 119 BPM 暗黑歌劇電音 Synth-Pop", "💔 \"Caught in a Bad Romance!\" 股市虐戀", "⚡ 法語戲劇 Bridge × 炸裂快嘴 Rap"]
  },
  Thzt3Hi6ihM: {
    title: "Michael Jackson《Thriller (顫慄)》80s 暗黑放克合成器 × 午夜崩盤驚悚饒舌",
    bpm: 118,
    preset: "mj-thriller",
    vibe: "標誌性午夜狼嚎與木門嘎吱聲開場 × 118 BPM 傳奇 Minimoog 放克合成器 Bassline 與銅管齊奏 × 流行之王爆發力律動唱腔與緊湊 Funk-Rap 交錯 ×「'Cause this is Thriller, Thriller night!」萬人殭屍舞步副歌 × 結尾 Vincent Price 莊家低沉恐怖獨白與邪惡狂笑",
    dna: ["🧟 80s Minimoog 暗黑放克 Bassline", "🕺 118 BPM 流行之王律動×Funk-Rap", "🌕 \"'Cause This Is Thriller Night!\"", "🦇 結尾莊家低音恐怖獨白+邪惡笑聲"]
  },
  sOnqjkJTMaA: {
    title: "Michael Jackson《Thriller (Official 4K MV)》80s 暗黑放克合成器 × 午夜崩盤驚悚饒舌",
    bpm: 118,
    preset: "mj-thriller",
    vibe: "標誌性午夜狼嚎與木門嘎吱聲開場 × 118 BPM 傳奇 Minimoog 放克合成器 Bassline 與銅管齊奏 × 流行之王爆發力律動唱腔與緊湊 Funk-Rap 交錯 ×「'Cause this is Thriller, Thriller night!」萬人殭屍舞步副歌 × 結尾 Vincent Price 莊家低沉恐怖獨白與邪惡狂笑",
    dna: ["🧟 80s Minimoog 暗黑放克 Bassline", "🕺 118 BPM 流行之王律動×Funk-Rap", "🌕 \"'Cause This Is Thriller Night!\"", "🦇 結尾莊家低音恐怖獨白+邪惡笑聲"]
  },
  S3IQwuYX_ls: {
    title: "One Direction《What Makes You Beautiful》陽光衝浪吉他 Pop-Rock × 男團多巴胺饒舌",
    bpm: 125,
    preset: "oned-beautiful",
    vibe: "標誌性清脆衝浪搖滾電吉他 Riff × 125 BPM 青春熱血 Power-Pop 四四拍鼓點 × 少年男團活力接力 Melodic Rap ×「Baby you light up my account like nobody else!」超洗腦多巴胺大合唱（Na-na-na）",
    dna: ["🎸 陽光衝浪電吉他 Riff", "👦 125 BPM 男團接力 Pop-Rap", "✨ \"You Light Up My Account!\"", "🏖️ \"Na-na-na\" 漲停多巴胺大合唱"]
  },
  vx2u5uUu3DE: {
    title: "Bon Jovi《It's My Life》傳奇體育館硬式搖滾 × 華爾街熱血 Rap-Rock 戰歌",
    bpm: 120,
    preset: "bonjovi-mylife",
    vibe: "經典 Talk-Box 哇音失真電吉他 Riff (Bow-wow-wow) × 120 BPM 炸裂體育館真鼓與重低音 × 硬派 Rap-Rock 節奏主歌 ×「It's my life, it's now or never!」萬人嘶吼破頂大合唱",
    dna: ["🎸 Talk-Box 哇音電吉他 Riff", "🏟️ 120 BPM 體育館硬式搖滾", "🔥 \"It's My Life, Now or Never!\"", "⚡ 硬核 Rap-Rock 交易員戰歌"]
  },
  x3bDhtuC5yk: {
    title: "茄子蛋 EggPlantEgg《浪子回頭 (Back Here Again)》台式滄桑藍調搖滾 × 散戶浪子饒舌",
    bpm: 78,
    preset: "prodigal-return",
    vibe: "催淚雙電吉他 Solo 與復古 Hammond 風琴 (78 BPM) × 阿斌式極致沙啞撕裂滄桑菸酒嗓（「菸一支一支一支地點，酒一杯一杯一杯地乾」）× 台語國語交錯走心散戶浪子敘事 Rap × 萬人KTV熱血大合唱",
    dna: ["🎸 催淚藍調電吉他×復古風琴", "🚬 「單一張一張地敲」沙啞菸酒嗓", "🍺 台式浪子國台語交錯走心 Rap", "😭 結尾雙吉他 Solo 萬人大合唱"]
  },
  K1j4kneapVY: {
    title: "PACT 派克特 & 寶石Gem《你也是個Rapper》全場群嘲 Satire × 雙段變奏硬核說唱",
    bpm: 98,
    preset: "you-too-rapper",
    vibe: "戲謔銅管馬戲團感 Boom-Bap (98 BPM) × 寶石老舅幽默嘴替點名群嘲（「他也少年股神、你也少年股神」）× 派克特中段 Beat Switch 炸裂硬核技術流快嘴 Real Talk",
    dna: ["🤡 戲謔銅管×老學校 Boom-Bap", "🗣️ 「你也是個股神」群嘲大合唱", "🔥 寶石Gem幽默嘴替辛辣點名", "⚡ 派克特 Beat Switch 硬核快嘴"]
  },
  "j-iN8RD44dI": {
    title: "楊宗緯 & 寶石Gem & 王宇宙《若月亮沒來》治癒哭腔 × 催淚走心敘事說唱",
    bpm: 84,
    preset: "moon-notcome",
    vibe: "溫暖鋼琴與木吉他 R&B 抒情 Hip-Hop (84 BPM) × 王宇宙清亮治癒副歌（「若是月亮還沒來，路燈也可照窗台」）× 楊宗緯細膩催淚哭腔 × 寶石老舅深夜走心散戶獨白 Rap",
    dna: ["🌙 溫暖鋼琴×木吉他 R&B", "😭 楊宗緯式深情催淚哭腔", "🎙️ 寶石老舅深夜走心敘事 Rap", "🏮 「若是月亮還沒來」治癒大合唱"]
  },
  "s4pxJ-1QLQg": {
    title: "G.E.M. 鄧紫棋《差不多姑娘 (Miss Similar)》女王覺醒快嘴×鐵肺高音",
    bpm: 94,
    preset: "gem-misssimilar",
    vibe: "致敬熱狗《差不多先生》古典鋼琴迴圈 × 現代 Trap Boom-Bap 重鼓點 (94 BPM) ×「差不多的…」犀利排比反諷主歌 × 鄧紫棋式爆發力女聲快嘴與鐵肺高音覺醒副歌",
    dna: ["🎹 經典鋼琴 Loop×Trap 808", "👑 鄧紫棋式女聲快嘴+鐵肺高音", "🔁 「差不多的…」排比反諷 Flow", "🔥 撕掉韭菜標籤覺醒高潮"]
  },
  "50BCt8bptDg": {
    title: "GAI 周延《苦行僧 (Ascetic Monk)》江湖搖滾國風 Trap 說唱",
    bpm: 90,
    preset: "gai-ascetic",
    vibe: "崔健經典搖滾失真電吉他 Riff × 滄桑古琴竹笛國風 Trap 重低音 808 (90 BPM) × GAI 式霸氣江湖川味草莽唱腔 × 「我想要從南走到北」蒼涼大合唱副歌",
    dna: ["🎸 搖滾失真吉他×國風古琴", "🐉 GAI式霸氣江湖草莽腔", "🥁 沉重 Trap 808 × 戰鼓", "🍶 「從南走到北」蒼涼大合唱"]
  },
  IBaWc3C00kU: {
    title: "那吾克熱 & 尤長靖《飄向北方 (Stranger in the North)》史詩高音×機關槍快嘴 Live",
    bpm: 92,
    preset: "drift-north",
    vibe: "史詩古典鋼琴與管弦樂搖滾 Hip-Hop (92 BPM) × 尤長靖清澈穿透高音抒情副歌 × 那吾克熱窒息式雙倍速機關槍快嘴 × 結尾高音與快嘴燃炸交疊",
    dna: ["🎹 史詩鋼琴×管弦搖滾", "🎤 尤長靖式穿透高音副歌", "⚡ 那吾克熱機關槍快嘴", "🔥 高音×快嘴雙軌交疊高潮"]
  },
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
  "avril-complicated": {
    nameZh: "Avril Lavigne《Complicated》風：Y2K 木吉他流行龐克搖滾 ×「Why'd you make it so complicated?」叛逆女聲 × 吐槽假股神快嘴 Rap",
    defaultBpm: 78,
    sunoStyleZh:
      "Early 2000s Y2K teen pop-rock and skate-punk acoustic-rock crossover fused with witty double-time melodic rap, {BPM} BPM, iconic laid-back spoken intro (Uh-huh, market's like this!) over bright strummed acoustic guitar and punchy mid-tempo boom-bap rock drums, charismatic rebellious young female rock vocalist with attitude and crystal-clear angst, exploding into crunchy distorted power-chord electric guitars on the anthemic sing-along chorus (Why'd you have to go and make trading so complicated?), trading sharp satirical double-time rap bars with a witty male rapper",
    sunoStyleEn:
      "2002 Y2K skate-pop-rock and alternative acoustic-punk anthem fused with playful double-time hip-hop rap, {BPM} BPM, signature spoken intro (Uh-huh, life's like this!) over crisp acoustic guitar strumming and hip-hop-inflected live rock drums, sassy rebellious female rock lead vocal exploding into a massive distorted electric guitar chorus belt (Why'd you have to go and make trading so complicated?), paired with a rapid-fire satirical rap verse roasting fake Wall Street gurus, pure early-2000s nostalgia energy",
    sunoExclude: "dark horror metal, slow funeral organ, EDM trance, country twang, robotic autotune",
    dnaTags: ["🛹 \"Uh-huh, Market's Like This!\"", "🎸 Y2K 木吉他刷弦×流行龐克搖滾", "🙄 \"Why'd You Make It So Complicated?\"", "⚡ 叛逆酷女聲×雙倍速吐槽快嘴 Rap"]
  },
  "coldplay-viva": {
    nameZh: "Coldplay《Viva La Vida》風：史詩巴洛克交響弦樂 × 教堂鐘聲定音鼓 ×「Whoa-oh-oh」萬人聖歌與王朝說唱",
    defaultBpm: 138,
    sunoStyleZh:
      "Epic baroque pop-rock and orchestral stadium anthem fused with cinematic storytelling hip-hop rap, {BPM} BPM, iconic staccato orchestral string section (violins and cellos) driving the main rhythm, booming timpani drums and resonant cathedral church bells, warm emotional British rock male vocalist singing a fallen-king narrative (I used to rule the trading floor!) answered by a passionate rapid-fire storytelling male rapper, massive euphoric 50,000-crowd stadium choir chant (Whoa-oh-oh-oh-oh-oh!), triumphant and majestic live concert atmosphere",
    sunoStyleEn:
      "2000s British baroque pop-rock and orchestral arena anthem fused with cinematic conscious hip-hop rap, {BPM} BPM, signature driving staccato violin and cello string ostinato, booming orchestral timpani and tolling cathedral bells, soulful warm British rock male lead vocal trading verses with an intense multi-syllable storytelling male rapper, soaring anthemic chorus and massive stadium crowd chant (Whoa-oh-oh-oh-oh-oh!), majestic uplifting triumph",
    sunoExclude: "dark underground drill, trap cowbell, heavy metal screaming, lo-fi mumble, country",
    dnaTags: ["🎻 標誌性巴洛克交響弦樂齊奏", "🔔 138 BPM 教堂大鐘×磅礴定音鼓", "👑 \"I Used To Rule The World!\"", "🏟️ \"Whoa-oh-oh-oh!\" 萬人聖歌大合唱"]
  },
  "lp-numb": {
    nameZh: "Linkin Park《Numb》風：標誌性電子合成器 Loop × 厚重 Nu-Metal 電吉他音牆 × 撕裂高音嘶吼與雙主唱 Rap-Rock",
    defaultBpm: 110,
    sunoStyleZh:
      "2000s nu-metal and alternative rap-rock stadium anthem, {BPM} BPM, iconic haunting electronic synth-pad melody intro and turntable DJ scratch textures, massive wall of drop-D distorted electric guitars and thunderous live acoustic drums, dual male vocalists: calm urgent emotional clean rock tenor in the verses exploding into raw agonizing raspy high-note vocal screams on the chorus (I've become so numb, I can't feel my portfolio!), interlocked with a razor-sharp rhythmic hip-hop male rapper delivering rapid-fire counter-bars, cathartic stadium angst and awakening energy",
    sunoStyleEn:
      "2000s Meteora-era nu-metal and alternative rap-rock crossover anthem, {BPM} BPM, signature haunting electronic synth lead intro, massive distorted power-chord guitar wall, heavy bass and punchy live rock drums, dual male vocal interplay between a urgent melodic rock tenor exploding into raw emotional high-register fry-scream chorus belts (I've become so numb!) and a tight rhythmic male rapper trading overlapping counter-verses, pure cathartic arena rock power",
    sunoExclude: "bubblegum pop, country, gentle jazz lounge, cheerful ukulele, disco",
    dnaTags: ["🎹 標誌性空靈電子合成器 Riff", "🎸 110 BPM 厚重 Nu-Metal 吉他音牆", "🔥 \"I've Become So Numb!\" 撕裂嘶吼", "🎤 雙主唱 Mike 快嘴×Chester 高音交疊"]
  },
  "gaga-shallow": {
    nameZh: "Lady Gaga & Bradley Cooper《Shallow》風：木吉他深情男女對唱 ×「Ah-ah-aaaah」核爆女高音 × 走心股市說唱",
    defaultBpm: 96,
    sunoStyleZh:
      "Cinematic arena folk-pop rock ballad and emotional melodic hip-hop duet, {BPM} BPM, intimate fingerpicked acoustic guitar and warm grand piano intro with live stadium crowd ambience, warm gravelly raspy male baritone vocalist opening in a tender conversational tone, answered by a powerhouse soulful female vocalist building from intimate vulnerability into an earth-shattering chest-voice high-note scream in the bridge (Ah-ah-ah-ah, ah-aaaaah!), heartfelt melodic storytelling rap interlude, crashing live stadium rock drums and soaring electric guitars in the final duet chorus (I'm off the deep end, watch as I dive in, we're far from the shallow now!)",
    sunoStyleEn:
      "Academy-Award style cinematic acoustic rock ballad fused with heartfelt melodic rap duet, {BPM} BPM, delicate fingerpicked acoustic guitar and grand piano building into a massive live stadium rock climax, weathered raspy male vocalist and powerhouse soulful female diva trading intimate verses, emotional storytelling rap bars, explosive goosebump-inducing female vocal belt bridge (Ah-ah-ah-ah, ah-aaaaah!), triumphant duet chorus (I'm off the deep end, watch as I dive in, we're far from the shallow now!)",
    sunoExclude: "EDM, techno, trap cowbell, robotic autotune, mumble rap, disco",
    dnaTags: ["🎸 溫暖指彈木吉他×鋼琴搖滾", "👩‍❤️‍👨 滄桑男聲×鐵肺女聲靈魂對唱", "🔥 \"Ah-ah-ah-aaaah!\" 核爆高音 Bridge", "🌊 \"We're Far From The Shallow Now!\""]
  },
  "gaga-badromance": {
    nameZh: "Lady Gaga《Bad Romance》風：暗黑歌劇電音 Synth-Pop ×「Rah-rah-ah-ah-ah」洗腦咒語 × 股市虐戀雙人說唱",
    defaultBpm: 119,
    sunoStyleZh:
      "Dark theatrical Euro-dance electropop and industrial synth-pop anthem fused with hard-hitting hip-hop rap duet, {BPM} BPM, iconic dramatic operatic synth-choir intro (Oh-oh-oh-oh-oh, caught in a bad romance!) and hypnotic stuttering vocal chant (Rah-rah-ah-ah-ah, roma-roma-ma, gaga-ooh-la-la!), heavy distorted sawtooth synth bassline and pounding four-on-the-floor stadium club drums, powerhouse theatrical female vocalist switching between deep sultry spoken-sung verses and soaring stadium diva chorus belts, trading fiery rapid-fire bars with an aggressive male rapper, dramatic spoken-word French-style bridge build-up",
    sunoStyleEn:
      "2010s dark theatrical electro-house synth-pop and industrial dance-pop anthem fused with explosive hip-hop rap duet, {BPM} BPM, iconic operatic synth intro and infectious stuttering chant hook (Rah-rah-ah-ah-ah, roma-roma-ma, gaga-ooh-la-la!), gritty sawtooth synth bass and thumping four-on-the-floor club drums, fierce theatrical female pop diva delivering sultry low-register verses and massive soaring stadium chorus vocals alongside a razor-sharp rapid-fire male rapper, dramatic French-inflected spoken bridge climax",
    sunoExclude: "gentle acoustic folk, country, slow sleepy lullaby, soft jazz lounge, monotone mumble",
    dnaTags: ["👑 \"Rah-rah-ah-ah-ah!\" 洗腦咒語", "🎹 119 BPM 暗黑歌劇電音 Synth-Pop", "💔 \"Caught in a Bad Romance!\" 股市虐戀", "⚡ 法語戲劇 Bridge × 炸裂快嘴 Rap"]
  },
  "mj-thriller": {
    nameZh: "Michael Jackson《Thriller 顫慄》風：80s 暗黑放克合成器 Bass × 午夜驚悚律動 Rap × 莊家邪惡笑聲獨白",
    defaultBpm: 118,
    sunoStyleZh:
      "80s dark cinematic synth-funk disco-pop and theatrical horror-funk hip-hop anthem, {BPM} BPM, creaking door and midnight wolf howl intro into iconic driving Minimoog synth-bass groove, punchy LinnDrum machine beat, funky rhythm guitar strums and blazing brass horn stabs, electrifying high-tenor King-of-Pop style male vocalist with crisp hiccup ad-libs (Hee-hee! Ow!) trading bars with a sharp rhythmic funk-rapper, explosive anthemic chorus ('Cause this is Thriller, Margin-Call Thriller Night!), theatrical deep baritone Vincent Price style sinister spoken-word bridge and evil laugh outro",
    sunoStyleEn:
      "1980s Quincy Jones style cinematic dark synth-funk pop-disco fused with theatrical horror-funk rap, {BPM} BPM, midnight wolf howl and footsteps intro into legendary punchy Minimoog bassline, crisp 80s drum machine and funky horn section stabs, charismatic dynamic high-tenor male lead vocal with percussive vocal hiccups and ad-libs trading verses with a tight rhythmic funk-rapper, massive stadium dance chorus ('Cause this is Thriller, Liquidation Night!), sinister deep-voiced theatrical spoken-word monologue and evil laugh finale",
    sunoExclude: "slow acoustic folk, country, gentle lullaby, monotone mumble rap, heavy metal screaming",
    dnaTags: ["🧟 80s Minimoog 暗黑放克 Bassline", "🕺 118 BPM 流行之王律動×Funk-Rap", "🌕 \"'Cause This Is Thriller Night!\"", "🦇 結尾莊家低音恐怖獨白+邪惡笑聲"]
  },
  "oned-beautiful": {
    nameZh: "One Direction《What Makes You Beautiful》風：陽光衝浪吉他 × 男團多巴胺接力 Rap × 超洗腦大合唱",
    defaultBpm: 125,
    sunoStyleZh:
      "Upbeat sunny teen pop-rock and power-pop boyband anthem fused with bouncy melodic pop-rap, {BPM} BPM, iconic bright surf-rock electric guitar riff and cowbell intro, driving four-on-the-floor live drums and punchy bass, charismatic youthful male vocal group trading verses and playful rapid-fire melodic rap bars, explosive euphoric gang-vocal sing-along chorus with handclaps and Na-na-na post-chorus chant, pure summer beach party dopamine energy",
    sunoStyleEn:
      "Upbeat British boyband power-pop and pop-rock anthem fused with playful melodic pop-rap, {BPM} BPM, iconic bright surf-rock electric guitar riff and cowbell intro, energetic live drums and driving bass, five youthful charismatic male vocalists trading verses, harmonies and bouncy rap bars, massive euphoric stadium sing-along chorus (Baby you light up my chart like nobody else!) and Na-na-na hook, pure sunshine feel-good energy",
    sunoExclude: "dark depressing ballad, heavy metal screaming, slow doom, gritty underground drill, funeral organ",
    dnaTags: ["🎸 陽光衝浪電吉他 Riff", "👦 125 BPM 男團接力 Pop-Rap", "✨ \"You Light Up My Account!\"", "🏖️ \"Na-na-na\" 漲停多巴胺大合唱"]
  },
  "bonjovi-mylife": {
    nameZh: "Bon Jovi《It's My Life》風：Talk-Box 哇音電吉他 × 體育館硬式搖滾嘶吼 × 熱血 Rap-Rock 戰歌",
    defaultBpm: 120,
    sunoStyleZh:
      "2000s stadium hard rock and rap-rock anthem, {BPM} BPM, iconic talk-box wah-wah distorted electric guitar riff intro, massive arena live acoustic drums and driving bassline, palm-muted rock guitar with punchy rhythmic rap-rock male vocals in the verses, explosive raspy high-energy stadium rock male lead vocalist belting an unstoppable anthemic gang-vocal chorus (It's my life, it's now or never!), soaring melodic guitar solo, pure adrenaline concert energy",
    sunoStyleEn:
      "2000s arena hard rock and rap-rock crossover anthem, {BPM} BPM, signature talk-box wah-wah distorted electric guitar riff intro, booming stadium drums and driving bass, tight palm-muted guitar chugs with fiery rhythmic rap-rock delivery in verses, powerhouse raspy rock tenor vocalist belting a massive stadium chant chorus (It's my trade, it's now or never!), epic melodic rock guitar solo, Bon Jovi meets Linkin Park stadium energy",
    sunoExclude: "slow sad acoustic ballad, lo-fi chill, gentle whisper, country, jazz lounge, mumble rap",
    dnaTags: ["🎸 Talk-Box 哇音電吉他 Riff", "🏟️ 120 BPM 體育館硬式搖滾", "🔥 \"It's My Life, Now or Never!\"", "⚡ 硬核 Rap-Rock 交易員戰歌"]
  },
  "prodigal-return": {
    nameZh: "茄子蛋《浪子回頭》風：催淚藍調電吉他 × 沙啞菸酒嗓大合唱 × 台式浪子走心饒舌",
    defaultBpm: 78,
    sunoStyleZh:
      "Taiwanese Hokkien and Mandarin indie blues rock ballad fused with heartfelt street storytelling rap, {BPM} BPM, soulful weeping vintage electric guitar intro and warm Hammond B3 organ chords, slow heavy live acoustic drums and bass, deeply raspy weathered emotional male rock vocalist screaming with raw heartbreak, gritty Taiwanese street-poet male rapper delivering remorseful yet defiant late-night trader confession verses, anthemic tavern gang-vocal sing-along chorus, epic crying twin-guitar solo finale",
    sunoStyleEn:
      "Heartland blues-rock ballad fused with gritty conscious storytelling hip-hop, {BPM} BPM, weeping vintage Stratocaster guitar lead and warm Hammond organ over slow heavy live drums, deeply raspy whisky-soaked male rock vocalist belting an emotional tavern sing-along chorus, raw street-poet male rapper confessing late-night trading scars and redemption in the verses, soaring crying guitar solo finale",
    sunoExclude: "EDM, techno, bubblegum pop, cute female vocal, fast trap cowbell, robotic autotune",
    dnaTags: ["🎸 催淚藍調電吉他×復古風琴", "🚬 「單一張一張地敲」沙啞菸酒嗓", "🍺 台式浪子國台語交錯走心 Rap", "😭 結尾雙吉他 Solo 萬人大合唱"]
  },
  "you-too-rapper": {
    nameZh: "派克特&寶石Gem《你也是個Rapper》風：辛辣群嘲假股神 × 洗腦大合唱 × 硬核 Beat Switch 快嘴",
    defaultBpm: 98,
    sunoStyleZh:
      "Mandarin satirical comedy boom-bap hip-hop duo switching into aggressive hardcore trap-bap, {BPM} BPM, quirky bouncy brass horn loop and funky upright bass with turntable scratches in part one, witty theatrical northern male rapper delivering hilarious sarcastic roast punchlines and a catchy crowd sing-along chant hook, sudden dramatic beat switch in part two into dark heavy 808 hardcore drums with an explosive rapid-fire technical fast-flow male rapper spitting real talk, live cypher riot energy",
    sunoStyleEn:
      "Satirical comedy boom-bap hip-hop duo with dramatic mid-song beat switch into hardcore technical rap, {BPM} BPM, quirky brass horns, slap bass and DJ scratches in first half with charismatic witty male rapper roasting fake gurus over a crowd chant hook, sudden dark heavy 808 beat switch in second half with breathless double-time multi-syllable technical male rapper spitting raw truth, Eminem meets 90s cypher energy",
    sunoExclude: "slow sad ballad, romantic R&B, country, gentle acoustic folk, EDM trance",
    dnaTags: ["🤡 戲謔銅管×老學校 Boom-Bap", "🗣️ 「你也是個股神」群嘲大合唱", "🔥 寶石Gem幽默嘴替辛辣點名", "⚡ 派克特 Beat Switch 硬核快嘴"]
  },
  "moon-notcome": {
    nameZh: "《若月亮沒來》楊宗緯&寶石Gem風：治癒旋律副歌 × 催淚哭腔 × 深夜走心敘事說唱",
    defaultBpm: 84,
    sunoStyleZh:
      "Mandarin emotional healing melodic hip-hop R&B ballad trio, {BPM} BPM, warm acoustic guitar and gentle grand piano intro with soft boom-bap R&B drums and lush strings, breathy tearful soulful male balladeer with signature emotional sobbing vibrato, warm clear youthful chorus vocal singing a comforting poetic melody, deep resonant narrative male rapper delivering heartfelt late-night working-class storytelling verses, tear-jerking live stage empathy",
    sunoStyleEn:
      "Emotional healing melodic hip-hop R&B ballad duet, {BPM} BPM, warm acoustic guitar and grand piano with gentle boom-bap R&B drums and sweeping strings, soulful tearful male vocalist singing a comforting poetic chorus with emotional vibrato, deep heartfelt storytelling male rapper delivering late-night struggle and resilience verses, raw live stage emotion",
    sunoExclude: "aggressive screaming metal, fast techno, EDM, dark drill, trap cowbell, harsh distortion",
    dnaTags: ["🌙 溫暖鋼琴×木吉他 R&B", "😭 楊宗緯式深情催淚哭腔", "🎙️ 寶石老舅深夜走心敘事 Rap", "🏮 「若是月亮還沒來」治癒大合唱"]
  },
  "gem-misssimilar": {
    nameZh: "鄧紫棋《差不多姑娘》風：經典鋼琴 Loop ×「差不多的」排比快嘴 × 鐵肺女高音覺醒",
    defaultBpm: 94,
    sunoStyleZh:
      "Mandarin female hip-hop R&B pop-rap anthem, {BPM} BPM, melancholic classical piano loop sampled over punchy modern trap boom-bap 808 drums, charismatic powerhouse female vocalist switching seamlessly between sharp rhythmic satirical rap verses, explosive double-time fast flow, and soaring diva belt high-note chorus, fierce empowering real-talk vibe",
    sunoStyleEn:
      "Female conscious pop-rap and R&B hip-hop anthem, {BPM} BPM, classical piano loop over hard-hitting modern trap boom-bap 808 bass, powerhouse female artist delivering sharp satirical anaphora rap verses, breathless double-time fast flow breakdown, and soaring soulful diva high notes on the hook, empowering awakening energy",
    sunoExclude: "male vocal only, heavy metal screaming, country, EDM, techno, lo-fi mumble",
    dnaTags: ["🎹 經典鋼琴 Loop×Trap 808", "👑 鄧紫棋式女聲快嘴+鐵肺高音", "🔁 「差不多的…」排比反諷 Flow", "🔥 撕掉韭菜標籤覺醒高潮"]
  },
  "gai-ascetic": {
    nameZh: "GAI《苦行僧》風：搖滾電吉他×國風古琴 Trap × 霸氣江湖草莽說唱 × 蒼涼大合唱",
    defaultBpm: 90,
    sunoStyleZh:
      "Chinese Jianghu wuxia trap rock hip-hop, {BPM} BPM, classic gritty distorted rock electric guitar riff fused with traditional guqin, suona horn and bamboo flute, booming heavy 808 sub-bass and war drums, raspy powerful aggressive southwestern Chinese dialect-inflected male rapper with raw outlaw swagger, weathered soulful rock sing-along chorus, epic live arena energy",
    sunoStyleEn:
      "East-meets-West outlaw blues-rock trap hip-hop, {BPM} BPM, gritty vintage distorted electric guitar riff fused with traditional Chinese guqin and bamboo flute, booming 808 bass and heavy live stomp drums, raspy aggressive male rapper with bold street-warrior swagger, weathered anthemic rock chant chorus, stadium live power",
    sunoExclude: "bubblegum pop, cute female vocal, EDM, techno, gentle whisper, disco",
    dnaTags: ["🎸 搖滾失真吉他×國風古琴", "🐉 GAI式霸氣江湖草莽腔", "🥁 沉重 Trap 808 × 戰鼓", "🍶 「從南走到北」蒼涼大合唱"]
  },
  "drift-north": {
    nameZh: "那吾克熱&尤長靖《飄向北方》風：史詩鋼琴管弦 × 穿透高音副歌 × 炸裂機關槍快嘴",
    defaultBpm: 92,
    sunoStyleZh:
      "Mandarin cinematic orchestral hip-hop rock duet, {BPM} BPM, emotional grand piano intro building with dramatic strings and heavy live rock drums, soaring crystal-clear high-tenor male vocalist singing a heartbroken yet powerful anthemic chorus, explosive double-time machine-gun fast-flow male rapper with raw grit and multi-syllable rhymes, climactic final chorus with overlapping high-note vocals and rapid-fire rap counter-melody, stadium live emotion",
    sunoStyleEn:
      "Cinematic orchestral hip-hop rock duet, {BPM} BPM, melancholic grand piano and sweeping strings with heavy live boom-bap rock drums, soaring powerhouse high-tenor male vocalist on the emotional chorus, breathless double-time chop-flow male rapper delivering intense rapid-fire storytelling verses, Linkin Park meets Eminem & Skylar Grey stadium climax with overlapping high notes and fast rap",
    sunoExclude: "happy bubblegum pop, EDM, techno, trap cowbell, mumble rap, country, lo-fi whisper",
    dnaTags: ["🎹 史詩鋼琴×管弦搖滾", "🎤 尤長靖式穿透高音副歌", "⚡ 那吾克熱機關槍快嘴", "🔥 高音×快嘴雙軌交疊高潮"]
  },
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
  preset: "avril-complicated",
  bpm: 78,
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
  customKeywords: "",
  randomSeed: Date.now(),
  variantMap: {},
  autoRandomStocks: []
};

const ALL_TOPIC_KEYS = [
  "nvda",
  "tsmc",
  "whipsaw",
  "tariff",
  "etf",
  "BBU",
  "robot",
  "cpi",
  "squeeze",
  "daytrade",
  "margincall",
  "settlement",
  "limitlock",
  "pledge",
  "jail",
  "levETF",
  "wick",
  "ma",
  "macd",
  "fibonacci",
  "orderbook",
  "vwap",
  "gap",
  "bollinger",
  "options",
  "ZeroDTE",
  "inst",
  "broker",
  "fomo",
  "pcr",
  "retail",
  "afterhours",
  "wendys",
  "inverse",
  "oneLot",
  "ancestors",
  "noodles",
  "appDelete",
  "shipping",
  "diamond",
  "buffett",
  "guru"
];

const RANDOM_STOCK_POOL = [
  { zh: "台積電 (2330) CoWoS 晶圓", en: "TSMC 2330 CoWoS wafers", tag: "#台積電2330" },
  { zh: "輝達 (NVDA) Blackwell 算力", en: "NVIDIA Blackwell GPU cluster", tag: "#輝達NVDA" },
  { zh: "鴻海 (2317) GB200 伺服器機櫃", en: "Foxconn GB200 AI server racks", tag: "#鴻海2317" },
  { zh: "聯發科 (2454) 邊緣 AI 旗艦晶片", en: "MediaTek edge-AI flagship silicon", tag: "#聯發科2454" },
  { zh: "廣達 (2382) 雲端資料中心大單", en: "Quanta cloud data-center orders", tag: "#廣達2382" },
  { zh: "奇鋐 (3017) 雙相水冷散熱模組", en: "AVC liquid-cooling thermal modules", tag: "#水冷散熱" },
  { zh: "長榮 (2603) 紅海運價報價", en: "Evergreen Red-Sea container freight rates", tag: "#航海王貨櫃" },
  { zh: "世芯-KY (3661) ASIC 客製化晶片", en: "Alchip custom ASIC silicon", tag: "#千金股ASIC" },
  { zh: "特斯拉 (TSLA) FSD 自駕與機器人", en: "Tesla FSD & Optimus robotics", tag: "#特斯拉TSLA" },
  { zh: "超微 (AMD) MI300 算力挑戰者", en: "AMD MI300 compute challenger", tag: "#AMD超微" },
  { zh: "微策略 (MSTR) 比特幣槓桿狂潮", en: "MicroStrategy Bitcoin leverage wave", tag: "#比特幣概念" },
  { zh: "美超微 (SMCI) 液冷機櫃妖股行情", en: "Supermicro liquid-cooled server volatility", tag: "#美超微SMCI" },
  { zh: "聯鈞 (3450) 矽光子 CPO 光通訊", en: "Sigurd CPO silicon photonics transceiver", tag: "#矽光子CPO" },
  { zh: "AES-KY (6781) BBU 伺服器備援電池", en: "AES-KY BBU server battery backup unit", tag: "#BBU概念股" },
  { zh: "所羅門 (2359) AI 視覺人形機器人", en: "Solomon 3D-vision humanoid robotics", tag: "#機器人概念股" },
  { zh: "帕蘭泰爾 (PLTR) 國防 AI 大數據神股", en: "Palantir defense AI ontology engine", tag: "#PLTR" },
  { zh: "元大台灣50正2 (00631L) 槓桿教主", en: "Yuanta Taiwan 50 Daily 2X Leverage ETF", tag: "#正2教派" },
  { zh: "遊戲驛站 (GME) 咆哮小貓迷因軋空", en: "GameStop Roaring Kitty meme short squeeze", tag: "#GME迷因股" }
];

const TRADING_KEYWORD_ENGINE = {
  nvda: {
    zh: [
      "皮衣男黃仁勳再次登台點火，輝達 Blackwell 算力把空頭防線徹底踏破",
      "看輝達 GPU 訂單排到明年，AI 算力就是這場牛市最硬的底氣與尊嚴",
      "那斯達克夜盤只看輝達臉色，皮衣刀客一揮手就是千億美元的市值翻騰"
    ],
    en: [
      "Leather-jacket Jensen steps back on stage, Nvidia Blackwell compute burning through the short-sellers' cage",
      "Nvidia GPU backlog stretched across the year, AI compute power is the hardest conviction here",
      "Nasdaq night session moves on Nvidia's breath, one keynote swing sends bears to margin death"
    ],
    tagZh: "#輝達 #黃仁勳 #AI算力",
    tagEn: "#NVIDIA #JensenHuang #AICompute"
  },
  tsmc: {
    zh: [
      "台積電 CoWoS 先進封裝產能全開，護國神山的晶圓護城河誰也跨不過來",
      "二三三零跳空站上千元大關，台積電 ADR 在美股夜盤先把多頭號角吹響",
      "外資認錯回補台積電幾萬張，兩奈米製程的信仰在Ｋ線圖上閃閃發亮"
    ],
    en: [
      "TSMC CoWoS packaging running at full speed, the Silicon Shield moat is everything the bulls need",
      "2330 gapping up past the thousand-dollar mark, TSMC ADR lighting up the Wall Street dark",
      "Foreign funds panic-buying TSMC shares back, 2nm wafer dominance leading the attack"
    ],
    tagZh: "#台積電 #2330 #CoWoS",
    tagEn: "#TSMC #SiliconShield #CoWoS"
  },
  whipsaw: {
    zh: [
      "昨天單日暴漲三千三百點創下奇蹟，今天又重挫兩千點把浮額洗到脫皮",
      "大盤像坐上失速雲霄飛車，早盤開高五百點尾盤卻翻黑殺得措手不及",
      "史詩級的千點振幅天天上演，多空雙巴的盤面只留給有心臟的人掌舵"
    ],
    en: [
      "Three thousand three hundred points rally yesterday, two thousand points crash today shaking weak hands away",
      "Market riding a runaway rollercoaster track, opening up five hundred before a brutal afternoon smack",
      "Thousand-point daily swings becoming the norm, only iron stomachs survive this whipsaw storm"
    ],
    tagZh: "#暴漲暴跌 #極致洗盤",
    tagEn: "#MarketWhipsaw #Volatility"
  },
  tariff: {
    zh: [
      "半夜一則關稅推文突襲夜盤，聯準會鮑爾的鷹派降息劇本還在反覆試探",
      "關稅壁壘與通膨數據連環開槍，華爾街在降息碼數的博弈裡徹夜未眠",
      "白宮關稅風暴吹亂全球供應鏈，我們在非農數據與利率點陣圖裡找買點"
    ],
    en: [
      "Midnight tariff tweets ambushing the futures screen, while Powell plays his hawkish-cut routine",
      "Tariff walls and CPI numbers firing back to back, Wall Street losing sleep on the interest-rate track",
      "Trade-war headlines shaking up the supply chain, hunting entries through the Fed dot-plot rain"
    ],
    tagZh: "#關稅戰 #聯準會降息",
    tagEn: "#TariffWar #FedRateCut"
  },
  squeeze: {
    zh: [
      "限空令下借券賣出踢到鐵板，股東會前融券強制回補把空軍軋上天花板",
      "券資比飆高就是軋空的燃料，空頭不死多頭不止的戰歌在盤中咆哮",
      "看那些放空妖股的空單被鎖在漲停板外，排隊回補的市價單像雪片般飛來"
    ],
    en: [
      "Short-selling restrictions locking bears in a trap, forced buy-ins sending the chart off the map",
      "Sky-high short interest is pure rocket fuel, squeezing greedy bears by the old-school rule",
      "Short sellers locked out above the limit-up line, market-buy cover orders begging for a sign"
    ],
    tagZh: "#限空令 #融券軋空",
    tagEn: "#ShortSqueeze #ForcedBuyIn"
  },
  etf: {
    zh: [
      "高股息 ETF 溢價破發，00940 的自救會在股版排隊買單",
      "千億規模 ETF 換股潮引爆土洋對作，吃豆腐的散戶反被投信結帳洗落",
      "月月配息的口號喊得震天響，左手配右手還不如抓緊主升段的成長浪"
    ],
    en: [
      "High-dividend ETFs breaking below NAV, retail bagholders praying at the close",
      "Billion-dollar ETF rebalancing sparks a turf war, front-running retail left bleeding on the floor",
      "Monthly dividend hype echoing everywhere, while growth-stock breakouts leave bagholders there"
    ],
    tagZh: "#高股息ETF #00940",
    tagEn: "#DividendETF #RetailBagholder"
  },
  daytrade: {
    zh: [
      "無本當沖搶那幾個 tick 的價差，撮合排隊在九點零一分生死交叉",
      "當沖客盯著江波圖秒進秒出，手續費跟證交稅算下來到底幫誰打了一整年工",
      "早盤急拉追進去想搶帽子，結果現股當沖翻黑留倉不起只能在尾盤含淚砍單"
    ],
    en: [
      "Zero-capital day-trading scalping every tick, queue orders clashing at 9:01 AM",
      "Scalpers glued to one-minute charts in and out, paying commissions while drowning in doubt",
      "Chased the morning spike for a quick hat-grab, trapped at the close taking a brutal loss stab"
    ],
    tagZh: "#無本當沖 #搶帽子",
    tagEn: "#DayTrading #TickScalping"
  },
  margincall: {
    zh: [
      "融資維持率跌破一百三的追繳令，清晨的簡訊比鬧鐘還要無情",
      "連續兩根跌停讓融資斷頭萬箭穿心，散戶大軍減肥成功才是底部浮現的證明",
      "維持率保衛戰在下午兩點開打，不想被券商砍在阿呆谷就只能忍痛補錢加碼"
    ],
    en: [
      "Margin maintenance crashing under 130 percent, liquidation SMS colder than the winter rain",
      "Back-to-back limit-downs triggering forced liquidation, retail margin washout marks the bottom formation",
      "Margin-call defense line at 2 PM sharp, wire more collateral or get dumped in the dark"
    ],
    tagZh: "#融資維持率 #斷頭追繳",
    tagEn: "#MarginCall #Liquidation"
  },
  settlement: {
    zh: [
      "T加2 交割款還差幾十萬，營業員的奪命連環叩讓人手心流汗",
      "上午十點銀行扣款倒數計時，差一點違約交割的驚魂記在交易室裡真實上演",
      "當沖沖過頭忘了算交割水位，四處調頭寸才懂得敬畏市場不能只靠一張嘴"
    ],
    en: [
      "T-plus-2 settlement clock ticking down, broker's phone calls ringing off the hook",
      "10 AM wire deadline counting down fast, dodging a settlement default by a razor-thin cast",
      "Over-leveraged day trades forgot the cash floor, scrambling for liquidity before they lock the door"
    ],
    tagZh: "#違約交割 #營業員",
    tagEn: "#SettlementDefault #BrokerCall"
  },
  limitlock: {
    zh: [
      "開盤一字線漲停鎖死買不到，隔天跌停關門直接請你吃碗大滷麵",
      "亮燈漲停十萬張市價委買排到天邊，隔日開高走低天地板讓你懷疑人生",
      "主力拉抬時一字鎖死不給上車，出貨時一字跌停連逃命的縫隙都不留"
    ],
    en: [
      "Limit-up locked tight at the open bell, limit-down trap door slamming straight to hell",
      "Hundred-thousand lots queued at the limit-up light, next day ceiling-to-floor wipeout in plain sight",
      "Locked limit-up when you want to buy in, locked limit-down when the dumping begins"
    ],
    tagZh: "#漲停鎖死 #跌停吃麵",
    tagEn: "#LimitUp #LimitDownTrap"
  },
  wick: {
    zh: [
      "那根天地針長下影線剛掃掉我的停損點，馬上假跌破真穿頭拉上雲端",
      "主力刻意畫出破底長下影線洗出帶血籌碼，收盤卻拉回五日線上笑看風雲",
      "避雷針長上影線以為要見頂，結果隔天跳空開高直接把所有仙人指路變成噴出"
    ],
    en: [
      "That nasty stop-hunt lower wick swept my exit clean, fake breakdown into a vertical green machine",
      "Whales painted a deep lower shadow to shake out bloody shares, closing back above the 5-MA like nobody cares",
      "Long upper wick looked like a blow-off top, next morning gap-up made the short sellers drop"
    ],
    tagZh: "#長下影線 #假跌破",
    tagEn: "#StopHuntWick #FakeBreakdown"
  },
  ma: {
    zh: [
      "五線合一均線糾結了一整季，帶量突破年線黃金交叉直接噴出天際",
      "沿著五日線強勢上攻不回頭，季線翻揚就是多軍最堅固的移動堡壘",
      "跌破月線假摔後三天內強勢站回，均線多頭排列的列車根本停不下來"
    ],
    en: [
      "Five moving averages coiled tight for a quarter, golden cross breakout ripping through the border",
      "Riding the 5-day moving average without looking back, rising quarterly line shielding the bull attack",
      "Reclaimed the monthly average after a three-day shake, full bullish alignment with no time to brake"
    ],
    tagZh: "#均線糾結 #黃金交叉",
    tagEn: "#GoldenCross #Breakout"
  },
  macd: {
    zh: [
      "高檔 KD 鈍化不要隨便猜頂，MACD 柱狀體底背離才是反轉的訊號",
      "RSI 超賣區亮起黃金買訊，MACD 綠翻紅第一根柱子就是我們扣扳機的瞬間",
      "指標在八十以上高檔鈍化軋空，看指標放空的技術派全被主升段軋到外太空"
    ],
    en: [
      "Stochastic staying overbought while bears get burned, MACD bullish divergence shows the tide has turned",
      "RSI oversold flashing the golden entry sign, MACD histogram flipping green on the front line",
      "Oscillators pinned above eighty in a runaway trend, shorting overbought signals brings a painful end"
    ],
    tagZh: "#KD鈍化 #MACD背離",
    tagEn: "#MACDDivergence #TechnicalAnalysis"
  },
  fibonacci: {
    zh: [
      "費波南希零點六一八的黃金回撤位，艾略特波浪推升到主升段第三波",
      "精算波浪理論的滿足點位，回測零點三八二支撐不破就是加碼滿倉的號角",
      "完成了邪惡第五波的末升段噴出，在黃金分割率的天際線上優雅停利轉身"
    ],
    en: [
      "Fibonacci 0.618 golden pocket retracement held, Elliott Wave Three impulse ringing the bell",
      "Calculated the wave-extension target with precision, 0.382 support bounce confirmed the all-in decision",
      "Riding the parabolic Wave Five blow-off high, taking profit right on the Fibonacci sky"
    ],
    tagZh: "#費波南希 #主升段",
    tagEn: "#Fibonacci #ElliottWave"
  },
  orderbook: {
    zh: [
      "五檔委買掛著幾千張假單瞬間抽走，內外盤搓合全是演算法的障眼法",
      "集合競價最後一秒試搓漲停瞬間變跌停，高頻交易機器人在毫秒之間獵殺散戶",
      "看到大單敲進外盤連拉五檔，識別出主力真突破還是假拉抬才是盤中真功夫"
    ],
    en: [
      "Level-2 order book spoofing thousand-lot bids then pulling the rug, HFT algos playing tug-of-war",
      "Pre-open auction flashing limit-up then yanked at the last second, millisecond bots hunting where retail beckoned",
      "Block orders sweeping five levels on the ask, separating real breakouts from spoofing is the trader's task"
    ],
    tagZh: "#五檔報價 #主力抽單",
    tagEn: "#Level2OrderBook #AlgoSpoofing"
  },
  options: {
    zh: [
      "台指夜盤多空雙巴洗到脫皮，選擇權莊家精算著最大痛點收割權利金",
      "外資期貨空單三萬口只是避險障眼法，看懂選擇權買權賣權未平倉量才知真方向",
      "隱含波動率飆升讓權利金貴得離譜，莊家雙賣收租卻在突破大行情裡踢到鐵板"
    ],
    en: [
      "Night session futures chopping both sides raw, options market makers pinning Max Pain by law",
      "Thirty thousand foreign futures shorts are just a hedge disguise, open-interest walls reveal where the real move lies",
      "Implied volatility spiking premiums through the roof, straddle sellers crushed when the breakout gives proof"
    ],
    tagZh: "#台指夜盤 #選擇權最大痛點",
    tagEn: "#IndexFutures #MaxPainOptions"
  },
  ZeroDTE: {
    zh: [
      "週三結算日買方樂透翻了十倍倒莊，賣方吃完歸零膏卻在一根長紅裡破產",
      "午後一點半結算價拉鋸戰，末日選擇權 Gamma Squeeze 讓點數在十分鐘內狂飆三百點",
      "幾十點的權利金買進末日翻倍樂透，以小博大的心臟在週三下午跳到最高速"
    ],
    en: [
      "Wednesday 0DTE lotto calls going ten-bagger gamma squeeze, option sellers blown out on their knees",
      "Final thirty-minute settlement tug-of-war, 0DTE gamma explosion ripping three hundred points more",
      "Cheap out-of-the-money lotto tickets turning into gold, Wednesday afternoon is only for the bold"
    ],
    tagZh: "#週選結算 #倒莊歸零膏",
    tagEn: "#0DTEOptions #GammaSqueeze"
  },
  inst: {
    zh: [
      "外資借券賣出幾萬張壓著盤面，投信季底作帳結帳在尾盤神仙打架",
      "自營商避險買盤點火、投信連買二十天鎖碼，土洋對作的籌碼戰我們跟著贏家走",
      "看懂三大法人買賣超背後的真假外資，隔著汪洋的熱錢匯入直接把權值股推上巔峰"
    ],
    en: [
      "Foreign funds short-lending millions of shares while local trusts window-dress the quarter-end close",
      "Proprietary desks hedging while domestic funds buy twenty days straight, riding institutional flow before it's too late",
      "Seeing through fake offshore accounts in the daily flow report, hot money flooding in to lift the flagship fort"
    ],
    tagZh: "#三大法人 #投信作帳",
    tagEn: "#InstitutionalFlow #QuarterEnd"
  },
  broker: {
    zh: [
      "盤後分點看到凱基台北跟隔日沖大軍鎖漲停，明天早盤開高九點半準備倒貨",
      "神秘地緣券商分點默默在低檔吃貨三個月，籌碼集中度飆高就是主力即將發動的暗號",
      "虎尾幫與嘉義幫在漲停板前大匯合，看穿隔日沖假突破才不會在早盤成為接盤俠"
    ],
    en: [
      "Broker-branch data shows overnight-flip whales locking the limit-up, ready to dump at 9:30 AM sharp",
      "A mysterious local broker branch quietly accumulated for three months straight, chip concentration signaling the breakout gate",
      "Overnight momentum syndicates crowding the limit-up board, dodging their morning dump is its own reward"
    ],
    tagZh: "#隔日沖 #主力分點",
    tagEn: "#BrokerFlow #OvernightFlip"
  },
  fomo: {
    zh: [
      "每次賣飛就是主升段起漲點，砍在阿呆谷底只能去公園搶最後一個紙箱",
      "看別人貼對帳單賺到財富自由，自己一追高就套在山頂、一停損就馬上V轉",
      "戒掉散戶追高殺低的 FOMO 心魔，守住交易紀律才不會在牛市裡還去睡公園"
    ],
    en: [
      "Every time I sell the stock goes parabolic, panic-sold the exact bottom now I'm shopping for a cardboard box",
      "Watching everyone post ten-bagger screenshots online, the second I FOMO in at the top the chart starts to decline",
      "Conquering retail FOMO and emotional panic trades, discipline is the only shield that never fades"
    ],
    tagZh: "#賣飛 #砍在阿呆谷 #睡公園",
    tagEn: "#PaperHands #SoldTheBottom"
  },
  BBU: {
    zh: [
      "BBU 備援電池跟矽光子 CPO 輪流點火，題材股只要有夢本益比就沒有天花板",
      "伺服器從氣冷換水冷再炒到光通訊，資金輪動快到散戶連公司做什麼都還來不及查",
      "CoWoS 設備股搭上矽光子高速列車，主力畫出的未來藍圖在漲停板上直接兌現"
    ],
    en: [
      "BBU battery backup and CPO silicon photonics catching fire, dream-stock multiples climbing higher and higher",
      "From liquid cooling to optical interconnects in a flash, sector rotation moving faster than retail cash",
      "CoWoS toolmakers riding the photonics express, limit-up boards pricing in tomorrow's success"
    ],
    tagZh: "#BBU #矽光子CPO #水冷散熱",
    tagEn: "#SiliconPhotonics #BBU #AIServers"
  },
  robot: {
    zh: [
      "黃仁勳夜市逛一圈背板概念股全體漲停，人形機器人還沒量產股價先飛上外太空",
      "仁來瘋的妖股清單每天在群組瘋傳，不管基本面只要沾到機器人視覺就是連拉五根",
      "從工業手臂炒到 AI 視覺感測器，背板點名誰誰就是這個月的主力印鈔機"
    ],
    en: [
      "Jensen tours the night market and his backdrop stocks all lock limit-up, humanoid robot tickers overflowing the cup",
      "AI robotics concept lists going viral in every chat, five straight green candles before a single robot ships out flat",
      "From robotic arms to 3D machine-vision eyes, whoever makes the keynote backdrop touches the skies"
    ],
    tagZh: "#人形機器人 #仁來瘋 #背板概念股",
    tagEn: "#HumanoidRobots #JensenMania #AIStocks"
  },
  cpi: {
    zh: [
      "八點半 CPI 通膨數據開獎前全場屏息，鮑爾一句話讓那斯達克瞬間上下洗盤五百點",
      "非農就業太強怕不降息、太弱又怕衰退，華爾街喪事喜辦的劇本永遠猜不透",
      "點陣圖跟降息預期天天在坐蹺蹺板，一覺醒來美股費半又幫台股決定了開盤的命運"
    ],
    en: [
      "8:30 AM CPI print drops and the whole floor holds its breath, one Powell syllable whipsaws Nasdaq to death",
      "Hot payrolls fear no cuts, cold payrolls fear recession, Wall Street spins bad news into a bull obsession",
      "Fed dot-plots and rate-cut odds swinging on a seesaw, Philly Semiconductor decides Taiwan's opening law"
    ],
    tagZh: "#CPI通膨 #非農數據 #鮑爾講話",
    tagEn: "#CPIPrint #FedPowell #MacroWhipsaw"
  },
  pledge: {
    zh: [
      "信貸借出來買股票再質押借出第二層，牛市裡人人都是槓桿大師直到暴跌那一天",
      "房屋增貸加股票質押把槓桿開到極限，利息還沒賺到先收到券商補擔保品的催命符",
      "負債滾出千萬部位號稱生命周期投資法，黑天鵝飛過來的時候連呼吸都要算維持率"
    ],
    en: [
      "Personal loan into stocks then pledged again for layer two, everyone's a leverage genius till the crash comes through",
      "Home-equity loan stacked on share-pledge margin to the max, one flash crash and the collateral call attacks",
      "Calling triple-layered debt a lifecycle strategy, praying maintenance ratios hold through the tragedy"
    ],
    tagZh: "#股票質押 #信貸開槓桿 #生命周期投資",
    tagEn: "#SharePledge #MaxLeverage #MarginDebt"
  },
  jail: {
    zh: [
      "注意股警告沒在怕，進了處置五分盤二十分盤反而越關越大尾鎖死漲停",
      "妖股關禁閉預收款券照樣排隊搶進，出關那天是龍袍加身還是直接關門放狗",
      "二十分鐘撮合一次的心跳加速局，處置股的流動性牢籠裡只有真賭徒敢留倉"
    ],
    en: [
      "Warning flags couldn't slow it down, locked in 5-minute and 20-minute disposition jail yet it still rips the crown",
      "Pre-funded cash-upfront restriction rules in the penalty box, monster stocks breaking out of regulatory locks",
      "One match every twenty minutes making heartbeats race, disposition-jail day is a high-stakes place"
    ],
    tagZh: "#處置股 #越關越大尾 #五分盤",
    tagEn: "#PenaltyBoxStock #DispositionJail #MonsterStock"
  },
  levETF: {
    zh: [
      "正2 邪教天天喊著無腦多頭複利奇蹟，遇到箱型盤整雙巴耗損卻在角落默默流淚",
      "美股 TQQQ 跟 SOXL 三倍槓桿直接拉滿，一夜暴富或一夜回到解放前只差一根長黑",
      "00631L 順風時把大盤狠狠甩在後頭，逆風連跌五天時才發現兩倍波動不是開玩笑"
    ],
    en: [
      "2X leveraged ETF cult preaching compounding miracles every day, until sideways chop decay eats the gains away",
      "TQQQ and SOXL triple-leveraged chips pushed to the center, one semiconductor drawdown and it's a brutal winter",
      "00631L outrunning the index when the bull wind blows, double-speed drawdown when the margin door closes"
    ],
    tagZh: "#正2教派 #00631L #TQQQ #SOXL",
    tagEn: "#LeveragedETF #TQQQ #SOXL #VolatilityDecay"
  },
  vwap: {
    zh: [
      "指數牢牢站穩 VWAP 當日均價成本線之上，帶量長紅直接把昨天的黑K整根吞噬",
      "綠線 VWAP 就是盤中多空唯一的生死分界，線上偏多加碼、線下偏空一秒都不戀戰",
      "開低走高強勢突破均價成本線，爆量陽線吞噬了所有空軍最後一絲僥倖"
    ],
    en: [
      "Price holding firm above the intraday VWAP line, high-volume bullish engulfing candle flashing the sign",
      "VWAP is the only bull-bear dividing line on the screen, long above the curve and short when it flips red from green",
      "Opened low then ripped straight through the volume-weighted cost, engulfing every short position that got lost"
    ],
    tagZh: "#VWAP均價線 #長紅吞噬",
    tagEn: "#VWAPLine #BullishEngulfing"
  },
  gap: {
    zh: [
      "島狀反轉跳空缺口三天不補就是真突破，回測頸線支撐不破直接扣下滿倉扳機",
      "底部竭盡缺口洗出最後一批恐慌散戶，隔天向上跳空直接把左邊套牢區變成孤島",
      "突破缺口伴隨三倍天量強勢表態，技術派的教科書買點在K線圖上完美成形"
    ],
    en: [
      "Island-reversal gap unclosed for three straight days, neckline retest held firm so the breakout pays",
      "Exhaustion gap washed out the final panic sellers at the low, gap-up island reversal stealing the whole show",
      "Breakaway gap on triple volume making its stand, textbook technical entry playing out as planned"
    ],
    tagZh: "#島狀反轉 #跳空缺口 #回測頸線",
    tagEn: "#IslandReversal #BreakawayGap #NecklineRetest"
  },
  bollinger: {
    zh: [
      "布林通道極度壓縮到快要窒息，一舉衝破上軌開口放大就是波段狂飆的起點",
      "K線貼著布林上軌一路軋空不回頭，碰到中軌二十日線就是老手眼中的黃金買點",
      "布林喇叭口正式張開伴隨法人大買，壓抑了一整季的能量在一根長紅裡徹底引爆"
    ],
    en: [
      "Bollinger Bands squeezed tight to the suffocation point, upper-band breakout blowing the roof off the joint",
      "Candles walking the upper Bollinger band without a pause, middle-band 20-MA pullback obeying trend laws",
      "Bollinger jaws opening wide with institutional buying flow, a whole quarter of coiled energy ready to blow"
    ],
    tagZh: "#布林通道 #通道壓縮 #沿上軌噴出",
    tagEn: "#BollingerSqueeze #UpperBandWalk"
  },
  pcr: {
    zh: [
      "上檔 Call Wall 最大未平倉築起鐵壁，下檔 Put Wall 莊家重兵防守連跌都跌不下去",
      "Put Call Ratio 站上一百二偏多支撐超硬，跟著莊家籌碼牆走才不會在盤中迷路",
      "一旦帶量衝破買權最大未平倉壓力天花板，莊家被迫停損對鎖就是倒莊軋空的開始"
    ],
    en: [
      "Overhead Call Wall stacked high with open interest, downside Put Wall defended where market makers invest",
      "Put-Call Ratio climbing past 120 showing iron support below, reading the OI walls is how the pros go",
      "Once price smashes through the Call Wall ceiling with force, dealers delta-hedging fuels a runaway course"
    ],
    tagZh: "#CallWall壓力 #PutWall支撐 #PCRatio",
    tagEn: "#CallWall #PutWall #PutCallRatio"
  },
  retail: {
    zh: [
      "散戶小台跟微台多空比又飆到極端正值，擦鞋童全體看多的時候我們早就反手落袋",
      "看散戶微台一路死扛攤平加碼做多，主力大鱷最愛獵殺的就是這種不設停損的對手盤",
      "小台散戶多空比就是全市場最準的反指標，當散戶終於認賠砍倉翻空就是底部反彈的號角"
    ],
    en: [
      "Retail mini and micro futures long-short ratio hitting extreme highs, when the shoeshine boy goes all-in the smart money says goodbye",
      "Retail micro-contracts averaging down into a falling knife, whale algos feasting on stubborn positions for life",
      "The retail small-lot ratio is the sharpest contrarian gauge in town, the exact minute retail capitulates short the market turns around"
    ],
    tagZh: "#散戶多空比 #微台反指標 #擦鞋童理論",
    tagEn: "#RetailContrarian #MicroFutures #SmartMoney"
  },
  afterhours: {
    zh: [
      "下午一點二十五分最後五分鐘撮合，神秘黑手一筆五萬張大單直接偷拉尾盤翻紅",
      "MSCI 季度調整尾盤爆出千億天量，最後一盤集合競價上演神仙打架的驚天逆轉",
      "盤中裝死一整天卻在尾盤一點半急拉五十點，黑手護盤的劇本永遠寫在最後一秒鐘"
    ],
    en: [
      "1:25 PM final five-minute closing auction bell, a mysterious whale drops fifty-thousand lots to flip the close swell",
      "MSCI rebalancing day exploding with billion-dollar closing print, last-second auction plot twist leaving bears in a splint",
      "Playing dead all session then ripping fifty points at 1:30 sharp, invisible hand painting the closing chart like a harp"
    ],
    tagZh: "#尾盤黑手 #最後一盤 #MSCI甩尾",
    tagEn: "#ClosingAuction #InvisibleHand #MSCIClose"
  },
  wendys: {
    zh: [
      "看對帳單從賓士變成國產車再變成腳踏車，麥當勞跟溫蒂漢堡的大夜班排班表已經填好名字",
      "大安森林公園的第一排紙箱位已經被預約滿，今晚跌停鎖死只好去跟街友借半塊厚紙板",
      "昨天還在群組看豪宅型錄挑車位，今天歐印翻車直接上網投履歷問薯條要怎麼炸才脆"
    ],
    en: [
      "Watched my portfolio shrink from a Porsche to a bicycle in a week, filling out the Wendy's night-shift application looking bleak",
      "VIP cardboard-box spots at the city park are already booked out, one more limit-down and I'm camping out without a doubt",
      "Yesterday browsing penthouse brochures in the group chat, today asking the drive-thru manager where the fryer station's at"
    ],
    tagZh: "#睡公園 #搶紙箱 #麥當勞排班",
    tagEn: "#SirThisIsAWendys #CardboardBox #BrokeTrader"
  },
  inverse: {
    zh: [
      "股版冥燈一出手連護國神山都要抖三抖，全體起立致敬東方神秘反指標的精準摸頭",
      "看到名嘴網紅高喊滿倉抄底我就知道還沒跌完，跟著冥燈反著做別墅直接靠大海",
      "不管是丸子還是折折只要在山頂喊多，那根反指標避雷針比任何技術線型都還要準確"
    ],
    en: [
      "When the famous forum jinx calls the bottom even blue-chips shake, inverse the guru is the easiest money you'll ever make",
      "TV pundits screaming all-in at the top is my cue to exit fast, betting against the inverse indicator builds wealth that lasts",
      "More accurate than any quantitative model on Wall Street, when the jinx turns bullish it's time for a tactical retreat"
    ],
    tagZh: "#股版冥燈 #反指標 #別墅靠大海",
    tagEn: "#InverseCramer #ContrarianMeme #MarketJinx"
  },
  oneLot: {
    zh: [
      "口中唸著一張不賣奇蹟自來的散戶聖經，結果短線當沖做成了長線存股最後變成傳家寶",
      "本來只想搶個兩百塊便當錢就跑，一不小心套在山頂被迫領股息當起公司永久股東",
      "套牢時安慰自己這叫價值投資長線佈局，對帳單上的負五十趴已經準備寫進遺囑傳給孫子"
    ],
    en: [
      "Chanting 'never sell a single share and miracles will appear', turning a five-minute scalp into a family heirloom for a souvenir",
      "Only wanted to grab lunch money on a morning bounce, now I'm a lifelong involuntary shareholder counting every ounce",
      "Calling a fifty-percent baghold 'long-term value investing' with pride, passing these underwater shares to my grandkids on the other side"
    ],
    tagZh: "#一張不賣奇蹟自來 #短線變股東 #傳家寶",
    tagEn: "#BagholderForLife #InvoluntaryInvestor #FamilyHeirloom"
  },
  ancestors: {
    zh: [
      "這波下殺狠到連阿公都從族譜裡跳出來問我到底買了什麼，別人恐懼我直接嚇到發抖",
      "群組老哥永遠只有一句問就是歐印加碼，抄底抄在半山腰結果山頂還有地下十八層",
      "以為地板已經到了結果下面還有地下室，攤平攤到連清明節去掃墓都不敢看祖先牌位"
    ],
    en: [
      "This crash hit so hard my grandpa jumped out of the family tree, asking what kind of garbage ticker I bought on a spree",
      "Group chat bros always yelling 'ask no questions just go all-in', catching falling knives halfway down where the basement begins",
      "Thought I bought the floor until the trapdoor opened to level B18, averaging down so deep it's the wildest loss ever seen"
    ],
    tagZh: "#問就是歐印 #抄底半山腰 #地板下有地下室",
    tagEn: "#CatchingFallingKnives #AllInYOLO #BasementBelowTheFloor"
  },
  noodles: {
    zh: [
      "漲停那天看的是信義區豪宅跟藍寶堅尼，跌停這晚關起燈默默吃著泡麵連茶葉蛋都不敢加",
      "開盤前幻想今天財富自由提早退休，收盤後默默打開外送平台看今晚要跑幾單才夠補交割",
      "左手牛排紅酒右手關燈吃麵只差一根K線，股市裡的貧富切換比川劇變臉還要快上百倍"
    ],
    en: [
      "Limit-up day I'm configurating a Lamborghini in gold, limit-down night eating instant noodles in the dark and cold",
      "9 AM dreaming of financial freedom and handing in my resignation, 1:30 PM turning on my food-delivery app in desperation",
      "One candle separates wagyu steak from ramen in the dark, the stock market flips your lifestyle with a single spark"
    ],
    tagZh: "#關燈吃麵 #財富自由 #藍寶堅尼",
    tagEn: "#RamenOrLambo #FinancialFreedom #RetailLife"
  },
  appDelete: {
    zh: [
      "只要我不打開看盤 APP 就沒有賠錢，直接把券商軟體刪掉就是散戶最強的停損結界",
      "把紅綠顏色調成黑白模式假裝心如止水，蓋牌不看損益表的鴕鳥心態在崩盤日特別好睡",
      "跌破季線那天我選擇直接登出帳號，薛丁格的對帳單只要不點開就永遠處於沒輸的狀態"
    ],
    en: [
      "As long as I don't open the trading app I haven't lost a dime, deleting the broker icon is the ultimate hedge of all time",
      "Switched my screen to grayscale pretending I achieved Zen peace, ostrich-mode portfolio hiding till the margin calls cease",
      "Schrödinger's brokerage account stays break-even if you never log in, ignorance is bliss when the red candles spin"
    ],
    tagZh: "#刪APP就不算賠 #蓋牌自欺 #薛丁格的對帳單",
    tagEn: "#DeleteTheApp #SchrodingersPortfolio #OstrichMode"
  },
  shipping: {
    zh: [
      "當年兩百塊山頂上的水手還在咕嚕咕嚕喝海水，一聽到紅海危機運價大漲馬上滿血復活",
      "航海王的大船開進加勒比海乘風破浪，水手們在甲板上高喊重返榮耀把前高通通解套",
      "SCFI 運價指數一跳動全村水手集合報到，這艘貨櫃巨輪載滿了散戶不肯下船的青春與驕傲"
    ],
    en: [
      "Bagholding sailors drowning at the peak go 'glug-glug' under the wave, one Red-Sea freight spike brings the pirate crew back from the grave",
      "Pirate King container ships sailing through the storm with pride, sailors on deck chanting 'Return to Glory' on the bull tide",
      "Every Friday SCFI freight index print rallies the whole crew, riding the shipping rollercoaster through the ocean blue"
    ],
    tagZh: "#咕嚕咕嚕 #航海王水手 #重返榮耀",
    tagEn: "#ShippingStocks #PirateKing #ContainerFreight"
  },
  diamond: {
    zh: [
      "鑽石手 Diamond Hands 死抱不放喊著 To The Moon，紙手散戶被洗出去一秒鐘股價馬上原地起飛",
      "主力洗盤震倉三百點也休想騙走我手上的籌碼，真正的信仰是在暴風雨裡依然握緊方向盤",
      "笑看那些追高殺低的紙手天天幫券商打工，我們用鑽石般的定力把主升段從魚頭吃到魚尾"
    ],
    en: [
      "Diamond Hands holding through the dip screaming To The Moon, Paper Hands shaken out right before the parabolic boom",
      "A three-hundred-point shakeout won't pry a single share from my grip, real conviction holds the wheel on a stormy ship",
      "Laughing at paper-handed tourists paying commissions in fear, Diamond Hands riding the entire super-cycle year"
    ],
    tagZh: "#鑽石手 #DiamondHands #ToTheMoon #紙手賣飛",
    tagEn: "#DiamondHands #ToTheMoon #HODL #PaperHands"
  },
  buffett: {
    zh: [
      "巴菲特說別人恐懼我貪婪，結果我一貪婪就抄在半山腰變成別人小賠我直接破產",
      "把股神語錄貼在螢幕前當護身符，卻忘了人家有無限現金流而我只有月底要繳的卡費",
      "雪球滾下山坡前要先確定自己不是那顆被輾過去的石頭，看清自己的籌碼底線才是真智慧"
    ],
    en: [
      "Buffett said be greedy when others are fearful in the street, I got greedy at the halfway dip and took a total defeat",
      "Taped Omaha quotes all over my monitor like a sacred charm, forgetting he has billions in cash while my margin sounds the alarm",
      "Everyone wants to roll a compounding snowball down the hill, just make sure you're not the rock getting crushed by the thrill"
    ],
    tagZh: "#別人恐懼我破產 #巴菲特語錄 #雪球理論",
    tagEn: "#GreedyWhenFearful #BuffettMeme #RetailReality"
  },
  guru: {
    zh: [
      "投顧老師電視上拿著雷射筆狂喊恭喜會員亮燈漲停，卻絕口不提另外四張蓋牌套牢在跌停",
      "每天收盤後馬後砲畫線說我早就在上禮拜預告在前，去問會員對帳單才發現全在山頂洗碗",
      "關掉電視裡天花亂墜的投顧明牌，相信自己的交易系統與停損紀律才不會再被當韭菜割"
    ],
    en: [
      "TV stock guru waving his laser pointer bragging about one limit-up pick, while hiding four bagholding losers under the desk trick",
      "Drawing hindsight trendlines after the close claiming he called it last week, while his paying members are washing dishes at the peak",
      "Turn off the late-night infomercial stock tips and the noise, only your own risk system and discipline keep your poise"
    ],
    tagZh: "#投顧老師 #蓋牌四張吹一張 #恭喜會員",
    tagEn: "#FakeStockGuru #HindsightTrader #LaserPointer"
  }
};

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  const presetEl = document.getElementById("style-preset");
  if (presetEl && STYLE_PRESETS[presetEl.value]) {
    currentState.preset = presetEl.value;
    currentState.bpm = STYLE_PRESETS[presetEl.value].defaultBpm;
  }
  randomizeSongKeywords(false);
  bindEvents();
  renderAll();
  drawIdleVisualizer();
});

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomizeSongKeywords(notify = true) {
  // 每個分類（含股市迷因）至少隨機挑 1~2 個，總共隨機挑 7~11 個不同關鍵字
  const groups = [
    ["nvda", "tsmc", "whipsaw", "tariff", "etf", "BBU", "robot", "cpi"],
    ["squeeze", "daytrade", "margincall", "settlement", "limitlock", "pledge", "jail", "levETF"],
    ["wick", "ma", "macd", "fibonacci", "orderbook", "vwap", "gap", "bollinger"],
    ["options", "ZeroDTE", "inst", "broker", "fomo", "pcr", "retail", "afterhours"],
    ["wendys", "inverse", "oneLot", "ancestors", "noodles", "appDelete", "shipping", "diamond", "buffett", "guru"]
  ];
  const picked = new Set();
  groups.forEach((g) => {
    const shuffled = shuffleArray(g);
    const count = Math.floor(Math.random() * 2) + 1; // 每組抽 1~2 個
    for (let i = 0; i < count; i++) {
      picked.add(shuffled[i]);
    }
  });

  // 再從全池隨機補滿 7~11 個
  const remaining = shuffleArray(ALL_TOPIC_KEYS.filter((k) => !picked.has(k)));
  const targetSize = Math.floor(Math.random() * 5) + 7; // 7 ~ 11 個
  while (picked.size < targetSize && remaining.length > 0) {
    picked.add(remaining.pop());
  }

  currentState.topics = picked;
  currentState.randomSeed = Date.now() + Math.floor(Math.random() * 100000);

  // 為每個關鍵字隨機挑一個歌詞句型版本 (0, 1, 2)
  const vMap = {};
  ALL_TOPIC_KEYS.forEach((k) => {
    vMap[k] = Math.floor(Math.random() * 3);
  });
  currentState.variantMap = vMap;

  // 隨機抽 2~3 個當次專屬熱門標的寫入歌詞
  currentState.autoRandomStocks = shuffleArray(RANDOM_STOCK_POOL).slice(0, 3);

  // 同步更新頁面上 Chip 的 active 狀態
  document.querySelectorAll(".topic-chips .chip").forEach((chip) => {
    if (currentState.topics.has(chip.dataset.topic)) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  if (notify) {
    const stockNames = currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、");
    showToast(`🎲 已隨機更換 ${picked.size} 組操作關鍵字與標的 (${stockNames})！`);
  }
}

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

  // 解析 YouTube URL (每次解析自動隨機換一組新關鍵字進行歌詞創作)
  document.getElementById("btn-analyze-url").addEventListener("click", analyzeYoutubeUrl);

  // 曲風模板切換 (每次切換曲風自動隨機換一組新關鍵字)
  const presetEl = document.getElementById("style-preset");
  presetEl.addEventListener("change", () => {
    currentState.preset = presetEl.value;
    const p = STYLE_PRESETS[currentState.preset];
    currentState.bpm = p.defaultBpm;
    document.getElementById("custom-bpm").value = p.defaultBpm;
    document.getElementById("bpm-val").textContent = p.defaultBpm;
    document.getElementById("ref-bpm-display").textContent = `${p.defaultBpm} BPM`;
    randomizeSongKeywords(false);
    renderAll();
    showToast("🎲 已切換曲風並隨機抽取全新關鍵字組合創作歌詞！");
  });

  const randomBtn = document.getElementById("btn-random-tags");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      randomizeSongKeywords(true);
      renderAll();
    });
  }

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
    showToast(`🔥 已全選 ${ALL_TOPIC_KEYS.length} 項台美股實戰關鍵字與股市迷因！`);
  });

  const clearBtn = document.getElementById("btn-clear-tags");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const defaults = new Set(["nvda", "tsmc", "whipsaw", "tariff", "squeeze", "daytrade", "margincall", "wick", "options", "wendys", "inverse"]);
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
    randomizeSongKeywords(false);
    renderAll();
    const stockNames = currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、");
    showToast(`🎲 已隨機抽取 ${currentState.topics.size} 組新關鍵字 (${stockNames}) 生成全新歌詞！`);
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
    document.getElementById("url-status").textContent = `已精準匹配 ${ref.title.split(" ")[0]} 曲風基因`;
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

  randomizeSongKeywords(false);
  renderAll();
  showToast("🔍 已完成曲風解析並隨機抽取全新關鍵字創作歌詞！");
}

function buildAvrilComplicatedPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "Why'd you have to go and make trading so complicated? 幹嘛把看盤搞得這麼複雜，最後還不是砍在阿呆谷底！";
  const hookLineEn =
    currentState.customHook ||
    "Why'd you have to go and make trading so complicated? I see the way you're drawing twenty indicators and getting liquidated!";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Bright Strummed Acoustic Guitar & Punchy Mid-Tempo Y2K Pop-Rock Boom-Bap Drums (78 BPM)]
[Sassy Rebellious Female Vocal - Avril Style, casual spoken attitude]
Uh-huh, market's like this...
Uh-huh, uh-huh... that's the way it is
'Cause life's like this
Uh-huh, uh-huh, that's the way it is...
（深呼吸，放下你螢幕上那二十條五顏六色的技術指標好嗎？Chill out!）

[Verse 1: Sassy Young Female Rock Vocal, Crisp Acoustic Guitar Strums & Bass Groove]
Chill out, 你在那裡大驚小怪吵什麼？
Lay back, 這不過就是一根回測五日線的正常洗盤
而且我們才剛走到主升段的一半
When you're 獨自在書房，你明明也知道只要買進 ${stockList} 抱緊就能贏
但一走進股版跟同學會群組，你卻突然換了一副假股神的面具

[Pre-Chorus: Building Electric Guitar Arpeggios & Snare Drum Roll]
你從來不肯老實承認自己又追高套在山頂
你只會在收盤後畫滿馬後砲的波浪理論來騙自己
You're making me
Laugh out when you strike your guru pose
把那個雷射筆給我拿開，你的維持率早就已經洩了底——！

[Chorus: Explosive Y2K Distorted Power-Chord Electric Guitars & Powerhouse Pop-Punk Female Belt!]
${hookLineZh}
我看穿你在群組裡假裝算準每一根天地針的模樣
讓我越看越無奈 (Makes me frustrated!)
行情明明就是這樣，你卻被無本當沖跟五檔假單耍得團團轉
You fall, and you crawl, and you break
然後在 T加2 交割日前把本金賠光，honesty, you promised me
你說這次絕對一張不賣，結果一跌兩趴你就嚇得全部砍光
Why'd you have to go and make things so complicated?

[Post-Chorus: Acoustic Guitar Riff & Sassy Vocal]
Uh-huh, that's the way it is!

[Verse 2: Witty Male Rapper & Sassy Female Vocal Trading Double-Time 156 BPM Rapid-Fire Roast Bars!]
[Rapper] （雙倍速 156 BPM 吐槽快嘴 Rap Flow × Y2K 搖滾節拍）
Yo! 你螢幕上開了 KD、MACD、布林通道外加八條費波南希黃金分割線
結果股版冥燈反指標隨便喊一句滿倉歐印，你馬上把所有交易紀律丟到天邊
投顧老師電視上蓋牌四張跌停股只吹漲停那一張，你也跟著刷卡入會喊恭喜會員
昨天才在看信義區豪宅跟藍寶堅尼型錄，今晚跌停鎖死只能關起燈吃泡麵連茶葉蛋都不敢添！
[Female Vocal] 只要不打開看盤 APP 就當作沒賠錢，把手機調成黑白模式自欺欺人
[Rapper] 短線當沖搶便當錢最後變成傳家寶寫進遺囑，連阿公都從族譜跳出來問你買了什麼鬼東西
明明只要跟著 ${stockList} 的基本面與 VWAP 均價線順勢走就海闊天空
你偏要把簡單的多頭趨勢搞得像量子力學一樣複雜，最後再去大安森林公園排隊領紙箱！

[Pre-Chorus: Escalating Rock Guitars & Drum Fill]
你從來不肯承認自己只是手癢想賭一把
你在夜盤面前裝得像華爾街之狼，卻在清晨追繳簡訊前雙腿發麻
Take off all your preppy guru clothes
You know you're not fooling anyone when your margin blows——！

[Chorus: Explosive Y2K Distorted Power-Chord Electric Guitars & Full Band Sing-Along!]
${hookLineZh}
我看穿你在那裡算來算去最後還是賣飛在起漲點
讓我越看越無奈 (Makes me frustrated!)
牛市明明就是這樣，只要鑽石手抱緊 ${stockList} 就能一路破頂
You fall, and you crawl, and you break
何必為了幾個 tick 的價差天天幫券商打工，honesty, you promised me
放下那些花裡胡哨的複雜指標，回歸最純粹的趨勢信仰
Why'd you have to go and make things so complicated?

[Bridge: Stripped-Back Acoustic Guitar & Emotional Female Vocal Building to Final Rock Explosion!]
[Female Vocal]
Chill out, what ya yellin' for?
Lay back, it's all been done before
And if you could only let it be, 刪掉那些雜訊，你會看見主升段有多清晰——！
([Rapper] Keep it simple! 抱緊核心龍頭，讓時間的複利替你說話！Let's go!)

[Chorus: Final Maximum Y2K Pop-Punk Stadium Climax, Soaring High-Note Ad-libs!]
${hookLineZh}
我看穿你假裝不在乎帳面虧損、其實半夜偷看美股期貨的模樣
Makes me frustrated!
Life's like this, you
把複雜的當沖槓桿全部砍掉，跟著 ${stockList} 迎向破頂的曙光
You truth, you promised me, I'm never gonna find you fake it
No, no, no!

[Outro: Iconic Acoustic Guitar Strum & Sassy Spoken Ad-lib]
[Female Vocal]
Uh-huh, market's like this...
一點都不複雜，抱緊就對了。收盤！
[End]`;

  const lyricsEn = `[Intro: Bright Strummed Acoustic Guitar & Punchy Mid-Tempo Y2K Pop-Rock Boom-Bap Drums (78 BPM)]
[Sassy Rebellious Female Vocal - Avril Style, casual spoken attitude]
Uh-huh, market's like this...
Uh-huh, uh-huh... that's the way it is
'Cause trading's like this
Uh-huh, uh-huh, that's the way it is...

[Verse 1: Sassy Young Female Rock Vocal, Crisp Acoustic Guitar Strums & Bass Groove]
Chill out, what ya panic-sellin' for?
Lay back, it's just a normal pullback we've seen before
And if you could only let it ride, you will see
I like you the way you trade when we're holding ${stockListEn} alone
And we're buying the dip and you're in the zone
But then we log onto the forum and you become somebody else 'round everyone else

[Pre-Chorus: Building Electric Guitar Arpeggios & Snare Drum Roll]
You're watchin' your back like you can't relax
You're tryin' to be cool, drawing fifty trendlines on the tracks
You're makin' me
Laugh out when you strike your guru pose
Take off all your Wall Street suits, you know you're not fooling anyone, no—!

[Chorus: Explosive Y2K Distorted Power-Chord Electric Guitars & Powerhouse Pop-Punk Female Belt!]
${hookLineEn}
Acting like you're a hedge-fund quant gets me frustrated
Market's like this, you
And you fall, and you crawl, and you break
And you take what you get, and you turn a five-minute scalp into a family heirloom
And honesty, you promised me I'm never gonna find you paper-handing
No, no, no!

[Verse 2: Witty Male Rapper & Sassy Female Vocal Trading Double-Time 156 BPM Rapid-Fire Roast Bars!]
[Rapper] (156 BPM Double-Time Satirical Rap Flow Over Y2K Pop-Rock Beat)
Yo! You got RSI, MACD, Bollinger Bands and twelve Fibonacci retracements on your screen
Then the forum jinx screams YOLO at the top and you blow your whole margin routine
TV guru waving a laser pointer bragging about one winner while hiding four losers in the drawer
Yesterday configuring a Lamborghini, tonight eating instant noodles on the Wendy's floor!
[Female Vocal] Deleting the broker app in grayscale mode pretending you haven't lost a dime
[Rapper] Even your grandpa jumped out the family tree asking why you bought the top every single time
All you had to do was hold ${stockListEn} above the VWAP line and let the bull run pay
Instead you over-complicated a simple breakout and gave your whole portfolio away!

[Chorus: Explosive Y2K Distorted Power-Chord Electric Guitars & Full Band Sing-Along!]
${hookLineEn}
Acting like you're Warren Buffett gets me frustrated
Trading's like this, you
And you fall, and you crawl, and you break
Stop over-trading every tick, hold ${stockListEn} to the all-time high
And honesty, you promised me I'm never gonna find you faking it
No, no, no!

[Outro: Iconic Acoustic Guitar Strum & Sassy Spoken Ad-lib]
[Female Vocal]
Uh-huh, market's like this...
Keep it simple, diamond hands. Market closed!
[End]`;

  return {
    zh: {
      title: "別把看盤搞得太複雜・簡單抱緊就贏了 (Why'd You Make Trading So Complicated)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI千禧搖滾饒舌】《別把看盤搞得太複雜 Complicated》｜致敬艾薇兒 Avril Lavigne 經典神曲！吐槽假股神畫線名師 (Official Audio)`,
        `《別把看盤搞得太複雜 (Why'd You Make Trading So Complicated)》｜Y2K 木吉他龐克搖滾 × 雙倍速吐槽快嘴 Rap (${bpm} BPM)`,
        `畫了二十條指標結果還是賣飛砍在阿呆谷？聽完艾薇兒風《Complicated》秒懂「簡單抱緊台積電就贏了」🛹🎸`
      ],
      ytDesc: `🛹「Uh-huh, market's like this! Why'd you have to go and make trading so complicated? 幹嘛把看盤搞得這麼複雜，最後還不是砍在阿呆谷底！」
致敬千禧年搖滾小天后 Avril Lavigne（艾薇兒）全球破億傳奇出道神曲《Complicated》（參考網址：5NPBIwQyPWE），這首《別把看盤搞得太複雜・簡單抱緊就贏了 (Why'd You Make Trading So Complicated)》以 ${bpm} BPM 最經典的「Uh-huh, life's like this!」清脆木吉他刷弦與帶有 Hip-Hop 律動感的 Y2K 流行龐克搖滾鼓點揭開序幕！
用艾薇兒式酷帥叛逆、一針見血的吐槽女聲，搭配中段 156 BPM 雙倍速男聲快嘴 Rap，狠狠吐槽那些在螢幕上畫了二十條技術指標、在群組裝模作樣當少年股神、聽信投顧老師雷射筆蓋牌、結果一開盤就被五檔假單洗出去、把短線當沖做成傳家寶、刪 APP 調黑白模式、去溫蒂漢堡排班與公園搶紙箱的搞笑日常——其實只要放下複雜的雜訊，用鑽石手簡單抱緊 ${stockList} 主升段就贏了！

🎧 曲風與編曲亮點：
• ${bpm} BPM Y2K 千禧滑板流行搖滾 (Skate-Pop-Rock / Acoustic Pop-Punk)
• 經典木吉他刷弦主歌 ➔ 副歌爆發力失真電吉他大合唱：「Why'd you have to go and make trading so complicated?」
• 雙倍速（156 BPM）吐槽快嘴 Rap 濃縮滿滿股市地獄迷因

💬 你身邊也有那種「指標畫滿整個螢幕，結果一買就套、一賣就噴」的朋友嗎？快把這首歌傳給他：「別把看盤搞得太複雜 🛹🎸」！

#台股 #美股 #AvrilLavigne #Complicated #艾薇兒 #Y2K搖滾 #流行龐克 #股市迷因 #少年股神 #台積電 #輝達 #SunoAI #AI音樂 #股票饒舌`
    },
    en: {
      title: "別把看盤搞得太複雜・簡單抱緊就贏了 (Why'd You Make Trading So Complicated)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `別把看盤搞得太複雜 (Why'd You Make Trading So Complicated) | Avril Lavigne Style Y2K Pop-Rock × Stock Rap (${bpm} BPM)`,
        `"Why'd You Have to Go and Make Trading So Complicated?" 🛹🎸 Roasting Over-Indicator Traders (Official AI Audio)`,
        `20 Indicators on Your Screen Just to Sell the Bottom 😂 Y2K Pop-Punk Wall Street Anthem (NVDA, TSMC)`
      ],
      ytDesc: `🛹 "Uh-huh, market's like this! ${hookLineEn}!"
Inspired by Avril Lavigne's iconic 2002 Y2K pop-rock smash hit "Complicated", this ${bpm} BPM acoustic-to-pop-punk anthem and double-time satirical rap duet roasts traders who clutter their screens with twenty indicators, follow forum jinxes, and turn five-minute scalps into family heirlooms—when simply holding ${stockListEn} with diamond hands was all it took!

#StockMarketRap #AvrilLavigne #Complicated #Y2KPopRock #PopPunk #WallStreetMemes #DiamondHands #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildColdplayVivaPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "I hear Jerusalem bells a-ringin', 開盤的鐘聲在華爾街敲響，我的多軍鐵騎正在歌唱";
  const hookLineEn =
    currentState.customHook ||
    "I hear the opening bells a-ringin', Roman cavalry choirs are singin', be my mirror, my sword and shield!";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Iconic Staccato Baroque Orchestral Violins & Cellos Ostinato, Booming Timpani Drum & Tolling Cathedral Bell!]
[Warm British-Rock Style Male Vocal & Rapper Intro]
(Strings & Timpani: Dum-dum-dum-dum!)
曾經，我在三萬點的牛市之巔俯瞰眾生……
直到那根重挫兩千點的黑色星期一敲響了王朝的喪鐘。
但真正的王者，總會在廢墟與阿呆谷底重建帝國！

[Verse 1: Warm Emotional British-Rock Male Vocal, Driving Staccato Strings & Timpani]
I used to rule the world
當我敲下市價買單，連五檔委賣都會為我讓路分開
那時候每天在股版曬出翻倍的對帳單，萬人崇拜
現在我卻在凌晨獨自睡在大安森林公園的紙箱裡
清晨一個人掃著溫蒂漢堡的地板，懷念曾經擁有的千萬部位

[Verse 2: Warm Rock Vocal, Building Orchestral Cello & Piano Chords]
I used to roll the dice
看著空頭眼裡的恐懼，聽著散戶跟單高喊我的名字
上一秒我還握著三倍槓桿與信貸質押的權杖
下一秒融資維持率一百三的追繳城牆就朝我轟然倒塌
而我發現我的交割城堡，原來只是建立在無本當沖的流沙之上

[Chorus: Majestic Orchestral Strings, Tolling Cathedral Bells & Soaring Male Vocal!]
${hookLineZh}
Be my mirror, my sword and shield
讓 ${stockList} 的護城河成為我的寶劍與盾牌
My missionaries in a foreign field
哪怕昨天暴跌到連阿公都從族譜裡跳出來，今天誰能解釋這場多頭的奇蹟歸來！

[Verse 3: Passionate Cinematic Storytelling Male Rapper, Rapid-Fire Multi-Syllable Flow Over Baroque Strings!]
（史詩巴洛克交響弦樂 × 激昂快嘴敘事 Rap Flow）
那是狂風暴雨最猛烈的一個夜盤，一筆五萬張的外資借券直接砸穿了城門
投顧老師蓋牌了四張跌停股還在電視上吹噓，股版冥燈反指標卻在山頂吹響了號角
我曾經以為只要刪掉看盤 APP 調成黑白模式，就能逃避一張不賣變成傳家寶的命運
直到我看見 ${stockList} 在底部爆出天量長下影線，在眾人恐慌砍倉的廢墟裡重新點燃星火
我丟掉了賭徒追高殺低的傲慢，用鋼鐵般的紀律與費波南希重鑄我的王冠
當限空令的戰鼓與教堂大鐘同時敲響，這位落難的少年股神將帶著鑽石手重返王座！

[Chorus: Full Stadium Orchestra, Timpani, Brass & Soaring Vocal!]
${hookLineZh}
Be my mirror, my sword and shield
讓 ${stockList} 的晶圓與算力成為我的寶劍與盾牌
For some reason I can't explain
曾經被洗出局的痛楚，如今化作主升段破頂封王的榮耀！

[Bridge: 50,000-Crowd Stadium Choir Sing-Along Anthem & Rapper Counterpoint!]
[50,000 Stadium Crowd Choir] Whoa-oh-oh-oh-oh-oh! Whoa-oh-oh-oh-oh!
([Rapper] 從關燈吃泡麵的谷底，一路軋穿空頭的防線！)
[50,000 Stadium Crowd Choir] Whoa-oh-oh-oh-oh-oh! Whoa-oh-oh-oh-oh!
([Rapper] 聽那九點整開盤的鐘聲敲響，我們的王朝正式重返榮耀！)

[Chorus: Final Maximum Majesty Stadium Climax, Bells, Strings & Choir Combined!]
${hookLineZh}
Be my mirror, my sword and shield
握緊 ${stockList} 的核心底牌，在這片華爾街與台股的戰場上
I know Saint Peter won't call my name
但歷史新高的里程碑上，終將刻下我們永不投降的對帳單！

[Outro: Fading Staccato Strings, Timpani & Stadium Choir Hum]
[Stadium Choir]
Mmm-mmm-mmm-mmm... Whoa-oh-oh-oh-oh...
Viva La Bull Market! 王朝重返，破頂收盤！
[End]`;

  const lyricsEn = `[Intro: Iconic Staccato Baroque Orchestral Violins & Cellos Ostinato, Booming Timpani Drum & Tolling Cathedral Bell!]
[Warm British-Rock Style Male Vocal & Rapper Intro]
(Strings & Timpani: Dum-dum-dum-dum!)
I used to rule the bull market from the thirty-thousand-point throne...
Until Black Monday rang the liquidation bell.
Now from the ashes of the margin call, the fallen king rises again!

[Verse 1: Warm Emotional British-Rock Male Vocal, Driving Staccato Strings & Timpani]
I used to rule the world
Order books would part when I gave the word
Now in the morning I sleep alone in a cardboard box
Sweep the Wendy's drive-thru floor I used to own

[Verse 2: Warm Rock Vocal, Building Orchestral Cello & Piano Chords]
I used to roll the dice
Feel the fear in my short-seller enemy's eyes
Listen as the forum crowd would sing
"Now the old guru's liquidated! Long live the king!"
One minute I held the triple-leveraged key
Next the margin-call walls were closed on me
And I discovered that my castles stand
Upon pillars of zero-day options and sand

[Chorus: Majestic Orchestral Strings, Tolling Cathedral Bells & Soaring Male Vocal!]
${hookLineEn}
My silicon missionaries in a foreign field
For some reason I can't explain
Once you go all-in at the top, there was never, never an honest word
And that was when I ruled the world!

[Verse 3: Passionate Cinematic Storytelling Male Rapper, Rapid-Fire Multi-Syllable Flow Over Baroque Strings!]
(Baroque Orchestral Strings × Cinematic Storytelling Fast Rap Flow)
It was a wicked and wild night-session wind, blew down the stop-loss doors to let the margin call in
Shattered monitors and the sound of timpani drums, people couldn't believe what I'd become
Forum jinxes calling the bottom while my grandpa jumped out of the family tree
Turned a five-minute scalp into a family heirloom, deleting the broker app so I wouldn't see
But when the blood washed over the floor, I saw ${stockListEn} holding the VWAP fort
Forged a new crown out of iron discipline, squeezing every greedy hedge-fund short
No longer a reckless gambler on a pillar of sand—the fallen king reclaims the promised land!

[Chorus: Full Stadium Orchestra, Timpani, Brass & Soaring Vocal!]
${hookLineEn}
Holding ${stockListEn} on the battlefield
For some reason I can't explain
I know the liquidation clerk won't call my name
Now that my diamond hands rule the world again!

[Bridge: 50,000-Crowd Stadium Choir Sing-Along Anthem & Rapper Counterpoint!]
[50,000 Stadium Crowd Choir] Whoa-oh-oh-oh-oh-oh! Whoa-oh-oh-oh-oh!
([Rapper] From eating ramen in the dark to the all-time high throne!)
[50,000 Stadium Crowd Choir] Whoa-oh-oh-oh-oh-oh! Whoa-oh-oh-oh-oh!
([Rapper] Hear the cathedral bells ring out at the opening bell—long live the bulls!)

[Outro: Fading Staccato Strings, Timpani & Stadium Choir Hum]
[Stadium Choir]
Mmm-mmm-mmm-mmm... Whoa-oh-oh-oh-oh...
Viva La Bull Market! Market conquered!
[End]`;

  return {
    zh: {
      title: "少年股神王朝・我曾統治這片盤面 (Viva La Bull Market)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI交響搖滾饒舌】《少年股神王朝 Viva La Bull Market》｜致敬 Coldplay 破十億神曲〈Viva La Vida〉！唱出股神殞落與浴火封王 (Official Audio)`,
        `《少年股神王朝 (Viva La Bull Market)》｜「I used to rule the world...」巴洛克弦樂 × 教堂鐘聲 × 萬人聖歌大合唱 (${bpm} BPM)`,
        `從千萬槓桿斷頭睡公園，到抱緊台積電與輝達重返王座！當 Coldplay《Viva La Vida》遇上台美股史詩 👑🎻`
      ],
      ytDesc: `👑「I used to rule the world... 當我敲下市價買單，連五檔委賣都會為我讓路分開；現在我卻在清晨一個人掃著溫蒂漢堡的地板，懷念曾經擁有的千萬部位……」
致敬英倫搖滾天團 Coldplay（酷玩樂團）葛萊美年度歌曲、全球破十億傳奇神作《Viva La Vida》（參考網址：dvgZkm1xWPE），這首《少年股神王朝・我曾統治這片盤面 (Viva La Bull Market)》以 ${bpm} BPM 最具標誌性的巴洛克斷奏小提琴/大提琴齊奏、磅礴定音鼓與教堂大鐘敲響揭開序幕！
以「落難國王」的史詩視角，唱出一位曾經靠著信貸質押與三倍槓桿不可一世的少年股神，在黑色星期一重挫兩千點中發現「交割城堡只是建立在無本當沖的流沙之上」（跌落公園紙箱、溫蒂漢堡排班、刪 APP、阿公從族譜跳出來）；最終在第三段激昂的交響快嘴 Rap 與五萬人體育館「Whoa-oh-oh-oh-oh!」聖歌大合唱中，以 ${stockList} 的晶圓與算力護城河為寶劍與盾牌（"Be my mirror, my sword and shield"），浴火重建多頭王朝！

🎧 曲風與編曲亮點：
• ${bpm} BPM 巴洛克交響流行搖滾 (Baroque Pop-Rock) × 史詩敘事說唱
• 標誌性斷奏交響弦樂 (Staccato Strings) + 磅礴定音鼓 (Timpani) 與開盤教堂大鐘
• 五萬人體育館聖歌級大合唱：「Whoa-oh-oh-oh-oh-oh! Be my mirror, my sword and shield!」

💬 你也曾在股海歷經起落、如今帶著更強的紀律重返榮耀嗎？在留言區刷一排「Whoa-oh-oh-oh-oh! 王朝重返 👑🎻」！

#台股 #美股 #Coldplay #VivaLaVida #酷玩樂團 #少年股神 #交響搖滾 #台積電 #輝達 #股市迷因 #SunoAI #AI音樂 #股票戰歌`
    },
    en: {
      title: "少年股神王朝・我曾統治這片盤面 (Viva La Bull Market)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `少年股神王朝 (Viva La Bull Market) | Coldplay "Viva La Vida" Style Baroque Pop-Rock × Wall Street Rap (${bpm} BPM)`,
        `"I Used to Rule the World... Upon Pillars of 0DTE Options and Sand!" 👑🎻 Fallen Trader King Anthem`,
        `Whoa-oh-oh-oh-oh! 🏟️ When Coldplay's "Viva La Vida" Meets Wall Street Memes & Diamond-Hand Comeback`
      ],
      ytDesc: `👑 "I used to rule the world, order books would part when I gave the word... And I discovered that my castles stand upon pillars of zero-day options and sand!"
Inspired by Coldplay's Grammy-winning baroque pop-rock masterpiece "Viva La Vida", this ${bpm} BPM orchestral stadium anthem and storytelling rap epic chronicles the rise, margin-call fall, and disciplined comeback of a retail trading king backed by ${stockListEn}—complete with staccato strings, timpani drums, cathedral bells, and the 50,000-strong "Whoa-oh-oh-oh-oh!" choir chant!

#StockMarketRap #Coldplay #VivaLaVida #BaroquePop #StadiumAnthem #WallStreetMemes #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildLinkinParkNumbPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "I've become so numb! 我對崩盤已經徹底麻木，連融資斷頭的痛都感覺不出";
  const hookLineEn =
    currentState.customHook ||
    "I've become so numb, I can't feel the drawdown there! Become so tired, so much more aware!";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Iconic Haunting 2000s Electronic Synth-Pad Riff, Turntable Scratch & Crashing Drop-D Nu-Metal Distorted Guitar Wall!]
[Rapper - Mike Style, urgent rhythmic cadence over heavy synth & drums]
Yeah... 凌晨三點半，看著螢幕上一片綠油油的跌停燈
從心痛、發抖、補錢，到現在連眼皮都不眨一下……
當你被主力洗過千百回，最後只剩下徹底的麻木。

[Verse 1: Clean Emotional Male Rock Tenor - Chester Style, Restrained Piano & Bass Pulse]
我已經厭倦了照著投顧老師的劇本走
厭倦了聽股版冥燈反指標在那裡指點多空
每當我以為終於抄到底部、準備迎接反彈的時候
總有一根無情的天地針長下影線，把我的停損全部刺穿掏空
Can't you see that you're smothering my margin?
握得太緊的槓桿，害怕失去最後一筆交割款
因為分析師說的每一句利多，最後都在五檔抽單裡碎成一灘！

[Pre-Chorus: Building Distorted Guitar Chugs & Snare Crescendo]
（每一次跳空開低，都把我推向斷頭的懸崖邊）
每一步踏錯，都比昨天還痛——！

[Chorus: Explosive Nu-Metal Guitar Wall & Raw Raspy High-Note Scream Belt!]
${hookLineZh}
被洗盤洗到疲憊，卻比任何時候都還要清醒 (So much more aware!)
I'm becoming this, all I want to do
是不再當被你們收割的韭菜，我要拿回我自己 (${stockList}) 的主控權！

[Verse 2: Interlocked Dual Vocals — Mike-Style Rapid-Fire Rap & Chester-Style Melodic Tenor]
[Rapper] （千禧 Nu-Metal 雙主唱交錯快嘴 Flow）
看外資借券賣出幾萬張壓著盤面，高頻演算法在毫秒之間獵殺散戶的防線
口中唸著一張不賣奇蹟自來，短線當沖做成了傳家寶，連阿公都從族譜跳出來問我買了哪支妖股
昨天還在看信義區豪宅跟藍寶堅尼，今晚關起燈吃泡麵連茶葉蛋都不敢加
只要我不打開看盤 APP 就沒有賠錢，把軟體調成黑白模式假裝心如止水！
[Rock Tenor] Can't you see that you're liquidating me?
維持率跌破一百三的簡訊緊緊掐住我的呼吸
因為你們畫出的每一個本益比大餅，全在尾盤黑手倒貨裡瓦解殆盡！

[Pre-Chorus: Maximum Tension Build-Up]
（每一秒五檔跳動，都在考驗最後的信仰底線）
一秒鐘的猶豫，就會萬劫不復——！

[Chorus: Explosive Nu-Metal Guitar Wall & Raw Raspy High-Note Scream Belt!]
${hookLineZh}
被雙巴洗到疲憊，卻比任何時候都還要清醒 (So much more aware!)
I'm becoming this, all I want to do
是斬斷所有追高殺低的心魔，用鑽石手抱緊 ${stockList} 走我自己的路！

[Bridge: Stripped-Back Atmospheric Synth & Piano Building into Cathartic Dual-Vocal Scream Climax!]
[Rock Tenor, soaring agonizing high belt]
And I know—— 我也可能在半山腰再次被套牢
But I know—— 就算跌進處置五分盤，我也再也不會像以前那樣慌張逃跑！
[Rapper & Rock Tenor Overlapping Roar]
([Rapper] 把所有恐懼跟貪婪全部關掉！當我對短線的震盪徹底麻木，就是空頭惡夢的開始！)
[Rock Tenor, Maximum Fry-Scream High Note]
I've become so NUUUUUUUMB——!

[Chorus: Final Maximum Stadium Nu-Metal Climax, Dual Vocals Overlapping!]
${hookLineZh}
([Rapper] I'm tired of being what the market makers want me to be!)
不再為幾根黑Ｋ流眼淚，我看穿了莊家最大痛點的詭計
I'm becoming this, all I want to do
是站在破頂的歷史高點，做我自己交易的王 (Be more like me and be less like you!)

[Outro: Iconic Haunting Electronic Synth Riff Returns Over Heavy Guitar Chords]
[Rock Tenor & Rapper]
I've become so numb... 對洗盤徹底麻木……
握緊 ${stockList}，直上雲霄。收盤！
[End]`;

  const lyricsEn = `[Intro: Iconic Haunting 2000s Electronic Synth-Pad Riff, Turntable Scratch & Crashing Drop-D Nu-Metal Distorted Guitar Wall!]
[Rapper - Mike Style, urgent rhythmic cadence over heavy synth & drums]
Yeah... 3:30 AM staring at a screen bleeding forty percent red
From panic, to margin calls, to feeling nothing at all...
Once the market breaks you a thousand times, you become completely numb.

[Verse 1: Clean Emotional Male Rock Tenor - Chester Style, Restrained Piano & Bass Pulse]
I'm tired of trading what you want me to trade
Feeling so faithless, lost under the HFT spoofing cascade
I don't know what the Fed's expecting of me
Put under the pressure of walking in Warren Buffett's shoes
(Caught in the stop-hunt, just caught in the stop-hunt)
Every step that I take is another mistake to my brokerage account
(Caught in the stop-hunt, just caught in the stop-hunt)

[Pre-Chorus: Building Distorted Guitar Chugs & Snare Crescendo]
I've held my margin so tight, afraid to lose control
'Cause everything that the TV gurus thought I would be
Has fallen apart right in front of the opening bell—!

[Chorus: Explosive Nu-Metal Guitar Wall & Raw Raspy High-Note Scream Belt!]
${hookLineEn}
By this drawdown, all I want to do
Is be more like a disciplined sniper and be less like a retail fool!

[Verse 2: Interlocked Dual Vocals — Mike-Style Rapid-Fire Rap & Chester-Style Melodic Tenor]
[Rapper] (Meteora-Era Dual-Vocal Rap-Rock Interplay)
Foreign funds short-lending millions while the forum jinxes scream all-in at the top
Turned a five-minute scalp into a family heirloom watching the maintenance ratio drop
Yesterday configuring a Lamborghini, tonight eating instant noodles in the dark
Deleted the broker app in grayscale mode so the red candles can't leave a mark!
[Rock Tenor] Can't you see that you're liquidating me?
Holding too tight to the leverage, afraid to lose control
'Cause every target price that the analysts promised me
Has crashed through the floor at the closing bell!

[Chorus: Explosive Nu-Metal Guitar Wall & Raw Raspy High-Note Scream Belt!]
${hookLineEn}
By this whipsaw, all I want to do
Is lock onto ${stockListEn} and never fold for you!

[Bridge: Stripped-Back Atmospheric Synth & Piano Building into Cathartic Dual-Vocal Scream Climax!]
[Rock Tenor, soaring agonizing high belt]
And I know—— I may end up catching a falling knife too
But I know—— You were just like me with paper hands disappointed in you!
[Rock Tenor, Maximum Fry-Scream High Note]
I've become so NUUUUUUUMB——!

[Chorus: Final Maximum Stadium Nu-Metal Climax, Dual Vocals Overlapping!]
${hookLineEn}
([Rapper] I'm tired of trading what the market makers want me to trade!)
I'm becoming this, all I want to do
Is hold my diamond hands to the all-time high and be less like you!

[Outro: Iconic Haunting Electronic Synth Riff Returns Over Heavy Guitar Chords]
[Rock Tenor & Rapper]
I've become so numb... I can't feel the drawdown there...
(I'm tired of being what you want me to be...) Market closed!
[End]`;

  return {
    zh: {
      title: "跌到麻木・砍不下手的心痛 (I've Become So Numb)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI新金屬搖滾饒舌】《跌到麻木 I've Become So Numb》｜致敬 Linkin Park 破二十億傳奇神曲！唱出散戶被洗盤到麻木的覺醒 (Official Audio)`,
        `《跌到麻木 (I've Become So Numb)》｜「我對崩盤已經徹底麻木，連融資斷頭的痛都感覺不出！」Nu-Metal 音牆 × 雙主唱說唱 (${bpm} BPM)`,
        `當聯合公園 Linkin Park《Numb》遇上台股美股大洗盤！那聲撕裂嘶吼出來直接靈魂共振 🔥🎸`
      ],
      ytDesc: `🔥「I've become so numb! 我對崩盤已經徹底麻木，連融資斷頭的痛都感覺不出！被洗盤洗到疲憊，卻比任何時候都還要清醒 (So much more aware!)」
致敬搖滾傳奇天團 Linkin Park（聯合公園）全球破二十億點擊不朽神曲《Numb》（參考網址：kXYiU_JCYtU），這首《跌到麻木・砍不下手的心痛 (I've Become So Numb)》以 ${bpm} BPM 最具標誌性的空靈電子合成器前奏 Loop 與厚重 Drop-D 失真電吉他音牆揭開序幕！
完美重現 Chester Bennington 式從壓抑低吟到副歌撕心裂肺的靈魂嘶吼高音，以及 Mike Shinoda 式冷靜犀利的快嘴 Rap 雙主唱交錯對撞！把散戶從聽信投顧明牌、被天地針掃停損、刪 APP 調黑白模式、關燈吃泡麵到最終「對短線震盪徹底麻木、砍掉情緒握緊 ${stockList} 覺醒為冷血狙擊手」的心路歷程唱得熱血沸騰！

🎧 曲風與編曲亮點：
• ${bpm} BPM 千禧年經典 Nu-Metal / Alternative Rap-Rock（標誌性電子合成器 Riff + DJ 刷碟 + 炸裂重金屬電吉他音牆）
• 雙主唱靈魂配置：撕裂高音搖滾主唱（Chester 風）× 冷靜快嘴饒舌主唱（Mike 風）結尾雙軌交疊
• 融合熱門股市迷因：股版冥燈、阿公從族譜跳出來、一張不賣變傳家寶、刪 APP 黑白模式、處置五分盤

💬 你也曾經被大盤洗到「徹底麻木（So Numb）」最後反而練成鑽石手嗎？在留言區刷一排「I've Become So Numb! 🔥🎸」！

#台股 #美股 #LinkinPark #Numb #聯合公園 #NuMetal #搖滾饒舌 #RapRock #台積電 #輝達 #股市迷因 #融資斷頭 #SunoAI #AI音樂 #股票戰歌`
    },
    en: {
      title: "跌到麻木・砍不下手的心痛 (I've Become So Numb)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `跌到麻木 (I've Become So Numb) | Linkin Park "Numb" Style Nu-Metal × Wall Street Rap-Rock (${bpm} BPM)`,
        `"I've Become So Numb, I Can't Feel the Drawdown There!" 🔥🎸 Cathartic Stock Market Anthem (Official AI Audio)`,
        `When a 2000s Nu-Metal Classic Meets Margin-Call Pain & Diamond-Hand Awakening (NVDA, TSMC)`
      ],
      ytDesc: `🔥 "${hookLineEn}!"
Inspired by Linkin Park's legendary 2003 nu-metal masterpiece "Numb", this ${bpm} BPM alternative rap-rock anthem pairs the iconic haunting electronic synth melody and crushing distorted guitar wall with dual male vocals—trading razor-sharp rap verses about retail trading memes with raw, cathartic high-note screams about becoming numb to market shakeouts and holding ${stockListEn} to the top!

#StockMarketRap #LinkinPark #Numb #NuMetal #RapRock #WallStreetMemes #DiamondHands #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildGagaShallowPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "I'm off the deep end, watch as I dive in! 我跳進主升段的深淵，絕不再回到當沖的淺灘 (We're far from the shallow now!)";
  const hookLineEn =
    currentState.customHook ||
    "I'm off the deep end, watch as I dive in! I'll never meet the margin floor—we're far from the shallow now!";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Intimate Fingerpicked Acoustic Guitar Arpeggios & Distant Live Stadium Crowd Murmur]
[Weathered Gravelly Male Vocal - Bradley Cooper Style, gentle and empathetic]
Tell me somethin', girl...
妳在這片紅綠閃爍的無情早盤裡，是不是也累了？
Tell me somethin', girl...
每天在無本當沖的淺灘裡搶那幾個 tick 的便當錢，妳真的快樂嗎？

[Verse 1: Gravelly Raspy Male Vocal, Warm Acoustic Guitar & Soft Piano Chords]
在所有暴漲暴跌的夜盤裡
我看見妳眼裡藏著被天地針洗出場的委屈
關起燈吃著泡麵，假裝只要不打開看盤 APP 就沒有輸過
在這個充滿投顧明牌與冥燈反指標的世界裡
還有沒有一檔核心信仰，值得妳用鑽石手死抱到底？

[Verse 2: Soulful Powerhouse Female Vocal - Lady Gaga Style, starting intimate and vulnerable]
Tell me somethin', boy...
你是不是也厭倦了在融資維持率一百三的邊緣拼命掙扎？
在每一個被外資借券砸盤的深夜裡
你明知道短線追高殺低只會去公園搶紙箱
卻還是渴望著一場能徹底翻身的破頂主升段？

[Pre-Chorus: Male storytelling Rapper & Female Vocalist Intertwining, Building Live Drums & Bass]
[Rapper] （深情走心敘事 Melodic Rap Flow）
我們都曾在阿呆谷底懷疑過人生，把短線當沖做成了傳家寶寫進遺囑
看別人貼對帳單看信義區豪宅，自己卻在 T加2 交割日前被營業員奪命連環叩
但當我越過那些五檔假單的泡沫，看清 ${stockList} 真正的晶圓與算力護城河
我決定不再在投機的淺水區裡溺水，牽起妳的手，我們直接縱身躍入趨勢的深海！

[Chorus: Powerhouse Female Diva Vocal & Raspy Male Harmony, Crashing Live Arena Rock Drums!]
${hookLineZh}
就算千點洗盤巨浪襲來，也撞不碎我們的底牌
Crash through the surface, where they can't hurt us
遠離隔日沖與散戶追高的淺灘，We're far from the shallow now!

[Post-Chorus Duet: Soaring Emotional Call & Response]
[Female & Male Duet]
In the sha-ha, sha-ha-llow (在追高殺低的韭菜淺灘裡)
In the sha-ha-sha-la-la-la-llow
In the sha-ha, sha-ha-llow
We're far from the shallow now! (我們已經航向破頂的深海！)

[Bridge: Stripped-Back Piano Building into Earth-Shattering Goosebump Female Vocal Scream Climax!]
[Female Diva Vocal, raw chest-voice building to maximum stadium roar]
Oh, ha-ah-ah-ah——
Ah-ah-ah-ah, ah-aaaaah——!
（撕裂雲霄的鐵肺女高音破頂吶喊 × Rapper 熱血疊句：衝破所有均線壓力天花板！把空頭全部軋上四萬點！）
Woo-aaaah——!

[Chorus: Final Maximum Voltage Stadium Rock Duet Climax, Full Orchestra, Electric Guitar & Choir!]
${hookLineZh}
抱緊 ${stockList} 的核心籌碼，迎著黃金交叉的曙光
Crash through the surface, where the bears can't hurt us
我們已經徹底告別韭菜的淺灘，We're far from the shallow now!

[Outro: Emotional Acoustic Guitar & Soaring Duet Harmonies with Crowd Applause]
[Female & Male Duet]
In the sha-ha, sha-ha-llow...
In the sha-ha-sha-la-la-la-llow...
We're far from the shallow now! (破頂封王，遠離淺灘！)
[End]`;

  const lyricsEn = `[Intro: Intimate Fingerpicked Acoustic Guitar Arpeggios & Distant Live Stadium Crowd Murmur]
[Weathered Gravelly Male Vocal - Bradley Cooper Style, gentle and empathetic]
Tell me somethin', girl...
Are you happy in this high-frequency day-trading world?
Or do you need more?
Is there somethin' else you're searchin' for on the trading floor?

[Verse 1: Gravelly Raspy Male Vocal, Warm Acoustic Guitar & Soft Piano Chords]
I'm fallin'...
In all the good times I find myself longin' for a real breakout trend
And in the bad times, when the stop-hunt lower wick sweeps my account clean, I fear myself

[Verse 2: Soulful Powerhouse Female Vocal - Lady Gaga Style, starting intimate and vulnerable]
Tell me somethin', boy...
Aren't you tired tryin' to fill that margin-call void?
Or do you need more?
Ain't it hard keepin' it so hardcore while eating ramen in the dark?

[Pre-Chorus: Male Storytelling Rapper & Female Vocalist Intertwining, Building Live Drums & Bass]
[Rapper] (Heartfelt Melodic Storytelling Rap Flow)
We both got burned in the shallow water, scalping ticks while paying commissions in fear
Watching the forum jinxes and fake TV gurus scream while our portfolios disappear
No more Wendy's night-shift applications, no more panic-selling at the exact valley floor
When we lock onto the real moat of ${stockListEn}, we leave the shallow noise behind and dive into the core!

[Chorus: Powerhouse Female Diva Vocal & Raspy Male Harmony, Crashing Live Arena Rock Drums!]
${hookLineEn}
Crash through the resistance, where the algos can't hurt us
We're far from the shallow now!

[Post-Chorus Duet: Soaring Emotional Call & Response]
[Female & Male Duet]
In the sha-ha, sha-ha-llow (Out of the paper-hand shallow water)
In the sha-ha-sha-la-la-la-llow
In the sha-ha, sha-ha-llow
We're far from the shallow now!

[Bridge: Stripped-Back Piano Building into Earth-Shattering Goosebump Female Vocal Scream Climax!]
[Female Diva Vocal, raw chest-voice building to maximum stadium roar]
Oh, ha-ah-ah-ah——
Ah-ah-ah-ah, ah-aaaaah——!
(Goosebump-Inducing Arena High-Note Belt × Rapper Counterpoint: Breaking through the Call Wall ceiling, riding the short squeeze to the sky!)
Woo-aaaah——!

[Chorus: Final Maximum Voltage Stadium Rock Duet Climax, Full Orchestra, Electric Guitar & Choir!]
${hookLineEn}
Holding ${stockListEn} with diamond hands through the volatility storm
Crash through the surface, where the bears can't hurt us
We're far from the shallow now!

[Outro: Emotional Acoustic Guitar & Soaring Duet Harmonies with Crowd Applause]
[Female & Male Duet]
In the sha-ha, sha-ha-llow...
In the sha-ha-sha-la-la-la-llow...
We're far from the shallow now! Market conquered!
[End]`;

  return {
    zh: {
      title: "遠離韭菜淺灘・跳進主升段的深淵 (Far From The Shallow Now)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI神級男女對唱】《遠離韭菜淺灘 Shallow》｜致敬 Lady Gaga & Bradley Cooper 奧斯卡神曲！核爆高音唱哭百萬股民 (Official Audio)`,
        `《遠離韭菜淺灘 (Far From The Shallow Now)》｜「我跳進主升段的深淵，絕不再回到當沖的淺灘！」木吉他對唱 × 走心說唱 (${bpm} BPM)`,
        `當《一個巨星的誕生 Shallow》遇上台股美股！那聲「Ah-ah-aaaah」高音出來直接破頂漲停 🌊🔥`
      ],
      ytDesc: `🌊「Tell me somethin', girl... 每天在無本當沖的淺灘裡搶那幾個 tick 的便當錢，妳真的快樂嗎？I'm off the deep end, watch as I dive in! 我們已經遠離韭菜的淺灘 (We're far from the shallow now!)」
致敬奧斯卡最佳原創歌曲、Lady Gaga 與 Bradley Cooper 全球破十億傳奇男女對唱神曲《Shallow》（電影《一個巨星的誕生 A Star Is Born》，參考網址：bo_efYhYU2A），這首《遠離韭菜淺灘・跳進主升段的深淵 (Far From The Shallow Now)》以 ${bpm} BPM 最經典的溫暖指彈木吉他與萬人演唱會氛圍揭開序幕！
前半段由粗獷滄桑的男聲與溫柔深情的女聲對話，訴說散戶在當沖淺灘、天地針洗盤、關燈吃麵與股版冥燈裡受盡折磨的心酸；中段融入走心敘事 Melodic Rap，並在 Bridge 迎來 Lady Gaga 最具靈魂穿透力的「Ah-ah-ah-ah, ah-aaaaah——！」核爆級女高音嘶吼，象徵徹底告別追高殺低的淺灘，抱緊核心護城河（${stockList}）縱身躍入波段主升段的深海！

🎧 曲風與編曲亮點：
• ${bpm} BPM 溫暖指彈木吉他 & 古典鋼琴開場 ➔ 後半段體育館搖滾真鼓與電吉他全面爆發
• 粗獷滄桑男聲 × 鐵肺靈魂女高音 × 走心敘事 Rap 三重情感堆疊
• 完美重現 Bridge 雞皮疙瘩級「Ah-ah-ah-aaaah!」破頂高音與「In the sha-ha, sha-ha-llow」大合唱

💬 你也決定離開「天天搶便當錢卻被洗出場的當沖淺灘」，航向波段主升段的深海了嗎？在留言區刷一排「We're far from the shallow now! 🌊🔥」！

#台股 #美股 #Shallow #LadyGaga #BradleyCooper #AStarIsBorn #一個巨星的誕生 #男女對唱 #台積電 #輝達 #股市迷因 #SunoAI #AI音樂 #股票情歌`
    },
    en: {
      title: "遠離韭菜淺灘・跳進主升段的深淵 (Far From The Shallow Now)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `遠離韭菜淺灘 (Far From The Shallow Now) | Lady Gaga & Bradley Cooper "Shallow" Style Trader Duet (${bpm} BPM)`,
        `"I'm Off the Deep End, Watch as I Dive In!" 🌊🔥 From Day-Trading Shallow Water to Diamond-Hand Conviction`,
        `When That "Ah-ah-aaaah!" High Note Hits the All-Time High Breakout 🎸 "Far From The Shallow Now" (Official AI Audio)`
      ],
      ytDesc: `🌊 "${hookLineEn}!"
Inspired by Lady Gaga and Bradley Cooper's Oscar-winning masterpiece "Shallow" (from A Star Is Born), this ${bpm} BPM acoustic-to-arena rock duet and melodic rap ballad tells the story of two retail traders leaving the toxic shallow waters of tick-scalping, margin calls, and forum jinxes to dive into deep, disciplined conviction on ${stockListEn}—complete with the goosebump-inducing "Ah-ah-ah-aaaah!" vocal climax!

#StockMarketRap #Shallow #LadyGaga #BradleyCooper #AStarIsBorn #ArenaRockDuet #DiamondHands #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildGagaBadRomancePackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "I want your 漲停, I want your 跌停, 只要不賣我們就是天生一對 (Caught in a bad romance!)";
  const hookLineEn =
    currentState.customHook ||
    "I want your green candles, and I want your red crash, long as you're my ticker I'm caught in a bad romance!";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Iconic Operatic Baroque Synth-Choir Swell & Pounding Industrial Sawtooth Synth-Bass Drop!]
[Powerhouse Theatrical Female Diva Vocal]
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
陷入這場股市的壞浪漫！

[Post-Intro Hook: Hypnotic Stuttering Electro-Pop Chant & Heavy Club Kick]
Rah, rah-ah-ah-ah
拉，拉抬，拉到漲停板
Roma, roma-ma
融資，融券，軋，軋到天花板
Gaga, ooh-la-la
砍在阿呆谷，也捨不得放開這壞浪漫！

[Verse 1: Sultry Low-Register Theatrical Female Vocal, Gritty Industrial Synth-Bass Pulse]
我想要你那根天地針的醜陋，我想要你洗盤的假動作
我想要你在早盤九點鐘，用十萬張假委買把我徹底迷惑
我想要你高股息左配右的溫柔，我想要你跌破季線的冷漠
你知道我愛你愛到連看盤 APP 都不敢刪，甘願為你睡公園搶紙箱吹冷風！

[Pre-Chorus: Escalating Euro-Club Synth Risers & Snare Roll Build-Up!]
你知道我想要你的主升段，你知道我賭上全部的交割款
想要你那瘋狂的千點振幅，Can't read my poker face!
You know that I want you, and you know that I need you ('Cause I'm all-in, baby!)
我想要你的壞，你的壞浪漫——！

[Chorus: Explosive Stadium Electro-Pop Diva Belt & Full Choir Harmony!]
${hookLineZh}
I want your 軋空, and your 融資追繳令
You and me could write a bad romance! (Oh-oh-oh-oh-oh!)
我想要你的暴漲，還有你半夜閃崩的瘋狂
只要 ${stockList} 還在帳上，You and me could write a bad romance!
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!

[Post-Chorus Chant]
Rah, rah-ah-ah-ah
拉，拉抬，拉到漲停板
Roma, roma-ma
Gaga, ooh-la-la!
Want your bad, your bad romance!

[Verse 2: Aggressive Rapid-Fire Male Rapper Trading Bars with Diva Ad-libs, Heavy Sawtooth Bass!]
（男聲硬派電音快嘴 Rap × 女王高音交鋒）
[Rapper] Yo! 這是一場散戶跟主力之間最致命的斯德哥爾摩症候群
你早盤拉高五百點給我一顆糖，尾盤殺到跌停板卻讓我遍體鱗傷還不肯停
看著股版冥燈反指標高喊滿倉抄底，連阿公都從族譜跳出來問我到底買了什麼東西
嘴巴唸著一張不賣奇蹟自來，短線當沖做成長線存股最後變成傳家寶寫進遺囑裡
（雙倍速電音快嘴衝刺）
昨天看的是信義區豪宅跟藍寶堅尼，今晚關起燈默默吃泡麵連茶葉蛋都不敢加進去
可是只要 ${stockList} 明天跳空開高一根紅Ｋ，我馬上忘記所有追繳的痛又滿倉衝進去！
[Diva Vocal] Walk, walk, fashion baby! Work it, 就算跌進處置五分盤也越關越大尾！
Walk, walk, passion baby! Work it, I'm a free-margin freak, baby!

[Bridge: Stripped-Back Dramatic Synth Pad & Whispered French-Style Theatrical Monologue Building to a Scream!]
[Diva Vocal, sultry theatrical whisper]
I want your 籌碼, I don't wanna be friends
J'veux ton amour, et je veux ta revanche (我想要你的紅利，也想要你的報復軋空)
J'veux ton amour, 我不要只賺便當錢，我要陪你從阿呆谷一路軋上四萬點！
[Screaming Diva Belt + Rapper Hype]
No, I don't wanna be just a bagholder!
I want your liquidity, I want your short squeeze, I want your all-time high——!

[Chorus: Final Maximum Voltage Stadium Electro-Pop Climax, Key-Change High Notes!]
${hookLineZh}
I want your 軋空, and your 融資追繳令
You and me could write a bad romance! (Oh-oh-oh-oh-oh!)
就算被你多空雙巴洗到脫皮，我依然死抱不放我的鑽石手
只要 ${stockList} 鎖死漲停，You and me could write a bad romance!
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!

[Outro: Iconic Stuttering Chant & Industrial Synth Slam Finale]
Rah, rah-ah-ah-ah!
Roma, roma-ma!
Gaga, ooh-la-la!
Want your bad, your bad romance! 漲停鎖死，收盤！
[End]`;

  const lyricsEn = `[Intro: Iconic Operatic Baroque Synth-Choir Swell & Pounding Industrial Sawtooth Synth-Bass Drop!]
[Powerhouse Theatrical Female Diva Vocal]
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a Wall Street bad romance!

[Post-Intro Hook: Hypnotic Stuttering Electro-Pop Chant & Heavy Club Kick]
Rah, rah-ah-ah-ah
Rally, rally, rip it to the top
Roma, roma-ma
Roll the margin, gamma never stops
Gaga, ooh-la-la
Want your bad, your stock-market romance!

[Verse 1: Sultry Low-Register Theatrical Female Vocal, Gritty Industrial Synth-Bass Pulse]
I want your ugly, I want your stop-hunt lower wick
I want your Level-two spoofing everything as long as it clicks
I want your volatility, your three-thousand-point whipsaw ride
I want your midnight flash crash leaving paper hands nowhere to hide
You know that I love you so much I won't even delete the broker app!

[Pre-Chorus: Escalating Euro-Club Synth Risers & Snare Roll Build-Up!]
You know that I want your breakout, and you know that I wired my cash
I want it bad, your parabolic flash!
You know that I want you, and you know that I need you ('Cause I'm all-in, baby!)
I want it bad, your bad romance—!

[Chorus: Explosive Stadium Electro-Pop Diva Belt & Full Choir Harmony!]
${hookLineEn}
I want your drama, the touch of your margin call
You and me could write a bad romance! (Oh-oh-oh-oh-oh!)
I want your vertical pump, and your circuit-breaker scream
Long as ${stockListEn} lead the team, you and me could write a bad romance!
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!

[Post-Chorus Chant]
Rah, rah-ah-ah-ah
Roma, roma-ma
Gaga, ooh-la-la!
Want your bad, your bad romance!

[Verse 2: Aggressive Rapid-Fire Male Rapper Trading Bars with Diva Ad-libs, Heavy Sawtooth Bass!]
(Hard-Hitting Electro-Rap × Diva Counterpoint)
[Rapper] Yo! It's Stockholm syndrome on the trading floor, addicted to the pain
You pump five hundred at the open bell then dump two thousand in the afternoon rain
Watching the forum jinx call the bottom while my grandpa jumps out the family tree
Chanting "never sell a single share" till a five-minute scalp becomes a family heirloom to be
Yesterday configuring a Lamborghini, tonight eating instant noodles in the dark
Next morning ${stockListEn} gap up one percent and I'm all-in chasing the spark!
[Diva Vocal] Walk, walk, fashion baby! Work it, move that leverage crazy!
Walk, walk, passion baby! Work it, I'm a diamond-handed freak, baby!

[Bridge: Stripped-Back Dramatic Synth Pad & Whispered French-Style Theatrical Monologue Building to a Scream!]
[Diva Vocal, sultry theatrical whisper]
I want your alpha, I don't wanna be friends
J'veux ton amour, et je veux ta revanche (I want your green rally, and I want your short-squeeze revenge)
J'veux ton amour, I don't wanna be just a paper-trading tourist!
[Screaming Diva Belt + Rapper Hype]
No, I don't wanna be friends!
Want your liquidity, want your gamma squeeze, want your all-time high——!

[Chorus: Final Maximum Voltage Stadium Electro-Pop Climax, Key-Change High Notes!]
${hookLineEn}
I want your drama, the touch of your margin call
You and me could write a bad romance! (Oh-oh-oh-oh-oh!)
Oh-oh-oh-oh-oh, oh-oh-oh-oh, oh-oh-oh!
Caught in a bad romance!

[Outro: Iconic Stuttering Chant & Industrial Synth Slam Finale]
Rah, rah-ah-ah-ah!
Roma, roma-ma!
Gaga, ooh-la-la!
Want your bad, your bad romance! Market closed!
[End]`;

  return {
    zh: {
      title: "韭菜壞浪漫・被主力套牢的愛 (Caught in a Bad Romance)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI電音神曲】《韭菜壞浪漫 Caught in a Bad Romance》｜致敬 Lady Gaga 破十億神曲！「拉、拉抬、拉到漲停板！」(Official Audio)`,
        `《韭菜壞浪漫 (Caught in a Bad Romance)》｜「I want your 漲停, I want your 跌停！」暗黑歌劇電音 × 股市虐戀說唱 (${bpm} BPM)`,
        `被主力洗盤虐千百遍還是一開盤就初戀？當 Lady Gaga《Bad Romance》遇上台股美股地獄迷因 👑💔`
      ],
      ytDesc: `👑「Rah, rah-ah-ah-ah! 拉、拉抬、拉到漲停板！Roma, roma-ma! 融資、融券、軋、軋到天花板！Gaga, ooh-la-la! 砍在阿呆谷也捨不得放開這壞浪漫！」
致敬流行天后 Lady Gaga 全球破十億點擊傳奇神曲《Bad Romance》（參考網址：qrO4YZeyl0I），這首《韭菜壞浪漫・被主力套牢的愛 (Caught in a Bad Romance)》以 ${bpm} BPM 最具標誌性的巴洛克歌劇合成器前奏、狂暴工業鋸齒 Synth-Bass 與超洗腦「Rah-rah-ah-ah-ah」咒語，把散戶與主力莊家之間「虐我千百遍、待你如初戀」的股市斯德哥爾摩症候群唱到極致！
完美融合女王低沉戲劇唸唱、高亢 Diva 副歌、法語經典過門（"J'veux ton amour, et je veux ta revanche"）與硬派男聲電音快嘴 Rap（涵蓋股版冥燈、阿公從族譜跳出來、一張不賣變傳家寶、關燈吃麵 vs. 藍寶堅尼、處置股越關越大尾等爆笑迷因）！

🎧 曲風與編曲亮點：
• ${bpm} BPM 暗黑歌劇電音舞曲 (Dark Theatrical Synth-Pop / Electro-House) + 工業鋸齒重低音
• 超洗腦諧音開頭咒語：「Rah-rah（拉抬）、Roma-roma-ma（融資融券軋）、Gaga-ooh-la-la！」
• 女王戲劇高音副歌 × 男聲雙倍速電音快嘴 Rap × 經典法語唸白 Bridge 高潮

💬 你手上有哪一檔股票讓你陷入「被套牢卻捨不得砍的 Bad Romance」？在留言區貼出它的代號吧 👑💔！

#台股 #美股 #LadyGaga #BadRomance #股市迷因 #韭菜心聲 #電音饒舌 #台積電 #輝達 #鴻海 #漲停板 #SunoAI #AI音樂 #股票情歌`
    },
    en: {
      title: "韭菜壞浪漫・被主力套牢的愛 (Caught in a Bad Romance)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `韭菜壞浪漫 (Caught in a Bad Romance) | Lady Gaga Style Dark Synth-Pop × Wall Street Rap (${bpm} BPM)`,
        `"I Want Your Green Candles & I Want Your Red Crash!" 👑💔 Stock Market Bad Romance Anthem (Official AI Audio)`,
        `Rah-Rah-Rally to the Top! 🔥 When Lady Gaga's "Bad Romance" Meets Wall Street Degens (NVDA, TSMC)`
      ],
      ytDesc: `👑 "${hookLineEn}!"
Inspired by Lady Gaga's iconic electro-pop masterpiece "Bad Romance", this ${bpm} BPM dark theatrical synth-pop and hip-hop duet turns the toxic love-hate relationship between retail traders and market volatility (${stockListEn}) into a stadium club banger—complete with the "Rah-rah-ah-ah-ah" chant, industrial sawtooth bass, rapid-fire rap verses, and the dramatic French bridge!

#StockMarketRap #LadyGaga #BadRomance #SynthPop #WallStreetMemes #DiamondHands #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildMjThrillerPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "'Cause this is Thriller, Thriller night! 夜盤崩盤斷頭的午夜誰能逃得開";
  const hookLineEn =
    currentState.customHook ||
    "'Cause this is Thriller, Liquidation night! And no one's gonna save you from the margin beast about to strike";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Creaking Haunted Trading-Room Door, Midnight Wolf Howl, Heavy Footsteps & Iconic 118 BPM Minimoog Synth-Bass Groove Drops!]
[King-of-Pop Style High-Tenor Vocal & Rapper Ad-libs]
(Creak... Awooooo!)
Hee-hee! Ow!
凌晨十二點整，那斯達克與台指夜盤的鐘聲敲響……
你以為刪掉 APP 就能睡個好覺？今晚，斷頭怪獸要出來獵食了！
Let's groove!

[Verse 1: Sharp Percussive 80s Synth-Funk Male Vocal, Tight Funky Guitar Strums & LinnDrum Beat]
接近午夜十二點，某個邪惡的黑天鵝正潛伏在黑暗的Ｋ線裡
月光下，你看見那根閃崩三百點的長黑正讓你屏住呼吸
你想要按停損尖叫，但恐懼已經把你的手指徹底凍結在鍵盤上
你開始全身發抖，因為 ${stockList} 的五檔委買正一瞬間被主力抽光——
你把眼睛緊緊閉上，祈禱這只是一場假跌破的幻象！

[Pre-Chorus: Building 80s Brass Horn Stabs & Percussive Vocal Hiccups]
但身後傳來券商系統逼近的腳步聲 (Hee-hee!)
你的融資維持率正一步一步墜入深淵，時間已經來不及——！

[Chorus: Explosive 80s Synth-Funk Pop Anthem, Soaring High-Tenor + Zombie Choir Harmony!]
${hookLineZh}
沒有人能從莊家獵殺的怪獸爪下救你出來
You know it's Thriller, Margin-Call night!
你正在跟夜盤多空雙巴的死神正面對決，為了生存而戰
Inside a killer, Thriller tonight! (Ow!)

[Verse 2: Tight Rhythmic Funk-Rapper trading bars with King-of-Pop Ad-libs]
（80s 暗黑放克 Funk-Rap 疾速律動 Flow）
你聽見營業員奪命連環叩的電話門鈴在半夜作響
外資借券賣出的幽靈大軍正沿著破底的均線四處遊蕩
剛才還在股版跟著冥燈反指標高喊滿倉歐印、一張不賣奇蹟自來
下一秒大安森林公園的紙箱位與溫蒂漢堡的大夜班已經為你敞開
他們從阿呆谷底伸出冰冷的雙手，要把不設停損的散戶全部拉下水
唯有握緊鑽石般的交易紀律與對沖籌碼，才能在這場午夜驚魂裡全身而退！

[Chorus: Explosive 80s Synth-Funk Pop Anthem, Full Brass & Synth-Bass Drop!]
${hookLineZh}
沒有人能從莊家獵殺的怪獸爪下救你出來
You know it's Thriller, Margin-Call night!
你正在跟夜盤洗盤三千點的死神正面對決，為了翻身而戰
Ooh, Thriller, liquidation night!

[Bridge: Stripped-Back Creepy Synth Pad & Theatrical Deep Baritone "Vincent Price" Market-Maker Monologue]
[Sinister Deep Baritone Narrator - Vincent Price Style]
黑暗降臨在午夜的期貨交易室，倒數結算的午夜鐘聲已經逼近……
被套在山頂的水手與滿倉開槓桿的散戶四處逃竄，面對著無情的強制平倉令
凡是沒有風險底線的靈魂，都將在這根天地針下化為莊家的權利金……

[Rapper & Deep Narrator Call-and-Response]
[Narrator] 惡魔的空單正在逼近，要把你的維持率徹底吞噬
[Rapper] （反手鎖定 ${stockList} 底部爆量長紅，一舉軋穿空頭的墳墓！）
[Narrator] 今晚沒有人能替你補交割，除非你擁有看穿籌碼的靈魂
[Rapper] （在眾人恐懼顫慄的午夜，我們把空軍全數軋上外太空！）

[Chorus: Final Maximum Voltage 80s Funk-Pop Climax + High-Note Ad-libs!]
${hookLineZh}
因為今晚我能把任何暴跌危機化為抄底暴富的奇蹟
Girl, this is Thriller, Short-Squeeze night!
我會陪你殺穿這場最黑暗的夜盤風暴，直到漲停曙光升起！

[Outro: Iconic Vincent Price Sinister Spoken Word & Evil Laugh Finale]
[Sinister Deep Baritone Narrator]
當大盤冷卻、水銀燈熄滅，你以為自己終於逃過了今晚的洗盤……
但明早九點整集合競價開盤的鐘聲，將再次把你的心臟緊緊掐住……
Mwah-ha-ha-ha-ha! A-ha-ha-ha-ha-ha-ha!
[End]`;

  const lyricsEn = `[Intro: Creaking Haunted Trading-Room Door, Midnight Wolf Howl, Heavy Footsteps & Iconic 118 BPM Minimoog Synth-Bass Groove Drops!]
[King-of-Pop Style High-Tenor Vocal & Rapper Ad-libs]
(Creak... Awooooo!)
Hee-hee! Ow!
It's midnight on the futures desk, and the margin monster is prowling the chart...
You thought deleting the broker app would save you? Tonight is Liquidation Night!
Let's groove!

[Verse 1: Sharp Percussive 80s Synth-Funk Male Vocal, Tight Funky Guitar Strums & LinnDrum Beat]
It's close to midnight, and something evil's lurking on the futures screen
Under the moonlight, you see a flash-crash candle that almost stops your heart
You try to hit stop-loss, but terror takes the click before you make it
You start to freeze, as ${stockListEn} Level-two bids vanish right between your eyes
You're paralyzed!

[Pre-Chorus: Building 80s Brass Horn Stabs & Percussive Vocal Hiccups]
'Cause you hear the margin-call SMS slamming against your door (Hee-hee!)
And you realize there's nowhere left to hide on the trading floor—!

[Chorus: Explosive 80s Synth-Funk Pop Anthem, Soaring High-Tenor + Zombie Choir Harmony!]
${hookLineEn}
You know it's Thriller, Margin-Call night!
You're fighting for your portfolio inside a killer, whipsaw tonight! (Ow!)

[Verse 2: Tight Rhythmic Funk-Rapper trading bars with King-of-Pop Ad-libs]
(80s Dark Synth-Funk Rap Flow)
You hear the broker phone start to ring and know there's no more cash left to wire
You feel the HFT spoofing algos dragging your leveraged options into the fire
Yesterday you followed the forum jinx yelling "all-in YOLO, never sell a single share"
Now the Wendy's night-shift roster and the park cardboard box are waiting over there
They're out to hunt the paper hands closing in from every side
Only iron discipline and a gamma-squeeze hedge can keep your account alive!

[Chorus: Explosive 80s Synth-Funk Pop Anthem, Full Brass & Synth-Bass Drop!]
${hookLineEn}
You know it's Thriller, Margin-Call night!
You're fighting for your equity inside a killer, Thriller tonight!

[Bridge: Stripped-Back Creepy Synth Pad & Theatrical Deep Baritone "Vincent Price" Market-Maker Monologue]
[Sinister Deep Baritone Narrator - Vincent Price Style]
Darkness falls across the Wall Street floor; the midnight liquidation hour is close at hand...
Over-leveraged bagholders crawl in search of liquidity, to terrorize y'all's neighborhood
And whosoever shall be found without a stop-loss for getting down
Must stand and face the hounds of Margin Call—and rot inside a worthless 0DTE shell...

[Rapper & Deep Narrator Call-and-Response]
[Narrator] The foulest stench is in the air, the funk of forty thousand blown accounts
[Rapper] (Flipping the script on ${stockListEn} at the VWAP floor, squeezing the bears out the door!)
[Narrator] And grizzly short-sellers from every tomb are closing in to seal your doom
[Rapper] (While the zombies panic sell the bottom, we ride the short squeeze to the moon!)

[Chorus: Final Maximum Voltage 80s Funk-Pop Climax + High-Note Ad-libs!]
${hookLineEn}
'Cause I can squeeze the shorts harder than any ghoul would ever dare try
Thriller, Short-Squeeze night!
So let me hold your diamond hands and share a killer, parabolic ride tonight!

[Outro: Iconic Vincent Price Sinister Spoken Word & Evil Laugh Finale]
[Sinister Deep Baritone Narrator]
And though you fight to stay solvent, your maintenance ratio starts to shiver...
For no mere retail mortal can resist the evil of... the Midnight Margin Thriller!
Mwah-ha-ha-ha-ha! A-ha-ha-ha-ha-ha-ha!
[End]`;

  return {
    zh: {
      title: "顫慄夜盤・斷頭驚魂夜 (Margin-Call Thriller Night)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI神曲改編】《顫慄夜盤 Margin-Call Thriller Night》｜致敬 Michael Jackson 傳奇神曲！把午夜閃崩與融資斷頭唱成 80s 暗黑放克戰歌 (Official Audio)`,
        `《顫慄夜盤 (Margin-Call Thriller Night)》｜「'Cause this is Thriller, Margin-Call night!」Minimoog 放克 Bass × 莊家邪惡笑聲獨白 (${bpm} BPM)`,
        `半夜盯美股與台指夜盤必聽！當流行之王《Thriller 顫慄》遇上天地針洗盤與反手軋空 🧟🌕`
      ],
      ytDesc: `🧟「'Cause this is Thriller, Thriller night! 夜盤崩盤斷頭的午夜誰能逃得開！」
致敬流行之王 Michael Jackson 史上最暢銷傳奇神曲《Thriller (顫慄)》（參考網址：Thzt3Hi6ihM），這首《顫慄夜盤・斷頭驚魂夜 (Margin-Call Thriller Night)》完美還原了 ${bpm} BPM 最具標誌性的午夜狼嚎、木門嘎吱聲、傳奇 Minimoog 放克合成器 Bassline 與 80 年代爆發力銅管編曲！
將半夜十二點盯著美股與台指夜盤突遇黑天鵝閃崩、融資維持率逼近 130% 追繳令、股版冥燈反指標與刪 APP 睡公園的地獄迷因，化為張力十足的 80s Dark Synth-Funk × 饒舌舞台劇；結尾更重現了經典 Vincent Price 式「莊家低沉恐怖口白」與邪惡狂笑（Mwah-ha-ha-ha!）！

🎧 曲風與編曲亮點：
• ${bpm} BPM 經典 80s Minimoog 暗黑放克合成器 Bassline + LinnDrum 鼓機與銅管齊奏
• 流行之王高音律動唱腔（Hee-hee! Ow!）× 緊湊 Funk-Rap 雙軌交鋒
• 經典恐怖片旁白致敬：Vincent Price 式低音莊家午夜追繳獨白與邪惡狂笑 Outro

💬 你也曾在凌晨夜盤經歷過「顫慄之夜」嗎？在留言區分享你最驚險的一次夜盤操作吧 🌕🦇！

#台股 #美股 #MichaelJackson #Thriller #顫慄 #台指夜盤 #融資斷頭 #台積電 #輝達 #股市迷因 #80sFunk #SynthFunk #SunoAI #AI音樂`
    },
    en: {
      title: "顫慄夜盤 (Margin-Call Thriller Night)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Margin-Call Thriller Night | Michael Jackson "Thriller" Style 80s Synth-Funk × Wall Street Rap (${bpm} BPM)`,
        `"'Cause This Is Thriller, Liquidation Night!" 🧟🌕 Midnight Futures Flash-Crash Anthem (Official AI Audio)`,
        `When the Midnight Margin Monster Hunts Your Portfolio 🔥 80s Dark Synth-Funk Stock Market Parody`
      ],
      ytDesc: `🧟 "${hookLineEn}!"
Inspired by Michael Jackson's legendary 1982 masterpiece "Thriller", this ${bpm} BPM 1980s dark synth-funk and horror-rap crossover captures the midnight terror of watching futures flash-crash, Level-2 bids vanish, and margin-call alerts ring—complete with the iconic Minimoog bassline, brass stabs, and a sinister Vincent Price-style market-maker monologue and evil laugh finale!

#StockMarketRap #MichaelJackson #Thriller #80sSynthFunk #MarginCall #WallStreetMemes #NightSession #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildOneDBeautifulPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "Baby, you light up my account like nobody else! 那根漲停紅Ｋ讓我徹底淪陷";
  const hookLineEn =
    currentState.customHook ||
    "Baby, you light up my account like nobody else! The way you gap up gets me overwhelmed";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Iconic Bright Surf-Rock Electric Guitar Riff & Punchy Cowbell Beat, Sunny Beach Party Vibes!]
[Boyband Vocalist A & Rapper Hype]
One, two, three, four!
早盤九點鐘的陽光灑進交易室，今天不唱悲歌，我們只唱漲停板的多巴胺！
Let's go boys!

[Verse 1: Youthful Charismatic Male Vocal A & B trading lines, Palm-Muted Pop-Rock Guitar]
你總是低調在底部盤整，不知道自己有多迷人
每次看外資報告把你低估，我都忍不住笑出聲
你根本不需要投顧老師畫大餅，五日線一抬頭全場都目不轉睛
他們說你本益比太高別追，我卻看見你主升段最閃耀的靈魂！

[Pre-Chorus: Boyband Vocal C, Building Drums & Handclaps]
全市場都在盯著你的五檔委買跳動
只有你還安靜站在起漲點不為所動——

[Chorus: Full 5-Member Boyband Euphoric Harmony Explosion, Bright Power-Pop Guitars!]
${hookLineZh}
看你帶量突破頸線的那一瞬間
You don't know, oh-oh
You don't know you're parabolic!
如果只有散戶看得見你的護城河有多美
當你跳空鎖死一字線，空頭只能流眼淚
You don't know, oh-oh
You don't know you're beautiful!
That's what makes ${stockList} so beautiful!

[Verse 2: Playful Bouncy Boyband Pop-Rapper D & E trading rapid-fire bars]
（男團陽光活力雙人接力 Pop-Rap Flow）
Hey! 以前我也在無本當沖跟天地針長下影線裡被洗到頭暈
直到遇見了 ${stockList} 的黃金交叉，我的對帳單終於放晴
看那隔日沖分點在早盤九點半倒貨想要嚇退我的真心
我反手逢低加碼一張不賣，讓空軍在限空令下強制回補到懷疑人生
不用看聯準會臉色、不怕半夜關稅推文來敲門
當你亮起紅通通的漲停燈號，整個台北到那斯達克都為你沸騰！

[Chorus: Full 5-Member Boyband Euphoric Harmony Explosion!]
${hookLineZh}
看你帶量突破頸線的那一瞬間
You don't know, oh-oh
You don't know you're parabolic!
That's what makes ${stockList} so beautiful!

[Bridge: Sing-Along Handclap Breakdown & Boyband Rap Counterpoint]
[All Boys] Na-na-na-na-na-na, na-na-na! ([Rapper] 漲停鎖死十萬張排隊買單！)
[All Boys] Na-na-na-na-na-na! ([Rapper] 把空頭全部軋上陽光海灘！)
[Lead Tenor Solo, acoustic guitar strums]
Baby, 你點亮了我的交割帳戶，沒有任何一檔妖股能把你取代
回測月線不破的那個微笑，讓我決定滿倉抱緊你不放開——！

[Chorus: Final Maximum Dopamine Boyband Key-Change Climax, High-Note Ad-libs!]
${hookLineZh}
從阿呆谷底一路噴上歷史高點
You don't know, oh-oh
You don't know you're parabolic!
You don't know, oh-oh
That's what makes ${stockList} so beautiful!

[Outro: Iconic Surf-Rock Guitar Riff Finale & Cheering]
[All Boys]
Na-na-na-na-na-na!
You light up my account! 漲停漂亮收盤！
[End]`;

  const lyricsEn = `[Intro: Iconic Bright Surf-Rock Electric Guitar Riff & Punchy Cowbell Beat, Sunny Beach Party Vibes!]
[Boyband Vocalist A & Rapper Hype]
One, two, three, four!
Nine-thirty AM sunshine hitting the trading screens—no sad drawdown songs today, pure breakout dopamine!
Let's go boys!

[Verse 1: Youthful Charismatic Male Vocal A & B trading lines, Palm-Muted Pop-Rock Guitar]
You're consolidating quiet at the base, don't know what you're worth
Every time the Wall Street analysts downgrade you, it's the funniest thing on earth
You don't need no CNBC hype-man, one green candle and you steal the show
Everyone says you're overbought today, I can't wait to watch your multiple grow!

[Pre-Chorus: Boyband Vocal C, Building Drums & Handclaps]
Every whale in the room is staring at your Level-two order book glow
And you're just sitting at the breakout line ready to blow—

[Chorus: Full 5-Member Boyband Euphoric Harmony Explosion, Bright Power-Pop Guitars!]
${hookLineEn}
When you rip right through resistance at the opening bell
You don't know, oh-oh
You don't know you're parabolic!
If only you saw what the diamond hands can see
You'll understand why I'm all-in on this buying spree
Right now I'm looking at my screen and I can't believe
You don't know, oh-oh
You don't know you're beautiful!
That's what makes ${stockListEn} so beautiful!

[Verse 2: Playful Bouncy Boyband Pop-Rapper D & E trading rapid-fire bars]
(Bouncy Boyband Pop-Rap Relay Flow)
Yo! Used to get shaken out by stop-hunt lower wicks and zero-day chop
Until I locked onto ${stockListEn} golden cross heading straight to the top
Let the overnight whales dump at nine-thirty thinking we're gonna fold
We scoop the dip with a smile on our face, turning every share into gold
Don't care about the midnight tariff tweets or the hawkish Fed talk tonight
When your ticker flashes green across the board, everything feels so right!

[Chorus: Full 5-Member Boyband Euphoric Harmony Explosion!]
${hookLineEn}
When you rip right through resistance at the opening bell
You don't know, oh-oh
You don't know you're parabolic!
That's what makes ${stockListEn} so beautiful!

[Bridge: Sing-Along Handclap Breakdown & Boyband Rap Counterpoint]
[All Boys] Na-na-na-na-na-na, na-na-na! ([Rapper] Hundred-thousand buy orders queued at the top!)
[All Boys] Na-na-na-na-na-na! ([Rapper] Short squeeze summer party never gonna stop!)
[Lead Tenor Solo, stripped-back guitar]
Baby, you light up my brokerage account like nobody else in the game
That bounce off the Fibonacci support made me forget every margin-call pain—!

[Chorus: Final Maximum Dopamine Boyband Key-Change Climax, High-Note Ad-libs!]
${hookLineEn}
From the bottom of the valley to the all-time high bell
You don't know, oh-oh
You don't know you're parabolic!
You don't know, oh-oh
That's what makes ${stockListEn} so beautiful!

[Outro: Iconic Surf-Rock Guitar Riff Finale & Cheering]
[All Boys]
Na-na-na-na-na-na!
That's what makes my portfolio beautiful! Market closed!
[End]`;

  return {
    zh: {
      title: "那根漲停讓我淪陷 (What Makes My Portfolio Beautiful)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI多巴胺饒舌】《What Makes My Portfolio Beautiful》｜致敬 One Direction 破十億神曲！把漲停板唱成陽光男團情歌 (Official Audio)`,
        `《那根漲停讓我淪陷》｜「Baby, you light up my account like nobody else!」衝浪電吉他 × 男團接力 Pop-Rap (${bpm} BPM)`,
        `帳面收紅必聽的快樂神曲！當 One Direction《What Makes You Beautiful》遇上台積電與輝達噴出 🏖️✨`
      ],
      ytDesc: `🏖️「Baby, you light up my account like nobody else! 那根漲停紅Ｋ讓我徹底淪陷！You don't know you're parabolic!」
誰說股票歌一定要苦大仇深？致敬英國傳奇男團 One Direction 全球破十億點擊代表作《What Makes You Beautiful》，這首《What Makes My Portfolio Beautiful (那根漲停讓我淪陷)》以 ${bpm} BPM 最經典的陽光衝浪搖滾電吉他 Riff 與青春四四拍鼓點，把你手上的核心飆股（${stockList}）當成暗戀對象來告白！
結合五人男團輪流接力主唱、中段活力雙人 Pop-Rap 快嘴，以及超洗腦的「Na-na-na-na-na-na」漲停沙灘派對大合唱，一秒注入滿滿股市多巴胺！

🎧 曲風與編曲亮點：
• ${bpm} BPM 陽光衝浪電吉他 Riff (Surf-Rock Guitar) + 青春 Power-Pop 真鼓與拍手節奏
• 五人男團和聲 × 俏皮接力 Melodic Pop-Rap 主歌
• 超洗腦多巴胺副歌：「You light up my account like nobody else! You don't know you're parabolic!」

💬 今天哪一檔股票「點亮了你的帳戶」？在留言區對你的愛股大聲告白吧 ✨！

#台股 #美股 #OneDirection #WhatMakesYouBeautiful #多巴胺音樂 #男團饒舌 #PopRap #台積電 #輝達 #鴻海 #漲停板 #SunoAI #AI音樂 #股票情歌`
    },
    en: {
      title: "那根漲停讓我淪陷 (What Makes You Parabolic)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `What Makes You Parabolic (You Light Up My Account) | One Direction Style Boyband Pop-Rock × Stock Rap (${bpm} BPM)`,
        `"Baby, You Light Up My Account Like Nobody Else!" 🏖️✨ Feel-Good Bull Market Anthem (Official AI Audio)`,
        `When a 2010s Boyband Sings a Love Song to Their Breakout Stocks 🔥 "What Makes You Parabolic" (NVDA, TSMC)`
      ],
      ytDesc: `🏖️ "${hookLineEn}! You don't know, oh-oh, you don't know you're parabolic!"
Inspired by One Direction's iconic power-pop smash hit "What Makes You Beautiful", this ${bpm} BPM sunshine surf-rock and boyband pop-rap anthem turns a breakout bull run on ${stockListEn} into an irresistible feel-good love song complete with five-part harmonies, bouncy rap verses, and a "Na-na-na" short-squeeze beach party bridge!

#StockMarketRap #OneDirection #WhatMakesYouBeautiful #PowerPop #BoybandRap #BullMarket #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildBonJoviMyLifePackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "It's my life! 這是我的盤，It's now or never! 我絕不白活一場";
  const hookLineEn =
    currentState.customHook ||
    "It's my trade! And it's now or never! I ain't gonna hold forever";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Iconic Talk-Box Wah-Wah Distorted Electric Guitar Riff (Bow-wow-wow!), Massive Stadium Drums Drop!]
[Powerhouse Raspy Rock Vocal & Rapper Hype]
Yeah! Bow-wow-wow!
從台北早盤九點鐘，到華爾街那斯達克不眠夜！
我的籌碼我做主！Turn the amps up! Let's rock!

[Verse 1: Palm-Muted Chugging Rock Guitar & Driving Bass, Fierce Rap-Rock Male Vocal]
這不是投顧老師寫好的劇本，更不是給膽小鬼玩的練習題
螢幕上紅綠Ｋ線像心電圖狂跳，${stockList} 在盤面上呼風喚雨
Tommy 以前在融資斷頭裡押上全部身家，被天地針洗出局在公園嘆氣
Gina 在夜盤暴跌兩千點時咬緊牙關，守住維持率底線等黎明升起
（Rap-Rock 疾速連押加速）
外資借券賣出幾萬張想把散戶壓在地板摩擦
高頻演算法在五檔委買瞬間抽單玩弄真假
但我的手指按在買進鍵上從來不會發抖害怕
自己選的賽道、自己扛的槓桿，就算天塌下來我也要親手把空頭打垮！

[Pre-Chorus: Building Drum Roll & Distorted Guitar Chord Crescendo]
我的心像滿載運轉的 AI 算力機房
頂開所有均線壓力的高牆
堅守我的交易信仰，絕不退讓——！

[Chorus: Explosive Stadium Hard-Rock Anthem, Raspy Rock Tenor + 50,000 Crowd Gang Vocals!]
${hookLineZh}
我只想在破頂的主升段裡輝煌！
(It's my life!)
我的信念像 ${stockList} 的護城河一樣開闊堅強
像老船長掌舵穿越千點洗盤的巨浪
I just want to trade while I'm alive!
(It's my life!)

[Talk-Box Wah-Wah Guitar Riff Interlude: Bow-wow-wow!]

[Verse 2: Aggressive Rap-Rock Male Vocal, Tight Punchy Arena Rock Groove]
這首歌獻給每一個在暴跌三千點時依然沒砍在阿呆谷底的孤勇者
獻給那些自己畫趨勢線、自己算費波南希、不聽明牌不跟風的硬骨頭
當關稅黑天鵝半夜突襲、當聯準會鷹派發言讓全場發抖
你敢不敢在萬眾恐慌的時刻逆勢扣下扳機、跟主升段生死與共？

[Pre-Chorus: Maximum Stadium Build-Up]
不向莊家低頭，不對震盪求饒
要麼不進場，要麼就一路軋上雲霄——！

[Chorus: Explosive Stadium Hard-Rock Anthem, Full Arena Sing-Along!]
${hookLineZh}
我不在乎空頭設下多少圈套！
(It's my life!)
我的帳戶由我自己親手打造
迎著黃金交叉的長紅一路狂飆
I just want to win while I'm alive!

[Guitar Solo: Soaring Melodic Stadium Hard-Rock Electric Guitar Solo with Talk-Box Wah-Wah Climax!]

[Bridge: Stripped-Back Bass & Stadium Stomp-Clap Beat, Rapper & Rock Vocal Call-and-Response]
[Rapper] 你是要聽別人的明牌當一輩子韭菜，還是自己握緊方向盤？
[Rock Vocal] Better stand tall when they're calling you out!
[Rapper] 面對追繳、面對洗盤，不彎腰、不認輸、不折斷！
[Rock Vocal] Don't bend, don't break, baby, don't back down!

[Chorus: Final Maximum Adrenaline Stadium Explosion, Key Change High-Note Belt!]
${hookLineZh}
And I ain't gonna live forever!
我只要在破頂的歷史高點被銘記！
(It's my life!)
握緊 ${stockList} 的最後底牌
It's now or never!
I just want to trade while I'm alive!

[Outro: Iconic Talk-Box Guitar Riff & Crashed Cymbals Finale]
[Rock Vocal]
It's my life! 我的盤面我做主！
It's now or never! 破頂封王！
[End]`;

  const lyricsEn = `[Intro: Iconic Talk-Box Wah-Wah Distorted Electric Guitar Riff (Bow-wow-wow!), Massive Stadium Drums Drop!]
[Powerhouse Raspy Rock Vocal & Rapper Hype]
Yeah! Bow-wow-wow!
From the Taipei opening bell to the Wall Street midnight floor!
My capital, my conviction! Turn it up! Let's go!

[Verse 1: Palm-Muted Chugging Rock Guitar & Driving Bass, Fierce Rap-Rock Male Vocal]
This ain't a paper-trading demo account, this ain't no practice round
Candlesticks flashing like a heartbeat monitor while ${stockListEn} shake the ground
Tommy used to blow his paycheck chasing zero-day options in the dark
Gina held the line through a two-thousand-point crash waiting for the morning spark
(Rap-Rock Double-Time Surge)
Hedge funds short-lending millions tryna crush the retail dream
HFT algos spoofing Level-two bids inside the machine
But my finger on the trigger never trembles at the open bell
My own thesis, my own risk—I'll ride this breakout straight through hell!

[Pre-Chorus: Building Drum Roll & Distorted Guitar Chord Crescendo]
My heart is like an open highway of AI compute power
Breaking through the resistance wall in the darkest hour
Standing my ground, I will never back down—!

[Chorus: Explosive Stadium Hard-Rock Anthem, Raspy Rock Tenor + 50,000 Crowd Gang Vocals!]
${hookLineEn}
I just want to ride the breakout wave while I'm alive!
(It's my trade!)
My conviction is like the silicon shield beside the open highway
Like Frankie said, I did it my way
I just want to trade while I'm alive!
(It's my life!)

[Talk-Box Wah-Wah Guitar Riff Interlude: Bow-wow-wow!]

[Verse 2: Aggressive Rap-Rock Male Vocal, Tight Punchy Arena Rock Groove]
This is for the ones who stood their ground when the index dropped three grand
For the diamond-handed warriors who drew their own Fibonacci plan
When midnight tariff headlines hit and hawkish Fed speakers roar
Will you fold in the panic or buy the blood on the trading floor?

[Pre-Chorus: Maximum Stadium Build-Up]
No bowing to the market makers, no begging for a break
All-in on the golden cross, everything's at stake—!

[Chorus: Explosive Stadium Hard-Rock Anthem, Full Arena Sing-Along!]
${hookLineEn}
I ain't gonna fold under the short-seller pressure!
(It's my trade!)
My portfolio, my discipline, my way
Riding ${stockListEn} into the break of day
I just want to win while I'm alive!

[Guitar Solo: Soaring Melodic Stadium Hard-Rock Electric Guitar Solo with Talk-Box Wah-Wah Climax!]

[Bridge: Stripped-Back Bass & Stadium Stomp-Clap Beat, Rapper & Rock Vocal Call-and-Response]
[Rapper] Are you gonna follow fake gurus like a sheep, or captain your own ship tonight?
[Rock Vocal] Better stand tall when the margin calls bite!
[Rapper] Through the stop-hunt wicks and the volatility storm—never fold!
[Rock Vocal] Don't bend, don't break, baby, don't back down!

[Chorus: Final Maximum Adrenaline Stadium Explosion, Key Change High-Note Belt!]
${hookLineEn}
I just want to ride the all-time high while I'm alive!
(It's my life!)
Like Frankie said, I traded my way!
It's now or never!
I just want to trade while I'm alive!

[Outro: Iconic Talk-Box Guitar Riff & Crashed Cymbals Finale]
[Rock Vocal]
It's my life! It's my trade!
It's now or never! Market conquered!
[End]`;

  return {
    zh: {
      title: "It's My Life・我的盤面我做主 (Now or Never)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI搖滾饒舌】《It's My Life・我的盤面我做主》｜致敬 Bon Jovi 傳奇搖滾神曲！Talk-Box 電吉他 × 台美股破頂戰歌 (Official Audio)`,
        `《It's My Life (It's Now or Never!)》股市熱血版｜「這是我的盤，我絕不白活一場！」體育館硬式搖滾 × Rap-Rock (${bpm} BPM)`,
        `開盤前聽這首直接腎上腺素狂飆！當 Bon Jovi《It's My Life》遇上台積電與輝達主升段 🎸🔥`
      ],
      ytDesc: `🎸「It's my life! 這是我的盤，It's now or never! 我絕不白活一場！我只想在破頂的主升段裡輝煌！」
致敬搖滾傳奇天團 Bon Jovi 跨越世代的體育館聖歌《It's My Life》，這首《It's My Life・我的盤面我做主》以 ${bpm} BPM 最具標誌性的 Talk-Box 哇音失真電吉他 Riff（Bow-wow-wow!）與炸裂真鼓揭開序幕！
將原曲中傳奇人物 Tommy & Gina 的奮鬥故事，改編為散戶在融資追繳、天地針洗盤與千點震盪中浴火重生、不聽投顧明牌、自己掌握交易紀律與 ${stockList} 護城河的熱血 Rap-Rock 戰歌！

🎧 曲風與編曲亮點：
• ${bpm} BPM 2000 年代體育館硬式搖滾 (Stadium Hard Rock) × 硬派 Rap-Rock 節奏主歌
• 經典 Talk-Box 哇音電吉他 Riff + 悶音電吉他推進 (Palm-Muted Chugs)
• 萬人體育館嘶吼大合唱副歌：「It's my life! It's now or never! Don't bend, don't break, baby, don't back down!」

💬 你的帳戶由你自己做主！在留言區刷一排「It's My Life! It's Now or Never! 🎸🔥」！

#台股 #美股 #ItsMyLife #BonJovi #搖滾饒舌 #RapRock #交易員戰歌 #台積電 #輝達 #鴻海 #SunoAI #AI音樂 #股票音樂 #熱血搖滾`
    },
    en: {
      title: "It's My Life・我的盤面我做主 (It's My Trade)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `It's My Trade (It's Now or Never!) | Bon Jovi Style Stadium Hard-Rock × Wall Street Rap-Rock Anthem (${bpm} BPM)`,
        `"It's My Trade, And It's Now or Never!" 🎸 Talk-Box Guitar Riff × Trader Conviction Rock Anthem (Official AI Audio)`,
        `Don't Bend, Don't Break, Don't Back Down 🔥 "It's My Trade" | Arena Rock Stock Market Song (NVDA, TSMC)`
      ],
      ytDesc: `🎸 "${hookLineEn}! I just want to ride the breakout wave while I'm alive!"
Inspired by Bon Jovi's legendary 2000s stadium rock anthem "It's My Life", "It's My Trade (It's Now or Never)" packs a ${bpm} BPM talk-box wah-wah distorted guitar riff, palm-muted rap-rock verses about Tommy and Gina surviving market shakeouts, and an explosive arena chorus celebrating trader independence and conviction on ${stockListEn}.

#StockMarketRap #BonJovi #ItsMyLife #ArenaRock #RapRock #TraderAnthem #WallStreet #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildProdigalReturnPackage(p, bpm, flags) {
  const hookLineZh =
    currentState.customHook ||
    "菸一支一支一支地點，酒一杯一杯一杯地乾，單一張一張一張地敲，停損一筆一筆一筆地砍";
  const hookLineEn =
    currentState.customHook ||
    "Cigarettes lit one by one, whiskey shots downed one by one, margin orders clicked one by one";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Weeping Vintage Blues Electric Guitar Solo & Warm Hammond Organ Chords, Rain & Neon Izakaya Ambience]
[Raspy Weathered Taiwanese Rock Male Vocal (EggPlantEgg style), raw emotional gravelly voice]
${hookLineZh}
請你要體諒我，我酒量不好賣給我衝康
時間一天一天一天地走，汗一滴一滴一滴地流
有一天，咱都老，帶某子一起，浪子回頭……

[Verse 1: Raspy Blues Rock Vocal & Street-Poet Rapper, Taiwanese Hokkien & Mandarin blend]
親愛的，可愛的，英俊的，少年股神朋友
垃圾的，沒品的，沒路用的，追高殺低那個我
佇這個五檔跳動的無情早盤
看著 ${stockList} 開高走低，我的心肝一直抖
以前總以為滿倉當沖，就能翻身做大爺
結果一根天地針長下影線，把我的嫁妝本全部洗乾
營業員打電話來催交割，我躲在熱炒店的廁所不敢接
看著鏡子裡通紅的目睭，才知影什麼叫作散戶的悲哀

[Verse 2: Gritty Taiwanese Street Storytelling Male Rapper, raw emotional boom-bap rock flow]
（台式江湖浪子走心饒舌 — 國台語氣口交錯）
拎北以前在股版也是喊水會結凍，每天看那斯達克夜盤當作在逛夜市
聽投顧老師畫大餅、跟隔日沖分點搶帽子，以為財富自由只是幾根漲停板的事
${flags.hasWhipsaw ? "誰知影昨天暴漲三千點還在開香檳，今天關稅利空重挫兩千點直接送進加護病房" : "誰知影昨天跳空創高還在開香檳，今天外資借券倒貨直接把多軍送進加護病房"}
融資維持率跌破一百三的那封簡訊，比寒流半夜的冷風還要刺骨冰涼
看著某子熟睡的臉龐，我把當沖的槓桿一筆一筆關掉
浪子回頭不是離開這片市場，是學會不再把身家當作賭場的籌碼亂拋
鎖定 ${stockList} 的基本面護城河，守住五線合一與交易紀律的底線
這一次，我不做少年賭徒，我要做能帶家人平安上岸的掌舵手！

[Chorus: Maximum Raspy Rock Vocal & Tavern Gang-Vocal Sing-Along, Heavy Live Drums & Crying Guitar]
${hookLineZh}
請主力體諒我，我本金不多賣給我洗盤
Ｋ線一根一根一根地走，淚一滴一滴一滴地流
有一天，咱都老，抱緊核心持股，浪子回頭！

[Guitar Solo: Epic Weeping Twin-Electric-Guitar Blues Rock Solo with Screaming Bends & Hammond Organ Swell]

[Bridge: Raspy Vocal Screaming Belt & Rapper Overlapping Oath, Raw Live Stadium Emotion]
[Raspy Rock Vocal] 時間一天一天一天地走——汗一滴一滴一滴地流——！
[Rapper] （戒掉無本當沖的毒，戒掉追高殺低的狂！看MACD底背離亮起紅燈，時間的複利會還我們公道！）
[Raspy Rock Vocal] 有一天——咱都老——！
[Rapper] （走過阿呆谷底的滄桑，握緊 ${stockList} 的信仰，散戶浪子終究會破頂回頭！）

[Outro: Slow Acoustic Guitar Strums & Weeping Electric Guitar Fade Out]
[Raspy Rock Vocal]
菸一支一支一支地點…… 酒一杯一杯一杯地乾……
有一天，咱都老…… 浪子回頭……
[Rapper]
少年股神下台一鞠躬，價值投資浪子回頭。收盤。
[End]`;

  const lyricsEn = `[Intro: Weeping Vintage Blues Electric Guitar Solo & Warm Hammond Organ Chords, Late-Night Tavern Ambience]
[Raspy Weathered Blues-Rock Male Vocal, raw whisky-soaked gravelly voice]
${hookLineEn}
Stop-losses cut one by one, please have mercy on my fragile account tonight
Candles ticking day by day, cold sweat dripping drop by drop
Someday when we all grow old, taking our families home... the prodigal trader returns...

[Verse 1: Raspy Blues-Rock Vocal, intimate and weathered confession]
My dear, my reckless, my handsome young bull-market friend
And the foolish, greedy, broken gambler I became in the end
Under the merciless neon glow of the nine-AM opening bell
Watching ${stockListEn} gap up and fade into a red candle hell
Used to think full-margin scalping would buy me a mansion on the hill
Until one wicked stop-hunt lower wick drained the last dollar in my till
Hiding in the diner bathroom while the broker's margin-call phone rings loud
Staring at my bloodshot eyes in the mirror, far away from the cheering crowd

[Verse 2: Gritty Street-Poet Male Rapper, raw emotional blues-rock boom-bap flow]
(Heartland Blues-Rock Storytelling Rap — Raw Remorse & Redemption)
I used to talk big on the forums like I owned the Nasdaq night session floor
Chasing overnight whales at nine-thirty, begging the leverage gods for more
Three thousand points up yesterday popping champagne, two thousand down today in the pouring rain
130 percent maintenance liquidation text cutting deeper than a rusty chain
Looking at my family sleeping in the next room, I finally closed the reckless leverage tab
Being a prodigal trader returning doesn't mean quitting—it means burying the gambler's habit I had
Locking onto the real silicon moat of ${stockListEn}, respecting the moving averages and the trend
No longer a zero-day lotto addict—I'm building compounding wealth that lasts till the end!

[Chorus: Maximum Raspy Rock Vocal & Tavern Gang-Vocal Sing-Along, Heavy Live Drums & Crying Guitar]
${hookLineEn}
Market makers hear my plea, don't shake out the last conviction in me
Candles ticking day by day, tears falling drop by drop along the way
Someday when we all grow old, holding our core positions... back here again!

[Guitar Solo: Epic Weeping Twin-Electric-Guitar Blues Rock Solo with Screaming Bends & Hammond Organ Swell]

[Bridge: Raspy Vocal Screaming Belt & Rapper Overlapping Oath, Raw Live Stadium Emotion]
[Raspy Rock Vocal] Time keeps rolling day by day—sweat keeps falling drop by drop—!
[Rapper] (Burn the FOMO addiction, bury the reckless leverage! MACD divergence flashing green from the valley floor!)
[Raspy Rock Vocal] Someday—when we all grow old—!
[Rapper] (From the ashes of the margin call, holding ${stockListEn} to the all-time high, the prodigal trader returns!)

[Outro: Slow Guitar Strums & Weeping Blues Lead Fade Out]
[Raspy Rock Vocal]
Cigarettes lit one by one... whiskey shots downed one by one...
Someday when we all grow old... back here again...
[Rapper]
The gambler steps down, the disciplined trader returns. Market closed.
[End]`;

  return {
    zh: {
      title: "散戶回頭 (Back to the Charts Again)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI台式搖滾饒舌】《散戶回頭》｜致敬茄子蛋〈浪子回頭〉！「菸一支一支地點，單一張一張地敲…」唱哭全網當沖客 (Official Audio)`,
        `《散戶回頭（浪子回頭股市版）》｜「請主力體諒我，我本金不多賣給我洗盤！」沙啞菸酒嗓 × 台語走心說唱 (${bpm} BPM)`,
        `當沖輸到躲廁所不敢接營業員電話？聽完這首《散戶回頭》戒掉賭徒心態，抱緊台積電浪子回頭 🚬🍺`
      ],
      ytDesc: `🚬「菸一支一支一支地點，酒一杯一杯一杯地乾，單一張一張一張地敲，停損一筆一筆一筆地砍！請主力體諒我，我本金不多賣給我洗盤……」
致敬華語破億神曲、茄子蛋 EggPlantEgg 經典代表作《浪子回頭 (Back Here Again)》，這首《散戶回頭》以 ${bpm} BPM 催淚至極的藍調雙電吉他 Solo 與復古 Hammond 風琴揭開序幕！
結合阿斌式極致沙啞滄桑的菸酒嗓大合唱，與國台語交錯的台式江湖浪子走心 Rap，把一個曾經沉迷無本當沖、追高殺低、在暴漲暴跌與融資維持率 130% 追繳中遍體鱗傷的少年賭徒，最終為了家人（「帶某子一起，浪子回頭」）戒掉浮躁槓桿、回歸 ${stockList} 基本面與交易紀律的救贖故事唱得淋漓盡致！

🎧 曲風與編曲亮點：
• ${bpm} BPM 台式滄桑藍調搖滾 (Taiwanese Indie Blues Rock) × 走心敘事說唱
• 復古 Hammond B3 風琴 + 結尾靈魂雙電吉他哭腔 Solo
• 國台語氣口交錯：「親愛的、可愛的、英俊的少年股神朋友，垃圾的、沒品的、追高殺低那個我……」

💬 你也曾在股海裡衝動當沖、如今學會「浪子回頭」守住紀律了嗎？在留言區敬自己一杯：「有一天，咱都老，浪子回頭 🍺」！

#台股 #美股 #浪子回頭 #茄子蛋 #台語搖滾 #台式饒舌 #當沖 #散戶心聲 #台積電 #輝達 #鴻海 #SunoAI #AI音樂 #股票饒舌`
    },
    en: {
      title: "散戶回頭 (Back to the Charts Again)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Back to the Charts Again (Prodigal Trader) | Raspy Blues-Rock × Heartfelt Trader Redemption Rap (${bpm} BPM)`,
        `"Cigarettes Lit One by One, Margin Orders Clicked One by One..." 🚬🍺 Prodigal Trader Anthem (Official AI Audio)`,
        `When Weeping Blues Guitar Meets Wall Street Confession 🔥 "Back to the Charts Again" (TSMC, NVDA)`
      ],
      ytDesc: `🚬 "${hookLineEn}..."
Inspired by EggPlantEgg's iconic blues-rock anthem "Back Here Again (浪子回頭)", this ${bpm} BPM heartland blues-rock and storytelling rap crossover pairs weeping vintage Stratocaster guitar solos and warm Hammond organ chords with a whisky-soaked raspy chorus and a raw, redemptive rap verse about leaving reckless day-trading behind for disciplined conviction on ${stockListEn}.

#StockMarketRap #EggPlantEgg #BackHereAgain #BluesRockRap #TraderRedemption #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildYouTooRapperPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "他也少年股神，你也少年股神，怎麼打開股版全都是少年股神";
  const hookLineEn = currentState.customHook || "He's a trading guru, you're a trading guru, everybody online is a trading guru";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達、鴻海";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC, Nvidia, Foxconn";

  const lyricsZh = `[Intro: Quirky Bouncy Brass Horn Loop, Classic Boom-Bap Drums, Turntable DJ Scratches]
[Rapper A (Gem style), sarcastic theatrical conversational tone with comedic timing]
哎呀，現在這年頭啊，只要大盤漲個兩天
我身邊做美髮的、開計程車的、連樓下賣早餐的阿姨
拿著手機畫兩條斜線，都跟我說他是「全職操盤手」了！
來，音響師傅給點動靜，咱們好好聊一聊——Let's go!

[Verse 1: Rapper A (Gem style), witty humorous northern roast flow, bouncy brass boom-bap]
自從看了兩集財經網紅的短影音
你把K線圖當成了算命的紫微斗數經
學會了「黃金交叉」「費波南希」幾個專有名詞
就在同學會群組裡指點江山裝得像個大師
漲停板的時候你說「早跟你們講過我有內線」
跌停板的時候你說「這叫主力洗盤價值浮現」
曬出來的對帳單永遠只截圖賺錢的那一筆
被套在山頂的 ${stockList} 怎麼從來不見你提起？
開個付費訂閱群、取個英文名叫什麼 Alpha Trader
結果無本當沖虧掉三個月房租還在那裡裝 Winner
一聊就是巴菲特、索羅斯跟華爾街的宏觀大局
一看交割戶頭餘額，連T加2的零頭都湊不齊！

[Chorus: Catchy Sarcastic Sing-Along Gang Vocal Hook, Bouncy Horns & Crowd Laughter]
${hookLineZh}
只買了一百股零股，講話像控股幾百億的財閥大神
他也少年股神，你也少年股神
牛市裡人人都是巴菲特，退潮了才知誰在公園裸泳過冬！

[Beat Switch! Turntable Scratch Stop — Sudden Drop into Dark Heavy Hardcore 808 Boom-Bap!]
[Rapper B (PACT style), deep aggressive authoritative voice]
Hold up! 把那嬉皮笑臉的伴奏給我關了！
前面老舅給你們留點面子，現在換我派克特來講點真話（Real Talk）！Listen!

[Verse 2: Rapper B (PACT style), explosive double-time hardcore technical fast-flow, multi-syllable rhyme barrage]
（派克特式硬核重拍技術流快嘴 — 火力全開 Real Talk）
別再拿模擬倉的截圖出來騙那些剛入市的菜鳥散戶
真正的交易室裡沒有神話，只有白紙黑字的風險控管與殘酷
你們只看到別人滿倉翻倍的慶功酒，卻沒看過凌晨三點回測十年數據的孤獨
當高頻演算法在毫秒之間抽走五檔委買，你那套看圖說故事的指標拿什麼去堵？
我敬重每一個用真金白銀在盤面裡跌倒、自己爬起來寫交易日誌的戰士
而不是那些靠賣課割韭菜、在漲停板後面馬後炮的騙子
看看 ${stockList} 的基本面與供應鏈護城河，哪一個不是千錘百鍊的產業周期
真正的操盤手在暴跌兩千點時守住維持率底線，在萬眾恐慌時安靜扣下扳機
尊重市場、敬畏槓桿，把那些浮誇的頭銜全部給我摘掉
能在空頭與多頭的絞肉機裡活過十個年頭，那才叫真正的驕傲！

[Bridge: Rapper A & Rapper B Trading Rapid-Fire Bars Back-and-Forth]
[Rapper A] 老師老師，明天哪支會漲停？（[Rapper B] 先看懂你的停損點設在哪裡！）
[Rapper A] 大神大神，這根下影線是不是見底？（[Rapper B] 沒量沒籌碼的幻想只會害死你自己！）
[Rapper A] 哎呀，原來不是買了麥克風就叫 Rapper——
[Rapper B] 更不是開了證券戶，就叫少年股神！

[Chorus: Full Riot Live Crowd Chant, Brass Horns + Heavy 808 Sub-Bass Combined]
${hookLineZh}
收起你的馬後炮，市場只認實力不認人
他也少年股神，你也少年股神
真金白銀見真章，看誰能站到最後收盤時分！

[Outro: DJ Scratch Solo & Crowd Cheering]
[Rapper A]
哈哈，不好意思啊各位股神，今天沒傷著你們的維持率吧？
[Rapper B]
Respect the market. Keep it real. 收盤！
[End]`;

  const lyricsEn = `[Intro: Quirky Bouncy Brass Horn Loop, Classic Boom-Bap Drums, Turntable DJ Scratches]
[Rapper A, sarcastic theatrical conversational tone with comedic timing]
Man, these days the market goes up for two days straight
And suddenly my barber, my Uber driver, and my cousin who just downloaded a trading app yesterday
Are all putting "Full-Time Hedge Fund Genius" in their bio!
DJ, drop that beat—let's talk about it!

[Verse 1: Rapper A, witty humorous roast flow, bouncy brass boom-bap]
Watched two TikTok videos on candlestick charts last night
Now you're drawing random triangles like a Wall Street fortune-teller site
Learned the words "Fibonacci" and "Golden Cross" at noon
By 2 PM you're charging fifty bucks a month for a Discord room
When it pumps you say "I called the bottom, told y'all I had the play"
When it dumps you say "Just a healthy shakeout, institutional accumulation day"
Cropping your screenshot so we only see the one green trade you made
While your bagholding shares of ${stockListEn} slowly fade
Calling yourself an Alpha Whale with a rented Lamborghini pic
While a single tick of day-trade slippage makes your stomach sick
Talking macro-economics like you're dining with Jerome Powell tonight
While your T-plus-two settlement account doesn't have a dollar in sight!

[Chorus: Catchy Sarcastic Sing-Along Gang Vocal Hook, Bouncy Horns & Crowd Energy]
${hookLineEn}
Holding zero-point-one fractional shares, talking like a billionaire mogul crew
He's a trading guru, you're a trading guru
Everybody's Warren Buffett in a bull run till the tide goes out on you!

[Beat Switch! Turntable Scratch Stop — Sudden Drop into Dark Heavy Hardcore 808 Boom-Bap!]
[Rapper B, deep aggressive authoritative voice]
Hold up! Cut that circus horn loop right now!
We had our laughs in the first half, now let me spit some real trading truth! Listen!

[Verse 2: Rapper B, explosive double-time hardcore technical fast-flow, multi-syllable rhyme barrage]
(Hardcore Beat Switch — Breathless Technical Real Talk Flow)
Stop flexing paper-trading screenshots to bait the rookies in the game
On the real trading floor there are no miracles, only risk management and pain
You envy the ten-bagger victory wine, never saw the ten thousand hours studying the tape
When HFT algorithms pull the Level-two bids in a millisecond, there is no escape
I salute every real trader who took a loss, wrote the journal, and rebuilt from the floor
Not these hindsight clowns selling courses who never survived a bear-market war
Study the silicon moat of ${stockListEn}, respect the cycle and the cash-flow sheet
Real operators protect their margin through a two-thousand-point crash on the street
Strip away the fake titles, humble your ego before the opening bell
Surviving ten years in this volatility meat-grinder is the only story worth to tell!

[Bridge: Rapper A & Rapper B Trading Rapid-Fire Bars Back-and-Forth]
[Rapper A] Guru, guru, what's the ten-bagger tomorrow? ([Rapper B] Learn where to set your stop-loss before you borrow!)
[Rapper A] Master, master, is that lower wick the bottom sign? ([Rapper B] Trading on hopium puts your whole life on the line!)
[Rapper A] Buying a microphone doesn't make you an MC—
[Rapper B] And opening a brokerage app doesn't make you a Wall Street OG!

[Chorus: Full Riot Live Crowd Chant, Brass Horns + Heavy 808 Sub-Bass Combined]
${hookLineEn}
Put away the hindsight talk, the market tests everything you do
He's a trading guru, you're a trading guru
Only real discipline survives when the closing bell rings through!

[Outro: DJ Scratch Solo & Crowd Cheering]
[Rapper A]
Haha, hope we didn't hurt nobody's feelings in the Discord chat tonight!
[Rapper B]
Respect the market. Keep it real. Market closed!
[End]`;

  return {
    zh: {
      title: "你也是個少年股神 (You're a Trading Guru Too)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI辛辣饒舌】《你也是個少年股神》｜致敬派克特×寶石Gem〈你也是個Rapper〉！前半段群嘲假老師、後半段硬核變奏炸全場 (Official Audio)`,
        `《你也是個少年股神》｜「他也少年股神、你也少年股神！」全網最敢講的台美股嘴替神曲｜幽默群嘲 × Beat Switch 快嘴 (${bpm} BPM)`,
        `當股市上漲兩天，身邊突然全是巴菲特？這首《你也是個少年股神》把股版跟投顧網紅嘴到體無完膚 🤡🔥`
      ],
      ytDesc: `🤡「他也少年股神，你也少年股神，怎麼打開股版全都是少年股神？只買了一百股零股，講話像控股幾百億的財閥大神！」
致敬《中國說唱巔峰對決》PACT 派克特 & 寶石Gem 席捲後台的炸場神曲《你也是個Rapper》，這首《你也是個少年股神》完美復刻原曲最經典的「雙段式變奏（Beat Switch）」架構！
前半段由寶石老舅式幽默戲謔的銅管 Boom-Bap 領軍，化身全網股民嘴替，辛辣群嘲那些看兩部短影音就開群帶單、只截圖賺錢單、馬後炮畫線的「假少年股神」；中段刷碟急停後瞬間 Beat Switch 切換暗黑硬核 808 重拍，由派克特式窒息技術流快嘴火力全開（Real Talk），致敬真正守住紀律、鑽研 ${stockList} 護城河與風險控管的實戰交易者！

🎧 曲風與編曲亮點：
• ${bpm} BPM 雙段變奏設計：前半段戲謔銅管馬戲團感 Boom-Bap ➔ 後半段暗黑硬核 808 炸裂快嘴
• 超洗腦群嘲大合唱 Hook：「${hookLineZh}」
• 雙人一搭一唱相聲式嗆聲 + 派克特式硬核 Real Talk 技術流轟炸

💬 你身邊也有那種「漲停早知道、跌停洗盤中」的少年股神嗎？趕快把這首歌分享給他！

#台股 #美股 #你也是個Rapper #派克特 #寶石Gem #中國說唱巔峰對決 #少年股神 #中文饒舌 #BeatSwitch #台積電 #輝達 #SunoAI #AI音樂 #股票饒舌`
    },
    en: {
      title: "你也是個少年股神 (You're a Trading Guru Too)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `You're a Trading Guru Too | Satirical Stock Market Roast × Hardcore Beat-Switch Fast Rap (${bpm} BPM)`,
        `"He's a Trading Guru, You're a Trading Guru!" 🤡 Roasting Fake Discord FinTwit Gurus (Official AI Audio)`,
        `From Comedy Boom-Bap Roast to Hardcore Real Talk 🔥 "You're a Trading Guru Too" (NVDA, TSMC, Wall Street)`
      ],
      ytDesc: `🤡 "${hookLineEn}!"
Inspired by PACT & Gem's viral cypher hit "You're a Rapper Too (你也是個Rapper)", this ${bpm} BPM two-part hip-hop banger starts as a hilarious brass-driven boom-bap roast of fake screenshot gurus and hindsight Discord traders—before executing a sudden mid-song Beat Switch into a dark, hard-hitting 808 technical fast-rap verse about real risk management and discipline on ${stockListEn}.

#StockMarketRap #TradingGuru #BeatSwitch #BoomBap #FastRap #FinTwit #WallStreet #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildMoonNotComePackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "若是牛市還沒來，路燈也可照看盤的窗台";
  const hookLineEn = currentState.customHook || "If the bull market hasn't come tonight, the streetlight still shines upon my trading desk";

  const stockList =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.zh.split(" ")[0]).join("、")
      : "台積電、輝達";
  const stockListEn =
    currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0
      ? currentState.autoRandomStocks.map((s) => s.en.split(" ")[0]).join(", ")
      : "TSMC and Nvidia";

  const lyricsZh = `[Intro: Gentle Grand Piano & Warm Acoustic Guitar Arpeggios, Late-Night City Breeze Ambience]
[Soulful Tearful Male Vocalist (Yang Zongwei style), breathy emotional sobbing vibrato]
抬頭看，那斯達克夜盤閃爍的微光
在凌晨兩點半的書房，把影子拉得好長
我們都只是在紅綠Ｋ線裡，尋找一點點希望……

[Verse 1: Gentle Narrative Vocal, intimate and weary late-night confession]
下班的捷運穿過信義區的霓虹燈海
手機螢幕裡的自選股，還停在綠色的無奈
${flags.hasWhipsaw ? "昨天才暴漲三千點以為終於能夠苦盡甘來\n今天卻又重挫洗盤，把剛燃起的期待摔進塵埃" : "看著別人貼出翻倍的對帳單在股版喝采\n自己卻在追高與停損之間，一次次被震盪淘汰"}
買了一碗超商打折的便當，配著還沒冷掉的看盤軟體
其實我想要的並不多，只是想給家人好一點的風景

[Chorus: Warm Clear Healing Male Vocal & Tearful Balladeer Harmony, sweeping strings enter]
${hookLineZh}
照著六點半剛收盤的發呆，照著還沒解套的無奈
若是漲停還沒來，晨風也可吹散交割的陰霾
吹乾眼角那滴不甘心的淚，溫暖你獨自盯盤的現在

[Verse 2: Deep Resonant Storytelling Male Rapper (Gem style), warm empathetic northern conversational flow]
（寶石老舅式深夜走心敘事說唱，充滿煙火氣與共情力）
嘿，兄弟，我看見你在凌晨三點還亮著的那盞檯燈
螢幕上跳動著 ${stockList} 的分時走勢，你揉著通紅的眼睛不敢出聲
你說你不是貪心想當什麼華爾街之狼，你只是想讓父母看病時不用再看標價
你只是想在房貸扣款的隔天，能微笑著給孩子買她最愛的那盒積木玩具啊
可是這盤面太冷酷，${flags.hasTariff ? "一則半夜的關稅推文、一句聯準會的鷹派發言" : "一趟主力假跌破的洗盤、一根刺穿底部的天地針"}
就能讓你在辦公室廁所裡，看著融資維持率的簡訊偷偷紅了眼眶
我們都在Ｋ線的迷宮裡受過傷，都曾在砍在阿呆谷的午後懷疑過自己的信仰
但你看窗外那盞昏黃的路燈，就算烏雲遮住了滿天星斗與月亮
只要手裡的本金還在、心中的紀律不慌，這點微光也能陪你熬過最冷的寒霜！

[Chorus: Trio Harmony — Clear Healing Vocal + Tearful High Tenor + Resonant Rapper Backing]
${hookLineZh}
照著被洗盤後的空白，照著不肯認輸的胸懷
若是主升段還沒來，時間的複利會替你把花開
撫平每一道追高砍低的傷痕，陪你走過最漫長的等待

[Bridge: Overlapping Emotional Climax — Tearful High-Note Belt & Heartfelt Rap Monologue]
[Tearful Balladeer] 就算這世界偶爾對散戶太殘忍——
[Rapper] （別怕，擦乾眼淚！看五日線已經慢慢走平，MACD 在谷底亮起了第一根紅柱！）
[Tearful Balladeer] 就算風暴吹落了滿身的傷痕——
[Rapper] （我們不是天生被收割的韭菜，守住 ${stockList} 的護城河，黎明前的夜盤總是最黑！）
[Tearful Balladeer] 若是月亮還沒來——路燈也會為你而亮——！

[Outro: Lone Acoustic Guitar and Soft Piano Chords, gentle comforting hum]
[Rapper]
關上電腦吧，今晚好好睡一覺。
就算月亮還沒來，明天九點，太陽依然會升起。
[Tearful Balladeer]
路燈也可照窗台…… 照亮你破頂的未來……
[End]`;

  const lyricsEn = `[Intro: Gentle Grand Piano & Warm Acoustic Guitar Arpeggios, Late-Night City Breeze Ambience]
[Soulful Tearful Male Vocalist, breathy emotional vibrato]
Looking up at the glowing Nasdaq futures in the dark
Two-thirty AM in a quiet room, chasing a tiny spark
We're all just searching for a little peace inside the red and green...

[Verse 1: Gentle Narrative Vocal, intimate and weary late-night confession]
Evening subway rolling past the downtown neon lights
Staring at a portfolio bleeding through another sleepless night
Three thousand points up yesterday made us believe the storm had passed
Two thousand down today shattered the fragile dream so fast
Heating up a late-night dinner by the glowing monitor screen
All I ever wanted was a better life for the ones who count on me

[Chorus: Warm Clear Healing Male Vocal & Soulful Harmony, sweeping strings enter]
${hookLineEn}
Shining on the weary eyes at dawn, shining on the drawdowns we hold on
If the limit-up hasn't come today, the morning breeze will blow the margin clouds away
Drying the quiet tears upon your face, keeping you warm inside this lonely race

[Verse 2: Deep Resonant Storytelling Male Rapper, warm empathetic conversational flow]
(Heartfelt Late-Night Storytelling Rap — Raw Empathy & Warmth)
Hey brother, I see your desk lamp burning at three in the morning
Tickers of ${stockListEn} flashing while the quiet city's yawning
You never wanted to be a greedy Wall Street wolf in a tailored suit
You just wanted to pay the mortgage down and give your family a softer route
To buy your kid that birthday gift without checking the account balance twice
To let your parents rest without worrying about the hospital price
But this market can be merciless—one midnight tariff tweet or stop-hunt wick
Can leave you staring at a margin-call text feeling broken and sick
We've all been bruised inside this candlestick maze, sold the bottom in the rain
Questioned every ounce of our conviction while carrying the quiet pain
But look outside your window at that humble amber streetlight standing tall
Even when the clouds hide the moon and the index takes a fall
As long as your discipline is breathing, that little light will guide you through it all!

[Chorus: Full Trio Harmony — Clear Vocal + Soulful High Tenor + Resonant Rapper Backing]
${hookLineEn}
Shining on the scars of the shakeout, shining on the faith we never sold out
If the breakout wave hasn't arrived, compounding patience keeps the dream alive
Healing every wound from the volatility, walking with you till the morning sky

[Bridge: Overlapping Emotional Climax — Soaring Tearful High Note & Heartfelt Rap Monologue]
[Soulful Vocal] Even when the market feels too cold to bear—
[Rapper] (Hold on, wipe your eyes! The moving averages are curling up, MACD divergence flashing at the bottom!)
[Soulful Vocal] Even when the drawdown leaves you standing there—
[Rapper] (We're not born to be harvested! Holding ${stockListEn} through the darkest hour before the dawn!)
[Soulful Vocal] If the moon hasn't come tonight—the streetlight still shines for you—!

[Outro: Lone Acoustic Guitar and Soft Piano Chords, gentle comforting hum]
[Rapper]
Close the laptop now, get some rest tonight.
Even if the moon hasn't come yet, the opening bell will bring the morning sun.
[Soulful Vocal]
The streetlight still shines upon your desk... lighting up the dawn...
[End]`;

  return {
    zh: {
      title: "若牛市沒來 (If the Bull Market Hasn't Come)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI催淚饒舌】《若牛市沒來》｜致敬楊宗緯×寶石Gem×王宇宙〈若月亮沒來〉！獨特哭腔搭配走心說唱，聽哭百萬股民 (Official Audio)`,
        `《若牛市沒來（若是牛市還沒來，路燈也可照窗台）》｜獻給深夜還在盯美股夜盤的你｜治癒抒情 × 走心敘事 Rap (${bpm} BPM)`,
        `被洗盤、套牢、砍在阿呆谷的夜晚必聽…這首《若牛市沒來》把散戶的心酸與溫柔唱進骨子裡 🌙😭`
      ],
      ytDesc: `🌙「若是牛市還沒來，路燈也可照看盤的窗台；照著六點半剛收盤的發呆，照著還沒解套的無奈……」
致敬《天賜的聲音5》楊宗緯、寶石Gem（董寶石）與王宇宙神級催淚舞台《若月亮沒來》，這首《若牛市沒來 (路燈下的看盤人)》以 ${bpm} BPM 溫暖的鋼琴與木吉他 R&B 律動，結合楊宗緯式深情細膩的催淚哭腔、王宇宙式清澈治癒的副歌旋律，以及寶石老舅式充滿人間煙火氣的深夜走心 Rap！
沒有浮誇的炫富，只有每個普通散戶為了家人、為了房貸、為了生活，在台股早盤與美股夜盤（${stockList}）的震盪洗盤中默默咬牙堅持的真實縮影。

🎧 曲風與編曲亮點：
• ${bpm} BPM 溫暖木吉他 & 古典鋼琴 R&B 抒情 Hip-Hop 編曲
• 楊宗緯式細膩哭腔主歌 × 清亮治癒大合唱副歌：「${hookLineZh}」
• 寶石Gem式深夜走心敘事說唱：句句共情，獻給凌晨三點還亮著檯燈的看盤人

💬 今晚如果帳面還沒有月亮，願這首歌像窗外的路燈一樣陪你度過震盪。在留言區給自己和戰友留一句「明天太陽依然會升起 🌙」！

#台股 #美股 #若月亮沒來 #楊宗緯 #寶石Gem #王宇宙 #天賜的聲音 #催淚說唱 #治癒音樂 #台積電 #輝達 #SunoAI #AI音樂 #散戶心聲 #股票饒舌`
    },
    en: {
      title: "若牛市沒來 (If the Bull Market Hasn't Come)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `If the Bull Market Hasn't Come | Healing R&B Vocal × Heartfelt Late-Night Trader Storytelling Rap`,
        `"If the Bull Market Hasn't Come Tonight, the Streetlight Still Shines..." 🌙 Emotional Stock Trader Ballad (${bpm} BPM)`,
        `For Every Trader Holding Through a Sleepless Drawdown 😭 "If the Bull Market Hasn't Come" (Official AI Audio)`
      ],
      ytDesc: `🌙 "${hookLineEn}..."
Inspired by the viral live performance of "If the Moon Hasn't Come (若月亮沒來)" by Aska Yang (楊宗緯), Gem (寶石老舅), and Wang Yuzhou, this ${bpm} BPM healing R&B hip-hop ballad blends a tearful, soulful chorus with an empathetic late-night storytelling rap verse dedicated to everyday retail traders holding ${stockListEn} through market volatility.

#StockMarketRap #IfTheMoonHasntCome #HealingMusic #EmotionalRap #TraderLife #TSMC #NVDA #SunoAI #AIMusic`
    }
  };
}

function buildMissSimilarPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "差不多的韭菜，追著差不多的浪";
  const hookLineEn = currentState.customHook || "Almost the same retail traders, chasing almost the same wave";

  const lyricsZh = `[Intro: Melancholic Classical Piano Loop, Vinyl Crackle, Punchy Trap Boom-Bap Drums Fade In]
[Powerhouse Female Rapper & Vocalist, calm ironic spoken-word building into melodic rap]
我抽著差不多的孤單，盯著差不多的盤
喝著差不多的冰美式，熬著差不多的夜盤
他們說差不多的散戶，就該認命當差不多的韭菜
Wait... 誰跟你差不多？Let's go!

[Verse 1: Charismatic Female Rapper, sharp rhythmic satirical "Chabuduo" anaphora flow]
差不多的早上九點，打開差不多的軟體
聽著差不多的投顧老師，畫著差不多的大餅
買在差不多的山頂，吹著差不多的風
看著差不多的隔日沖分點，在九點半差不多的倒貨一空
差不多的無本當沖，搶著差不多的 tick 價差
差不多的撮合排隊，在差不多的滑價裡蒸發
差不多的五檔委買，掛著差不多的假單護盤
一根差不多的天地針長下影線，把差不多的停損全部掃完
${flags.hasWhipsaw ? "差不多的昨天暴漲三千點，全網都在差不多的狂歡\n差不多的今天重挫兩千點，股版又是差不多的哀嘆" : "差不多的昨天跳空創高，全網都在差不多的狂歡\n差不多的今天殺破月線，股版又是差不多的哀嘆"}
差不多的融資維持率，跌到差不多的一百三
差不多的清晨追繳簡訊，催著差不多的 T加2 交割款！

[Chorus: Powerhouse Female Diva Vocal, soaring emotional belt & lush harmonies]
${hookLineZh}
差不多的散戶，受著差不多的傷
都想在差不多的Ｋ線裡，抓到差不多的光
卻在差不多的阿呆谷底，繳出差不多的投降
差不多姑娘，不想再當差不多的羔羊！

[Verse 2: Fierce Female Rapper, shifting into breathless Double-Time Fast Flow awakening]
（節奏驟變！鄧紫棋式爆發力雙倍速女聲快嘴 Double-Time Awakening Flow）
夠了！把那些差不多的跟風明牌全部丟進垃圾桶裡燒掉
別再用差不多的藉口安慰自己只是運氣差了一點才被套牢
你看那外資借券賣出幾萬張、演算法在內外盤搓合裡設下圈套
如果還用差不多的心態隨波逐流，怎麼在華爾街的狼群裡站穩腳步微笑
我開始看懂每一根長下影線背後主力吸籌的訊號
我開始算準費波南希零點六一八回撤位與 MACD 底背離的轉折力道
${flags.hasTsmc ? "當別人恐慌拋售，我鎖定台積電 CoWoS 獨一無二的晶圓護城河道" : "當別人恐慌拋售，我鎖定核心龍頭獨一無二的護城河道"}
${flags.hasNvda ? "看皮衣男黃仁勳帶著輝達算力引爆下一個世代的風暴" : "看科技巨頭帶著 AI 算力引爆下一個世代的風暴"}
${flags.hasTariff ? "不管關稅消息怎麼干擾、聯準會嘴砲怎麼咆哮" : "不管黑天鵝消息怎麼干擾、聯準會嘴砲怎麼咆哮"}
我的交易紀律從此不再差不多，一分一毫我都要精準抓牢！

[Bridge: Stripped-back Piano & Sub-Bass, Soulful Female Vocal building to an Ultra-High G5 Belt]
曾經我也差一點就被洗出場
差一點就相信散戶注定只能陪葬
但從今天起，我撕掉「差不多」的標籤
看五線合一黃金交叉，限空令下把空頭全部軋上青天——！
（Woah-oh-oh-oh——！High Note Belt!）

[Chorus: Maximum Diva Climax, Powerhouse Female Vocal + Gospel Choir + Heavy 808 Drop]
不再做差不多的韭菜，我踏上破頂的浪！
每一筆買單都帶著信仰，不再迷失方向
從台北早盤到華爾街夜盤，綻放我獨一無二的光
這不是差不多姑娘，這是破頂的女王！

[Outro: Classical Piano Loop returns with confident Female Rapper ad-libs]
[Female Rapper]
差一點就砍在谷底，好險我沒差不多。
台積、輝達，破頂新高。
這一次，絕不差不多。
[End]`;

  const lyricsEn = `[Intro: Melancholic Classical Piano Loop, Vinyl Crackle, Punchy Trap Boom-Bap Drums Fade In]
[Powerhouse Female Rapper & Vocalist, calm ironic spoken-word building into melodic rap]
Staring at almost the same screen, nursing almost the same cold brew
Scrolling through almost the same panic, waiting for almost the same clue
They say retail traders are all the same, born to take almost the same loss
Wait... who said we're the same? Let's go!

[Verse 1: Charismatic Female Rapper, sharp rhythmic satirical anaphora flow]
Almost the same nine AM bell, opening almost the same app
Listening to almost the same gurus setting almost the same trap
Buying at almost the same peak, feeling almost the same breeze
Watching overnight whales dump at nine-thirty, bringing bagholders to their knees
Almost the same zero-capital scalpers fighting for almost the same tick
Almost the same slippage wiping out paychecks before the orders even click
Almost the same Level-two spoofed bids flashing on the screen
One nasty stop-hunt lower wick sweeps almost every stop-loss clean
Almost the same three-thousand-point rally had everyone cheering loud
Almost the same two-thousand-point tariff crash broke the whole crowd
Almost the same margin maintenance crashing under one-thirty again
Almost the same liquidation text message asking where the money went!

[Chorus: Powerhouse Female Diva Vocal, soaring emotional belt & lush harmonies]
${hookLineEn}
Almost the same dreamers, bleeding in almost the same cave
Looking for a little bit of light inside the candlestick storm
Capitulating at the exact bottom like it's the only norm
Miss Similar no more—I refuse to be a lamb on the trading floor!

[Verse 2: Fierce Female Rapper, shifting into breathless Double-Time Fast Flow awakening]
(Beat Switch! Explosive Double-Time Female Fast Flow Awakening)
Enough! Throw all those copycat stock tips straight into the fire
Stop making "almost" excuses while your drawdown climbs higher
Foreign funds short-lending millions while HFT algos rig the game
If you trade with an average mindset, you'll end up with the same shame
Now I read the institutional accumulation behind every lower wick
Fibonacci zero-six-one-eight and MACD divergence clicking quick
While the herd panic-sells, I lock onto TSMC's CoWoS silicon moat
Leather-jacket Jensen and Nvidia compute keeping the whole era afloat
No matter how loud the tariff rumors or hawkish Fed speakers roar
My trading discipline is razor-sharp—I don't do "almost" anymore!

[Bridge: Stripped-back Piano & Sub-Bass, Soulful Female Vocal building to an Ultra-High Belt]
I almost got shaken out before the dawn
Almost believed the lie that retail is just a pawn
But today I tear the "Miss Similar" label off my chest
Five moving averages golden-crossed, short-squeeze putting bears to rest—!
(Woah-oh-oh-oh—! Soaring High Note!)

[Chorus: Maximum Diva Climax, Powerhouse Female Vocal + Choir + Heavy 808 Drop]
No longer almost the same trader, I'm riding the breakout wave!
Every order backed by discipline, fearless and brave
From Taipei morning bell to Wall Street night, shining one of a kind
Queen of the all-time high, leaving "almost" far behind!

[Outro: Classical Piano Loop returns with confident Female Rapper ad-libs]
[Female Rapper]
Almost sold the bottom... glad I didn't settle for almost.
TSMC, NVDA, all-time high.
Never "almost" again.
[End]`;

  return {
    zh: {
      title: "差不多韭菜 (Miss Almost Bagholder)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI女聲饒舌】《差不多韭菜》｜致敬鄧紫棋〈差不多姑娘〉Real Talk版！犀利排比×炸裂女聲快嘴×鐵肺高音覺醒 (Official Audio)`,
        `《差不多韭菜（破頂女王覺醒版）》｜「差不多的散戶，追著差不多的浪…」聽完戒掉追高殺低！台積電×輝達逆襲神曲 (${bpm} BPM)`,
        `當鄧紫棋《差不多姑娘》遇上台股美股大洗盤！從「差不多的追繳斷頭」唱到「破頂女王」太燃了 👑🔥`
      ],
      ytDesc: `👑「差不多的韭菜，追著差不多的浪；差不多的散戶，在差不多的阿呆谷底繳出差不多的投降……」
致敬 G.E.M. 鄧紫棋經典 Real Talk 說唱代表作《差不多姑娘 (Miss Similar)》（取樣自 MC HotDog 熱狗〈差不多先生〉），這首《差不多韭菜 (破頂女王覺醒版)》以 ${bpm} BPM 經典憂鬱古典鋼琴迴圈融合現代重擊 Trap Boom-Bap 808 鼓點！
主歌第一段以連珠炮般的「差不多的…」排比句型，犀利嘲諷散戶聽明牌、無本當沖搶 tick、被天地針長下影線掃停損、暴漲三千點狂歡又在關稅重挫裡斷頭追繳的日常；主歌第二段與副歌則瞬間切換「鄧紫棋式雙倍速女聲快嘴 + G5 鐵肺高音」，撕掉差不多韭菜標籤，靠著紀律、台積電（2330）CoWoS 與輝達（NVIDIA）算力信仰覺醒為破頂女王！

🎧 曲風與編曲亮點：
• ${bpm} BPM 經典古典鋼琴 Loop × 現代 Trap 808 重低音鼓點
• 第一段高密度「差不多的…」排比反諷 Flow，句句戳中散戶痛點
• 第二段爆發力女聲雙倍速快嘴 + 鄧紫棋式穿透高音副歌覺醒反轉

💬 你決心撕掉「差不多韭菜」的標籤了嗎？在留言區刷一排「這一次，絕不差不多 👑」！

#台股 #美股 #差不多姑娘 #鄧紫棋 #GEM #差不多先生 #女聲饒舌 #台積電 #輝達 #NVIDIA #TSMC #SunoAI #AI音樂 #股票饒舌 #鐵肺高音`
    },
    en: {
      title: "差不多韭菜 (Miss Almost Bagholder)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Miss Almost Bagholder (Queen of the Breakout) | Powerhouse Female Rap × Soaring Diva High-Note Anthem`,
        `"Almost the Same Traders, Chasing Almost the Same Wave..." 👑 Miss Almost Bagholder (${bpm} BPM Stock Rap)`,
        `From Retail Traps to Diamond-Hand Awakening 🔥 "Miss Almost Bagholder" (NVDA, TSMC Official AI Audio)`
      ],
      ytDesc: `👑 "${hookLineEn}, almost the same dreamers bleeding in almost the same cave..."
Inspired by G.E.M.'s hit rap-pop anthem "Miss Similar (差不多姑娘)", "Miss Almost Bagholder (Queen of the Breakout)" pairs a ${bpm} BPM classical piano loop and punchy trap boom-bap 808s with sharp satirical anaphora verses, a breathless double-time female fast-rap awakening, and soaring diva belt vocals.

#StockMarketRap #MissSimilar #GEM #FemaleRap #TSMC #NVDA #WallStreet #SunoAI #AIMusic #TradingDiscipline`
    }
  };
}

function buildAsceticMonkPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "我想要從空軋到多，我還要從底抄到頂";
  const hookLineEn = currentState.customHook || "I wanna walk from Bear to Bull, I'll climb from bottom to the peak";

  const lyricsZh = `[Intro: Gritty Distorted Classic Rock Electric Guitar Riff, Weathered Guqin Plucks & Lonely Bamboo Flute]
[Raspy Soulful Rock Male Vocal, weathered and resonant]
${hookLineZh}
我要這市場都看我，但不知道我是誰
要是你看我就交出籌碼，我給你留條活路走
要是你敢攔我破頂的路，我立刻把你軋上天！

[Heavy Trap 808 Bass & War Drums Drop!]
[Rapper: Raspy Aggressive Jianghu Male Rapper, bold outlaw swagger]
勒是霧都！台北到華爾街！開盤！

[Verse 1: Raspy Aggressive Jianghu Male Rapper, heavy rhythmic bounce and swagger]
腳踏開盤風火輪，老子滿倉就是神
不管外資怎麼洗，生死有命富貴在天門
彎弓射下那黑天鵝，帳戶紅得像火盆
小散戶還在看新聞，老子早鎖定護國神山魂
開路先鋒誰敢擋，五檔委買直接掃光
他們在股版哭爹喊娘，我在夜盤裡大口喝湯
那些沒膽的牆頭草，追高殺低往死裡跑
一根天地針長下影線，就把你嚇得把手裡籌碼倒
${flags.hasTsmc ? "台積電的護城河，CoWoS 晶圓煉真金\n任憑空軍借券幾萬張，也撼動不了老子的定力心" : "龍頭股的護城河，主升段裡煉真金\n任憑空軍借券幾萬張，也撼動不了老子的定力心"}
無本當沖的小嘍囉，為幾個 tick 在泥巴裡摸
老子是股市的苦行僧，抱緊趨勢單從不哆嗦！

[Chorus: Raspy Weathered Rock Male Vocal & Gang Vocals, Heavy Guitar Riff + 808 Sub-Bass]
${hookLineZh}
我要這主力都看我，但不知道我是誰
我只看Ｋ線不看人，我只認籌碼不認神
我也曾砍在阿呆谷，從不稀罕誰來施捨同情！

[Verse 2: Raspy Aggressive Jianghu Male Rapper, fiery explosive delivery]
一雙布鞋踏過股災，兩手抓緊我的底牌
${flags.hasWhipsaw ? "昨天暴漲三千三百點，今天重挫兩千點又怎樣\n大風大浪老子見得多，你這點洗盤算什麼名堂" : "昨天跳空創下新高點，今天回測月線又怎樣\n大風大浪老子見得多，你這點洗盤算什麼名堂"}
${flags.hasNvda ? "看皮衣男黃仁勳揮起大刀，輝達算力把天空燒\n華爾街空頭還在發抖，老子的多單已經在山腰" : "看科技巨頭揮起大刀，AI 算力把天空燒\n華爾街空頭還在發抖，老子的多單已經在山腰"}
${flags.hasTariff ? "關稅大棒隨便你敲，聯準會降息隨便你聊" : "利空消息隨便你敲，聯準會降息隨便你聊"}
融資維持率一百三的追繳，嚇不倒真正走江湖的豪傑英豪
莫問老子從哪裡來，對帳單翻開全是紅牌
限空令下融券強制回補，空頭的棺材板老子親自來抬
五線合一黃金交叉，這波主升段直衝雲霄
一命二運三風水，四積陰德五看盤，誰敢跟老子比高低！

[Bridge: Traditional Chinese Opera Gongs, Bamboo Flute Solo & Stripped-Back War Drums]
[Rapper, deep menacing whisper building to a roar]
世人笑我太瘋癲，我笑他人看不穿
漲停鎖死一字線，跌停關門吃碗麵
你在K線裡找神仙，老子在恐慌裡撿銅錢
天乾物燥，小心軋空！

[Chorus: Maximum Arena Climax, Distorted Rock Guitar + Suona Horn + Full 808 Drop]
${hookLineZh}
我要這華爾街都看我，但不知道我是誰
要是你看我就交出空單，我給你留條活路走
要是你敢擋我破頂的路，老子把你軋到外太空！

[Outro: Vintage Rock Guitar Solo & Guqin fade out]
[Vocal]
我想要從空軋到多…… 我還要從底抄到頂……
[Rapper]
苦行僧修成正果，破頂封王！收盤！
[End]`;

  const lyricsEn = `[Intro: Gritty Distorted Classic Rock Electric Guitar Riff, Weathered Guqin Plucks & Lonely Bamboo Flute]
[Raspy Soulful Rock Male Vocal, weathered and resonant]
${hookLineEn}
I want Wall Street staring at my orders, never knowing who I am
If you cross my path then cover your shorts, I'll leave you a way out alive
If you block my breakout to the top, I'll squeeze your margin to the sky!

[Heavy Trap 808 Bass & War Drums Drop!]
[Rapper: Raspy Aggressive Outlaw Male Rapper, bold street-warrior swagger]
From Taipei to New York! Opening bell! Let's ride!

[Verse 1: Raspy Aggressive Outlaw Male Rapper, heavy rhythmic bounce and swagger]
Stepping on the trading floor with fire beneath my feet
All-in leverage on the table, never tasting defeat
Shoot the black swan out the sky, account burning bright and red
While retail sheep read the headlines, I'm ten steps ahead
Vanguard of the breakout, sweeping Level-two order books clean
Crying bagholders on the forum while I feast upon the green
Paper-handed cowards chasing tops and panic-selling lows
One stop-hunt lower wick and their whole portfolio folds
TSMC silicon fortress, CoWoS wafers forged in gold
Let the hedge funds short a million shares, my conviction never sold
Zero-capital scalpers fighting for pennies in the dirt
I'm the ascetic monk of the market, holding trends until it hurts!

[Chorus: Raspy Weathered Rock Male Vocal & Gang Vocals, Heavy Guitar Riff + 808 Sub-Bass]
${hookLineEn}
I want the market makers watching me, never knowing who I am
I only trust the candlesticks, I bow to no Wall Street king
I survived the darkest margin calls, never begged for anything!

[Verse 2: Raspy Aggressive Outlaw Male Rapper, fiery explosive delivery]
Worn-out boots walking through the crash, two hands gripping my ace
Three thousand points up yesterday, two thousand down in your face
I've seen hurricanes on the chart, your little shakeout is a joke
Leather-jacket Jensen swinging the blade, Nvidia turning shorts to smoke
Tariff hammers slamming down, Fed speakers talking tough
130 percent maintenance warnings ain't nearly scary enough
Don't ask me where I came from, my brokerage statement bleeds green
Forced short-covering sirens ringing, cleanest squeeze you've ever seen
Five moving averages golden-crossed, riding the third wave high
Fortune favors the disciplined warrior under the neon sky!

[Bridge: Traditional Chinese Opera Gongs, Bamboo Flute Solo & Stripped-Back War Drums]
[Rapper, deep menacing whisper building to a roar]
The world laughs and calls me crazy, I laugh 'cause they cannot see
Limit-up locked at the open bell, blood on the street sets me free
Watch your shorts, the squeeze is coming!

[Chorus: Maximum Arena Climax, Distorted Rock Guitar + Suona Horn + Full 808 Drop]
${hookLineEn}
I want all of Wall Street watching me, never knowing who I am
If you see my bid then cover your shorts, I'll leave you a way out alive
If you block my breakout to the top, we squeeze you past the sky!

[Outro: Vintage Rock Guitar Solo & Guqin fade out]
[Vocal]
From Bear to Bull... from bottom to the peak...
[Rapper]
The ascetic monk claims the crown. Market closed!
[End]`;

  return {
    zh: {
      title: "股市苦行僧 (Market Ascetic Monk)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI江湖饒舌】《股市苦行僧》｜致敬 GAI 周延〈苦行僧〉搖滾國風 Trap！「我想要從空軋到多，我還要從底抄到頂！」(Official Audio)`,
        `《股市苦行僧（從空軋到多）》｜台積電、輝達大洗盤下的散戶俠客戰歌｜霸氣江湖說唱 × 滄桑搖滾副歌 (${bpm} BPM)`,
        `「世人笑我太瘋癲，我笑他人看不穿！」這首《股市苦行僧》把台股美股唱出江湖草莽霸氣 🐉🔥`
      ],
      ytDesc: `🐉「我想要從空軋到多，我還要從底抄到頂！我要這主力都看我，但不知道我是誰！」
當崔健搖滾經典與 GAI 周延封神舞台《苦行僧》的江湖草莽國風 Trap，遇上台股與美股的史詩級多空博弈！
這首《股市苦行僧 (從空軋到多)》以 ${bpm} BPM 粗獷失真的搖滾電吉他 Riff 與古琴、竹笛開場，融合炸裂的現代 Trap 808 重低音與戰鼓，用 GAI 式霸氣十足、咬字鏗鏘的江湖唱腔，把台積電（2330）CoWoS 護城河、輝達（NVIDIA）皮衣刀客、單日三千點暴漲暴跌洗盤、天地針長下影線與限空令軋空，唱成一首行走金融江湖的散戶俠客戰歌！

🎧 曲風與編曲亮點：
• ${bpm} BPM 經典搖滾失真電吉他 Riff × 古琴/竹笛/嗩吶 × 沉重 Trap 808 戰鼓
• 蒼涼豪邁搖滾大合唱副歌：「${hookLineZh}，我要這市場都看我，但不知道我是誰！」
• GAI 式江湖草莽霸氣主歌：「一命二運三風水，四積陰德五看盤，天乾物燥，小心軋空！」

💬 你也是在震盪洗盤中堅守紀律的「股市苦行僧」嗎？在留言區刷一排「天乾物燥，小心軋空 🐉」！

#台股 #美股 #苦行僧 #GAI周延 #中國新說唱 #中國說唱巔峰對決 #中國風說唱 #江湖說唱 #台積電 #輝達 #NVIDIA #TSMC #SunoAI #AI音樂 #股票饒舌 #軋空`
    },
    en: {
      title: "股市苦行僧 (Market Ascetic Monk)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Market Ascetic Monk (From Bear to Bull) | Wuxia Outlaw Rock-Trap Stock Market Anthem (NVDA, TSMC)`,
        `"I Wanna Walk From Bear to Bull!" 🐉 Market Ascetic Monk | Gritty Guitar Riff × Heavy 808 Jianghu Rap (${bpm} BPM)`,
        `When Classic Chinese Rock Meets Wall Street Trap 🔥 "Market Ascetic Monk" (Official AI Audio)`
      ],
      ytDesc: `🐉 "${hookLineEn}, I want Wall Street staring at my orders, never knowing who I am!"
Inspired by GAI's legendary wuxia rock-trap anthem "Ascetic Monk (苦行僧)", "Market Ascetic Monk (From Bear to Bull)" fuses a gritty vintage rock electric guitar riff, traditional Chinese guqin and bamboo flute with booming ${bpm} BPM 808 sub-bass and outlaw street-warrior rap delivery.

#StockMarketRap #AsceticMonk #GAI #ChineseTrap #RockRap #TSMC #NVDA #WallStreet #ShortSqueeze #SunoAI #AIMusic`
    }
  };
}

function buildDriftNorthPackage(p, bpm, flags) {
  const hookLineZh = currentState.customHook || "我飄向北方，別問我帳面多淒涼";
  const hookLineEn = currentState.customHook || "Drifting to Wall Street, don't ask me where my margin's gone";

  const lyricsZh = `[Intro: Melancholic Grand Piano Solo and Sweeping Strings, Cold Wind & Stock Ticker Ambience]
[Soaring Crystal-Clear High-Tenor Male Vocal, emotional and piercing]
${hookLineZh}
肩上沉重的槓桿，晃呀晃
回不去的起漲遠方
在夜盤裡遊蕩……

[Verse 1: Explosive Male Rapper, building from gritty narrative into rapid-fire multi-syllable flow]
有人說台北到紐約不過是十二個小時的時差
卻裝不下一個散戶想要財富自由的夢啊
看著螢幕上一排排紅綠閃爍冰冷的報價
五檔委買委賣的跳動像是命運無情的拷打
我懷裡揣著最後一筆東拼西湊來的本金
踏進這座被外資與高頻演算法統治的叢林
${flags.hasTsmc ? "仰望著台積電高聳入雲像不可攀越的城牆\n每一片 CoWoS 晶圓都折射著令人目眩的光芒" : "仰望著權值股高聳入雲像不可攀越的城牆\n每一根跳空的紅Ｋ都折射著令人目眩的光芒"}
他們說這裡遍地黃金只要敢滿倉就能翻身
卻沒人告訴你跌停鎖死時連呼吸都會發冷
無本當沖在九點零一分排隊撮合裡廝殺
一個 tick 的滑價就能讓整個月的薪水蒸發
那根天地針長下影線精準刺穿了我的停損點
剛砍在阿呆谷底它卻又旱地拔蔥拉上天際線
站在信義區的街頭看著一零一大樓的燈火輝煌
怎麼容不下我這一張被追繳斷頭的對帳單！

[Chorus: Soaring High-Tenor Male Vocal, full orchestral strings and heavy live rock drums drop]
${hookLineZh}
肩上沉重的槓桿，晃呀晃
也許這根長紅能撫平我遍體鱗傷
我飄向北方，別問我停損在哪方
抬頭看那Ｋ線的星光
微弱卻依然滾燙，照亮這破頂的戰場

[Verse 2: Explosive Double-Time Machine-Gun Fast-Flow Male Rapper, breathless technical speed]
（雙倍速機關槍快嘴 Double-Time Chop Flow）
凌晨兩點半的房間只剩下主機風扇在轟鳴
聯準會的記者會每一句鷹派發言都讓人神經緊繃得不能呼吸
${flags.hasWhipsaw ? "昨天才暴漲三千三百點全市場都在高喊牛市回歸的奇蹟\n今天卻因為一則關稅推文直接重挫兩千點把多軍洗到脫皮" : "昨天才跳空創下歷史新高全市場都在高喊牛市回歸的奇蹟\n今天卻因為一則黑天鵝推文直接跳水殺破月線把多軍洗到脫皮"}
融資維持率跌破一百三的簡訊在清晨六點準時響起
營業員奪命連環叩問你 T加2 的交割款到底在哪裡
外資借券賣出幾萬張、投信季底結帳、隔日沖分點在早盤九點半無情倒貨
散戶在股版排隊取暖、問著零零九四零何時才能回到十塊錢的寄託
我不甘心就這樣淪為華爾街財報季裡一顆被收割的韭菜
擦乾眼角把破碎的交易紀律重新一筆一劃拼湊起來
${flags.hasNvda ? "看皮衣男黃仁勳帶著輝達算力重新站上世界之巔的舞台" : "看科技巨頭帶著 AI 算力重新站上世界之巔的舞台"}
五線合一均線糾結了一整季，MACD 底背離的訊號已經徹底展開
限空令下融券強制回補的號角吹響，這一次我絕不再置身事外！

[Bridge: Overlapping Dual Climax — Soaring High-Note Vocal & Machine-Gun Rap Counterpoint]
[High-Tenor Vocal] ${hookLineZh}——（[Rapper] 就算曾被斷頭追繳壓得喘不過氣！）
[High-Tenor Vocal] 肩上沉重的槓桿，晃呀晃——（[Rapper] 看破了假跌破真穿頭的把戲，握緊手中台積與輝達的底氣！）
[High-Tenor Vocal] 就算K線再動盪，阻擋不了我的信仰——（[Rapper] 從台北早盤一路殺到那斯達克夜盤，把空軍全部軋上天際！）
[High-Tenor Vocal] 迎著狂風巨浪，飛向那破頂的北方——！（[Rapper] 這場翻身仗我們絕不投降！Let's go!）

[Chorus: Maximum Stadium Climax, Ultra-High Belt Note + Full Orchestra & Distorted Guitar]
${hookLineZh}
握緊最後的籌碼，放手一搏去闖
那萬點之上的光芒
終究會把我的帳戶照亮！

[Outro: Lone Grand Piano echoing in the hall, Rapper breathing heavily]
[Rapper]
從阿呆谷底，一路飄向北方……
只要還沒下桌，我們終究會破頂封王。
[High-Tenor Vocal]
飄向北方…… 迎著那道曙光……
[End]`;

  const lyricsEn = `[Intro: Melancholic Grand Piano Solo and Sweeping Strings, Cold Wind & Trading Floor Ambience]
[Soaring Crystal-Clear High-Tenor Male Vocal, emotional and piercing]
${hookLineEn}
Heavy leverage on my shoulders, swaying til the dawn
No way back to where we started from
Wandering through the night session alone...

[Verse 1: Explosive Male Rapper, building from gritty narrative into rapid-fire multi-syllable flow]
They say Taipei to New York is just twelve hours on the clock
But it's too small to hold a retail dreamer chasing one big stock
Staring at the glowing monitors of red and green all night
Level-two order book flashing like a merciless street fight
Holding onto the last savings that I scraped up from the floor
Stepping into a concrete jungle where the HFT algos roar
Looking up at TSMC towering like a fortress in the sky
Every CoWoS silicon wafer blinding to the naked eye
They said the streets were paved with gold if you just go all-in bold
Nobody warned you how a limit-down lock makes your blood run cold
Zero-capital day traders clashing at the nine-oh-one bell
One tick of slippage sends a whole month's paycheck straight to hell
That wicked stop-hunt lower wick pierced right through my exit line
Sold the exact rock bottom right before it went vertical prime
Standing under the neon skyline watching billionaire towers shine
Why is there no room in this bull market for a brokerage account like mine!

[Chorus: Soaring High-Tenor Male Vocal, full orchestral strings and heavy live rock drums drop]
${hookLineEn}
Heavy leverage on my shoulders, swaying til the dawn
Maybe this breakout candle heals the scars I've carried on
Drifting to Wall Street, don't ask me where my stop-loss lies
Looking up at the candlestick skies
Faint but burning bright, lighting up this battlefield tonight

[Verse 2: Explosive Double-Time Machine-Gun Fast-Flow Male Rapper, breathless technical speed]
(Double-Time Chop Flow — Breathless Rapid Delivery)
Two-thirty in the morning and the PC fans are screaming loud
Jerome Powell on the podium dropping hawkish thunderclouds
Three thousand points up yesterday, everybody screaming bull market miracle
Then one tariff headline drops two thousand points, retail panic critical
Margin maintenance falling under one-thirty, liquidation SMS at six AM
Broker calling nonstop asking where the T-plus-two settlement went
Foreign funds short-lending millions while overnight whales dump at nine-thirty sharp
Bagholders crying on the forums praying their ETFs get out of the dark
I refuse to be another statistic harvested in earnings season's game
Wipe the blood off my keyboard, rebuild my trading discipline from the flame
Watch leather-jacket Jensen and Nvidia compute reclaim the global throne
Five moving averages coiled tight, MACD bullish divergence fully shown
Short-squeeze forced-covering sirens ringing out, I'm taking back what's my own!

[Bridge: Overlapping Dual Climax — Soaring High-Note Vocal & Machine-Gun Rap Counterpoint]
[High-Tenor Vocal] ${hookLineEn}— ([Rapper] Even when the margin calls had me down upon my knees!)
[High-Tenor Vocal] Heavy leverage on my shoulders, swaying til the dawn— ([Rapper] Saw right through the fake breakdown, holding TSMC and NVDA keys!)
[High-Tenor Vocal] No matter how the market shakes, my conviction won't break— ([Rapper] From Taipei morning bell to Nasdaq futures, riding the gamma squeeze!)
[High-Tenor Vocal] Rising through the hurricane toward the northern peak—! ([Rapper] We never surrender until we hit the all-time high! Let's go!)

[Chorus: Maximum Stadium Climax, Ultra-High Belt Note + Full Orchestra & Distorted Guitar]
${hookLineEn}
Gripping my final chips, rising up against the storm
The light above the all-time high
Will finally bring our portfolio home!

[Outro: Lone Grand Piano echoing in the hall, Rapper breathing heavily]
[Rapper]
From the bottom of the valley, drifting to the northern peak...
As long as we're still at the table, we'll claim the crown we seek.
[High-Tenor Vocal]
Drifting to Wall Street... into the morning light...
[End]`;

  return {
    zh: {
      title: "飄向北方・破頂之戰 (Drifting to Wall Street)",
      sunoStyle: p.sunoStyleZh.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsZh,
      ytTitles: [
        `【AI史詩饒舌】《飄向北方・破頂之戰》｜致敬那吾克熱×尤長靖〈飄向北方〉！高音副歌×炸裂快嘴唱盡台美股散戶逆襲 (Official Audio)`,
        `《飄向北方（別問我帳面多淒涼）》｜台積電、輝達大洗盤下的散戶心聲｜史詩高音 × 雙倍速機關槍快嘴 (${bpm} BPM)`,
        `砍在阿呆谷、熬過融資斷頭必聽！這首《飄向北方・破頂之戰》最後高音與快嘴交疊直接聽哭全網股民 🔥`
      ],
      ytDesc: `🌪️「我飄向北方，別問我帳面多淒涼，肩上沉重的槓桿晃呀晃……」
當台股與美股的散戶北漂華爾街、熬夜盯著台指夜盤與那斯達克，遇上《中國新說唱》那吾克熱 & 尤長靖經典神級現場《飄向北方》曲風基因！
這首《飄向北方・破頂之戰》以 ${bpm} BPM 淒美磅礴的古典鋼琴與管弦搖滾揭開序幕，融合尤長靖式清澈穿透天靈蓋的抒情高音副歌，以及那吾克熱式令人窒息的雙倍速機關槍快嘴（Double-Time Chop Flow），並在 Bridge 迎來「高音長嘯 × 疾速快嘴」雙軌交疊的史詩級燃炸高潮！

🎧 曲風與編曲亮點：
• ${bpm} BPM 史詩鋼琴 × 交響弦樂 × 重擊搖滾真鼓 (Cinematic Orchestral Hip-Hop Rock)
• 尤長靖式穿透高音副歌：「${hookLineZh}，肩上沉重的槓桿晃呀晃」
• 那吾克熱式雙倍速機關槍快嘴：把無本當沖、天地針長下影線、融資維持率 130% 追繳、關稅暴跌洗盤到台積電 CoWoS 與輝達算力逆襲一氣呵成！
• Bridge 靈魂雙軌對位：高音主唱與機關槍 Rapper 同步炸裂交疊，情緒張力直接拉滿！

💬 你也曾「砍在阿呆谷、在夜盤裡遊蕩」嗎？在留言區寫下你的逆襲目標，我們一起破頂封王！

#台股 #美股 #飄向北方 #那吾克熱 #尤長靖 #中國新說唱 #中國說唱巔峰對決 #台積電 #輝達 #NVIDIA #TSMC #快嘴饒舌 #高音副歌 #SunoAI #AI音樂 #股票饒舌`
    },
    en: {
      title: "飄向北方・破頂之戰 (Drifting to Wall Street)",
      sunoStyle: p.sunoStyleEn.replace("{BPM}", bpm),
      sunoExclude: p.sunoExclude,
      lyrics: lyricsEn,
      ytTitles: [
        `Drifting to Wall Street (Stranger in the Market) | Soaring High-Tenor Vocal × Machine-Gun Fast Rap Duet`,
        `"Don't Ask Me Where My Margin's Gone..." 🌪️ Drifting to Wall Street | Epic Orchestral Stock Market Rap (${bpm} BPM)`,
        `When Breathless Double-Time Chop Flow Meets Powerhouse High Notes 🔥 "Drifting to Wall Street" (NVDA, TSMC)`
      ],
      ytDesc: `🌪️ "${hookLineEn}, heavy leverage on my shoulders, swaying til the dawn..."
Inspired by the legendary live duet performance of "Stranger in the North (飄向北方)" by Nawukere & Azora Chin, "Drifting to Wall Street" fuses a ${bpm} BPM melancholic grand piano and sweeping orchestral rock arrangement with a soaring high-tenor vocal chorus and breathless double-time machine-gun rap verses—culminating in an overlapping vocal-and-rap stadium climax!

#StockMarketRap #StrangerInTheNorth #FastRap #OrchestralHipHop #TSMC #NVDA #WallStreet #SunoAI #AIMusic #TraderAnthem`
    }
  };
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
      title: "籌碼槍火 (Margin Crossfire)",
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
      title: "籌碼槍火 (Margin Crossfire)",
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
      title: "破頂攀登 (Scaling the Peak)",
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
      title: "除了看盤我什麼都不會 (Nothing But The Charts)",
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
      title: "離開盤面 (Log Off The Market)",
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
      title: "在盤中Cypher裏 (In The Trading Cypher)",
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
      title: "操盤假面 (Ghost Face Trader)",
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
      title: "漲停慶功酒 (Limit-Up Victory Wine)",
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

  if (currentState.preset === "avril-complicated") {
    return buildAvrilComplicatedPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "coldplay-viva") {
    return buildColdplayVivaPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "lp-numb") {
    return buildLinkinParkNumbPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "gaga-shallow") {
    return buildGagaShallowPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "gaga-badromance") {
    return buildGagaBadRomancePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "mj-thriller") {
    return buildMjThrillerPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "oned-beautiful") {
    return buildOneDBeautifulPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "bonjovi-mylife") {
    return buildBonJoviMyLifePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "prodigal-return") {
    return buildProdigalReturnPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "you-too-rapper") {
    return buildYouTooRapperPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "moon-notcome") {
    return buildMoonNotComePackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "gem-misssimilar") {
    return buildMissSimilarPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "gai-ascetic") {
    return buildAsceticMonkPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

  if (currentState.preset === "drift-north") {
    return buildDriftNorthPackage(p, bpm, {
      hasNvda,
      hasTsmc,
      hasWhipsaw,
      hasTariff,
      hasSqueeze,
      hasOptions
    });
  }

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
      title: `多空冤家 (Wall Street Rivals: Bull & Bear)`,
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

  // 依據當次隨機順序與隨機變體句庫抽取歌詞行
  const activeKeys = Object.keys(TRADING_KEYWORD_ENGINE).filter((k) => currentState.topics.has(k));

  activeKeys.forEach((key) => {
    const item = TRADING_KEYWORD_ENGINE[key];
    const vIdx = currentState.variantMap && typeof currentState.variantMap[key] === "number"
      ? currentState.variantMap[key]
      : 0;
    const lineZh = Array.isArray(item.zh) ? item.zh[vIdx % item.zh.length] : item.zh;
    const lineEn = Array.isArray(item.en) ? item.en[vIdx % item.en.length] : item.en;
    extraZh.push(lineZh);
    extraEn.push(lineEn);
    extraTagsZh.push(item.tagZh);
    extraTagsEn.push(item.tagEn);
  });

  // 自動注入當次隨機抽取的熱門個股標的（確保每首歌都有不同的股票與題材組合）
  if (currentState.autoRandomStocks && currentState.autoRandomStocks.length > 0) {
    const sZh = currentState.autoRandomStocks.map((s) => s.zh).join("、");
    const sEn = currentState.autoRandomStocks.map((s) => s.en).join(", ");
    extraZh.push(`這局籌碼隨機鎖定 ${sZh}，在多空洗盤的風暴裡寫下獨一無二的對帳單`);
    extraEn.push(`Rotating alpha locked onto ${sEn}, carving a unique track record through the market storm`);
    currentState.autoRandomStocks.forEach((s) => {
      extraTagsZh.push(s.tag);
    });
  }

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
    // 拆分為兩段：前半段直接融入 Verse 1 / Verse 2 之間，後半段作為專屬實戰 Breakdown，讓整首歌從頭到尾都隨每次隨機關鍵字變化
    const mid = Math.ceil(extraZh.length / 2);
    const firstHalfZh = extraZh.slice(0, mid);
    const secondHalfZh = extraZh.slice(mid);
    const firstHalfEn = extraEn.slice(0, mid);
    const secondHalfEn = extraEn.slice(mid);

    if (firstHalfZh.length > 0) {
      const verseInsertZh = `\n${firstHalfZh.join("\n")}\n`;
      const verseInsertEn = `\n${firstHalfEn.join("\n")}\n`;
      pkg.zh.lyrics = pkg.zh.lyrics.replace(/\n\[Chorus/, `${verseInsertZh}\n[Chorus`);
      pkg.en.lyrics = pkg.en.lyrics.replace(/\n\[Chorus/, `${verseInsertEn}\n[Chorus`);
    }

    if (secondHalfZh.length > 0) {
      const blockZh = `\n[Trading Alpha Breakdown: Randomized live market operation bars]\n${secondHalfZh.join("\n")}\n`;
      const blockEn = `\n[Trading Alpha Breakdown: Randomized live market operation bars]\n${secondHalfEn.join("\n")}\n`;
      pkg.zh.lyrics = pkg.zh.lyrics.replace(/\n\[Outro/, `${blockZh}\n[Outro`);
      pkg.en.lyrics = pkg.en.lyrics.replace(/\n\[Outro/, `${blockEn}\n[Outro`);
    }
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
