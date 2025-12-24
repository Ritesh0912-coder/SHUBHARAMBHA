"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
    const phoneNumber = "917798693233"; // Updated to Santosh Shinde's number
    const message = "नमस्कार 🙏, मला शुभारंभ कंपनीच्या उत्पादनांबद्दल माहिती हवी आहे.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            aria-label="Contact us on WhatsApp"
        >
            <FaWhatsapp size={32} />
            <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-stone-100">
                आमच्याशी बोला
            </span>
        </a>
    );
}
