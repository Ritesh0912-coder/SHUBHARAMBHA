import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                            SHUBHARAMBHA
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-foreground hover:text-primary font-medium">होम</Link>
                        <Link href="/products" className="text-foreground hover:text-primary font-medium">आमची उत्पादने</Link>
                        <Link href="/how-it-works" className="text-foreground hover:text-primary font-medium">कसे कार्य करते</Link>
                        <Link href="/about" className="text-foreground hover:text-primary font-medium">आमच्याबद्दल</Link>
                        <Link href="/contact" className="text-foreground hover:text-primary font-medium tracking-tight">संपर्क</Link>
                        <Link href="/products" className="bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-primary-hover transition-all">
                            ऑर्डर करा
                        </Link>
                    </div>
                    {/* Mobile menu could be added here, keeping it simple for now as requested */}
                    <div className="md:hidden">
                        <Link href="/products" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                            उत्पादने
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
