"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaWhatsapp, FaLeaf, FaShieldAlt, FaStar, FaCubes, FaFlask, FaCheckCircle, FaListOl } from "react-icons/fa";
import { GiFertilizerBag } from "react-icons/gi";

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    benefits?: string[];
    points?: string[];
    usage: string;
    image: string;
    tag: string;
    waMsg?: string;
    isFeatured?: boolean;
}

export default function ProductsPage() {
    const [coreProducts, setCoreProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setCoreProducts(data.map(p => ({
                        ...p,
                        points: p.benefits || [],
                        tag: p.category || "Bio-Organic",
                        usage: p.usageMethod || "तज्ञांच्या सल्ल्यानुसार वापरा.",
                        description: p.description || "High quality bio-product."
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
            name: "Nemato Super Killer (निमॅटो किलर)",
            image: "/nemato.png",
            tag: "Bio-Nematicide",
            description: "मुळांवरील निमॅटोड (गाठी) आणि मर रोगावर अत्यंत प्रभावी जैविक सोल्यूशन. मातीतील हानिकारक सूक्ष्मजीव नष्ट करते.",
            points: [
                "नॅमॅटोडचा प्रभाव १००% कमी करते",
                "मुळकूज आणि कोमेजणे थांबवते",
                "पांढऱ्या मुळीला सुरक्षित ठेवते"
            ],
            usage: "२-३ मिली प्रती लिटर पाण्यातून ड्रेचिंग (Drenching) द्वारे."
        },
        {
            id: "k-lifter",
            name: "K-Lifter (के-लिफ्टर)",
            image: "/k-lifter.png",
            tag: "Potash Mobilizer",
            description: "फळांच्या उत्तम फुगवणीसाठी आणि चकाकीसाठी विशेषतः तयार केलेले पोटॅश मोबिलायझर.",
            points: [
                "फळांचा आकार आणि वजन वाढवते",
                "फळांना उत्तम रंग आणि गोडवा देते",
                "जमिनीतील स्थिर पालाश उपलब्ध करून देते"
            ],
            usage: "२.५ मिली प्रती लिटर पाण्यातून फवारणी किंवा ड्रीप."
        },
        {
            id: "rootlix",
            name: "Rootlix (रूटलिक्स् - पाकीट)",
            image: "/product-group.png",
            tag: "Root Developer",
            description: "पांढऱ्या मुळ्यांच्या जोमदार वाढीसाठी विशेष पावडर. पिकाला जमिनीत घट्ट पकड मिळवून देते.",
            points: [
                "मुळ्यांची वेगाने वाढ करते",
                "अन्नद्रव्य शोषण्याचे प्रमाण वाढते",
                "अडचणीच्या काळात पिकाला आधार देते"
            ],
            usage: "५०० ग्रॅम प्रती एकर ड्रीप किंवा पाण्यासोबत."
        },
        {
            id: "bio-magic",
            name: "Bio-Magic (बायो-मॅजिक)",
            image: "/bio-magic.png",
            tag: "Flower Booster",
            description: "भरघोस फुलधारणेसाठी आणि कळ्या टिकवण्यासाठी नैसर्गिकरीत्या तयार केलेले बूस्टर.",
            points: [
                "फुलगळ थांबवते आणि नवीन फुले आणते",
                "फुलांचे फळात रूपांतर करण्याचे प्रमाण वाढवते",
                "सर्व फळभाज्यांसाठी अत्यंत योग्य"
            ],
            usage: "२ मिली प्रती लिटर पाण्यातून फुलधारणेच्या आधी."
        }
    ];

    const peruKitDoses = [
        {
            title: "पहिला डोस (The Builder)",
            desc: "पांढऱ्या मुळ्यांची लांबी वाढवून झाडाला अन्न साठवण्यासाठी शक्ती प्रदान करतो.",
            impact: "मुळांचा विस्तार"
        },
        {
            title: "दुसरा डोस (The Protector)",
            desc: "निमॅटोडच्या गाठी फोडून नवीन मुळ्या सुरू करतो आणि मुळकूज थांबवतो.",
            impact: "निमॅटोड मुक्ती"
        },
        {
            title: "तिसरा डोस (The Controller)",
            desc: "मिलिबग, पांढरी माशी आणि चिकट्या यांसारख्या रोगांवर प्रभावी नियंत्रण मिळवतो.",
            impact: "रोग नियंत्रण"
        },
        {
            title: "चौथा डोस (The Uptake)",
            desc: "झाडाला पोषण शोषण्यास मदत करतो, ज्यामुळे रासायनिक औषधांचा खर्च कमी होतो.",
            impact: "पोषण वाढ"
        }
    ];

    const getWhatsappUrl = (productName: string) => {
        const msg = `नमस्कार,
मला श्री गौराई ॲग्रो कंपनीचे उत्पादन घ्यायचे आहे.

उत्पादन नाव: ${productName}
पिकाचे नाव: 
क्षेत्र (एकर): 
गाव: 

कृपया योग्य मार्गदर्शन करा. धन्यवाद.`;
        return `https://wa.me/917798693233?text=${encodeURIComponent(msg)}`;
    };

    return (
        <div className="bg-soft-white min-h-screen">
            {/* Header */}
            <section className="bg-primary pt-24 pb-16 px-4 text-white text-center relative">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-marathi tracking-tight">उत्पादन प्रगती - श्री गौराई ॲग्रो</h1>
                    <p className="text-xl text-stone-200 opacity-90 font-medium italic">"योग्य नियोजन, शाश्वत उत्पादन."</p>
                </div>
            </section>

            {/* Peru Special Kit Detailed Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-bold mb-6">Flagship Solution</div>
                            <h2 className="text-4xl font-bold text-stone-900 mb-6 font-marathi">श्री गौराई ॲग्रो पेरू स्पेशल कीट</h2>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                आता पेरूवरील प्रत्येक रोगासाठी वेगळे औषध खरेदी करण्याची गरज नाही. आमचे हे कीट ४ टप्प्यात संपूर्ण बागेचे आरोग्य सुधारते.
                            </p>
                            <div className="space-y-6">
                                {peruKitDoses.map((dose, i) => (
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
                                <p className="text-xs text-stone-400 font-bold mb-2 uppercase tracking-widest">Expected Result</p>
                                <p className="text-stone-800 font-bold font-marathi">भरघोस उत्पादन आणि जमिनीला कोणतीही हानी नाही.</p>
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
                            <h3 className="text-2xl font-bold font-marathi">कसे वापरावे? (How to Use)</h3>
                            <p className="text-stone-400">उत्तम परिणामांसाठी कृषी तज्ञांचा सल्ला घ्या.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-sm font-bold">
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">फवारणी (Spraying)</span>
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">ड्रेचिंग (Drenching)</span>
                        <span className="px-6 py-3 bg-white/10 rounded-full border border-white/10">ड्रीप (Drip)</span>
                    </div>
                </div>
            </section>

            {/* Detailed Product List */}
            <section className="py-24 px-4 bg-soft-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                        {coreProducts.map((p) => (
                            <div key={p.id} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-stone-100 flex flex-col lg:flex-row gap-10 hover:shadow-xl transition-all">
                                <div className="lg:w-2/5 flex flex-col items-center">
                                    <div className="relative w-full aspect-square bg-stone-50 rounded-[2rem] overflow-hidden p-8 flex items-center justify-center mb-6">
                                        <Image src={p.image} alt={p.name} fill className="object-contain" />
                                        <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                            {p.tag}
                                        </div>
                                    </div>
                                    <div className="w-full bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center">
                                        <span className="block text-primary font-bold text-xs mb-1 uppercase tracking-widest leading-none">Method of Usage</span>
                                        <p className="text-stone-800 font-bold text-sm font-marathi">{p.usage}</p>
                                    </div>
                                </div>
                                <div className="lg:w-3/5 flex flex-col">
                                    <h3 className="text-3xl font-bold text-stone-900 mb-2 font-marathi leading-tight">{p.name}</h3>
                                    <p className="text-primary font-bold text-2xl mb-6">Price: {p.price}</p>
                                    <p className="text-stone-500 text-lg mb-8 leading-relaxed italic border-l-2 border-primary/20 pl-6">
                                        {p.description}
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {(p.points || []).map((pt, i) => (
                                            <li key={i} className="flex items-start gap-4 text-stone-700 font-medium">
                                                <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                                    <FaCheckCircle size={12} />
                                                </span>
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={getWhatsappUrl(p.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp w-full justify-center py-4 text-lg shadow-lg hover:shadow-2xl translate-y-0 hover:-translate-y-1 transition-all"
                                    >
                                        <FaWhatsapp size={24} />
                                        माहितीसाठी संपर्क करा
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
                        <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi underline decoration-primary decoration-4 underline-offset-8">प्रत्यक्ष परिणाम (Impact Evidence)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/dalimb-impact.png" alt="Dalimb Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">डाळिंब</div>
                        </div>
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/peru-impact.png" alt="Peru Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">पेरू</div>
                        </div>
                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg group">
                            <Image src="/peru-harvest.png" alt="Harvest Success" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-sm">भरघोस उत्पादन</div>
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
                    <h2 className="text-4xl font-bold mb-10 font-marathi">"तुमच्या कष्टाला जैविक सोन्याची जोड!"</h2>
                    <p className="text-stone-400 mb-12 text-lg leading-relaxed italic">
                        आमची सर्व उत्पादने Radix Internals तर्फे प्रमाणित आणि जैविक आहेत. पर्यावरणाचे रक्षण करत भरघोस उत्पादन मिळवा.
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
