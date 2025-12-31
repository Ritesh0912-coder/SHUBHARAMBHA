"use client";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { toEnglishNumerals } from "@/lib/format";

interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
    suitableCrops?: string[];
}

export default function ProductCard({ name, price, image, benefits, id, suitableCrops }: ProductCardProps) {
    const { t } = useLanguage();
    const T: any = t;

    const whatsappMessage = `${T.common?.waMsgHeader}
    
${T.common?.waProductLabel}: ${name} (${price})

📍 ${T.common?.waDistrictLabel}:
🌾 ${T.common?.waCropLabel}: ${(suitableCrops && suitableCrops.length > 0) ? suitableCrops.join(", ") : ""}
📦 Quantum:
📞 Mobile:
🏡 Address:

${T.common?.waAdviceRequest}`;

    const whatsappUrl = `https://wa.me/917798693233?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="rural-card flex flex-col h-full bg-white shadow-lg rounded-[2.5rem] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all">
            <div className="relative h-64 w-full bg-stone-50 p-6">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain"
                />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{name}</h3>
                <p className="text-primary font-bold text-2xl mb-4">{toEnglishNumerals(price)}</p>
                <ul className="mb-6 space-y-2 flex-grow">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="text-stone-600 text-sm flex items-start gap-2 text-left">
                            <span className="text-accent">✔</span> {benefit}
                        </li>
                    ))}
                </ul>
                <div className="space-y-3">
                    <Link
                        href={`/products#${id}`}
                        className="block text-center border border-primary text-primary px-4 py-2.5 rounded-full font-bold hover:bg-stone-50 transition-all"
                    >
                        {T.common?.viewDetails}
                    </Link>
                    <Link
                        href="/solutions"
                        className="block text-center bg-stone-100 text-stone-600 px-4 py-2.5 rounded-full font-bold hover:bg-stone-200 transition-all"
                    >
                        {T.common?.solutionsAdvice}
                    </Link>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp w-full justify-center"
                    >
                        <FaWhatsapp size={20} />
                        {T.common?.orderNow}
                    </a>
                </div>
            </div>
        </div>
    );
}
