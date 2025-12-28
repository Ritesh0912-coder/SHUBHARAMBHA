"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

interface SpecialKitCardProps {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
    description?: string;
}

export default function SpecialKitCard({ name, price, image, benefits, description }: SpecialKitCardProps) {
    const whatsappNumber = "917798693233";
    const whatsappMessage = `नमस्कार,
मला शुभारंभ ब्रँडचे ${name} (${price}) घ्यायचे आहे.
कृपया मार्गदर्शन करा.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-100 hover:shadow-2xl transition-all group h-full flex flex-col">
            {/* Image Section */}
            <div className="relative h-72 w-full bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-accent text-white text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-lg">
                    स्पेशल किट
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-stone-900 mb-3 font-marathi">{name}</h3>

                {/* Price Display - For Information Only */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">किंमत (माहितीसाठी)</p>
                    <p className="text-3xl font-black text-primary">{price}</p>
                    <p className="text-xs text-stone-500 mt-1">*ऑनलाइन पेमेंट उपलब्ध नाही</p>
                </div>

                {description && (
                    <p className="text-stone-600 mb-4 leading-relaxed text-sm italic border-l-2 border-primary/20 pl-4">
                        {description}
                    </p>
                )}

                {/* Benefits */}
                <ul className="mb-8 space-y-3 flex-grow">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="text-stone-700 text-sm flex items-start gap-3">
                            <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mt-0.5">✔</span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>

                {/* WhatsApp Order Button */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center py-4 text-lg shadow-lg hover:shadow-2xl transition-all"
                >
                    <FaWhatsapp size={24} />
                    WhatsApp वर ऑर्डर करा
                </a>
            </div>
        </div>
    );
}
