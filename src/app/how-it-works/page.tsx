import { FaWhatsapp, FaBoxOpen, FaTruck, FaArrowRight } from "react-icons/fa";

export default function HowItWorks() {
    const steps = [
        {
            icon: <FaWhatsapp className="text-4xl text-primary" />,
            title: "१. ऑर्डर नोंदवा",
            desc: "शेतकरी वेबसाइट किंवा WhatsApp वर आमच्या तज्ञांशी संपर्क साधून ऑर्डर नोंदवू शकतात.",
        },
        {
            icon: <FaBoxOpen className="text-4xl text-primary" />,
            title: "२. सुरक्षित पॅकिंग",
            desc: "तुमचे उत्पादन पुणे येथील आमच्या केंद्रातून सुरक्षितपणे पॅक करून पाठवले जाते.",
        },
        {
            icon: <FaTruck className="text-4xl text-primary" />,
            title: "३. घरपोच वितरण",
            desc: "ऑर्डर केल्यानंतर ३-७ दिवसांत उत्पादन थेट तुमच्या शेतात किंवा घरी पोहोचवले जाते.",
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-stone-50 py-24 px-4 border-b border-stone-100">
                <div className="max-w-7xl auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 font-marathi">सोपी ३-टप्प्यांची प्रक्रिया</h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                        आम्ही महाराष्ट्रातील प्रत्येक शेतकऱ्यासाठी खते ऑर्डर करणे सोपे केले आहे. क्लिष्ट फॉर्म नाहीत, फक्त सोपे WhatsApp ऑर्डरिंग.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-stone-100 -translate-y-12 z-0" />

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-2 border-primary flex items-center justify-center mx-auto mb-8 transform hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-4">{step.title}</h3>
                                <p className="text-stone-600 leading-relaxed max-w-xs mx-auto">
                                    {step.desc}
                                </p>
                                {idx < steps.length - 1 && (
                                    <div className="md:hidden flex justify-center py-8">
                                        <FaArrowRight className="text-stone-300 text-2xl rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust section */}
            <section className="bg-primary py-20 px-4 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 italic">"विश्वास - आमचा पाया"</h2>
                    <p className="text-xl text-stone-200 leading-relaxed mb-10">
                        पुणे केंद्रातून बाहेर पडण्यापूर्वी प्रत्येक बाटलीची गुणवत्ता तपासली जाते. आम्ही शेतकऱ्यांच्या कष्टाची जाणीव ठेवतो आणि तुमच्या विश्वासाचा आदर करतो.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <h4 className="font-bold text-xl mb-2">💸 रोख पेमेंट (COD)</h4>
                            <p className="text-stone-300">जेव्हा उत्पादन तुमच्या दारात मिळेल, तेव्हाच पैसे द्या.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <h4 className="font-bold text-xl mb-2">📱 UPI उपलब्ध</h4>
                            <p className="text-stone-300">PhonePe, Google Pay किंवा Paytm द्वारे सोपे पेमेंट.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 text-center">
                <h2 className="text-3xl font-bold text-stone-900 mb-8">सुरुवात करण्यास तयार आहात?</h2>
                <a
                    href="https://wa.me/919876543210?text=मला उत्पादनांबद्दल माहिती हवी आहे आणि ऑर्डर करायची आहे."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp inline-flex justify-center text-xl py-4 px-10"
                >
                    <FaWhatsapp size={24} />
                    WhatsApp वर ऑर्डर सुरू करा
                </a>
            </section>
        </div>
    );
}
