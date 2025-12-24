import Link from "next/link";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold text-primary mb-4">शुभारंभ</h3>
                        <p className="text-stone-600 mb-6 leading-relaxed">
                            Gaurai Agro Consultancy तर्फे शेतकऱ्यांसाठी विश्वासार्ह जैविक उपक्रम. "एक चांगली सुरुवात" - समृद्धीकडे.
                        </p>
                        <div className="flex items-center gap-2 text-stone-400 font-bold text-sm tracking-widest uppercase">
                            <span className="w-8 h-px bg-stone-300"></span>
                            Santosh Shinde
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-stone-900 mb-6">जलद दुवे</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-stone-600 hover:text-primary transition-colors">होम</Link></li>
                            <li><Link href="/products" className="text-stone-600 hover:text-primary transition-colors">आमची उत्पादने</Link></li>
                            <li><Link href="/about" className="text-stone-600 hover:text-primary transition-colors">आमच्याबद्दल</Link></li>
                            <li><Link href="/contact" className="text-stone-600 hover:text-primary transition-colors">संपर्क</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-stone-900 mb-6 font-marathi">संपर्क माहिती (Contact Info)</h4>
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
                                    <FaMapMarkerAlt className="text-primary" /> बारामती, पुणे, महाराष्ट्र
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-primary" /> सकाळी 9 ते संध्याकाळी 7
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-400">
                    <p>© {new Date().getFullYear()} Gaurai Agro Consultancy - SHUBHARAMBHA. सर्व हक्क राखीव.</p>
                    <p className="font-medium text-stone-500">पुणे, इंदापूर, बारामती क्षेत्रासाठी समर्पित.</p>
                </div>
            </div>
        </footer>
    );
}
