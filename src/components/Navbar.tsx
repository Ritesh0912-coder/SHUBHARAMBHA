"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { FaGlobe, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
    const { t, language, setLanguage } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLang = () => setIsLangOpen(!isLangOpen);

    const selectLang = (lang: 'en' | 'hi' | 'mr') => {
        setLanguage(lang);
        setIsLangOpen(false);
    };

    const langNames = {
        en: "EN",
        hi: "HI",
        mr: "MR"
    };

    return (
        <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image
                                    src="/logo.jpg"
                                    alt="Shubharambha Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-primary tracking-tight leading-tight hidden lg:block">
                                {t.nav.brandName} <br />
                                <span className="text-[10px] text-stone-500 font-medium">{t.nav.brandSub}</span>
                            </span>
                            <span className="text-lg font-bold text-primary tracking-tight md:hidden">
                                {t.nav.brandName}
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                        <Link href="/" className="text-stone-700 hover:text-primary font-medium text-sm lg:text-base">{t.nav.home}</Link>
                        <Link href="/products" className="text-stone-700 hover:text-primary font-medium text-sm lg:text-base">{t.nav.products}</Link>

                        <Link href="/about" className="text-stone-700 hover:text-primary font-medium text-sm lg:text-base">{t.nav.about}</Link>


                        <Link href="/solutions" className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-bold hover:bg-stone-50 transition-all text-sm lg:text-base whitespace-nowrap">
                            {t.nav.solutions}
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors border border-stone-200"
                            >
                                <FaGlobe className="text-stone-500 text-sm" />
                                <span className="font-bold text-stone-700 text-xs">{langNames[language]}</span>
                                <FaChevronDown className={`text-[10px] text-stone-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden py-1 z-50">
                                    <button onClick={() => selectLang('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${language === 'en' ? 'text-primary font-bold' : 'text-stone-600'}`}>
                                        English
                                    </button>
                                    <button onClick={() => selectLang('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${language === 'hi' ? 'text-primary font-bold' : 'text-stone-600'}`}>
                                        हिंदी
                                    </button>
                                    <button onClick={() => selectLang('mr')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${language === 'mr' ? 'text-primary font-bold' : 'text-stone-600'}`}>
                                        मराठी
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/products" className="bg-primary text-white px-4 lg:px-6 py-2 rounded-full font-bold text-sm lg:text-base hover:bg-primary-hover transition-all shadow-md active:scale-95">
                            {t.nav.order}
                        </Link>
                    </div>
                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center gap-3">
                        <button onClick={toggleLang} className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-full border border-stone-200">
                            <FaGlobe className="text-stone-500 text-sm" />
                            <span className="font-bold text-stone-700 text-xs">{langNames[language]}</span>
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-primary hover:bg-stone-100 rounded-lg transition-colors border-2 border-primary/10"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile language dropdown overlay */}
            {isLangOpen && (
                <div className="md:hidden absolute top-20 right-4 w-32 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden py-1 z-[60]">
                    <button onClick={() => selectLang('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">English</button>
                    <button onClick={() => selectLang('hi')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">हिंदी</button>
                    <button onClick={() => selectLang('mr')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">मराठी</button>
                </div>
            )}

            {/* Mobile menu drawer */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-stone-100 shadow-2xl z-50 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <div className="flex flex-col p-6 gap-2">
                        <Link href="/" className="text-stone-700 hover:text-primary font-bold py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
                        <Link href="/products" className="text-stone-700 hover:text-primary font-bold py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.products}</Link>
                        <Link href="/#videos" className="text-stone-700 hover:text-primary font-bold py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.videos}</Link>
                        <Link href="/about" className="text-stone-700 hover:text-primary font-bold py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</Link>
                        <Link href="/contact" className="text-stone-700 hover:text-primary font-bold py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</Link>

                        <div className="h-px bg-stone-100 my-2" />

                        <Link href="/solutions" className="border-2 border-primary text-primary px-4 py-4 rounded-2xl font-bold text-center hover:bg-stone-50 transition-all text-lg mb-2" onClick={() => setIsMenuOpen(false)}>
                            {t.nav.solutions}
                        </Link>

                        <Link href="/products" className="bg-primary text-white px-6 py-4 rounded-2xl font-bold text-center shadow-lg hover:bg-primary-hover active:scale-95 transition-all text-lg" onClick={() => setIsMenuOpen(false)}>
                            {t.nav.order}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
