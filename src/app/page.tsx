"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { FaWhatsapp, FaArrowRight, FaLeaf, FaShieldAlt, FaTruck, FaCheckCircle, FaUserTie, FaQuestionCircle, FaStar } from "react-icons/fa";
import { GiFertilizerBag } from "react-icons/gi";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [coreProducts, setCoreProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const processed = data.map(p => ({
            ...p,
            tag: p.category || p.price || "Bio-Organic",
            description: p.description || (p.benefits ? p.benefits[0] : "High quality bio-product."),
            usage: p.usageMethod || p.usage || "तज्ञांच्या सल्ल्यानुसार वापरा.",
            points: p.benefits || []
          }));
          setCoreProducts(processed);
          setFeaturedProducts(processed.filter(p => p.isFeatured).slice(0, 3));
        } else {
          setCoreProducts(staticCoreProducts);
          setFeaturedProducts(staticCoreProducts.slice(0, 3));
        }
      })
      .catch(err => {
        console.error("Home fetch error:", err);
        setCoreProducts(staticCoreProducts);
        setFeaturedProducts(staticCoreProducts.slice(0, 3));
      });
  }, []);

  const staticCoreProducts = [
    {
      id: "peru-kit",
      name: "श्री गौराई ॲग्रो पेरू स्पेशल कीट",
      price: "४-डोस सिस्टीम",
      image: "/peru-kit-card.png",
      benefits: [
        "पेरूच्या आकारासाठी ४ टप्प्यांचे नियोजन",
        "निमॅटोड आणि मुळकूजवर १००% मात",
        "रासायनिक खर्चात ५०% पर्यंत बचत",
      ],
    },
    {
      id: "nemato",
      name: "Nemato Super Killer",
      price: "Bio-Nematicide",
      image: "/nemato.png",
      benefits: [
        "मुळांवरील गाठी (Nematodes) नष्ट करते",
        "मातीतील हानिकारक कीडे थांबवते",
        "मुळांची नैसर्गिक वाढ सुधारते",
      ],
    },
    {
      id: "rootlix",
      name: "Rootlix (रूटलिक्स्)",
      price: "White Root Specialist",
      image: "/product-group.png",
      benefits: [
        "पांढऱ्या मुळ्यांची जोमदार वाढ",
        "अन्नद्रव्य शोषण्याची क्षमता वाढवते",
        "झाल्या पिकाला नवीन संजीवनी",
      ],
    },
  ];

  const benefitsValues = [
    {
      icon: <FaLeaf className="text-primary text-3xl" />,
      title: "१००% जैविक",
      desc: "पिके, शेतकरी आणि पर्यावरणासाठी पूर्णपणे सुरक्षित सेंद्रिय घटक.",
    },
    {
      icon: <FaShieldAlt className="text-primary text-3xl" />,
      title: "मुळकूज नियंत्रण",
      desc: "मुळकूज आणि निमॅटोडवर मात करण्यासाठी तज्ञ उपाय.",
    },
    {
      icon: <GiFertilizerBag className="text-primary text-3xl" />,
      title: "उत्पादन वाढ",
      desc: "फळांची फुगवण, चमक आणि गुणवत्ता सुधारण्यासाठी प्रभावी.",
    },
    {
      icon: <FaTruck className="text-primary text-3xl" />,
      title: "महाराष्ट्र निर्मित",
      desc: "पुणे व बारामती परिसरातील शेतकऱ्यांचा हक्काचा ब्रँड.",
    },
  ];

  const faqs = [
    {
      q: "हे रासायनिक आहे का?",
      a: "नाही, आमची सर्व उत्पादने १००% जैविक व बायोलॉजिकल आहेत आणि जमिनीला हानी पोहोचवत नाहीत."
    },
    {
      q: "फवारणीसोबत चालेल का?",
      a: "हो, मार्गदर्शनानुसार अनेक उत्पादने इतर फवारणीसोबत वापरता येतात."
    },
    {
      q: "कधी वापरायचं?",
      a: "पिकाच्या अवस्थेनुसार (वाढ, फुलधारणा किंवा फळधारणा) उत्पादनाचा वापर करावा."
    }
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
              <span className="text-sm font-bold tracking-wide">श्री गौराई ॲग्रो</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-marathi">
              शेतकऱ्यांसाठी <br />
              <span className="text-accent italic">विश्वासार्ह</span> <br />
              जैविक उत्पादने
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-stone-200 font-medium leading-relaxed border-l-4 border-accent pl-6">
              माती सुधारणा | रोग नियंत्रण | उत्पादन वाढ <br />
              <span className="text-lg opacity-80">पुणे, इंदापूर, बारामती क्षेत्रासाठी 'श्री गौराई ॲग्रो' ची साथ.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/917798693233?text=नमस्कार 🙏%0Aमला श्री गौराई ॲग्रो उत्पादनांबद्दल माहिती हवी आहे."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-lg px-8 py-4 justify-center"
              >
                <FaWhatsapp size={24} />
                WhatsApp वर ऑर्डर करा
              </a>
              <Link
                href="/products"
                className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-stone-100 transition-all shadow-xl"
              >
                सर्व उत्पादने पाहा
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
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">आमचा विश्वास (Trust Path)</span>
              <h2 className="text-4xl font-bold text-stone-900 mb-6 font-marathi">संतोष शिंदे - शेती सल्लागार</h2>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed italic border-l-4 border-stone-200 pl-6">
                "आम्ही केवळ बॉटल विकत नाही, तर आम्ही सोल्यूशन देतो. पेरू आणि डाळिंब बागेत निमॅटोड आणि मुळकूज हे मोठे शत्रू आहेत, ज्यावर आमचे कीट प्रभावी काम करते."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-stone-900">विशेष पेरू कीट नियोजन</h4>
                    <p className="text-stone-500 text-sm">४ डोसच्या माध्यमांतून संपूर्ण बागेचे आरोग्य.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-stone-900">प्रत्यक्ष परिणाम</h4>
                    <p className="text-stone-500 text-sm">कमी रासायनिक खतात अधिक उत्पादन.</p>
                  </div>
                </div>
              </div>
              <a href="tel:917798693233" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all">
                मार्गदर्शनासाठी कॉल करा
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Results Section - Real Success Stories */}
      <section className="py-24 bg-stone-50 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">शेतकऱ्यांचे यश (Real Success)</h2>
          <p className="text-xl text-stone-600">आमच्या मार्गदर्शनाखाली बहरलेल्या काही बागांचे दर्शन.</p>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-4" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/impact-full-tree.png" alt="Healthy Pomegranate Tree" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">जोमदार फळधारणा</h3>
                <p className="text-stone-500 text-sm">पूर्ण बागेत एकसारखा आकार</p>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/impact-close.png" alt="Close up Pomegranate" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">नैसर्गिक चकाकी</h3>
                <p className="text-stone-500 text-sm">कोणतेही रासायनिक डाग नाहीत</p>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
              <Image src="/impact-seeds.png" alt="Pomegranate Seeds Impact" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl">
                <h3 className="text-lg font-bold text-stone-900 font-marathi">उत्तम गुणवत्ता</h3>
                <p className="text-stone-500 text-sm">गडद लाल रंग आणि गोडवा</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shree Gaurai Agro */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">"श्री गौराई ॲग्रो" का निवडावे?</h2>
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
              <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi">आमची प्रमुख उत्पादने</h2>
              <p className="text-xl text-stone-600">तज्ञांनी शिफारस केलेले जैविक उपाय.</p>
            </div>
            <Link href="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              सर्व उत्पादने पाहा <FaArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4 font-marathi flex items-center justify-center gap-3">
              <FaQuestionCircle className="text-primary" /> साधे प्रश्न (FAQ)
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                <h4 className="text-lg font-bold text-stone-900 mb-3 font-marathi">प्रश्न: {faq.q}</h4>
                <p className="text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-stone-900 text-white relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8 font-marathi">एक चांगली सुरुवात, भरघोस प्रगती!</h2>
          <p className="text-xl text-stone-400 mb-10 leading-relaxed">
            तुमच्या शेतीसाठी आजच तज्ञ मार्गदर्शन आणि कोअर जैविक उत्पादने मिळवा.
          </p>
          <a
            href="https://wa.me/917798693233?text=नमस्कार 🙏%0Aमला श्री गौराई ॲग्रो उत्पादनांबद्दल माहिती हवी आहे."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xl px-12 py-5 justify-center inline-flex"
          >
            <FaWhatsapp size={28} />
            WhatsApp वर बोला
          </a>
        </div>
      </section>
    </div>
  );
}
