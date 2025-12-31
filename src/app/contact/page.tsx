"use client";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { t } = useLanguage();
    const T: any = t;

    const contactPoints = [
        {
            icon: <FaWhatsapp className="text-3xl text-primary" />,
            title: T.contact?.phoneTitle,
            info: "+91 77986 93233",
            sub: T.contact?.phoneSub,
            link: "https://wa.me/917798693233"
        },
        {
            icon: <FaEnvelope className="text-3xl text-primary" />,
            title: T.contact?.emailTitle,
            info: "santoshshinde309@gmail.com",
            sub: T.contact?.emailSub,
            link: "mailto:santoshshinde309@gmail.com"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-primary" />,
            title: T.contact?.addressTitle,
            info: "Radix International",
            sub: "Pune, Maharashtra, India",
            link: "#"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-primary pt-24 pb-16 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-marathi">{T.contact?.title}</h1>
                    <p className="text-xl text-stone-200">{T.contact?.desc}</p>
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
                            <h2 className="text-4xl font-bold text-stone-900 mb-8 font-marathi">{T.contact?.expertGuidance}</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{T.contact?.cropPlanning}</h4>
                                        <p className="text-stone-600 leading-relaxed font-marathi">{T.contact?.cropPlanningDesc}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{T.contact?.pestControl}</h4>
                                        <p className="text-stone-600 leading-relaxed font-marathi">{T.contact?.pestControlDesc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                <FaClock className="absolute -bottom-6 -right-6 text-white/5 text-8xl" />
                                <p className="font-bold text-lg mb-2">{T.contact?.availableTime}</p>
                                <p className="text-primary text-2xl font-bold">{T.contact?.timeRange}</p>
                                <p className="mt-4 text-stone-400 italic">{T.contact?.sundayNote}</p>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="inline-block bg-primary text-white p-3 rounded-2xl mb-8">
                                <FaWhatsapp size={48} />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-8 leading-tight font-marathi">
                                {T.contact?.whatsappTitle} <br />
                                <span className="text-primary italic">{T.contact?.whatsappSub}</span> <br />
                                {T.contact?.whatsappEnd}
                            </h2>
                            <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-lg">
                                {T.contact?.whatsappDesc}
                            </p>
                            <a
                                href="https://wa.me/917798693233?text=Hello, I need guidance for my farm."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp text-2xl px-12 py-5 justify-center inline-flex shadow-2xl"
                            >
                                {T.contact?.chatBtn}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Working Areas */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-stone-400 font-bold uppercase tracking-[0.5em] mb-8">{T.contact?.servingAreas}</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {T.contact?.cities.map((city: string, i: number) => (
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
