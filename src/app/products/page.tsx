"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaWhatsapp, FaLeaf, FaShieldAlt, FaStar, FaCubes, FaFlask, FaCheckCircle, FaListOl } from "react-icons/fa";
import { GiFertilizerBag } from "react-icons/gi";
import { useLanguage } from "@/context/LanguageContext";
import { toEnglishNumerals } from "@/lib/format";

interface Product {
    id: string;
    name: string;
    name_hi?: string;
    name_mr?: string;
    price: string;
    description: string;
    description_hi?: string;
    description_mr?: string;
    benefits?: string[];
    benefits_hi?: string[];
    benefits_mr?: string[];
    usage: string;
    usageMethod?: string;
    usageMethod_hi?: string;
    usageMethod_mr?: string;
    category?: string;
    category_hi?: string;
    category_mr?: string;
    image: string;
    tag: string;
    waMsg?: string;
    isFeatured?: boolean;
}

export default function ProductsPage() {
    const { t, language } = useLanguage();
    const [coreProducts, setCoreProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setCoreProducts(data.map(p => ({
                        ...p,
                        name: p.name,
                        name_hi: p.name_hi,
                        name_mr: p.name_mr,
                        description: p.description,
                        description_hi: p.description_hi,
                        description_mr: p.description_mr,
                        benefits: p.benefits,
                        benefits_hi: p.benefits_hi,
                        benefits_mr: p.benefits_mr,
                        usage: p.usageMethod || "तज्ञांच्या सल्ल्यानुसार वापरा.",
                        usageMethod: p.usageMethod,
                        usageMethod_hi: p.usageMethod_hi,
                        usageMethod_mr: p.usageMethod_mr,
                        tag: p.category || "Bio-Organic",
                        category: p.category,
                        category_hi: p.category_hi,
                        category_mr: p.category_mr,
                        image: p.image || "/product-placeholder.png",
                        price: p.price
                    })));
                } else {
                    // Type-cast static data to ensure compatibility
                    setCoreProducts(staticCoreProducts as Product[]);
                }
            })
            .catch(err => {
                console.error("Products fetch error:", err);
                setCoreProducts(staticCoreProducts as Product[]);
            });
    }, []);

    const staticCoreProducts = [
        {
            id: "nemato",
            name: "Nemato Super Killer",
            name_hi: "निमैटो सुपर किलर",
            name_mr: "निमॅटो सुपर किलर",
            image: "/nemato.png",
            tag: "Bio-Nematicide",
            description: "Highly effective biological solution for root knot nematodes and root rot.",
            description_hi: "जड़ की गांठों और सड़न पर अत्यंत प्रभावी जैविक समाधान।",
            description_mr: "मुळांवरील निमॅटोड (गाठी) आणि मर रोगावर अत्यंत प्रभावी जैविक सोल्यूशन.",
            benefits: ["Reduces nematode impact by 100%", "Stops root rot and wilting", "Protects white roots"],
            benefits_hi: ["निमतौड का प्रभाव १००% कम करता है", "जड़ सड़न और मुरझाना रोकता है", "सफेद जड़ों को सुरक्षित रखता है"],
            benefits_mr: ["नॅमॅटोडचा प्रभाव १००% कमी करते", "मुळकूज आणि कोमेजणे थांबवते", "पांढऱ्या मुळीला सुरक्षित ठेवते"],
            usage: "2-3 ml per liter water Drenching.",
            usageMethod_hi: "२-३ मिली प्रति लीटर पानी में ड्रेंचिंग।",
            usageMethod_mr: "२-३ मिली प्रती लिटर पाण्यातून ड्रेचिंग (Drenching) द्वारे.",
            price: "₹1200"
        },
        {
            id: "rootlix",
            name: "Radix Rootlix",
            name_hi: "रेडिक्स रूटलिक्स",
            name_mr: "रेडिक्स रूटलिक्स",
            image: "/rootlix.png",
            tag: "Root Growth",
            description: "Powerful root stimulator and growth promoter for all crops.",
            description_hi: "सभी फसलों के लिए शक्तिशाली जड़ उत्तेजक और विकास प्रवर्तक।",
            description_mr: "सर्व पिकांसाठी शक्तिशाली मूळ उत्तेजक आणि वाढ प्रवर्तक.",
            benefits: ["Promotes deep root penetration", "Enhances nutrient uptake", "Increases plant immunity"],
            benefits_hi: ["गहरी जड़ प्रवेश को बढ़ावा देता है", "पोषक तत्वों के अवशोषण को बढ़ाता है", "पौधों की प्रतिरक्षा बढ़ाता है"],
            benefits_mr: ["मुळांची खोलवर वाढ होण्यास मदत करते", "अन्नद्रव्य शोषण्याची क्षमता वाढवते", "रोगांपासून संरक्षण करते"],
            usage: "2 ml/Liter for Spraying or 1 Liter/Acre via Drip.",
            usageMethod_hi: "छिड़काव के लिए २ मिली/लीटर या ड्रिप के माध्यम से १ लीटर/एकड़।",
            usageMethod_mr: "फवारणीसाठी २ मिली/लिटर किंवा १ लिटर/एकर ड्रीपद्वारे.",
            price: "₹850"
        },
        {
            id: "biomagic",
            name: "Bio Magic",
            name_hi: "बायो मैजिक",
            name_mr: "बायो मॅजिक",
            image: "/bio-magic.png",
            tag: "Soil Health",
            description: "Revitalizes soil health and activates beneficial microbes.",
            description_hi: "मिट्टी के स्वास्थ्य को पुनर्जीवित करता है और लाभकारी सूक्ष्मजीवों को सक्रिय करता है।",
            description_mr: "जमिनीचे आरोग्य सुधारते आणि उपयुक्त सूक्ष्मजीव सक्रिय करते.",
            benefits: ["Softens hard soil", "Increases water holding capacity", "Neutralizes soil pH"],
            benefits_hi: ["कठोर मिट्टी को नरम करता है", "जल धारण क्षमता बढ़ाता है", "मिट्टी के पीएच को संतुलित करता है"],
            benefits_mr: ["जमीन भुसभुशीत करते", "पाणी धरून ठेवण्याची क्षमता वाढवते", "जमिनीचा सामू (pH) संतुलित करते"],
            usage: "500g - 1kg per Acre.",
            usageMethod_hi: "५०० ग्राम - १ किलो प्रति एकड़।",
            usageMethod_mr: "५०० ग्रॅम - १ किलो प्रति एकर.",
            price: "₹1500"
        }
    ];

    const peruKitDoses = {
        en: [
            { title: "First Dose (The Builder)", desc: "Increases white root length and powers the tree for food storage.", impact: "Root Expansion" },
            { title: "Second Dose (The Protector)", desc: "Breaks nematode knots to start new roots and stops root rot.", impact: "Nematode Free" },
            { title: "Third Dose (The Controller)", desc: "Effective control over pests like Mealybug, Whitefly, and Sticky secretion.", impact: "Disease Control" },
            { title: "Fourth Dose (The Uptake)", desc: "Helps tree absorb nutrition, reducing chemical fertilizer costs.", impact: "Nutrition Uptake" }
        ],
        hi: [
            { title: "पहला डोस (द बिल्डर)", desc: "सफेद जड़ों की लंबाई बढ़ाता है और पेड़ को भोजन जमा करने की शक्ति देता है।", impact: "जड़ विस्तार" },
            { title: "दूसरा डोस (द प्रोटेक्टर)", desc: "निमेटोड की गांठें तोड़कर नई जड़ें शुरू करता है और सड़न रोकता है।", impact: "निमेटोड मुक्ति" },
            { title: "तीसरा डोस (द कंट्रोलर)", desc: "मिलीबग, सफेद मक्खी और चिपचिपापन जैसे रोगों पर प्रभावी नियंत्रण।", impact: "रोग नियंत्रण" },
            { title: "चौथा डोस (द अपटेक)", desc: "पेड़ को पोषण अवशोषित करने में मदद करता है, रासायनिक खर्च कम करता है।", impact: "पोषण वृद्धि" }
        ],
        mr: [
            { title: "पहिला डोस (The Builder)", desc: "पांढऱ्या मुळ्यांची लांबी वाढवून झाडाला अन्न साठवण्यासाठी शक्ती प्रदान करतो.", impact: "मुळांचा विस्तार" },
            { title: "दुसरा डोस (The Protector)", desc: "निमॅटोडच्या गाठी फोडून नवीन मुळ्या सुरू करतो आणि मुळकूज थांबवतो.", impact: "निमॅटोड मुक्ती" },
            { title: "तिसरा डोस (The Controller)", desc: "मिलिबग, पांढरी माशी आणि चिकट्या यांसारख्या रोगांवर प्रभावी नियंत्रण मिळवतो.", impact: "रोग नियंत्रण" },
            { title: "चौथा डोस (The Uptake)", desc: "झाडाला पोषण शोषण्यास मदत करतो, ज्यामुळे रासायनिक औषधांचा खर्च कमी होतो.", impact: "पोषण वाढ" }
        ]
    };

    const getWhatsappUrl = (productName: string) => {
        const msg = `Hello Shree Gaurai Agro, I am interested in ${productName}.\n\nCrop:\nArea:\nVillage:`;
        return `https://wa.me/917798693233?text=${encodeURIComponent(msg)}`;
    };

    const getLocalized = (obj: any, key: string) => {
        if (!obj) return "";
        if (language === 'hi') return obj[`${key}_hi`] || obj[key];
        if (language === 'mr') return obj[`${key}_mr`] || obj[key];
        return obj[key];
    };

    const getLocalizedArray = (obj: any, key: string) => {
        if (!obj) return [];
        if (language === 'hi') return obj[`${key}_hi`] || obj[key] || [];
        if (language === 'mr') return obj[`${key}_mr`] || obj[key] || [];
        return obj[key] || [];
    };

    const currentDoses = peruKitDoses[language] || peruKitDoses.en;
    // t is typed as 'any' safely here to avoid TS errors if interface isn't perfectly matched yet
    const T = t as any;

    return (
        <div className="bg-soft-white min-h-screen">
            {/* Header */}
            <section className="bg-primary pt-24 pb-16 px-4 text-white text-center relative">
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-3xl md:text-5xl font-extrabold mb-4 tracking-tight ${language !== 'en' ? 'font-marathi' : ''}`}>{T.products?.title}</h1>
                    <p className="text-xl text-stone-200 opacity-90 font-medium italic">{T.products?.subtitle}</p>
                </div>
            </section>

            {/* Peru Special Kit Detailed Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-bold mb-6">{T.products?.flagship}</div>
                            <h2 className={`text-3xl md:text-4xl font-bold text-stone-900 mb-6 ${language !== 'en' ? 'font-marathi' : ''}`}>{T.products?.kitTitle}</h2>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                {T.products?.kitDesc}
                            </p>
                            <div className="space-y-6">
                                {currentDoses.map((dose, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-bold text-stone-900">{dose.title}</h4>
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{dose.impact}</span>
                                            </div>
                                            <p className="text-stone-500 text-sm">{dose.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white p-4">
                                <Image src="/peru-kit-card.png" alt="Peru Special Kit Card" fill className="object-contain" />
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-stone-100 max-w-[240px]">
                                <p className="text-xs text-stone-400 font-bold mb-2 uppercase tracking-widest">{T.products?.expectedResult}</p>
                                <p className={`text-stone-800 font-bold ${language !== 'en' ? 'font-marathi' : ''}`}>{T.products?.resultText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Usage Guide Banner */}
            <section className="py-12 bg-stone-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-bounce">
                            <FaListOl size={30} />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold ${language !== 'en' ? 'font-marathi' : ''}`}>{T.products?.howToUse}</h3>
                            <p className="text-stone-400">{T.products?.consultExpert}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-sm font-bold flex-wrap justify-center">
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">{T.products?.spraying}</span>
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">{T.products?.drenching}</span>
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">{T.products?.drip}</span>
                    </div>
                </div>
            </section>

            {/* Detailed Product List */}
            <section className="py-16 px-4 bg-soft-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                        {coreProducts.map((p) => (
                            <div key={p.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 flex flex-col lg:flex-row gap-8 hover:shadow-lg transition-all">
                                <div className="lg:w-2/5 flex flex-col items-center">
                                    <div className="relative w-full aspect-square bg-stone-50 rounded-[2rem] overflow-hidden p-8 flex items-center justify-center mb-6">
                                        <Image src={p.image} alt={getLocalized(p, 'name')} fill className="object-contain" />
                                        <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                            {getLocalized(p, 'category') || p.tag}
                                        </div>
                                    </div>
                                    <div className="w-full bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center">
                                        <span className="block text-primary font-bold text-xs mb-1 uppercase tracking-widest leading-none">{T.products?.methodUsage}</span>
                                        <p className={`text-stone-800 font-bold text-sm ${language !== 'en' ? 'font-marathi' : ''}`}>{getLocalized(p, 'usageMethod') || p.usage}</p>
                                    </div>
                                </div>
                                <div className="lg:w-3/5 flex flex-col">
                                    <h3 className={`text-3xl font-bold text-stone-900 mb-2 leading-tight ${language !== 'en' ? 'font-marathi' : ''}`}>{getLocalized(p, 'name')}</h3>
                                    <p className="text-primary font-bold text-2xl mb-6">{T.common?.priceInfo ? `${T.common.priceInfo}: ` : ""}{toEnglishNumerals(p.price)}</p>
                                    <p className="text-stone-500 text-lg mb-8 leading-relaxed italic border-l-2 border-primary/20 pl-6">
                                        {getLocalized(p, 'description')}
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {(getLocalizedArray(p, 'benefits')).map((pt: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 text-stone-700 font-medium">
                                                <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <FaCheckCircle size={12} />
                                                </span>
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={getWhatsappUrl(getLocalized(p, 'name'))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp w-full justify-center py-4 text-lg shadow-lg hover:shadow-2xl translate-y-0 hover:-translate-y-1 transition-all"
                                    >
                                        <FaWhatsapp size={24} />
                                        {T.products?.contactForInfo}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Impact Proof Gallery */}
            <section className="py-24 bg-white px-4 border-t border-stone-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi underline decoration-primary decoration-4 underline-offset-8">{T.products?.impactEvidence}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/dalimb-impact.png" alt="Dalimb Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">Dalimb</div>
                        </div>
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/peru-impact.png" alt="Peru Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">Peru</div>
                        </div>
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/peru-harvest.png" alt="Harvest Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">Harvest</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary / Trust */}
            <footer className="py-24 bg-stone-950 text-white px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-3 mb-10 text-accent font-bold tracking-[0.3em] uppercase text-xs">
                        <span className="w-8 h-px bg-accent/30" />
                        Gaurai Agro Expertise
                        <span className="w-8 h-px bg-accent/30" />
                    </div>
                    <h2 className="text-4xl font-bold mb-10 font-marathi">{T.products?.footerTitle}</h2>
                    <p className="text-stone-400 mb-12 text-lg leading-relaxed italic">
                        {T.products?.footerDesc}
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60">
                        <div className="flex items-center gap-2"><FaFlask /> Govt. Accredited</div>
                        <div className="flex items-center gap-2"><GiFertilizerBag /> Bio-Logic Formula</div>
                        <div className="flex items-center gap-2"><FaLeaf /> Eco-Friendly</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
