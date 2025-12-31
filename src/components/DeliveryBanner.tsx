"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function DeliveryBanner() {
    const { t } = useLanguage();
    const T: any = t;
    return (
        <div className="bg-brown text-white py-2 px-4 text-center text-sm font-medium">
            <p>{T.deliveryBanner}</p>
        </div>
    );
}
