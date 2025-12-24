import Image from "next/image";
import { FaSeedling, FaHandsHelping, FaCheckCircle, FaAward } from "react-icons/fa";

export default function AboutPage() {
    const values = [
        {
            icon: <FaSeedling className="text-primary text-3xl" />,
            title: "जैविक क्रांती",
            desc: "रासायनिक खतांचा वापर कमी करून जमिनीला पुन्हा जिवंत करणे हा आमचा ध्यास आहे.",
        },
        {
            icon: <FaHandsHelping className="text-primary text-3xl" />,
            title: "वैयक्तिक लक्ष",
            desc: "आमची प्रत्येक टीम शेतकऱ्यांच्या प्रत्यक्ष बागेवर जाऊन समस्या समजून घेते.",
        },
        {
            icon: <FaAward className="text-primary text-3xl" />,
            title: "शुद्धता",
            desc: "प्रत्येक उत्पादनात १००% नैसर्गिक अर्क आणि सुरक्षित सेंद्रिय घटक असतात.",
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Intro */}
            <section className="py-24 px-4 bg-stone-50 border-b border-stone-100">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">आमची ओळख | About Us</span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-8 leading-tight font-marathi">
                            शुभारंभ – <br />
                            <span className="text-primary italic">Gaurai Agro Consultancy</span>
                        </h1>
                        <p className="text-xl text-stone-600 leading-relaxed mb-6">
                            पुणे आणि बारामती परिसरातील शेतकऱ्यांच्या समस्यांना जैविक उत्तर देण्यासाठी आम्ही काम करतो. संतोष शिंदे यांच्या मार्गदर्शनाखाली शेकडो डाळिंब व पेरूच्या बागा आज यशस्वीरीत्या बहरत आहेत.
                        </p>
                    </div>
                </div>
            </section>

            {/* Brand Context Section */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-marathi">आमचा उद्देश (Mission)</h2>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                शेतकऱ्यांना विज्ञानावर आधारित परंतु नैसर्गिकरित्या सुरक्षित जैविक उत्पादने पुरवणे हा आमचा उद्देश आहे. निव्वळ व्यापार न करता शेतकऱ्यांच्या समृद्धीत वाटा उचलणे हीच आमची कमाई आहे.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 font-bold text-stone-800">
                                    <FaCheckCircle className="text-primary" /> १००% जैविक उत्पादने
                                </li>
                                <li className="flex items-center gap-3 font-bold text-stone-800">
                                    <FaCheckCircle className="text-primary" /> पिकांसाठी व पर्यावरणासाठी सुरक्षित
                                </li>
                                <li className="flex items-center gap-3 font-bold text-stone-800">
                                    <FaCheckCircle className="text-primary" /> तज्ञांच्या मार्गदर्शनाखाली निर्मिती
                                </li>
                            </ul>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <video className="w-full h-full object-cover" controls>
                                <source src="/about-video.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-4 bg-soft-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl border border-stone-100 shadow-sm text-center md:text-left">
                                <div className="mb-6 flex justify-center md:justify-start">
                                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center">
                                        {v.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-4 font-marathi">{v.title}</h3>
                                <p className="text-stone-600 leading-relaxed">
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Pride */}
            <section className="py-24 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative text-white overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-2/3">
                                <h2 className="text-4xl font-bold mb-6 font-marathi underline decoration-accent underline-offset-8">पुणे, बारामती आणि महाराष्ट्राचा विश्वास.</h2>
                                <p className="text-xl text-stone-200 leading-relaxed mb-10 italic">
                                    "आम्ही स्थानिक भाषेत आणि स्थानिक परिस्थितीनुसार शेतकऱ्यांशी संवाद साधतो. इंदापूरच्या ऊसापासून ते बारामतीच्या डाळिंबापर्यंत, आम्ही प्रत्येक मातीचा इतिहास जाणून आहोत."
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full font-bold">📍 बारामती</span>
                                    <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full font-bold">📍 इंदापूर</span>
                                    <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full font-bold">📍 फलटण</span>
                                    <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full font-bold">📍 नगर</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
