"use client";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    const T: any = t;

    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200">
                                <Image
                                    src="/logo.jpg"
                                    alt="Shubharambha Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-primary leading-tight">{T.nav?.brandName}</h3>
                        </div>
                        <p className="text-stone-600 mb-6 leading-relaxed">
                            {T.footer?.brandDesc}
                        </p>
                        <div className="flex items-center gap-2 text-stone-400 font-bold text-sm tracking-widest uppercase">
                            <span className="w-8 h-px bg-stone-300"></span>
                            Radix International
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-stone-900 mb-6">{T.footer?.quickLinks}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-stone-600 hover:text-primary transition-colors">{T.footer?.home}</Link></li>
                            <li><Link href="/products" className="text-stone-600 hover:text-primary transition-colors">{T.footer?.products}</Link></li>
                            <li><Link href="/about" className="text-stone-600 hover:text-primary transition-colors">{T.footer?.about}</Link></li>
                            <li><Link href="/contact" className="text-stone-600 hover:text-primary transition-colors">{T.footer?.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-stone-900 mb-6 font-marathi">{T.footer?.contactInfo}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-600">
                            <div className="space-y-4">
                                <a href="tel:917798693233" className="flex items-center gap-3 hover:text-primary transition-colors">
                                    <FaWhatsapp className="text-primary" /> +91 77986 93233
                                </a>
                                <a href="mailto:santoshshinde309@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                                    <FaEnvelope className="text-primary" /> santoshshinde309@gmail.com
                                </a>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-primary" /> {T.footer?.location}
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-primary" /> {T.footer?.time}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-400">
                    <p>{T.footer?.copyright}</p>
                    <p className="font-medium text-stone-500">{T.footer?.bottomLocation}</p>
                </div>
            </div>
        </footer>
    );
}
