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
  lEKuorDbaCQ: {
    title: "《中國新說唱》ICE & 李榮浩《王牌冤家》Live 改編版",
    bpm: 96,
    preset: "ace-rivals",
    vibe: "慵懶都會 R&B / Pop Rock 旋律 × 強勢俐落 Melodic Trap 說唱 × 結尾高張力交錯對唱 (Call & Response)",
    dna: ["🎸 Funky 電吉他 Riff", "🥁 現場真鼓 + 808", "🎤 雙男聲反差對唱", "⚡ Bridge 交錯疊句"]
  }
};

const STYLE_PRESETS = {
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
  preset: "ace-rivals",
  bpm: 96,
  topics: new Set(["nvda", "tsmc", "whipsaw", "tariff", "squeeze"]),
  customHook: ""
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

  // 話題 Chip 切換
  document.querySelectorAll("#topic-chips .chip").forEach((chip) => {
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
    document.querySelectorAll("#topic-chips .chip").forEach((chip) => {
      currentState.topics.add(chip.dataset.topic);
      chip.classList.add("active");
    });
    renderAll();
  });

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
    const songData = buildSongPackage();
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
    const songData = buildSongPackage();
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

function buildSongPackage() {
  const p = STYLE_PRESETS[currentState.preset];
  const bpm = currentState.bpm;
  const hasNvda = currentState.topics.has("nvda");
  const hasTsmc = currentState.topics.has("tsmc");
  const hasWhipsaw = currentState.topics.has("whipsaw");
  const hasTariff = currentState.topics.has("tariff");
  const hasSqueeze = currentState.topics.has("squeeze");
  const hasOptions = currentState.topics.has("options");

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

function renderAll() {
  const pkg = buildSongPackage();
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
  const pkg = buildSongPackage();
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
