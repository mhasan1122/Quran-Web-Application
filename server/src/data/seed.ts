import Surah from '../models/Surah.js';

// Metadata for all 114 surahs: [transliteration, Arabic name, revelation type]
const SURAH_META: Record<number, { transliteration: string; arabic: string; type: 'Meccan' | 'Medinan' }> = {
  1:  { transliteration: 'Al-Fatihah',       arabic: 'الفاتحة',      type: 'Meccan'   },
  2:  { transliteration: 'Al-Baqarah',       arabic: 'البقرة',       type: 'Medinan'  },
  3:  { transliteration: "Ali 'Imran",        arabic: 'آل عمران',     type: 'Medinan'  },
  4:  { transliteration: 'An-Nisa',          arabic: 'النساء',       type: 'Medinan'  },
  5:  { transliteration: 'Al-Maidah',        arabic: 'المائدة',      type: 'Medinan'  },
  6:  { transliteration: 'Al-Anam',          arabic: 'الأنعام',      type: 'Meccan'   },
  7:  { transliteration: 'Al-Araf',          arabic: 'الأعراف',      type: 'Meccan'   },
  8:  { transliteration: 'Al-Anfal',         arabic: 'الأنفال',      type: 'Medinan'  },
  9:  { transliteration: 'At-Tawbah',        arabic: 'التوبة',       type: 'Medinan'  },
  10: { transliteration: 'Yunus',            arabic: 'يونس',         type: 'Meccan'   },
  11: { transliteration: 'Hud',              arabic: 'هود',          type: 'Meccan'   },
  12: { transliteration: 'Yusuf',            arabic: 'يوسف',         type: 'Meccan'   },
  13: { transliteration: "Ar-Ra'd",          arabic: 'الرعد',        type: 'Medinan'  },
  14: { transliteration: 'Ibrahim',          arabic: 'إبراهيم',      type: 'Meccan'   },
  15: { transliteration: 'Al-Hijr',          arabic: 'الحجر',        type: 'Meccan'   },
  16: { transliteration: 'An-Nahl',          arabic: 'النحل',        type: 'Meccan'   },
  17: { transliteration: 'Al-Isra',          arabic: 'الإسراء',      type: 'Meccan'   },
  18: { transliteration: 'Al-Kahf',          arabic: 'الكهف',        type: 'Meccan'   },
  19: { transliteration: 'Maryam',           arabic: 'مريم',         type: 'Meccan'   },
  20: { transliteration: 'Ta-Ha',            arabic: 'طه',           type: 'Meccan'   },
  21: { transliteration: 'Al-Anbiya',        arabic: 'الأنبياء',     type: 'Meccan'   },
  22: { transliteration: 'Al-Hajj',          arabic: 'الحج',         type: 'Medinan'  },
  23: { transliteration: "Al-Muminun",       arabic: 'المؤمنون',     type: 'Meccan'   },
  24: { transliteration: 'An-Nur',           arabic: 'النور',        type: 'Medinan'  },
  25: { transliteration: 'Al-Furqan',        arabic: 'الفرقان',      type: 'Meccan'   },
  26: { transliteration: "Ash-Shu'ara",      arabic: 'الشعراء',      type: 'Meccan'   },
  27: { transliteration: 'An-Naml',          arabic: 'النمل',        type: 'Meccan'   },
  28: { transliteration: 'Al-Qasas',         arabic: 'القصص',        type: 'Meccan'   },
  29: { transliteration: 'Al-Ankabut',       arabic: 'العنكبوت',     type: 'Meccan'   },
  30: { transliteration: 'Ar-Rum',           arabic: 'الروم',        type: 'Meccan'   },
  31: { transliteration: 'Luqman',           arabic: 'لقمان',        type: 'Meccan'   },
  32: { transliteration: 'As-Sajdah',        arabic: 'السجدة',       type: 'Meccan'   },
  33: { transliteration: 'Al-Ahzab',         arabic: 'الأحزاب',      type: 'Medinan'  },
  34: { transliteration: 'Saba',             arabic: 'سبأ',          type: 'Meccan'   },
  35: { transliteration: 'Fatir',            arabic: 'فاطر',         type: 'Meccan'   },
  36: { transliteration: 'Ya-Sin',           arabic: 'يس',           type: 'Meccan'   },
  37: { transliteration: 'As-Saffat',        arabic: 'الصافات',      type: 'Meccan'   },
  38: { transliteration: 'Sad',              arabic: 'ص',            type: 'Meccan'   },
  39: { transliteration: 'Az-Zumar',         arabic: 'الزمر',        type: 'Meccan'   },
  40: { transliteration: 'Ghafir',           arabic: 'غافر',         type: 'Meccan'   },
  41: { transliteration: 'Fussilat',         arabic: 'فصلت',         type: 'Meccan'   },
  42: { transliteration: 'Ash-Shura',        arabic: 'الشورى',       type: 'Meccan'   },
  43: { transliteration: 'Az-Zukhruf',       arabic: 'الزخرف',       type: 'Meccan'   },
  44: { transliteration: 'Ad-Dukhan',        arabic: 'الدخان',       type: 'Meccan'   },
  45: { transliteration: 'Al-Jathiyah',      arabic: 'الجاثية',      type: 'Meccan'   },
  46: { transliteration: 'Al-Ahqaf',         arabic: 'الأحقاف',      type: 'Meccan'   },
  47: { transliteration: 'Muhammad',         arabic: 'محمد',         type: 'Medinan'  },
  48: { transliteration: 'Al-Fath',          arabic: 'الفتح',        type: 'Medinan'  },
  49: { transliteration: 'Al-Hujurat',       arabic: 'الحجرات',      type: 'Medinan'  },
  50: { transliteration: 'Qaf',              arabic: 'ق',            type: 'Meccan'   },
  51: { transliteration: 'Adh-Dhariyat',     arabic: 'الذاريات',     type: 'Meccan'   },
  52: { transliteration: 'At-Tur',           arabic: 'الطور',        type: 'Meccan'   },
  53: { transliteration: 'An-Najm',          arabic: 'النجم',        type: 'Meccan'   },
  54: { transliteration: 'Al-Qamar',         arabic: 'القمر',        type: 'Meccan'   },
  55: { transliteration: 'Ar-Rahman',        arabic: 'الرحمن',       type: 'Medinan'  },
  56: { transliteration: "Al-Waqi'ah",       arabic: 'الواقعة',      type: 'Meccan'   },
  57: { transliteration: 'Al-Hadid',         arabic: 'الحديد',       type: 'Medinan'  },
  58: { transliteration: 'Al-Mujadila',      arabic: 'المجادلة',     type: 'Medinan'  },
  59: { transliteration: 'Al-Hashr',         arabic: 'الحشر',        type: 'Medinan'  },
  60: { transliteration: 'Al-Mumtahanah',    arabic: 'الممتحنة',     type: 'Medinan'  },
  61: { transliteration: 'As-Saf',           arabic: 'الصف',         type: 'Medinan'  },
  62: { transliteration: "Al-Jumu'ah",       arabic: 'الجمعة',       type: 'Medinan'  },
  63: { transliteration: 'Al-Munafiqun',     arabic: 'المنافقون',    type: 'Medinan'  },
  64: { transliteration: 'At-Taghabun',      arabic: 'التغابن',      type: 'Medinan'  },
  65: { transliteration: 'At-Talaq',         arabic: 'الطلاق',       type: 'Medinan'  },
  66: { transliteration: 'At-Tahrim',        arabic: 'التحريم',      type: 'Medinan'  },
  67: { transliteration: 'Al-Mulk',          arabic: 'الملك',        type: 'Meccan'   },
  68: { transliteration: 'Al-Qalam',         arabic: 'القلم',        type: 'Meccan'   },
  69: { transliteration: 'Al-Haqqah',        arabic: 'الحاقة',       type: 'Meccan'   },
  70: { transliteration: "Al-Ma'arij",       arabic: 'المعارج',      type: 'Meccan'   },
  71: { transliteration: 'Nuh',              arabic: 'نوح',          type: 'Meccan'   },
  72: { transliteration: 'Al-Jinn',          arabic: 'الجن',         type: 'Meccan'   },
  73: { transliteration: 'Al-Muzzammil',     arabic: 'المزمل',       type: 'Meccan'   },
  74: { transliteration: 'Al-Muddaththir',   arabic: 'المدثر',       type: 'Meccan'   },
  75: { transliteration: 'Al-Qiyamah',       arabic: 'القيامة',      type: 'Meccan'   },
  76: { transliteration: 'Al-Insan',         arabic: 'الإنسان',      type: 'Medinan'  },
  77: { transliteration: 'Al-Mursalat',      arabic: 'المرسلات',     type: 'Meccan'   },
  78: { transliteration: "An-Naba'",         arabic: 'النبأ',        type: 'Meccan'   },
  79: { transliteration: "An-Nazi'at",       arabic: 'النازعات',     type: 'Meccan'   },
  80: { transliteration: "Abasa",            arabic: 'عبس',          type: 'Meccan'   },
  81: { transliteration: 'At-Takwir',        arabic: 'التكوير',      type: 'Meccan'   },
  82: { transliteration: 'Al-Infitar',       arabic: 'الانفطار',     type: 'Meccan'   },
  83: { transliteration: 'Al-Mutaffifin',    arabic: 'المطففين',     type: 'Meccan'   },
  84: { transliteration: 'Al-Inshiqaq',      arabic: 'الانشقاق',     type: 'Meccan'   },
  85: { transliteration: 'Al-Buruj',         arabic: 'البروج',       type: 'Meccan'   },
  86: { transliteration: 'At-Tariq',         arabic: 'الطارق',       type: 'Meccan'   },
  87: { transliteration: "Al-A'la",          arabic: 'الأعلى',       type: 'Meccan'   },
  88: { transliteration: 'Al-Ghashiyah',     arabic: 'الغاشية',      type: 'Meccan'   },
  89: { transliteration: 'Al-Fajr',          arabic: 'الفجر',        type: 'Meccan'   },
  90: { transliteration: 'Al-Balad',         arabic: 'البلد',        type: 'Meccan'   },
  91: { transliteration: 'Ash-Shams',        arabic: 'الشمس',        type: 'Meccan'   },
  92: { transliteration: 'Al-Layl',          arabic: 'الليل',        type: 'Meccan'   },
  93: { transliteration: 'Ad-Duha',          arabic: 'الضحى',        type: 'Meccan'   },
  94: { transliteration: 'Ash-Sharh',        arabic: 'الشرح',        type: 'Meccan'   },
  95: { transliteration: 'At-Tin',           arabic: 'التين',        type: 'Meccan'   },
  96: { transliteration: "Al-'Alaq",         arabic: 'العلق',        type: 'Meccan'   },
  97: { transliteration: 'Al-Qadr',          arabic: 'القدر',        type: 'Meccan'   },
  98: { transliteration: 'Al-Bayyinah',      arabic: 'البينة',       type: 'Medinan'  },
  99: { transliteration: 'Az-Zalzalah',      arabic: 'الزلزلة',      type: 'Medinan'  },
  100: { transliteration: "Al-'Adiyat",      arabic: 'العاديات',     type: 'Meccan'   },
  101: { transliteration: "Al-Qari'ah",      arabic: 'القارعة',      type: 'Meccan'   },
  102: { transliteration: 'At-Takathur',     arabic: 'التكاثر',      type: 'Meccan'   },
  103: { transliteration: 'Al-Asr',          arabic: 'العصر',        type: 'Meccan'   },
  104: { transliteration: 'Al-Humazah',      arabic: 'الهمزة',       type: 'Meccan'   },
  105: { transliteration: 'Al-Fil',          arabic: 'الفيل',        type: 'Meccan'   },
  106: { transliteration: 'Quraysh',         arabic: 'قريش',         type: 'Meccan'   },
  107: { transliteration: "Al-Ma'un",        arabic: 'الماعون',      type: 'Meccan'   },
  108: { transliteration: 'Al-Kawthar',      arabic: 'الكوثر',       type: 'Meccan'   },
  109: { transliteration: 'Al-Kafirun',      arabic: 'الكافرون',     type: 'Meccan'   },
  110: { transliteration: 'An-Nasr',         arabic: 'النصر',        type: 'Medinan'  },
  111: { transliteration: 'Al-Masad',        arabic: 'المسد',        type: 'Meccan'   },
  112: { transliteration: 'Al-Ikhlas',       arabic: 'الإخلاص',      type: 'Meccan'   },
  113: { transliteration: 'Al-Falaq',        arabic: 'الفلق',        type: 'Meccan'   },
  114: { transliteration: 'An-Nas',          arabic: 'الناس',        type: 'Meccan'   },
};

export async function seedDatabase(): Promise<void> {
  // Check if data is already properly seeded (with English translations)
  const count = await Surah.countDocuments();
  if (count === 114) {
    // Verify translations are correct (not Arabic text)
    const sample = await Surah.findOne({ number: 1 });
    const firstTranslation = sample?.ayahs?.[0]?.translation ?? '';
    // If first ayah translation is English (ASCII), skip re-seed
    const isEnglish = /^[a-zA-Z]/.test(firstTranslation);
    if (isEnglish) {
      console.log('✅ Database already seeded with 114 surahs.');
      return;
    }
    console.log('⚠️  Re-seeding: translations appear incorrect, fixing...');
  }

  console.log('🌱 Seeding database from quran-json CDN...');

  // quran_en.json has BOTH Arabic text AND English translation in each verse:
  // { id, name, transliteration, type, total_verses, verses: [{id, text(arabic), translation(english)}] }
  const englishUrl = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json';

  const englishRes = await fetch(englishUrl);
  if (!englishRes.ok) {
    throw new Error('Failed to fetch Quran data from CDN');
  }

  type VerseData = { id: number; text: string; translation: string };
  type SurahData = {
    id: number;
    name: string;
    transliteration: string;
    type: string;
    total_verses: number;
    verses: VerseData[];
  };

  const englishData = (await englishRes.json()) as SurahData[];

  const surahs = englishData.map((surahData) => {
    const meta = SURAH_META[surahData.id];

    const ayahs = surahData.verses.map((v) => ({
      number: v.id,
      arabic: v.text,       // Arabic text
      translation: v.translation, // English (Sahih International)
    }));

    return {
      number: surahData.id,
      arabicName: meta?.arabic ?? surahData.name,
      englishName: surahData.name,
      transliteration: meta?.transliteration ?? surahData.transliteration,
      totalAyahs: surahData.total_verses,
      revelationType: (meta?.type ?? surahData.type) as 'Meccan' | 'Medinan',
      ayahs,
    };
  });

  // Clear and re-seed
  await Surah.deleteMany({});
  await Surah.insertMany(surahs);
  console.log(`✅ Seeded ${surahs.length} surahs into MongoDB.`);
}
