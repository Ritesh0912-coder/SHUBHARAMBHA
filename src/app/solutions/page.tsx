"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface CropGuidance {
    id: string;
    cropName: string;
    image?: string;
    problems: string;
    solutions: string;
    usageMethod: string;
    advice: string;
}

export default function SolutionsPage() {
    const [guidances, setGuidances] = useState<CropGuidance[]>([]);
    const [loading, setLoading] = useState(true);

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

    const whatsappMessage = "नमस्कार 🙏 मला श्री गौराई ॲग्रो च्या अनुभवी मार्गदर्शकांकडून माहिती हवी आहे.";
    const whatsappUrl = `https://wa.me/917798693233?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 font-marathi">
                        पीक मार्गदर्शन आणि उपाय (Solutions)
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10">
                        आमच्या अनुभवी मार्गदर्शकांकडून तुमच्या पिकांसाठी अचूक जैविक उपाय आणि तंत्रज्ञान.
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
                    >
                        <FaWhatsapp size={24} />
                        अनुभवी मार्गदर्शकांशी बोला
                    </a>
                </div>
            </section>

            {/* Guidance Content */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-stone-500 font-bold">माहिती लोड होत आहे...</p>
                        </div>
                    ) : guidances.length > 0 ? (
                        <div className="space-y-24">
                            {["पेरू", "डाळिंब", "केळी"].map((crop) => {
                                const cropGuidances = guidances.filter(g => g.cropName === crop);
                                if (cropGuidances.length === 0) return null;

                                return (
                                    <div key={crop} id={crop} className="scroll-mt-32">
                                        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
                                            <div className="h-1.5 w-12 bg-primary rounded-full" />
                                            <h2 className="text-4xl font-black text-stone-900 font-marathi">{crop} (Guidance)</h2>
                                            <div className="flex-grow h-[1px] bg-stone-200 hidden md:block" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-8">
                                            {cropGuidances.map((guidance) => (
                                                <div key={guidance.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all flex flex-col md:flex-row min-h-[400px]">
                                                    {guidance.image && (
                                                        <div className="w-full md:w-2/5 h-72 md:h-auto relative">
                                                            <img
                                                                src={guidance.image}
                                                                alt={guidance.cropName}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className={`p-6 md:p-10 flex flex-col justify-center space-y-6 ${guidance.image ? 'md:w-3/5' : 'w-full'}`}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div>
                                                                <div className="flex items-center gap-2 text-red-500 mb-3">
                                                                    <FaExclamationTriangle size={18} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">समस्या (Problems)</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap">{guidance.problems}</p>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 text-green-600 mb-3">
                                                                    <FaCheckCircle size={18} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">जैविक उपाय (Solutions)</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap">{guidance.solutions}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="bg-stone-50 p-6 rounded-[1.5rem]">
                                                                <div className="flex items-center gap-2 text-primary mb-3">
                                                                    <FaInfoCircle size={18} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">वापरण्याची पद्धत</h4>
                                                                </div>
                                                                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{guidance.usageMethod}</p>
                                                            </div>

                                                            <div className="bg-primary/5 p-6 rounded-[1.5rem] border border-primary/10">
                                                                <div className="flex items-center gap-2 text-primary mb-3">
                                                                    <FaLightbulb size={18} />
                                                                    <h4 className="text-[10px] font-black uppercase tracking-widest">मार्गदर्शन / सल्ला</h4>
                                                                </div>
                                                                <p className="text-stone-800 text-sm font-medium leading-relaxed whitespace-pre-wrap italic">
                                                                    "{guidance.advice}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-stone-100">
                            <FaInfoCircle size={48} className="text-stone-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-stone-900 mb-2">अद्याप कोणतीही माहिती उपलब्ध नाही</h3>
                            <p className="text-stone-500">कृपया थोड्या वेळाने तपासा किंवा मार्गदर्शकांशी थेट संपर्क साधा.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-stone-900 text-white px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-8 font-marathi">काही शंका असल्यास आजच संपर्क साधा!</h2>
                    <p className="text-xl text-stone-400 mb-12 leading-relaxed">
                        तुमच्या बागेतील कोणत्याही समस्येवर श्री गौराई ॲग्रो च्या मार्गदर्शकांकडून मोफत सल्ला मिळवा.
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                    >
                        <FaWhatsapp size={28} />
                        व्हाट्सएप वर मेसेज करा
                    </a>
                </div>
            </section>
        </main>
    );
}
