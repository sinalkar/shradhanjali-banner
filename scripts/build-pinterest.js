#!/usr/bin/env node
/**
 * Generates the Pinterest content pack: marketing/pinterest/content.json
 *
 * One board per shipped language, four pins per board (print, WhatsApp,
 * Instagram, flex), each pointing at that language's canonical page. Written
 * as a generator, not hand-authored JSON, so it stays in lockstep with the
 * languages the app actually ships (i18n/languages.json) and never proposes
 * a pin for a language without a page.
 *
 * Why descriptions lead with native script: Pinterest search is keyword
 * search. A Marathi family types "श्रद्धांजली बॅनर", not "shradhanjali
 * banner" — the existing pins were English-only and invisible to exactly the
 * audience each board targets. English follows for the diaspora, hashtags
 * close. Alt text is plain descriptive native text (accessibility + visual
 * search), no hashtags.
 *
 * The pack also carries `existing_board_fixes`: description + link + alt-text
 * repairs for the 4 boards / 12 pins created before the per-language pages
 * existed. Pin IDs are resolved at publish time by listing each board.
 *
 * Publish with scripts/publish-pinterest.js (needs PINTEREST_ACCESS_TOKEN).
 *
 * Usage: node scripts/build-pinterest.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://shradhanjalibanner.in';
const UTM = 'utm_source=pinterest&utm_medium=social&utm_campaign=language_boards';

const { languages: LANGS, default: DEFAULT_LANG } = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'i18n', 'languages.json'), 'utf8')
);

/* Per-language marketing vocabulary. `ceremony` uses each language's own
   term for the memorial observance — never transliterated Marathi. */
const L = {
  mr: {
    langEn: 'Marathi',
    native: 'मराठी',
    tool: 'श्रद्धांजली बॅनर',
    keywords: ['श्रद्धांजली बॅनर', 'शोक संदेश बॅनर', 'भावपूर्ण श्रद्धांजली', 'दशक्रिया विधी बॅनर'],
    ceremony: 'दशक्रिया विधी',
    cta: 'फोटो व माहिती भरा आणि काही मिनिटांत बॅनर डाउनलोड करा — विनामूल्य, वॉटरमार्कशिवाय, नोंदणीशिवाय.',
    boardName: 'Marathi Shradhanjali Banner Templates',
    boardDesc:
      'श्रद्धांजली बॅनर, शोक संदेश आणि दशक्रिया विधी बॅनरचे विनामूल्य मराठी नमुने. Free Marathi shradhanjali banner and memorial poster templates — make yours online in minutes at shradhanjalibanner.in, no login, no watermark.',
  },
  hi: {
    langEn: 'Hindi',
    native: 'हिन्दी',
    tool: 'श्रद्धांजलि बैनर',
    keywords: ['श्रद्धांजलि बैनर', 'शोक संदेश', 'श्रद्धांजलि फोटो', 'तेरहवीं कार्ड'],
    ceremony: 'तेरहवीं / शोक सभा',
    cta: 'फ़ोटो और जानकारी भरें, कुछ ही मिनटों में बैनर डाउनलोड करें — निःशुल्क, बिना वॉटरमार्क, बिना पंजीकरण.',
    boardName: 'Hindi Shradhanjali Banner Templates',
    boardDesc:
      'श्रद्धांजलि बैनर, शोक संदेश और तेरहवीं कार्ड के निःशुल्क हिन्दी नमूने. Free Hindi shradhanjali banner and condolence card templates — create yours online in minutes at shradhanjalibanner.in, no login, no watermark.',
  },
  en: {
    langEn: 'English',
    native: 'English',
    tool: 'Shradhanjali Banner',
    keywords: [
      'shradhanjali banner',
      'memorial tribute card',
      'RIP poster maker',
      'condolence card',
    ],
    ceremony: 'prayer meeting',
    cta: 'Add a photo and details, download in minutes — free, no watermark, no sign-up.',
    boardName: 'English Shradhanjali Banner Templates',
    boardDesc:
      'Free English shradhanjali banner, memorial tribute card and RIP poster templates. Make a dignified condolence banner online in minutes at shradhanjalibanner.in — no login, no watermark, 100% private.',
  },
  bn: {
    langEn: 'Bengali',
    native: 'বাংলা',
    tool: 'শ্রদ্ধাঞ্জলি ব্যানার',
    keywords: ['শ্রদ্ধাঞ্জলি ব্যানার', 'শোক বার্তা', 'স্মরণসভা কার্ড', 'শ্রাদ্ধ ব্যানার'],
    ceremony: 'শ্রাদ্ধ / শোকসভা',
    cta: 'ছবি ও তথ্য দিন, কয়েক মিনিটে ব্যানার ডাউনলোড করুন — বিনামূল্যে, ওয়াটারমার্ক ছাড়া, নিবন্ধন ছাড়া।',
    boardName: 'Bengali Shradhanjali Banner Templates',
    boardDesc:
      'শ্রদ্ধাঞ্জলি ব্যানার, শোক বার্তা ও শ্রাদ্ধ কার্ডের বিনামূল্যের বাংলা নমুনা। Free Bengali shradhanjali banner and memorial card templates — make yours online at shradhanjalibanner.in, no login, no watermark.',
  },
  te: {
    langEn: 'Telugu',
    native: 'తెలుగు',
    tool: 'శ్రద్ధాంజలి బ్యానర్',
    keywords: ['శ్రద్ధాంజలి బ్యానర్', 'సంతాప సందేశం', 'దశదిన కర్మ', 'నివాళి కార్డ్'],
    ceremony: 'దశదిన కర్మ / సంతాప సభ',
    cta: 'ఫోటో, వివరాలు నమోదు చేసి నిమిషాల్లో బ్యానర్ డౌన్‌లోడ్ చేయండి — ఉచితం, వాటర్‌మార్క్ లేదు, నమోదు అవసరం లేదు.',
    boardName: 'Telugu Shradhanjali Banner Templates',
    boardDesc:
      'శ్రద్ధాంజలి బ్యానర్, సంతాప సందేశం, దశదిన కర్మ కార్డుల ఉచిత తెలుగు నమూనాలు. Free Telugu shradhanjali banner and condolence card templates — shradhanjalibanner.in లో నిమిషాల్లో తయారు చేయండి, లాగిన్ లేదు, వాటర్‌మార్క్ లేదు.',
  },
  ta: {
    langEn: 'Tamil',
    native: 'தமிழ்',
    tool: 'இரங்கல் பேனர்',
    keywords: ['இரங்கல் அஞ்சலி', 'இரங்கல் செய்தி', 'காரியம் அழைப்பிதழ்', 'நினைவு அஞ்சலி'],
    ceremony: 'காரியம் / இரங்கல் கூட்டம்',
    cta: 'புகைப்படமும் விவரங்களும் சேர்த்து சில நிமிடங்களில் பேனரைப் பதிவிறக்குங்கள் — இலவசம், வாட்டர்மார்க் இல்லை, பதிவு தேவையில்லை.',
    boardName: 'Tamil Shradhanjali Banner Templates',
    boardDesc:
      'இரங்கல் அஞ்சலி பேனர், இரங்கல் செய்தி மற்றும் காரியம் அழைப்பிதழ்களின் இலவச தமிழ் வடிவங்கள். Free Tamil memorial and condolence banner templates — shradhanjalibanner.in இல் நிமிடங்களில் உருவாக்குங்கள், பதிவு இல்லை, வாட்டர்மார்க் இல்லை.',
  },
  gu: {
    langEn: 'Gujarati',
    native: 'ગુજરાતી',
    tool: 'શ્રદ્ધાંજલિ બેનર',
    keywords: ['શ્રદ્ધાંજલિ બેનર', 'શોક સંદેશ', 'બેસણું કાર્ડ', 'સ્મરણાંજલિ'],
    ceremony: 'બેસણું / પ્રાર્થના સભા',
    cta: 'ફોટો અને વિગતો ભરો, મિનિટોમાં બેનર ડાઉનલોડ કરો — મફત, વોટરમાર્ક વિના, નોંધણી વિના.',
    boardName: 'Gujarati Shradhanjali Banner Templates',
    boardDesc:
      'શ્રદ્ધાંજલિ બેનર, શોક સંદેશ અને બેસણું કાર્ડના મફત ગુજરાતી નમૂના. Free Gujarati shradhanjali banner and besnu card templates — shradhanjalibanner.in પર મિનિટોમાં બનાવો, લોગિન નહીં, વોટરમાર્ક નહીં.',
  },
  kn: {
    langEn: 'Kannada',
    native: 'ಕನ್ನಡ',
    tool: 'ಶ್ರದ್ಧಾಂಜಲಿ ಬ್ಯಾನರ್',
    keywords: ['ಶ್ರದ್ಧಾಂಜಲಿ ಬ್ಯಾನರ್', 'ಸಂತಾಪ ಸಂದೇಶ', 'ವೈಕುಂಠ ಸಮಾರಾಧನೆ', 'ನುಡಿನಮನ'],
    ceremony: 'ವೈಕುಂಠ ಸಮಾರಾಧನೆ / ಸಂತಾಪ ಸಭೆ',
    cta: 'ಫೋಟೋ ಮತ್ತು ವಿವರ ತುಂಬಿ, ನಿಮಿಷಗಳಲ್ಲಿ ಬ್ಯಾನರ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ — ಉಚಿತ, ವಾಟರ್‌ಮಾರ್ಕ್ ಇಲ್ಲ, ನೋಂದಣಿ ಇಲ್ಲ.',
    boardName: 'Kannada Shradhanjali Banner Templates',
    boardDesc:
      'ಶ್ರದ್ಧಾಂಜಲಿ ಬ್ಯಾನರ್, ಸಂತಾಪ ಸಂದೇಶ ಮತ್ತು ನುಡಿನಮನ ಕಾರ್ಡ್‌ಗಳ ಉಚಿತ ಕನ್ನಡ ನಮೂನೆಗಳು. Free Kannada shradhanjali banner and condolence card templates — shradhanjalibanner.in ನಲ್ಲಿ ನಿಮಿಷಗಳಲ್ಲಿ ರಚಿಸಿ, ಲಾಗಿನ್ ಇಲ್ಲ, ವಾಟರ್‌ಮಾರ್ಕ್ ಇಲ್ಲ.',
  },
  ml: {
    langEn: 'Malayalam',
    native: 'മലയാളം',
    tool: 'ആദരാഞ്ജലി ബാനർ',
    keywords: ['ആദരാഞ്ജലി ബാനർ', 'അനുശോചന സന്ദേശം', 'ചരമ വാർഷികം', 'സ്മരണാഞ്ജലി'],
    ceremony: 'സഞ്ചയനം / അനുശോചന യോഗം',
    cta: 'ഫോട്ടോയും വിവരങ്ങളും ചേർത്ത് മിനിറ്റുകൾക്കുള്ളിൽ ബാനർ ഡൗൺലോഡ് ചെയ്യൂ — സൗജന്യം, വാട്ടർമാർക്കില്ല, രജിസ്ട്രേഷനില്ല.',
    boardName: 'Malayalam Shradhanjali Banner Templates',
    boardDesc:
      'ആദരാഞ്ജലി ബാനർ, അനുശോചന സന്ദേശം, ചരമ വാർഷിക കാർഡുകളുടെ സൗജന്യ മലയാളം മാതൃകകൾ. Free Malayalam memorial and condolence banner templates — shradhanjalibanner.in ൽ മിനിറ്റുകൾക്കുള്ളിൽ നിർമ്മിക്കൂ, ലോഗിൻ ഇല്ല, വാട്ടർമാർക്കില്ല.',
  },
  pa: {
    langEn: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    tool: 'ਸ਼ਰਧਾਂਜਲੀ ਬੈਨਰ',
    keywords: ['ਸ਼ਰਧਾਂਜਲੀ ਬੈਨਰ', 'ਸ਼ੋਕ ਸੁਨੇਹਾ', 'ਅੰਤਿਮ ਅਰਦਾਸ ਕਾਰਡ', 'ਭੋਗ ਕਾਰਡ'],
    ceremony: 'ਅੰਤਿਮ ਅਰਦਾਸ / ਭੋਗ',
    cta: 'ਫ਼ੋਟੋ ਅਤੇ ਜਾਣਕਾਰੀ ਭਰੋ, ਮਿੰਟਾਂ ਵਿੱਚ ਬੈਨਰ ਡਾਊਨਲੋਡ ਕਰੋ — ਮੁਫ਼ਤ, ਬਿਨਾਂ ਵਾਟਰਮਾਰਕ, ਬਿਨਾਂ ਰਜਿਸਟਰੇਸ਼ਨ.',
    boardName: 'Punjabi Shradhanjali Banner Templates',
    boardDesc:
      'ਸ਼ਰਧਾਂਜਲੀ ਬੈਨਰ, ਸ਼ੋਕ ਸੁਨੇਹਾ ਅਤੇ ਅੰਤਿਮ ਅਰਦਾਸ ਕਾਰਡ ਦੇ ਮੁਫ਼ਤ ਪੰਜਾਬੀ ਨਮੂਨੇ. Free Punjabi shradhanjali banner and antim ardas card templates — shradhanjalibanner.in ਤੇ ਮਿੰਟਾਂ ਵਿੱਚ ਬਣਾਓ, ਲਾਗਇਨ ਨਹੀਂ, ਵਾਟਰਮਾਰਕ ਨਹੀਂ.',
  },
  or: {
    langEn: 'Odia',
    native: 'ଓଡ଼ିଆ',
    tool: 'ଶ୍ରଦ୍ଧାଞ୍ଜଳି ବ୍ୟାନର',
    keywords: ['ଶ୍ରଦ୍ଧାଞ୍ଜଳି ବ୍ୟାନର', 'ଶୋକ ବାର୍ତ୍ତା', 'ଶ୍ରାଦ୍ଧ କାର୍ଡ', 'ସ୍ମୃତି ଅଞ୍ଜଳି'],
    ceremony: 'ଶ୍ରାଦ୍ଧ / ଶୋକସଭା',
    cta: 'ଫଟୋ ଓ ସୂଚନା ଭରନ୍ତୁ, ମିନିଟରେ ବ୍ୟାନର ଡାଉନଲୋଡ କରନ୍ତୁ — ମାଗଣା, ୱାଟରମାର୍କ ନାହିଁ, ପଞ୍ଜୀକରଣ ନାହିଁ।',
    boardName: 'Odia Shradhanjali Banner Templates',
    boardDesc:
      'ଶ୍ରଦ୍ଧାଞ୍ଜଳି ବ୍ୟାନର, ଶୋକ ବାର୍ତ୍ତା ଓ ଶ୍ରାଦ୍ଧ କାର୍ଡର ମାଗଣା ଓଡ଼ିଆ ନମୁନା। Free Odia shradhanjali banner and memorial card templates — shradhanjalibanner.in ରେ ମିନିଟରେ ତିଆରି କରନ୍ତୁ, ଲଗଇନ ନାହିଁ, ୱାଟରମାର୍କ ନାହିଁ।',
  },
};

/* The four pin formats. `angle` differentiates the pins so they are not four
   near-identical descriptions competing with each other in search. */
const FORMATS = [
  {
    key: 'print',
    file: (l) => `${l}_print.jpg`,
    titleEn: (v) => `${v.langEn} Shradhanjali Banner Template – Free Memorial Poster Maker`,
    angle: 'full landscape banner for printing and sharing',
    hashtagsEn: ['ShradhanjaliBanner', 'MemorialPoster', 'RIPBannerMaker'],
  },
  {
    key: 'whatsapp',
    file: (l) => `${l}_whatsapp.jpg`,
    titleEn: (v) => `${v.langEn} Shradhanjali WhatsApp Status (9:16) – Free RIP Tribute Banner`,
    angle: 'vertical 9:16 banner sized for WhatsApp Status and Instagram Story',
    hashtagsEn: ['WhatsAppStatusRIP', 'ShradhanjaliBanner', 'CondolenceStatus'],
  },
  {
    key: 'instagram',
    file: (l) => `${l}_instagram.jpg`,
    titleEn: (v) => `${v.langEn} Shradhanjali Instagram Post (1:1) – Free Memorial Tribute Card`,
    angle: 'square 1:1 memorial card for Instagram and Facebook posts',
    hashtagsEn: ['MemorialPost', 'ShradhanjaliBanner', 'TributeCard'],
  },
  {
    key: 'flex',
    file: (l) => `${l}_flex.jpg`,
    titleEn: (v) => `${v.langEn} Shradhanjali Flex Banner – 300 DPI Print-Shop Ready`,
    angle: 'large-format flex banner, 2×3 to 6×4 ft at up to 300 DPI for print shops',
    hashtagsEn: ['FlexBanner', 'ShradhanjaliBanner', 'FuneralBanner'],
  },
];

const pageFor = (lang) => (lang === DEFAULT_LANG ? `${ORIGIN}/` : `${ORIGIN}/${lang}/`);
const linkFor = (lang) => `${pageFor(lang)}?${UTM}`;

function pinDescription(v, fmt) {
  const native = `${v.keywords[0]} — ${v.ceremony} ${v.keywords[1]}. ${v.cta}`;
  const english = `Free ${v.langEn} shradhanjali ${fmt.angle}. Made with shradhanjalibanner.in — private, in-browser, no watermark.`;
  const tags = [...fmt.hashtagsEn, `${v.langEn}Memorial`].map((h) => `#${h}`).join(' ');
  return `${native}\n\n${english}\n\n${tags}`;
}

function pinAltText(v, fmt) {
  /* Plain descriptive text, native first — used for accessibility and visual
     search, so no hashtags and no marketing. */
  return `${v.tool} — ${v.ceremony}. Sample ${v.langEn} memorial banner: ${fmt.angle}.`;
}

/* ── Assemble ─────────────────────────────────────────────────────────── */
const missingImages = [];
const boards = LANGS.map((lang) => {
  const v = L[lang];
  if (!v) throw new Error(`No Pinterest vocabulary for shipped language "${lang}"`);
  return {
    lang,
    name: v.boardName,
    description: v.boardDesc,
    privacy: 'PUBLIC',
    pins: FORMATS.map((fmt) => {
      const rel = `assets/samples/${fmt.file(lang)}`;
      if (!fs.existsSync(path.join(ROOT, rel))) missingImages.push(rel);
      return {
        format: fmt.key,
        title: fmt.titleEn(v),
        description: pinDescription(v, fmt),
        alt_text: pinAltText(v, fmt),
        image_url: `${ORIGIN}/${rel}`,
        link: linkFor(lang),
      };
    }),
  };
});

if (missingImages.length) {
  console.error(`ERROR: missing sample images:\n  ${missingImages.join('\n  ')}`);
  process.exit(1);
}

const pack = {
  _generated_by: 'scripts/build-pinterest.js — do not edit by hand',
  origin: ORIGIN,
  utm: UTM,
  boards,
  /* The 12 pins created before the per-language pages existed link to
     ?lang= URLs and have no alt text. The publisher PATCHes every pin on
     these boards: link → canonical page (+UTM), alt_text filled, and the
     board description set. Pin IDs are resolved at publish time. */
  existing_board_fixes: ['mr', 'hi', 'en', 'bn'].map((lang) => ({
    lang,
    board_name: L[lang].boardName,
    set_board_description: L[lang].boardDesc,
    set_pin_link: linkFor(lang),
    set_alt_text_fallback: pinAltText(L[lang], FORMATS[0]),
    prepend_native_keywords: `${L[lang].keywords[0]} | ${L[lang].keywords[1]} — `,
  })),
};

const outDir = path.join(ROOT, 'marketing', 'pinterest');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'content.json'), JSON.stringify(pack, null, 2) + '\n');

const totalPins = boards.reduce((a, b) => a + b.pins.length, 0);
console.log(`marketing/pinterest/content.json`);
console.log(`  ${boards.length} boards, ${totalPins} pins (${LANGS.join(', ')})`);
console.log(`  + fixes for ${pack.existing_board_fixes.length} existing boards`);
