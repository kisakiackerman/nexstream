export type DuaTheme =
  | "Réveil"
  | "Sommeil"
  | "Repas"
  | "Voyage"
  | "Anxiété"
  | "Protection"
  | "Après la prière";

export const DUA_THEMES: DuaTheme[] = [
  "Réveil",
  "Sommeil",
  "Repas",
  "Voyage",
  "Anxiété",
  "Protection",
  "Après la prière",
];

export type Dua = {
  id: string;
  theme: DuaTheme;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
};

export const DUAS: Dua[] = [
  // Réveil
  {
    id: "reveil-1",
    theme: "Réveil",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    translation:
      "Louange à Allah qui nous a redonné la vie après nous avoir fait mourir (le sommeil), et c'est vers Lui que se fera la résurrection.",
    reference: "Al-Bukhari",
  },
  {
    id: "reveil-2",
    theme: "Réveil",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ",
    transliteration: "Alhamdu lillahil-ladhi 'afani fi jasadi wa radda 'alayya ruhi wa adhina li bidhikrih",
    translation:
      "Louange à Allah qui m'a rendu la santé, m'a rendu mon âme et m'a permis de L'évoquer.",
    reference: "At-Tirmidhi",
  },

  // Sommeil
  {
    id: "sommeil-1",
    theme: "Sommeil",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "En Ton nom, ô Allah, je meurs et je vis.",
    reference: "Al-Bukhari",
  },
  {
    id: "sommeil-2",
    theme: "Sommeil",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: "Ô Allah, protège-moi de Ton châtiment le jour où Tu ressusciteras Tes serviteurs.",
    reference: "Abu Dawud, At-Tirmidhi",
  },
  {
    id: "sommeil-3",
    theme: "Sommeil",
    arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ",
    transliteration: "Allahumma aslamtu nafsi ilayka wa fawwadtu amri ilayka wa alja'tu zahri ilayk",
    translation:
      "Ô Allah, je Te remets mon âme, je Te confie mon affaire et je m'appuie sur Toi.",
    reference: "Al-Bukhari, Muslim",
  },

  // Repas
  {
    id: "repas-1",
    theme: "Repas",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "Au nom d'Allah.",
    reference: "Abu Dawud, At-Tirmidhi",
  },
  {
    id: "repas-2",
    theme: "Repas",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Allahumma barik lana fima razaqtana wa qina 'adhaban-nar",
    translation: "Ô Allah, bénis ce que Tu nous as accordé et préserve-nous du châtiment du Feu.",
    reference: "Ibn as-Sunni",
  },
  {
    id: "repas-3",
    theme: "Repas",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation:
      "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni pouvoir de ma part.",
    reference: "Abu Dawud, At-Tirmidhi",
  },

  // Voyage
  {
    id: "voyage-1",
    theme: "Voyage",
    arabic:
      "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    translation:
      "Allah est le plus grand (x3). Gloire à Celui qui a mis ceci à notre service ; nous n'aurions pu le dominer par nous-mêmes, et c'est vers notre Seigneur que nous retournerons.",
    reference: "Muslim (d'après Coran 43:13-14)",
  },
  {
    id: "voyage-2",
    theme: "Voyage",
    arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى",
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa",
    translation: "Ô Allah, nous Te demandons, dans ce voyage, la bonté et la piété.",
    reference: "Muslim",
  },
  {
    id: "voyage-3",
    theme: "Voyage",
    arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
    transliteration: "Ayibuna ta'ibuna 'abiduna li-Rabbina hamidun",
    translation: "Nous revenons, repentants, adorateurs, louant notre Seigneur.",
    reference: "Muslim (au retour de voyage)",
  },

  // Anxiété
  {
    id: "anxiete-1",
    theme: "Anxiété",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "Ô Allah, je cherche refuge auprès de Toi contre l'angoisse et la tristesse.",
    reference: "Al-Bukhari",
  },
  {
    id: "anxiete-2",
    theme: "Anxiété",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    translation: "Il n'y a de divinité que Toi, gloire à Toi, j'ai été du nombre des injustes.",
    reference: "Coran 21:87 · At-Tirmidhi",
  },
  {
    id: "anxiete-3",
    theme: "Anxiété",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    translation: "Allah nous suffit, Il est le meilleur garant.",
    reference: "Coran 3:173",
  },
  {
    id: "anxiete-4",
    theme: "Anxiété",
    arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration: "Allahumma rahmataka arju fala takilni ila nafsi tarfata 'ayn",
    translation: "Ô Allah, j'espère en Ta miséricorde, ne me laisse pas à moi-même, ne serait-ce qu'un instant.",
    reference: "Abu Dawud",
  },

  // Protection
  {
    id: "protection-1",
    theme: "Protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: "Je cherche protection dans les paroles parfaites d'Allah contre le mal qu'Il a créé.",
    reference: "Muslim",
  },
  {
    id: "protection-2",
    theme: "Protection",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahil-ladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    translation:
      "Au nom d'Allah, avec Son nom rien ne peut nuire sur terre ni dans le ciel, et Il est Celui qui entend tout, qui sait tout.",
    reference: "Abu Dawud, At-Tirmidhi",
  },
  {
    id: "protection-3",
    theme: "Protection",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ",
    transliteration:
      "A'udhu bikalimatillahit-tammati min ghadabihi wa 'iqabihi wa sharri 'ibadihi wa min hamazatish-shayatini wa an yahdurun",
    translation:
      "Je cherche protection dans les paroles parfaites d'Allah contre Sa colère, Son châtiment, le mal de Ses serviteurs, et les insinuations des démons.",
    reference: "Abu Dawud, At-Tirmidhi",
  },

  // Après la prière
  {
    id: "apres-priere-1",
    theme: "Après la prière",
    arabic:
      "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration:
      "Astaghfirullah (x3). Allahumma antas-salamu wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation:
      "Je demande pardon à Allah (x3). Ô Allah, Tu es la Paix et de Toi vient la paix, béni sois-Tu, ô Détenteur de la majesté et de la générosité.",
    reference: "Muslim",
  },
  {
    id: "apres-priere-2",
    theme: "Après la prière",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation:
      "Il n'y a de divinité qu'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange, et Il est capable de toute chose.",
    reference: "Al-Bukhari, Muslim",
  },
];