// --- 1. Data (Products) ---
const products = [
    {
        id: 101,
        title: "ساعة ذكية T800 Ultra - شاشة كاملة",
        category: "ساعات",
        price: 350,
        profit: 100,
        sales: 520,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",
        desc: "أشهر ساعة الترا في السوق، شاشة 1.99 بوصة، تدعم المكالمات"
    },
    {
        id: 102,
        title: "ساعة HW22 Pro Max - سيريس 6",
        category: "ساعات",
        price: 450,
        profit: 120,
        sales: 300,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80",
        desc: "تصميم أنيق مشابه لساعة ابل، زر جانبي شغال، وتدعم تغيير الخلفيات."
    },
    {
        id: 103,
        title: "ساعة X8 Ultra Plus - النسخة الأصلية",
        category: "ساعات",
        price: 550,
        profit: 150,
        sales: 150,
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=500&q=80",
        desc: "نسخة طبق الأصل من ابل الترا، مشبك استيك حقيقي، ومسامير في الظهر."
    },
    {
        id: 104,
        title: "ساعة ذكية للأطفال Smart 2030 (شريحة)",
        category: "ساعات",
        price: 400,
        profit: 100,
        sales: 800,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=500&q=80",
        desc: "ساعة أمان للأطفال، تدعم شريحة اتصال وتحديد الموقع GPS وكاميرا للمراقبة."
    },
    {
        id: 105,
        title: "oraimo Watch ES 2 ساعة ذكية 1.95 بوصة AMOLED IP68",
        category: "ساعات",
        price: 1200,
        profit: 400,
        sales: 1600,
        image: "https://cdn-img.oraimo.com/fit-in/600x600/EG/product/2025/04/04/OSW-810.png",
        desc: "ساعة اقتصادية، تدعم الإشعارات والمكالمات، خامة معدنية ممتازة."
    },
    {
        id: 106,
        title: "ساعة HK9 Pro - شاشة أموليد",
        category: "ساعات",
        price: 950,
        profit: 250,
        sales: 90,
        image: "https://m.media-amazon.com/images/I/61xXELzZt4L._AC_SL1065_.jpg",
        desc: "أعلى جودة شاشة AMOLED، معالج سريع جداً، تدعم ChatGPT وبوصلة حقيقية."
    },
    {
        id: 107,
        title: "ساعة ذكية T500",
        category: "ساعات",
        price: 500,
        profit: 200,
        sales: 1200,
        image: "https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/81/518583/1.jpg?4987",
        desc: "أرخص ساعة ذكية، تقيس نبضات القلب والضغط، خفيفة جداً للرياضة."
    },
    {
        id: 108,
        title: "ساعة T500 Plus - شاشة كبيرة",
        category: "ساعات",
        price: 500,
        profit: 200,
        sales: 600,
        image: "https://images-eu.ssl-images-amazon.com/images/I/610SEaxNYTL._AC_UL495_SR435,495_.jpg",
        desc: "ترقية لساعة T500 العادية، شاشة أكبر وألوان أفضل، ألعاب مدمجة."
    },
    {
        id: 109,
        title: "ساعة Hello Watch 3 pvo plus - ذاكرة داخلية",
        category: "ساعات",
        price: 1100,
        profit: 300,
        sales: 45,
        image: "https://m.media-amazon.com/images/I/61rmOGZIQOL._AC_SL1389_.jpg",
        desc: "بذاكرة 4 جيجا لتحميل الأغاني، شاشة أموليد، ومعرض صور."
    },
    {
        id: 110,
        title: "ساعة Oraimo Watch 3 Pro OSW-34",
        category: "ساعات",
        price: 700,
        profit: 200,
        sales: 150,
        image: "https://pomegy.com/_next/image?url=https%3A%2F%2Fmedia.pomegy.com%2Fimages%2Fproducts%2F1708118426.oriamo-osw34-1.png&w=1080&q=75",
        desc: "تصميم دائري كلاسيك، استيك معدن (ماجنتيك)، مناسبة للبدل والملابس الرسمية."
    },
    {
        id: 111,
        title: "ساعة ذكية X8 ألترا بلس - ساعة ذكية X8 ألترا بلس برتقالية",
        category: "ساعات",
        price: 800,
        profit: 150,
        sales: 200,
        image: "https://m.media-amazon.com/images/I/71+VqzzEK4L._AC_SL1500_.jpg",
        desc: "شبيهة شاومي باند 4، بطارية تدوم طويلاً، تربط بالموبايل للإشعارات."
    },
    {
        id: 112,
        title: "ساعة Series10 Hk10 Ultra 3 - ",
        category: "ساعات",
        price: 1200,
        profit: 400,
        sales: 110,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk6oL_NCfttCrdnJesfMs0nyvtZi9hHuRkjw&s",
        desc: "مقاومة للماء IP68، تدعم NFC، شاشة كبيرة، وتطبيق ممتاز."
    },
    {
        id: 113,
        title: "HK10 Pro Max Plus",
        category: "ساعات",
        price: 1400,
        profit: 1650,
        sales: 1350,
        image: "https://elmaktabatech.com/wp-content/uploads/2025/03/480557686_658312719889755_638461488190730333_n.jpg",
        desc: "شاشة كاملة بدون حواف تقريباً، زرار جانبي للتنقل، حرارة الجسم."
    },
    {
        id: 114,
        title:"ساعة ADHOMAX الجديدة X9 Ultra 2",
        category: "ساعات",
        price: 900,
        profit: 250,
        sales: 330,
        image: "https://m.media-amazon.com/images/I/51GNv60t16L._AC_SL1200_.jpg",
        desc: "تصميم سيريس 7، شاحن مغناطيسي، سريعة في اللمس."
    },
    {
        id: 115,
        title: "ساعة H11 Ultra - استيك برتقالي",
        category: "ساعات",
        price: 1200,
        profit: 400,
        sales: 180,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb8oMhV4vepsGXwm2DndUWapK3lBwYz4_jmw&s",
        desc: "حجم 49 مم، استيك اوشن مموج، لوك للاستيك، بطارية قوية."
    },
    {
        id: 116,
        title: "ساعة ذكية HK9 برو ماكس بلس(+HK 9 pro max)",
        category: "ساعات",
        price: 1600,
        profit: 250,
        sales: 95,
        image: "https://m.media-amazon.com/images/I/71BQm+qhnoL._AC_SL1500_.jpg",
        desc: "تدعم المساعد الصوتي Siri، واجهات متعددة، تشغيل الموسيقى."
    },
    {
        id: 117,
        title: "ساعة ConnectME Ultra 2 الذكية",
        category: "ساعات",
        price: 480,
        profit: 120,
        sales: 140,
        image: "https://m.media-amazon.com/images/I/51hmsHEpYlL._AC_SL1024_.jpg",
        desc: "شاشة AMOLED 2.02 بوصة، ذاكرة لتسجيل الأسماء، بطارية 4 أيام."
    },
    {
        id: 118,
        title: "ساعة سمارت هاي كوبي بناتي ",
        category: "ساعات",
        price: 800,
        profit: 200,
        sales: 70,
        image: "https://m.media-amazon.com/images/I/41HHetFFEBL._AC_.jpg",
        desc: "ساعة أطفال متطورة تدعم مكالمات الفيديو 4G والواي فاي."
    },
    {
        id: 119,
        title: "ساعة ذكية (HK 10 Ultra 3) HK10 Ultra 3,2025",
        category: "ساعات",
        price: 600,
        profit: 200,
        sales: 550,
        image: "https://m.media-amazon.com/images/I/614NliEvgUL._AC_.jpg",
        desc: "أرخص ساعة الترا، شكل شيك، إشعارات واتس وفيس، استيك سيليكون."
    },
    {
        id: 120,
        title: "ساعة hello 10 smart watch مواصفات شاشة بدون حواف",
        category: "ساعات",
        price: 750,
        profit: 200,
        sales: 60,
        image: "https://mesrshop.com/wp-content/uploads/2024/08/cltd08syn01u401g94ds44yrm_CF602CD4-D163-457A-B52C-2CBC1E623128_11zon.webp",
        desc: "براند G-Tab الأصلي، شاشة دائرية عالية الوضوح، بطارية تدوم أسبوع."
    },
    // --- الفئة: سماعات ---
    {
        id: 2,
        title: "سماعة P9 Pro Max عازلة للضوضاء",
        category: "سماعات",
        price: 550,
        profit: 650,
        sales: 120,
        image: "https://m.media-amazon.com/images/I/51fmaoOg92L._AC_SL1280_.jpg",
        desc: "جودة صوت ستيريو، مايكروفون مدمج."
    },
    {
        id: 201,
        title: "ايربودز برو 2 (نسخة طبق الأصل) - عزل ضوضاء",
        category: "سماعات",
        price: 450,
        profit: 150,
        sales: 850,
        image: "https://www.gom3adeals.com/wp-content/uploads/2024/01/%D8%A7%D9%8A%D8%B1-%D8%A8%D9%88%D8%AF%D8%B1%D8%B2-%D8%A8%D8%B1%D9%88-2-6.jpg",
        desc: "أعلى نسخة كوبي، عزل ضوضاء حقيقي، تدعم الشحن اللاسلكي وتتبع الموقع."
    },
    {
        id: 202,
        title: "سماعة P9 Pro Max - هيدفون بلوتوث",
        category: "سماعات",
        price: 400,
        profit: 150,
        sales: 1200,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        desc: "تصميم عصري، صوت ستيريو قوي، تدعم كارت ميموري ووصلة AUX."
    },
    {
        id: 203,
        title: "ايربودز الجيل الثالث (AirPods 3) - صوت محيطي",
        category: "سماعات",
        price: 500,
        profit: 100,
        sales: 600,
        image: "https://incredideals.co/cdn/shop/files/IMG-18063722_m_jpeg_1.png?v=1757986696&width=4000",
        desc: "حجم صغير ومريح للأذن، بطارية تدوم 6 ساعات، اقتران سريع بالايفون."
    },
    {
        id: 204,
        title: "سماعات بلوتوث لاسلكية M10 مزودة بشاشة LED عالية الدقة،",
        category: "سماعات",
        price: 600,
        profit: 150,
        sales: 2000,
        image: "https://m.media-amazon.com/images/I/511x7HKyX7L._AC_.jpg",
        desc: "أرخص سماعة بلوتوث .وسماعات ستيريو عالية الدقة مع علبة شحن، وشاشة عرض رقمية للطاقة، ووظيفة حامل الهاتف، وتحكم باللمس"
    },
    {
        id: 205,
        title: "سماعة جيمنج K9 - إضاءة RGB",
        category: "سماعات",
        price: 500,
        profit: 150,
        sales: 300,
        image: "https://m.media-amazon.com/images/I/71muJD1xpPL._AC_SL1500_.jpg",
        desc: "مايكروفون احترافي للألعاب، صوت محيطي لتحديد مكان العدو، إضاءة ملونة."
    },
    {
        id: 206,
        title: "سماعة لينوفو LP40 Pro الأصلية",
        category: "سماعات",
        price: 450,
        profit: 150,
        sales: 500,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
        desc: "براند لينوفو الأصلي، صوت نقي جداً، بطارية ممتازة، مقاومة للتعرق."
    },
    {
        id: 207,
        title: "سماعة رقبة (Neckband) رياضية مغناطيسية",
        category: "سماعات",
        price: 450,
        profit: 100,
        sales: 900,
        image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=500&q=80",
        desc: "مثالية للجيم والرياضة، ثبات عالي، صوت بيز قوي."
    },
    {
        id: 208,
        title: "سماعة Joyroom T03S Pro - عزل",
        category: "سماعات",
        price: 650,
        profit: 150,
        sales: 400,
        image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?auto=format&fit=crop&w=500&q=80",
        desc: "أفضل بديل للايربودز، جودة خامات عالية، ضمان فعلي، سينسور أذن."
    },
    {
        id: 209,
        title: "W&O2 ANC Earbuds with Premium Sound Experience",
        category: "سماعات",
        price: 250,
        profit: 50,
        sales: 1500,
        image: "https://m.media-amazon.com/images/I/41ho3Jw4qoL._AC_.jpg",
        desc: "Touch Screen, Highest Efficiency - Wireless, In-Ear, Aura White"
    },
    {
        id: 210,
        title: "سماعة سامسونج Buds 2 Pro (كوبي)",
        category: "سماعات",
        price: 650,
        profit: 100,
        sales: 250,
        image: "https://gadgetsstore.co.in/wp-content/uploads/2023/08/1.jpeg",
        desc: "تصميم انسيابي، صوت AKG مميز، مريحة جداً في الأذن لفترات طويلة."
    },
    {
        id: 211,
        title: "سماعات أذن لاسلكية حقيقية Oraimo OEB-E104DC FreePods 3",
        category: "سماعات",
        price: 800,
        profit: 150,
        sales: 950,
        image: "https://m.media-amazon.com/images/I/61RuDMWoDYL._AC_SL1500_.jpg",
        desc: "بلوتوث 5.2، مدة تشغيل 36 ساعة، مكالمات واضحة مع 4 ميكروفونات وتقنية ENC، صوت جهير عميق، مقاومة للماء بمعيار IPX5، شحن سريع وتحكم باللمس - أسود"
    },
    {
        id: 212,
        title: "سماعة سلك JBL (High Copy) - صوت نقي",
        category: "سماعات",
        price: 100,
        profit: 50,
        sales: 3000,
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=500&q=80",
        desc: "سماعة سلكية عملية، مايك للمكالمات، سلك قوي ضد القطع."
    },
    {
        id: 213,
        title: "سماعة Oraimo FreePods 3 (Original)",
        category: "سماعات",
        price: 850,
        profit: 200,
        sales: 150,
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80",
        desc: "صوت قوي جداً (Bass)، بطارية تدوم 8 ساعات متواصلة، ضد المياه."
    },
    {
        id: 214,
        title: "سماعات أذن لاسلكية مع علبة عرض LED",
        category: "سماعات",
        price: 450,
        profit: 100,
        sales: 400,
        image: "https://m.media-amazon.com/images/I/41NZ2ZmKzSL._AC_.jpg",
        desc: "سماعة أذن واحدة للمكالمات، تدعم ربط هاتفين، بطارية طويلة."
    },
    {
        id: 215,
        title: "صب ووفر بلوتوث محمول (Mini Speaker)",
        category: "سماعات",
        price: 550,
        profit: 100,
        sales: 600,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",
        desc: "صوت عالي ومحيطي، يدعم الفلاشة وكارت الميموري، حجم صغير."
    },
    {
        id: 6,
        title: "سماعة ايفون سلك حراري كوالتي عالي",
        category: "سماعات",
        price: 120,
        profit: 40,
        sales: 80,
        image: "https://m.media-amazon.com/images/I/51rbYUO85FL._AC_SL1500_.jpg",
        desc: "سماعة ايفون سلك حراري كوالتي عالي"
    },
    {
        id: 3,
        title: "Airpods pro 2 semi   Black (copy)",
        category: "سماعات",
        price: 650,
        profit: 150,
        sales: 200,
        image: "https://elmaktabatech.com/wp-content/uploads/2024/02/418151592_298282699932339_2238320010379355775_n.jpg",
        desc: "اقتران تلقائي بالايفون، عزل ضوضاء."
    },
    // --- الفئة: شواحن ---
    {
        id: 301,
        title: "رأس شاحن 20 وات (PD) للايفون - سريع",
        category: "شواحن",
        price: 200,
        profit: 100,
        sales: 2000,
        image: "https://m.media-amazon.com/images/I/51+iVOSj2-L._AC_SL1500_.jpg",
        desc: "يدعم الشحن السريع للايفون من 11 إلى 14، منفذ Type-C، جودة عالية."
    },
    {
        id: 302,
        title: "شاحن جوال سريع من النوع مايكرو، كابل بطول 1.2 متر، طاقة 3.1 أمبير",
        category: "شواحن",
        price: 150,
        profit: 50,
        sales: 1500,
        image: "https://m.media-amazon.com/images/I/51goWsg67FL._SY500_.jpg",
        desc: "تصميم قابس دوار بزاوية 90 درجة، مع مؤشر ضوئي أزرق للشحن الكامل وأحمر لوضع الشحن، شحن سريع،"
    },
    {
        id: 303,
        title: "شاحن سامسونج 25 وات (Super Fast Charging)",
        category: "شواحن",
        price: 200,
        profit: 50,
        sales: 900,
        image: "https://m.media-amazon.com/images/I/31DiF1Y6bNL._AC_.jpg",
        desc: "شحن فائق السرعة لهواتف سامسونج الحديثة (A52, S21, S23)، مخرج Type-C."
    },
    {
        id: 304,
        title: "كابل آيفون اصلي (Foxconn) - USB to Lightning",
        category: "شواحن",
        price: 200,
        profit: 50,
        sales: 3000,
        image: "https://static-01.daraz.lk/p/235007227a682a4c6f8e8de884ef860d.jpg",
        desc: "كابل فوكسكون بجودة الأصلي، يدعم نقل البيانات، لا يسبب سخونة."
    },
    {
        id: 305,
        title: "شاحن سيارة معدني صغير من جوي روم JR-CCN05 بقوة 30 واط",
        category: "شواحن",
        price: 150,
        profit: 60,
        sales: 700,
        image: "https://m.media-amazon.com/images/I/61XnMXovr3L._AC_SL1092_.jpg",
        desc: "يدعم الشحن السريع عبر منفذ USB-C PD ومنفذ USB-A، ويدعم الشحن السريع (PD3.0/PPS/QC3.0)، بتصميم صغير الحجم - أسود | ضمان لمدة 12 شهرً"
    },
    {
        id: 306,
        title: "كابل شحن سريع USB قابل للتحويل 4 في 1، طوله 1 متر",
        category: "شواحن",
        price: 200,
        profit: 50,
        sales: 500,
        image: "https://m.media-amazon.com/images/I/71tfpzBBeuL._AC_SL1500_.jpg",
        desc: "وقدرته 65 واط، مصنوع من النايلون المضفر، كابل شحن USB-C، لشحن أجهزة متعددة من الهواتف الذكية والأجهزة اللوحية وأجهزة الكمبيوتر المحمولة"
    },
    {
        id: 307,
        title: "شاحن نينجا دريم بقوة 120 واط",
        category: "شواحن",
        price: 350,
        profit: 100,
        sales: 400,
        image: "https://m.media-amazon.com/images/I/61hFU5ZsG2L._AC_SL1015_.jpg",
        desc: "متعدد الاستخدامات مع موصل 4 في 1، ضمان محلي."
    },
    {
        id: 308,
        title: "شاحن USB وكابل USB-C بقوة 100 واط بتقنية SuperVOOC لهواتف OPPO Reno 10 Pro و 10 Pro+ 5G،",
        category: "شواحن",
        price: 250,
        profit: 80,
        sales: 600,
        image: "https://m.media-amazon.com/images/I/614c8x9h58L._AC_SL1500_.jpg",
        desc: "وكابل شحن سريع من النوع C بقوة 8 أمبير بطول 1 متر لهواتف OPPO Find X6 Pro و X7 Ultra و Realme 11 Pro+ و Realme GT6 و GT Neo"
    },
    {
        id: 309,
        title: "شاحن جداري فائق السرعة من لينوك، ثنائي المنافذ USB-C PD بقدرة 25 واط",
        category: "شواحن",
        price: 200,
        profit: 50,
        sales: 300,
        image: "https://m.media-amazon.com/images/I/41UhzwhXPgL._AC_SL1080_.jpg",
        desc: "يدعم تقنية GaN PD/PPS، متوافق مع هواتف سامسونج جالاكسي S24/S23/S22+/S21 ألترا/بلس/S20/نوت 20/زد فولد 5 (أسود)"
    },
    {
        id: 310,
        title: "وصلة OTG (Type-C) - لتشغيل الفلاشة",
        category: "شواحن",
        price: 35,
        profit: 15,
        sales: 1000,
        image: "https://media.pomegy.com/images/products/1704049154.otg-typec-1.jpg",
        desc: "صغيرة ومهمة، بتخليك توصل فلاشة أو ماوس أو دراع تحكم بالموبايل."
    },
    {
        id: 5,
        title: "كابل LENOK USB C إلى USB C، كابل شحن USB C بقوة 100 واط لأجهزة iPhone 17/17 Air/17 Pro/17 Pro Max/16",
        category: "شواحن",
        price: 200,
        profit: 50,
        sales: 300,
        image: "https://m.media-amazon.com/images/I/71xVafk8vzL._SL1500_.jpg",
        desc: "وMacBook Pro، وiPad Pro، وDell XPS، وSamsung Galaxy S25/S24/S22 Ultra، وSwitch، وPixel، (100 واط، 2 متر)"
    },
    // --- الفئة: باور بنك ---
    {
        id: 401,
        title: "باور بنك جيروم 10000 مللي (JR-T012) - شاشة",
        category: "باور",
        price: 550,
        profit: 100,
        sales: 1200,
        image: "https://f.nooncdn.com/p/pnsku/N70084537V/45/_/1740034206/14e810ae-f86b-498b-9a7b-c9ea82934d5c.jpg?width=800",
        desc: "النسخة الكلاسيكية من جيروم، 2 مخرج USB، شاشة رقمية، خامة قوية جداً."
    },
    {
        id: 403,
        title: "باور بنك أورايمو (Traveler 4) - 20000 مللي",
        category: "باور",
        price: 750,
        profit: 120,
        sales: 800,
        image: "https://f.nooncdn.com/p/pnsku/N70072338V/45/_/1715608890/a02c26c0-ddc9-4de3-8d55-06e8b61ec08f.jpg?width=800",
        desc: "توكيل أورايمو الأصلي، كشاف LED قوي مدمج، تصميم محبب وشيك."
    },
    {
        id: 404,
        title: "باور بنك سمارت (Start) 10000 مللي - نحيف",
        category: "باور",
        price: 500,
        profit: 100,
        sales: 1500,
        image: "https://api.cezma.cloud/storage/thumbnails/products/web/1723322973temp8072114129556678488.png",
        desc: "حجم صغير جداً (Slim) بحجم الكارت، مخرجين شحن، عملي للطوارئ."
    }
];
