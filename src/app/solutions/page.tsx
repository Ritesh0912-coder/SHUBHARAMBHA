"use client";
import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface CropGuidance {
    id: string;
    cropName: string;
    cropName_hi?: string;
    cropName_mr?: string;
    image?: string;
    problems: string;
    problems_hi?: string;
    problems_mr?: string;
    solutions: string;
    solutions_hi?: string;
    solutions_mr?: string;
    usageMethod: string;
    usageMethod_hi?: string;
    usageMethod_mr?: string;
    advice: string;
    advice_hi?: string;
    advice_mr?: string;
}

export default function SolutionsPage() {
    const { t, language } = useLanguage();
    const T: any = t;
    const [guidances, setGuidances] = useState<CropGuidance[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuidance, setSelectedGuidance] = useState<CropGuidance | null>(null);

    const getLocalized = (obj: any, key: string, lang: string): string => {
        if (lang === 'en') return obj[key];
        const localizedKey = `${key}_${lang}`;
        return obj[localizedKey] || obj[key] || "";
    };

    useEffect(() => {
        const fetchGuidances = async () => {
            try {
                const res = await fetch("/api/guidance");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setGuidances(data);
                }
            } catch (error) {
                console.error("Error fetching guidance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuidances();
    }, []);

    const whatsappMessage = T.common?.waMsgHeader || "Hello, I want to inquire about products.";
    const whatsappUrl = `https://wa.me/917798693233?text=${encodeURIComponent(whatsappMessage)}`;

    // Grouping by unique cropName (English key usually)
    const uniqueCrops = Array.from(new Set(guidances.map(g => g.cropName)));

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 font-marathi">
                        {T.solutions?.title}
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10">
                        {T.solutions?.desc}
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
                    >
                        <FaWhatsapp size={24} />
                        {T.solutions?.talkToExpert}
                    </a>
                </div>
            </section>

            {/* Guidance Content */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-stone-500 font-bold">{T.solutions?.loading}</p>
                        </div>
                    ) : guidances.length > 0 ? (
                        <div className="space-y-24">
                            {uniqueCrops.map((cropKey) => {
                                const cropGuidances = guidances.filter(g => g.cropName === cropKey);
                                if (cropGuidances.length === 0) return null;

                                const firstItem = cropGuidances[0];
                                const displayCropName = getLocalized(firstItem, 'cropName', language);

                                return (
                                    <div key={cropKey} id={cropKey} className="scroll-mt-32">
                                        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
                                            <div className="h-0.5 w-4 bg-primary rounded-full" />
                                            <h2 className={`text-xl font-black text-stone-900 ${language !== 'en' ? 'font-marathi' : ''}`}>{displayCropName} {T.solutions?.guidanceSuffix}</h2>
                                            <div className="flex-grow h-[1px] bg-stone-200 hidden md:block" />
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {cropGuidances.map((guidance) => (
                                                <button
                                                    key={guidance.id}
                                                    onClick={() => setSelectedGuidance(guidance)}
                                                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col md:flex-row text-left w-full group focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    {guidance.image && (
                                                        <div className="w-full md:w-1/4 h-32 md:h-auto relative">
                                                            <img
                                                                src={guidance.image}
                                                                alt={displayCropName}
                                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className={`p-5 flex flex-col justify-center ${guidance.image ? 'md:w-3/4' : 'w-full'}`}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 text-red-500 mb-1">
                                                                    <FaExclamationTriangle size={12} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{T.solutions?.problems}</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-sm leading-relaxed font-medium line-clamp-3">{getLocalized(guidance, 'problems', language)}</p>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                                                    <FaCheckCircle size={12} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{T.solutions?.solutions}</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-sm leading-relaxed font-medium line-clamp-3">{getLocalized(guidance, 'solutions', language)}</p>
                                                            </div>
                                                            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                                                                <div className="flex items-center gap-2 text-primary mb-1">
                                                                    <FaInfoCircle size={12} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{T.solutions?.usageMethod}</h4>
                                                                </div>
                                                                <p className="text-stone-700 text-xs leading-relaxed font-semibold italic line-clamp-2">{getLocalized(guidance, 'usageMethod', language)}</p>
                                                            </div>
                                                            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
                                                                <div className="flex items-center gap-2 text-primary mb-1">
                                                                    <FaLightbulb size={12} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{T.solutions?.advice}</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-sm font-black leading-relaxed italic line-clamp-2">
                                                                    "{getLocalized(guidance, 'advice', language)}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-stone-100">
                            <FaInfoCircle size={48} className="text-stone-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-stone-900 mb-2">{T.solutions?.noInfoTitle}</h3>
                            <p className="text-stone-500">{T.solutions?.noInfoDesc}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 bg-stone-900 text-white px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-3xl md:text-5xl font-black mb-8 ${language !== 'en' ? 'font-marathi' : ''}`}>{T.solutions?.footerTitle}</h2>
                    <p className="text-xl text-stone-400 mb-12 leading-relaxed">
                        {T.solutions?.footerDesc}
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                    >
                        <FaWhatsapp size={28} />
                        {T.solutions?.whatsappBtn}
                    </a>
                </div>
            </section>

            {/* Modal Detail View */}
            {selectedGuidance && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedGuidance(null)}
                >
                    <div
                        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedGuidance(null)}
                            className="absolute top-6 right-6 p-3 bg-stone-100 rounded-full text-stone-500 hover:bg-red-50 hover:text-red-500 transition-all z-10"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="flex flex-col">
                            {/* Modal Header/Image */}
                            {selectedGuidance.image && (
                                <div className="w-full h-64 md:h-96 relative">
                                    <img
                                        src={selectedGuidance.image}
                                        alt={getLocalized(selectedGuidance, 'cropName', language)}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                </div>
                            )}

                            {/* Modal Content */}
                            <div className="p-8 md:p-12 -mt-20 relative bg-white rounded-t-[3rem]">
                                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold mb-4">
                                    {getLocalized(selectedGuidance, 'cropName', language)}
                                </div>
                                <h2 className={`text-3xl md:text-5xl font-black text-stone-900 mb-10 ${language !== 'en' ? 'font-marathi' : ''}`}>
                                    {getLocalized(selectedGuidance, 'cropName', language)} {T.solutions?.guidanceSuffix}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                                    <div className="space-y-8">
                                        <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100/50">
                                            <div className="flex items-center gap-3 text-red-500 mb-4">
                                                <FaExclamationTriangle size={20} />
                                                <h4 className="text-xs font-black uppercase tracking-widest">{T.solutions?.problems}</h4>
                                            </div>
                                            <p className="text-stone-800 text-lg leading-relaxed whitespace-pre-wrap">{getLocalized(selectedGuidance, 'problems', language)}</p>
                                        </div>

                                        <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100/50">
                                            <div className="flex items-center gap-3 text-green-600 mb-4">
                                                <FaCheckCircle size={20} />
                                                <h4 className="text-xs font-black uppercase tracking-widest">{T.solutions?.solutions}</h4>
                                            </div>
                                            <p className="text-stone-800 text-lg leading-relaxed whitespace-pre-wrap">{getLocalized(selectedGuidance, 'solutions', language)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                                            <div className="flex items-center gap-3 text-primary mb-4">
                                                <FaInfoCircle size={20} />
                                                <h4 className="text-xs font-black uppercase tracking-widest">{T.solutions?.usageMethod}</h4>
                                            </div>
                                            <p className="text-stone-700 text-base leading-relaxed whitespace-pre-wrap font-medium">{getLocalized(selectedGuidance, 'usageMethod', language)}</p>
                                        </div>

                                        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-inner">
                                            <div className="flex items-center gap-3 text-primary mb-4">
                                                <FaLightbulb size={24} />
                                                <h4 className="text-xs font-black uppercase tracking-widest">{T.solutions?.advice}</h4>
                                            </div>
                                            <p className="text-stone-900 text-xl font-black leading-relaxed italic">
                                                "{getLocalized(selectedGuidance, 'advice', language)}"
                                            </p>
                                        </div>

                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-4 bg-green-500 text-white p-6 rounded-2xl font-black text-xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 mt-4"
                                        >
                                            <FaWhatsapp size={28} />
                                            {T.solutions?.talkToExpert}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main >
    );
}
