import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";

export default function ContactPage() {
    const contactPoints = [
        {
            icon: <FaWhatsapp className="text-3xl text-primary" />,
            title: "आमचा नंबर",
            info: "+91 77986 93233",
            sub: "सकाळी 9 ते संध्याकाळी 7",
            link: "https://wa.me/917798693233"
        },
        {
            icon: <FaEnvelope className="text-3xl text-primary" />,
            title: "ईमेल",
            info: "santoshshinde309@gmail.com",
            sub: "कोणत्याही शंकांसाठी संपर्क करा",
            link: "mailto:santoshshinde309@gmail.com"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-primary" />,
            title: "पत्ता (Address)",
            info: "Gaurai Agro Consultancy",
            sub: "बारामती, पुणे, महाराष्ट्र",
            link: "#"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-primary pt-24 pb-16 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-marathi">संपर्क करा (Contact Us)</h1>
                    <p className="text-xl text-stone-200">तुमच्या बागेसाठी योग्य सल्ल्याची गरज आहे? आम्ही एका कॉलवर उपलब्ध आहोत.</p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactPoints.map((point, idx) => (
                            <a
                                key={idx}
                                href={point.link}
                                className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-200 text-center hover:shadow-xl transition-all group"
                            >
                                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">
                                    {point.icon}
                                </div>
                                <h3 className="text-lg font-bold text-stone-400 mb-2 uppercase tracking-widest">{point.title}</h3>
                                <p className="text-2xl font-bold text-stone-900 mb-2 font-marathi">{point.info}</p>
                                <p className="text-stone-500">{point.sub}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Message and Guidance */}
            <section className="py-24 px-4 bg-soft-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-100">
                            <h2 className="text-4xl font-bold text-stone-900 mb-8 font-marathi">तज्ञ मार्गदर्शन घ्या</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">पीक नियोजन</h4>
                                        <p className="text-stone-600 leading-relaxed font-marathi">छाटणीपासून ते फळ काढणीपर्यंतच्या सर्व अवस्थांचे सूक्ष्म नियोजन.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">किड व रोग नियंत्रण</h4>
                                        <p className="text-stone-600 leading-relaxed font-marathi">जैविक पद्धतीने किड व रोगांवर १००% मात करण्यासाठी सल्ला.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                <FaClock className="absolute -bottom-6 -right-6 text-white/5 text-8xl" />
                                <p className="font-bold text-lg mb-2">उपलब्ध वेळ:</p>
                                <p className="text-primary text-2xl font-bold">सकाळी 09:00 - संध्याकाळी 07:00</p>
                                <p className="mt-4 text-stone-400 italic">प्रत्येक रविवार - सुट्टी असू शकते.</p>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="inline-block bg-primary text-white p-3 rounded-2xl mb-8">
                                <FaWhatsapp size={48} />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-8 leading-tight font-marathi">
                                श्री गौराई ॲग्रो चे <br />
                                <span className="text-primary italic">थेट WhatsApp</span> <br />
                                द्वारे मार्गदर्शन
                            </h2>
                            <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-lg">
                                आम्ही उत्पादनांचा केवळ पुरवठा करत नाही, तर ते कसे वापरावेत याचे संपूर्ण तंत्र आपल्याला WhatsApp वर देतो.
                            </p>
                            <a
                                href="https://wa.me/917798693233?text=नमस्कार, मला माझ्या बागेसाठी योग्य मार्गदर्शनाची आवशक्यता आहे."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp text-2xl px-12 py-5 justify-center inline-flex shadow-2xl"
                            >
                                आमच्याशी बोला
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Working Areas */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-stone-400 font-bold uppercase tracking-[0.5em] mb-8">Serving Areas</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {['बारामती', 'इंदापूर', 'फलटण', 'आटपाडी', 'पुणे', 'नगर'].map((city, i) => (
                            <div key={i} className="bg-stone-50 border border-stone-200 px-8 py-3 rounded-full text-stone-600 font-bold">
                                {city}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
