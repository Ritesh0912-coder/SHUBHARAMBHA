import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
    suitableCrops?: string[];
}

export default function ProductCard({ name, price, image, benefits, id, suitableCrops }: ProductCardProps) {
    const whatsappMessage = `नमस्कार,
मला शुभारंभ ब्रँडचे ${name} (${price}) घ्यायचे आहे.

📍 जिल्हा:
🌾 मुख्य पीक: ${(suitableCrops && suitableCrops.length > 0) ? suitableCrops.join(", ") : ""}
📦 प्रमाण:
📞 मोबाईल:
🏡 पत्ता:

कृपया मार्गदर्शन करा.
धन्यवाद.`;

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
                <p className="text-primary font-bold text-2xl mb-4">₹{price}</p>
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
                        माहिती पाहा
                    </Link>
                    <Link
                        href="/solutions"
                        className="block text-center bg-stone-100 text-stone-600 px-4 py-2.5 rounded-full font-bold hover:bg-stone-200 transition-all"
                    >
                        Solutions / सल्ला
                    </Link>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp w-full justify-center"
                    >
                        <FaWhatsapp size={20} />
                        ऑर्डर करा
                    </a>
                </div>
            </div>
        </div>
    );
}
