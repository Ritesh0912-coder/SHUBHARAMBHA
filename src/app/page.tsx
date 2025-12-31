"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import SpecialKitCard from "@/components/SpecialKitCard";
import FarmerVideos from "@/components/FarmerVideos";
import { FaWhatsapp, FaArrowRight, FaLeaf, FaShieldAlt, FaTruck, FaCheckCircle, FaUserTie, FaQuestionCircle, FaStar } from "react-icons/fa";
import { GiFertilizerBag } from "react-icons/gi";

export default function Home() {
  const { t, language } = useLanguage();
  const [productsData, setProductsData] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [specialKits, setSpecialKits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProductsData(data);
        } else {
          // Fallback to static data if API is empty or errors
          setProductsData([
            { id: "nemato", name: "Nemato Super Killer", price: "Contact us", image: "/nemato.png", isFeatured: true, category: "Bio-Nematicide", benefits: ["Reduces nematode impact", "Stops root rot"] },
            { id: "peru-kit", name: "Guava Special Kit", price: "Contact us", image: "/peru-kit-card.png", isSpecialKit: true, benefits: ["Complete Guava solution", "Increases yield"] }
          ]);
        }
      })
      .catch(err => {
        console.error("Home fetch error:", err);
        setProductsData([
          { id: "nemato", name: "Nemato Super Killer", price: "Contact us", image: "/nemato.png", isFeatured: true, category: "Bio-Nematicide", benefits: ["Reduces nematode impact", "Stops root rot"] },
          { id: "peru-kit", name: "Guava Special Kit", price: "Contact us", image: "/peru-kit-card.png", isSpecialKit: true, benefits: ["Complete Guava solution", "Increases yield"] }
        ]);
      });
  }, []);

  useEffect(() => {
    const getLangField = (obj: any, field: string) => {
      if (language === 'en') return obj[field]; // Default field
      return obj[`${field}_${language}`] || obj[field];
    };

    const getArrayField = (obj: any, field: string) => {
      if (language === 'en') return obj[field];
      const val = obj[`${field}_${language}`];
      return (Array.isArray(val) && val.length > 0) ? val : obj[field];
    };

    const processProducts = (data: any[]) => {
      return data.filter(p => p.isVisible !== false).map(p => ({
        ...p,
        name: getLangField(p, 'name'),
        description: getLangField(p, 'description') || (p.benefits ? p.benefits[0] : "High quality bio-product."),
        usage: getLangField(p, 'usageMethod') || "Consult expert.",
        points: getArrayField(p, 'benefits') || [],
        tag: p.category || p.price || "Bio-Organic"
      }));
    };

    let processed = processProducts(Array.isArray(productsData) && productsData.length > 0 ? productsData : []);

    // If no data (or loading), maybe show static fallback? 
    // For now assuming data comes or empty.

    // Fallback static if empty for demo (optional, but keep it simple)
    if (processed.length === 0 && productsData.length === 0) {
      // We can skip static fallback logic or implement it if critical.
      // Given complexity, let's rely on API.
    }

    const kits = processed.filter(p => p.isSpecialKit);
    const regular = processed.filter(p => !p.isSpecialKit);
    setSpecialKits(kits);
    setFeaturedProducts(regular.filter(p => p.isFeatured).slice(0, 3));

  }, [productsData, language]);

  const benefitsValues = [
    { icon: <FaLeaf className="text-primary text-3xl" />, ...t.home.benefits[0] },
    { icon: <FaShieldAlt className="text-primary text-3xl" />, ...t.home.benefits[1] },
    { icon: <GiFertilizerBag className="text-primary text-3xl" />, ...t.home.benefits[2] },
    { icon: <FaTruck className="text-primary text-3xl" />, ...t.home.benefits[3] },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Lush green farm in Maharashtra"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <span className="text-sm font-bold tracking-wide">{t.nav.brandName} {t.nav.brandSub}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-marathi">
              {t.hero.titleHigh} <br />
              <span className="text-accent italic">{t.hero.titleAccent}</span> <br />
              {t.hero.titleEnd}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-stone-200 font-medium leading-relaxed border-l-4 border-accent pl-6">
              {t.hero.subtitle} <br />
              <span className="text-lg opacity-80">{t.hero.location}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/917798693233?text=${encodeURIComponent((t as any).common?.waMsgHeader || "Hello, I want to inquire about products.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-lg px-8 py-4 justify-center"
              >
                <FaWhatsapp size={24} />
                {t.hero.whatsappBtn}
              </a>
              <Link
                href="/products"
                className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-stone-100 transition-all shadow-xl"
              >
                {t.hero.viewProducts}
                <FaArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-stone-50 rounded-[3rem] p-8 md:p-16 border border-stone-200 flex flex-col lg:flex-row items-center gap-16 shadow-sm overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full" />
            <div className="lg:w-1/3 relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-white p-4">
                <Image src="/consultant-card.png" alt="Santosh Shinde Business Card" fill className="object-contain" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
                <FaUserTie size={32} />
              </div>
            </div>
            <div className="lg:w-2/3">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{t.home.expertTrust}</span>
              <h2 className="text-4xl font-bold text-stone-900 mb-6 font-marathi">{t.home.expertTitle}</h2>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed italic border-l-4 border-stone-200 pl-6">
                {t.home.expertQuote}
              </p>
              <a href="tel:917798693233" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all">
                {t.home.callGuide}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Results Section - Real Success Stories */}
      <section className="py-24 bg-stone-50 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">{t.home.successTitle}</h2>
          <p className="text-xl text-stone-600">{t.home.successSub}</p>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-4" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/impact-full-tree.png" alt="Healthy Pomegranate Tree" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">{(t.home as any).stories?.strongFruit}</h3>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/impact-close.png" alt="Fruit Quality" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">{(t.home as any).stories?.shinyProduce}</h3>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/dalimb-tree.png" alt="Healthy Orchard" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">{(t.home as any).stories?.whiteRoots}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shree Gaurai Agro */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">{t.home.whyChoose}</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-4" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsValues.map((item, idx) => (
            <div key={idx} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-md transition-shadow text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{item.title}</h3>
              <p className="text-stone-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">{t.home.featProducts}</h2>
              <p className="text-xl text-stone-600">{t.home.featSub}</p>
            </div>
            <Link href="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {t.common.viewAll} <FaArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Kits Section */}
      {specialKits.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-widest">
                {t.common.specialOffer}
              </div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">{t.home.specialKits}</h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">{t.home.specialSub}</p>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialKits.map((kit) => (
                <SpecialKitCard key={kit.id} {...kit} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Farmer Experience Videos */}
      <FarmerVideos />

      {/* FAQ Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi flex items-center justify-center gap-3">
              <FaQuestionCircle className="text-primary" /> {t.home.faqTitle}
            </h2>
          </div>
          <div className="space-y-6">
            {t.home.faqs.map((faq, i) => (
              <div key={i} className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                <h4 className="text-lg font-bold text-stone-900 mb-3 font-marathi">{faq.q}</h4>
                <p className="text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-stone-900 text-white relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8 font-marathi">{t.home.ctaTitle}</h2>
          <p className="text-xl text-stone-400 mb-10 leading-relaxed">
            {t.home.ctaSub}
          </p>
          <a
            href="https://wa.me/917798693233?text=नमस्कार 🙏%0Aमला श्री गौराई ॲग्रो उत्पादनांबद्दल माहिती हवी आहे."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xl px-12 py-5 justify-center inline-flex"
          >
            <FaWhatsapp size={28} />
            {t.home.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
