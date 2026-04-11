/**
 * =====================================================
 * قاعدة بيانات المنتجات - data.js
 * =====================================================
 * في هذا الملف، نحتفظ بقائمة كاملة بجميع المنتجات المتاحة للبيع
 * كل منتج حيحتوي على:
 *   - id: معرف فريد للمنتج
 *   - title: اسم المنتج
 *   - category: الفئة (ساعات، سماعات، شواحن، باور)
 *   - price: السعر الجملة (السعر اللي تشتري به)
 *   - profit: الربح المقترح (الفرق بينك وبين العميل)
 *   - sales: عدد المبيعات الكلية (الإحصائيات)
 *   - image: رابط الصورة من الإنترنت
 *   - desc: وصف المنتج (المميزات)
 */

// --- قائمة جميع المنتجات ---
const products = [
    // ======= فئة الساعات الذكية (ساعات) =======
    {
        id: 101,
        title: "ساعة ذكية T800 Ultra - شاشة كاملة",
        category: "ساعات",
        price: 350,          // تشتري الساعة بـ 350 ج.م
        profit: 100,         // تبيعها باضافة 100 ج.م ربح
        sales: 520,          // بيعت 520 ساعة من هذا النوع
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=500&q=80",
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

    // ======= فئة السماعات (سماعات) =======
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

    // ======= فئة الشواحن (شواحن) =======
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

    // ======= فئة البطاريات الخارجية (باور) =======
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
