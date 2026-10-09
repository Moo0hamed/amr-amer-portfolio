export type Locale = "ar" | "en";

export type SocialLink = {
  label: string;
  href: string;
  kind: "behance" | "linkedin" | "instagram" | "facebook" | "whatsapp" | "email";
};

export const designer = {
  name: "عمرو عامر",
  nameEn: "Amr Amer",
  role: "مصمم داخلي",
  roleEn: "Interior Designer",
  education: "خريج كلية التربية الفنية",
  educationEn: "Fine Arts Education graduate",
  email: "amramer6289@gmail.com",
  whatsapp: "201024186289",
  phoneDisplay: "+20 102 418 6289",
  location: "القاهرة، مصر",
  locationEn: "Cairo, Egypt"
};

export const socialLinks: SocialLink[] = [
  { label: "Behance", href: "https://www.behance.net/amramer404", kind: "behance" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/amr-amer-8a707b273", kind: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/amramer404", kind: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/share/1FTqTrsTZW", kind: "facebook" },
  { label: "WhatsApp", href: "https://wa.me/201024186289", kind: "whatsapp" },
  { label: "Email", href: "mailto:amramer6289@gmail.com", kind: "email" }
];

export const services = [
  {
    number: "01",
    title: "التصميم الداخلي السكني",
    titleEn: "Residential interiors",
    description: "مساحات هادئة ومتماسكة تبدأ من طريقة عيشك، لا من شكلٍ جاهز.",
    descriptionEn: "Calm, coherent spaces that begin with the way you live — never a ready-made look."
  },
  {
    number: "02",
    title: "المطابخ وغرف الملابس",
    titleEn: "Kitchens & dressing rooms",
    description: "حلول عملية دقيقة تجمع بين التخزين الذكي، الحركة السلسة والتفاصيل الجميلة.",
    descriptionEn: "Precise, practical solutions that bring together smart storage, flow and beautiful details."
  },
  {
    number: "03",
    title: "التصوّر ثلاثي الأبعاد",
    titleEn: "3D visualisation",
    description: "رؤية واضحة للمكان قبل التنفيذ، كي تصبح القرارات أسهل والنتيجة أصدق.",
    descriptionEn: "A clear view of the space before it is built, making decisions easier and outcomes truer."
  }
];

export const studioPrinciples = [
  { value: "01", label: "الضوء أولًا", labelEn: "Light first" },
  { value: "02", label: "خامات صادقة", labelEn: "Honest materials" },
  { value: "03", label: "تفاصيل هادئة", labelEn: "Quiet detail" }
];

export const projectFilters = [
  { id: "all", label: "الكل", labelEn: "All" },
  { id: "archive", label: "أرشيف Drive", labelEn: "Drive archive" }
];

export const driveFolderUrl = "https://drive.google.com/drive/folders/1GwMEKU8_Bo-u_d4YBn9mU9PCmIGUTOO9";

export type Project = {
  id: string;
  fileName: string;
  category: "archive";
  imageUrl: string;
  sourceUrl: string;
};

const driveFiles = [
  ["1LPc4m7iPSWZXo2zF639vdNtbPJBNlpdA", "1ع (1).png"],
  ["1n1MV458XlSj8PUcdSg9df25OBSBSTUK2", "1ع (2).png"],
  ["1ah6Ar_F2c5Wq-EZcKKRH1xO4lqAI1K2Z", "1ع (3).png"],
  ["1asPelFaRdejgvVjIu_dUHnbpPPIWeLnx", "1ع (4).png"],
  ["1xoFCLkFtL5AP-lZincCcnjmzr2hrBrtK", "1ع (5).png"],
  ["1IqKnXVzmD8W0_Q7H12TmLxy35oCIenpB", "2ع (1).png"],
  ["1Gs55eEPy3KMepqoyfdSCgqNssTB0mWSM", "2ع (2).png"],
  ["1-e8Q-VcizvxJdaVqKdVrANaBn5rkYsp1", "2ع (3).png"],
  ["1FdwIv4Gzy3ykLOJ_DVkxGrCo4Fti_FTz", "2ع (4).png"],
  ["1equgtit1_lOU40dYpKZAdfOlLeb9r9xT", "2ع (5).png"],
  ["1smjJeOqRT3H1kFq_1PTSwIJ-R7YP0xRM", "2ع (6).png"],
  ["1XiFAk5OGetVhCE5a9s1peP6_B7-m6D1_", "2ع (7).png"],
  ["1eMkdfoFuWsnOzH_99D9oSuTDoZYC_zlg", "2ع (8).png"],
  ["15QcAZG70nUpYM_lgP_VNjlxKzrMlGibE", "3ع (1).png"],
  ["1hX3zTpB8AScLqEqL_W0Wy7zRZ3AxPXx4", "3ع (2).png"],
  ["1SRgCJbTa-ng3IhgB2l-5_VaiZPoCWDuB", "3ع (3).png"],
  ["1BSSIZCDQ9G1DnBFNDppbHRMF3JshXemn", "3ع (4).png"],
  ["1a35koQ7gMKn2Q6Sp43GU_UuuJC1wF-xQ", "3ع (5).png"],
  ["1_B-aIvCNys7NAvHLa9FBjchxtLs3ciCX", "3ع (6).png"],
  ["1RYHB6Q56lS5vKVn-bzH4gwjtZ28pSj31", "4ع (1).png"],
  ["1CAP-hxa8R05UXUBifZfQipqTK8NI_LU_", "4ع (2).png"],
  ["1jOfbAFAuTeIF3M8TNMkOfzfjrOxCJYKd", "4ع (3).png"],
  ["14paMnKJ_UmXtowrXxCsLpImUIx7izpNZ", "4ع (4).png"],
  ["1Mlx31biQ52KG_PJx2G-mSLVvFjGm2YKR", "4ع (5).png"],
  ["1WTuIenmeyGzmZMiKoLMekOCl96I6uCAN", "5ع (1).png"],
  ["12eSfdL2JsS_N4I800l1cv_BWve81zH1K", "5ع (2).png"],
  ["1ecKG0qvLfFcYa3a2GppUWKnDj1nxyr4U", "5ع (3).png"],
  ["1hH_J1JdS1BZuDNejVgFGu-OHnSRLG6Kx", "5ع (4).png"],
  ["1H1CndDVlTGZK8bmbVmGyrrVbfEh8Ifwy", "5ع (5).png"],
  ["1nScTTw5KZejY88pGDpZ0bDz1ttjCB9ot", "5ع (6).png"],
  ["1MOMybUaZl2DMjcMhWBtgpTy19R9RY7um", "5ع (7).png"],
  ["10reliH0djoM12SXQLknTsuSVOkKokQLl", "6ع (1).png"],
  ["1ELHfhMOAiUwh-5DlPIpoYwiu6C0LYfd5", "6ع (2).png"],
  ["1cti13rjz_g5gnFPMNcKTFDZVAXthpz1P", "6ع (3).png"],
  ["16ubPR1g7Sh0GHAtamigl-_fJ7nmDEdrT", "6ع (4).png"],
  ["1q0_fXAmTksRrD_X8plSj0swZw52ncyRe", "6ع (5).png"],
  ["1pn9cGTHnHM5IjLqTdt2qL2YLQAlEWuPC", "6ع (6).png"],
  ["1v7QH1M55MurGFiqcLVNj4vqjTCjORz74", "6ع (7).png"],
  ["1dKSMdEjuUz05F6p6XK5RMd33MY1GbPJn", "6ع (8).png"],
  ["1_j4FfzmjxLNajSIqZBI7YZhWgiJzGV1z", "7ع (1).jpg"],
  ["1wRpew9LyMmj3jrIZoJvfEAVjcj0rn6o6", "7ع (2).jpg"],
  ["1Rq4rp5M_T4a2ga-gQy6QrfqjmnFuBw-K", "7ع (3).jpg"],
  ["1fLWJz303ckz_QTga27w_gIZbsNB5wTsM", "7ع (4).jpg"],
  ["1sJ0FqwtDb5KHYR9USfcypXfLHDJAopGr", "7ع (5).jpg"],
  ["1MVF8QhvkxcyYFf7HPDoFpTT_WF1UkOvu", "8ع (1).jpg"],
  ["1ViDeTfT6eugJxxsh2YGYQsyyMeCtVvc2", "8ع (2).jpg"],
  ["1wx2xsWL7ZqMesbZH9Bd-mWls_L7oUPgY", "8ع (3).jpg"],
  ["1nM0xYU8j8jSM8Sn0swlR7ONtQ1JXsvh3", "8ع (4).jpg"],
  ["1YunExPephfVPeo5hq2oI7pRDybBOEceT", "8ع (5).jpg"],
  ["1ydGaQ7RyGOp_SiCNGbnkKg-jJ6e7os_7", "8ع (6).jpg"]
] as const;

export const projects: Project[] = driveFiles.map(([id, fileName]) => ({
  id,
  fileName,
  category: "archive",
  imageUrl: `/api/drive?id=${id}&size=800`,
  sourceUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing`
}));

export const copy = {
  ar: {
    navWork: "الأعمال",
    navAbout: "عن الاستوديو",
    navContact: "تواصل",
    navStudio: "استوديو المالك",
    heroKicker: "استوديو عمرو عامر / تصميم داخلي",
    heroTitle: "مساحات هادئة،\nمصممة لتُعاش.",
    heroDescription:
      "أصمم تجارب داخلية دافئة ومتوازنة؛ حيث يلتقي الضوء بالخامة، وتخدم كل تفصيلة طريقة حياتك.",
    explore: "استكشف الرؤية",
    contact: "لنصنع مساحة",
    scroll: "مرّر للاستكشاف",
    selectedWork: "أعمال مختارة",
    selectedWorkTitle: "المكان يبدأ\nمن إحساسه.",
    selectedWorkDescription:
      "أرشيف حقيقي من ملفاتك المنشورة على Google Drive، مع رابط مباشر لكل لوحة كي تبقى الأعمال موثقة وقابلة للفتح.",
    archiveLabel: "أرشيف Google Drive",
    openArchive: "فتح المجلد الأصلي",
    openProject: "فتح العمل",
    emptyTitle: "المعرض يستعد لاستقبال الأعمال.",
    emptyDescription:
      "لا توجد مشاريع منشورة بعد. هذه المساحة محجوزة لأعمال عمرو الحقيقية، دون صور أو قصص تجريبية منسوبة إليه.",
    openStudio: "إدارة المعرض من الاستوديو",
    philosophyKicker: "فلسفة العمل",
    philosophyTitle: "ليس الهدف أن يبدو المكان جميلًا فقط.\nبل أن يبدو لك.",
    philosophyBody:
      "أتعامل مع التصميم كترجمة هادئة لشخصية أصحاب المكان. أبدأ بالاستماع، ثم أبني حول الضوء والحركة والخامة نظامًا يشعر بالراحة قبل أن يلفت النظر.",
    servicesKicker: "ما أقدمه",
    servicesTitle: "من الفكرة الأولى\nإلى آخر تفصيلة.",
    processKicker: "طريقة العمل",
    processTitle: "وضوحٌ يسبق\nكل قرار.",
    processBody:
      "نحوّل الرغبة إلى لغة بصرية مفهومة، ثم إلى مساحة قابلة للتنفيذ. كل مرحلة لها سؤالها، وكل تفصيلة لها سببها.",
    step01: "01 / الاستماع",
    step01Body: "نفهم المكان، روتينك، وما تريد أن تشعر به كل يوم.",
    step02: "02 / التكوين",
    step02Body: "نرتّب الضوء والحركة والخامات في اتجاه واحد متماسك.",
    step03: "03 / التحقق",
    step03Body: "نُظهر الرؤية بوضوح قبل التنفيذ، ونراجعها معًا.",
    contactKicker: "لنتحدث",
    contactTitle: "هل لديك مساحة\nتريد أن تبدأ؟",
    contactBody: "أرسل فكرة بسيطة عن مشروعك، وسأعود إليك عبر البريد أو واتساب.",
    emailLabel: "البريد الإلكتروني",
    whatsappLabel: "واتساب",
    sendMessage: "إرسال رسالة",
    formName: "الاسم",
    formEmail: "البريد الإلكتروني",
    formMessage: "أخبرني عن مشروعك",
    formNamePlaceholder: "اسمك الكريم",
    formEmailPlaceholder: "you@example.com",
    formMessagePlaceholder: "نوع المساحة، المدينة، وما تتخيله...",
    formSubmit: "إرسال الطلب",
    formSending: "جارٍ الإرسال...",
    formSuccess: "تم تجهيز رسالتك بنجاح. سأتواصل معك قريبًا.",
    formNeedsSetup: "النموذج جاهز، لكن خدمة الإرسال تحتاج إعداد البريد في البيئة أولًا.",
    formError: "تعذر تجهيز الرسالة. راجع البيانات وحاول مرة أخرى.",
    required: "هذا الحقل مطلوب",
    footerNote: "تصميم داخلي يُبنى حولك.",
    footerRights: "جميع الحقوق محفوظة",
    backTop: "العودة للأعلى",
    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",
    menu: "القائمة",
    close: "إغلاق"
  },
  en: {
    navWork: "Work",
    navAbout: "The studio",
    navContact: "Contact",
    navStudio: "Owner studio",
    heroKicker: "Amr Amer studio / interior design",
    heroTitle: "Quiet spaces,\ndesigned to be lived in.",
    heroDescription:
      "I shape warm, balanced interiors where light meets material and every detail serves the way you live.",
    explore: "Explore the vision",
    contact: "Start a conversation",
    scroll: "Scroll to explore",
    selectedWork: "Selected work",
    selectedWorkTitle: "A place begins\nwith a feeling.",
    selectedWorkDescription:
      "A real archive from the files you shared on Google Drive, with a direct source link for every board.",
    archiveLabel: "Google Drive archive",
    openArchive: "Open original folder",
    openProject: "Open work",
    emptyTitle: "The gallery is getting ready.",
    emptyDescription:
      "No projects are published yet. This space is reserved for Amr’s real work — never placeholder images or invented stories.",
    openStudio: "Manage the gallery in studio",
    philosophyKicker: "The philosophy",
    philosophyTitle: "The goal is not only for a room to look beautiful.\nIt should feel like you.",
    philosophyBody:
      "I treat design as a quiet translation of the people who inhabit a place. We start by listening, then build around light, movement and material a system that feels comfortable before it asks for attention.",
    servicesKicker: "What I do",
    servicesTitle: "From the first idea\nto the last detail.",
    processKicker: "The process",
    processTitle: "Clarity before\nevery decision.",
    processBody:
      "We turn an instinct into a clear visual language, then into a space that can be built. Every stage has a question; every detail has a reason.",
    step01: "01 / Listen",
    step01Body: "We understand the space, your rhythm and what you want to feel each day.",
    step02: "02 / Compose",
    step02Body: "We bring light, movement and material into one coherent direction.",
    step03: "03 / Validate",
    step03Body: "We make the vision visible before anything is built, then review it together.",
    contactKicker: "Let’s talk",
    contactTitle: "Have a space\nyou want to begin?",
    contactBody: "Send a short note about your project and I’ll get back to you by email or WhatsApp.",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    sendMessage: "Send a message",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Tell me about your project",
    formNamePlaceholder: "Your name",
    formEmailPlaceholder: "you@example.com",
    formMessagePlaceholder: "Space type, city and what you imagine...",
    formSubmit: "Send enquiry",
    formSending: "Sending...",
    formSuccess: "Your message is ready. I’ll be in touch soon.",
    formNeedsSetup: "The form is ready, but email delivery needs to be configured in the environment first.",
    formError: "The message could not be prepared. Check your details and try again.",
    required: "This field is required",
    footerNote: "Interiors built around you.",
    footerRights: "All rights reserved",
    backTop: "Back to top",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    menu: "Menu",
    close: "Close"
  }
} as const;
