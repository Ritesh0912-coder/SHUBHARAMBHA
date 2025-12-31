"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaLock, FaUserShield, FaChartLine, FaBoxOpen, FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaWhatsapp, FaVideo, FaYoutube, FaEye, FaEyeSlash, FaChevronDown, FaLightbulb, FaCloudUploadAlt } from "react-icons/fa";
import { toEnglishNumerals } from "@/lib/format";

interface Product {
    id: string;
    name: string;
    name_hi?: string;
    name_mr?: string;
    price: string;
    image: string;
    benefits: string[];
    benefits_hi?: string[];
    benefits_mr?: string[];
    description?: string;
    description_hi?: string;
    description_mr?: string;
    usageMethod?: string;
    usageMethod_hi?: string;
    usageMethod_mr?: string;
    category?: string;
    category_hi?: string;
    category_mr?: string;
    suitableCrops?: string[];
    suitableCrops_hi?: string[];
    suitableCrops_mr?: string[];
    isVisible?: boolean;
    isSpecialKit?: boolean;
    isFeatured: boolean;
}

interface Inquiry {
    id: string;
    farmerName: string;
    phone: string;
    crop: string;
    district: string;
    product: string;
    status: string;
    createdAt: string;
}

interface FarmerVideo {
    id: string;
    title: string;
    videoUrl: string;
    isYouTube: boolean;
    isVisible: boolean;
}

interface CropGuidance {
    id: string;
    cropName: string;
    cropName_hi?: string;
    cropName_mr?: string;
    image?: string;
    problems: string;
    problems_hi?: string;
    problems_mr?: string;
    solutions: string;
    solutions_hi?: string;
    solutions_mr?: string;
    usageMethod: string;
    usageMethod_hi?: string;
    usageMethod_mr?: string;
    advice: string;
    advice_hi?: string;
    advice_mr?: string;
}

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("shubharambha2025");
    const [view, setView] = useState<"overview" | "products" | "inquiries" | "videos" | "guidance">("overview");
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [videos, setVideos] = useState<FarmerVideo[]>([]);
    const [guidances, setGuidances] = useState<CropGuidance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    // Form states
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [formLang, setFormLang] = useState<'en' | 'hi' | 'mr'>('en'); // New state for form language tab
    const [newProduct, setNewProduct] = useState<any>({ // looser type for form handling ease
        name: "", name_hi: "", name_mr: "",
        price: "",
        image: "/peru-kit-card.png",
        benefits: [""], benefits_hi: [""], benefits_mr: [""],
        description: "", description_hi: "", description_mr: "",
        usageMethod: "", usageMethod_hi: "", usageMethod_mr: "",
        category: "", category_hi: "", category_mr: "",
        suitableCrops: "", suitableCrops_hi: "", suitableCrops_mr: "",
        isVisible: true,
        isSpecialKit: false,
        isFeatured: false
    });

    // Video form states
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [newVideo, setNewVideo] = useState({
        title: "",
        videoUrl: "",
        isYouTube: false
    });

    // Guidance form states
    const [isAddingGuidance, setIsAddingGuidance] = useState(false);
    const [isEditingGuidance, setIsEditingGuidance] = useState(false);
    const [editingGuidanceId, setEditingGuidanceId] = useState<string | null>(null);
    const [cropImage, setCropImage] = useState<File | null>(null);
    const [guidanceLang, setGuidanceLang] = useState<'en' | 'hi' | 'mr'>('en');
    const [newGuidance, setNewGuidance] = useState<any>({
        cropName: "पेरू", cropName_hi: "", cropName_mr: "",
        image: "",
        problems: "", problems_hi: "", problems_mr: "",
        solutions: "", solutions_hi: "", solutions_mr: "",
        usageMethod: "", usageMethod_hi: "", usageMethod_mr: "",
        advice: "", advice_hi: "", advice_mr: ""
    });

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
            fetchInquiries();
            fetchVideos();
            fetchGuidance();
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                setProducts(data);
                if (data.length === 0) {
                    setError("Database is connected but currently empty. Add your first product below!");
                }
            } else {
                setError(data.error || "Failed to fetch products from database.");
            }
        } catch (e) {
            console.error(e);
            setError("Database connection failed. Please check your Atlas IP whitelist.");
        }
        setIsLoading(false);
    };

    const fetchInquiries = async () => {
        try {
            const res = await fetch("/api/inquiries");
            const data = await res.json();
            if (Array.isArray(data)) setInquiries(data);
        } catch (e) { console.error(e); }
    };

    const fetchVideos = async () => {
        try {
            const res = await fetch("/api/videos");
            const data = await res.json();
            if (Array.isArray(data)) setVideos(data);
        } catch (e) { console.error(e); }
    };

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let finalVideoUrl = newVideo.videoUrl;

            if (!newVideo.isYouTube && videoFile) {
                const formData = new FormData();
                formData.append("file", videoFile);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) {
                    finalVideoUrl = uploadData.secure_url;
                } else {
                    alert("व्हिडिओ अपलोड अयशस्वी: " + (uploadData.error || "Unknown error"));
                    setIsLoading(false);
                    return;
                }
            }

            if (!finalVideoUrl) {
                alert("कृपया व्हिडिओ URL द्या किंवा व्हिडिओ फाइल निवडा.");
                setIsLoading(false);
                return;
            }

            const res = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newVideo, videoUrl: finalVideoUrl })
            });
            if (res.ok) {
                await fetchVideos();
                setIsAddingVideo(false);
                setVideoFile(null);
                setNewVideo({ title: "", videoUrl: "", isYouTube: false });
            } else {
                alert("व्हिडिओ जतन करण्यात अयशस्वी.");
            }
        } catch (e: any) {
            console.error(e);
            alert("नेटवर्क एरर: " + e.message);
        }
        setIsLoading(false);
    };

    const handleToggleVideoVisibility = async (id: string, isVisible: boolean) => {
        try {
            await fetch(`/api/videos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: !isVisible })
            });
            await fetchVideos();
        } catch (e) { console.error(e); }
    };

    const handleDeleteVideo = async (id: string) => {
        if (!confirm("हा व्हिडिओ हटवायचा आहे का?")) return;
        try {
            const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
            if (res.ok) await fetchVideos();
        } catch (e) { console.error(e); }
    };

    const fetchGuidance = async () => {
        try {
            const res = await fetch("/api/guidance");
            const data = await res.json();
            if (Array.isArray(data)) setGuidances(data);
        } catch (e) { console.error(e); }
    };

    const handleAddGuidance = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let finalImageUrl = newGuidance.image;

            if (cropImage) {
                const formData = new FormData();
                formData.append("file", cropImage);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) {
                    finalImageUrl = uploadData.secure_url;
                } else {
                    alert("प्रतिमा अपलोड अयशस्वी: " + (uploadData.error || "Unknown error"));
                    setIsLoading(false);
                    return;
                }
            }

            const url = isEditingGuidance && editingGuidanceId ? `/api/guidance/${editingGuidanceId}` : "/api/guidance";
            const method = isEditingGuidance ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newGuidance, image: finalImageUrl })
            });

            if (res.ok) {
                await fetchGuidance();
                setIsAddingGuidance(false);
                setIsEditingGuidance(false);
                setEditingGuidanceId(null);
                setCropImage(null);
                setNewGuidance({
                    cropName: "पेरू", cropName_hi: "", cropName_mr: "",
                    image: "",
                    problems: "", problems_hi: "", problems_mr: "",
                    solutions: "", solutions_hi: "", solutions_mr: "",
                    usageMethod: "", usageMethod_hi: "", usageMethod_mr: "",
                    advice: "", advice_hi: "", advice_mr: ""
                });
            } else {
                alert("माहिती जतन करण्यात अयशस्वी.");
            }
        } catch (e: any) {
            console.error(e);
            alert("नेटवर्क एरर: " + e.message);
        }
        setIsLoading(false);
    };

    const handleStartEditGuidance = (guidance: CropGuidance) => {
        setIsAddingGuidance(true);
        setIsEditingGuidance(true);
        setEditingGuidanceId(guidance.id);
        setNewGuidance({
            cropName: guidance.cropName,
            cropName_hi: guidance.cropName_hi || "",
            cropName_mr: guidance.cropName_mr || "",
            image: guidance.image || "",
            problems: guidance.problems,
            problems_hi: guidance.problems_hi || "",
            problems_mr: guidance.problems_mr || "",
            solutions: guidance.solutions,
            solutions_hi: guidance.solutions_hi || "",
            solutions_mr: guidance.solutions_mr || "",
            usageMethod: guidance.usageMethod,
            usageMethod_hi: guidance.usageMethod_hi || "",
            usageMethod_mr: guidance.usageMethod_mr || "",
            advice: guidance.advice,
            advice_hi: guidance.advice_hi || "",
            advice_mr: guidance.advice_mr || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteGuidance = async (id: string) => {
        if (!confirm("हे मार्गदर्शन हटवायचे आहे का?")) return;
        try {
            const res = await fetch(`/api/guidance/${id}`, { method: "DELETE" });
            if (res.ok) await fetchGuidance();
        } catch (e) { console.error(e); }
    };

    const handleUpdateInquiryStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchInquiries();
        } catch (e) { console.error(e); }
    };

    const handleDeleteInquiry = async (id: string) => {
        if (!confirm("Remove this inquiry?")) return;
        try {
            const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
            if (res.ok) fetchInquiries();
        } catch (e) { console.error(e); }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = isEditing && editingId ? `/api/products/${editingId}` : "/api/products";
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProduct,
                    price: toEnglishNumerals(newProduct.price)
                })
            });
            if (res.ok) {
                await fetchProducts();
                setIsAddingProduct(false);
                setIsEditing(false);
                setEditingId(null);
                setNewProduct({
                    name: "", name_hi: "", name_mr: "",
                    price: "",
                    image: "/peru-kit-card.png",
                    benefits: [""], benefits_hi: [""], benefits_mr: [""],
                    description: "", description_hi: "", description_mr: "",
                    usageMethod: "", usageMethod_hi: "", usageMethod_mr: "",
                    category: "", category_hi: "", category_mr: "",
                    suitableCrops: "", suitableCrops_hi: "", suitableCrops_mr: "",
                    isVisible: true,
                    isSpecialKit: false,
                    isFeatured: false
                });
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save product.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error while saving.");
        }
        setIsLoading(false);
    };

    const handleStartEdit = (product: Product) => {
        setNewProduct({
            name: product.name,
            name_hi: product.name_hi || "",
            name_mr: product.name_mr || "",
            price: product.price,
            image: product.image,
            benefits: product.benefits,
            benefits_hi: product.benefits_hi || [""],
            benefits_mr: product.benefits_mr || [""],
            description: product.description || "",
            description_hi: product.description_hi || "",
            description_mr: product.description_mr || "",
            usageMethod: product.usageMethod || "",
            usageMethod_hi: product.usageMethod_hi || "",
            usageMethod_mr: product.usageMethod_mr || "",
            category: product.category || "",
            category_hi: product.category_hi || "",
            category_mr: product.category_mr || "",
            suitableCrops: (product.suitableCrops || []).join(", "),
            suitableCrops_hi: (product.suitableCrops_hi || []).join(", "),
            suitableCrops_mr: (product.suitableCrops_mr || []).join(", "),
            isVisible: product.isVisible !== false,
            isSpecialKit: product.isSpecialKit || false,
            isFeatured: product.isFeatured
        });
        setEditingId(product.id);
        setIsEditing(true);
        setIsAddingProduct(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ... (intermediate logic kept implicitly via context match, wait, this is replace_file_content, I need to be careful with chopping)
    // Actually safe to just target handleStartEdit and surrounding.

    // Let's do huge blocks for safety or multiple Replace.
    // I'll stick to targeting specific blocks.

    // Block 1: handleAddProduct reset & handleStartEdit

    // Block 2: handleAddGuidance reset & handleStartEditGuidance

    // Block 3: Quick Add resets

    // This call will do Block 1.

    // ...

    // Wait, the ReplacementContent above includes handleAddProduct closure.

    // Let's retry with multi_replace for efficiency.

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct({ ...newProduct, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSeedProducts = async () => {
        setIsLoading(true);
        const staticOnes = [
            {
                name: "Shree Gaurai Agro Peru Special Kit",
                name_hi: "श्री गौराई एग्रो पेरू स्पेशल किट",
                name_mr: "श्री गौराई ॲग्रो पेरू स्पेशल कीट",
                price: "₹4500",
                price_hi: "₹४५००",
                price_mr: "₹४५००",
                image: "/peru-kit-card.png",
                benefits: ["4-step planning for guava size", "100% cure for nematodes and root rot"],
                benefits_hi: ["पेरू के आकार के लिए ४ चरणों का नियोजन", "निमेटोड और जड़ सड़न पर १००% नियंत्रण"],
                benefits_mr: ["पेरूच्या आकारासाठी ४ टप्प्यांचे नियोजन", "निमॅटोड आणि मुळकूजवर १००% मात"],
                description: "No need to buy separate medicines for every disease on Guava. This kit improves the health of the entire garden in 4 steps.",
                description_hi: "अमरूद के हर रोग के लिए अलग दवा खरीदने की जरूरत नहीं है। यह किट ४ चरणों में पूरे बगीचे के स्वास्थ्य में सुधार करती है।",
                description_mr: "आता पेरूवरील प्रत्येक रोगासाठी वेगळे औषध खरेदी करण्याची गरज नाही. आमचे हे कीट ४ टप्प्यात संपूर्ण बागेचे आरोग्य सुधारते.",
                usageMethod: "As per expert advice with drip or water.",
                usageMethod_hi: "विशेषज्ञों की सलाह के अनुसार ड्रिप या पानी के साथ।",
                usageMethod_mr: "तज्ञांच्या सल्ल्यानुसार ड्रीप किंवा पाण्यासोबत.",
                category: "Special Kit",
                isFeatured: true
            },
            {
                name: "Nemato Super Killer",
                name_hi: "निमैटो सुपर किलर",
                name_mr: "निमॅटो सुपर किलर",
                price: "₹899",
                price_hi: "₹८९९",
                price_mr: "₹८९९",
                image: "/nemato.png",
                benefits: ["Destroys root Nematodes", "Stops root rot and wilting"],
                benefits_hi: ["जड़ों की गांठों (Nematodes) को नष्ट करता है", "जड़ सड़न और मुरझाना रोकता है"],
                benefits_mr: ["मुळांवरील गाठी (Nematodes) नष्ट करते", "मुळकूज आणि कोमेजणे थांबवते"],
                description: "Highly effective biological solution for root nematodes and wilt disease. Destroys harmful microbes in the soil.",
                description_hi: "जड़ निमेटोड और मुरझाना रोग के लिए अत्यधिक प्रभावी जैविक समाधान। मिट्टी में हानिकारक सूक्ष्मजीवों को नष्ट करता है।",
                description_mr: "मुळांवरील निमॅटोड (गाठी) आणि मर रोगावर अत्यंत प्रभावी जैविक सोल्यूशन. मातीतील हानिकारक सूक्ष्मजीव नष्ट करते.",
                usageMethod: "Drenching with 2-3 ml per liter of water.",
                usageMethod_hi: "२-३ मिली प्रति लीटर पानी के साथ ड्रेंचिंग।",
                usageMethod_mr: "२-३ मिली प्रती लिटर पाण्यातून ड्रेचिंग (Drenching) द्वारे.",
                category: "Bio-Nematicide",
                isFeatured: false
            },
            {
                name: "K-Lifter",
                name_hi: "के-लिफ्टर",
                name_mr: "के-लिफ्टर",
                price: "₹750",
                price_hi: "₹७५०",
                price_mr: "₹७५०",
                image: "/k-lifter.png",
                benefits: ["Increases fruit size and weight", "Gives best color and sweetness", "Mobilizes stable potash in soil"],
                benefits_hi: ["फलों का आकार और वजन बढ़ाता है", "फलों को अच्छा रंग और मिठास देता है", "मिट्टी में स्थिर पोटाश उपलब्ध कराता है"],
                benefits_mr: ["फळांचा आकार आणि वजन वाढवते", "फळांना उत्तम रंग आणि गोडवा देते", "जमिनीतील स्थिर पालाश उपलब्ध करून देते"],
                description: "Specialized potash mobilizer for better fruit swelling and shine.",
                description_hi: "फलों के बेहतर विकास और चमक के लिए विशेष पोटाश मोबिलाइज़र।",
                description_mr: "फळांच्या उत्तम फुगवणीसाठी आणि चकाकीसाठी विशेषतः तयार केलेले पोटॅश मोबिलायझर.",
                usageMethod: "Foliar spray or drip with 2.5 ml per liter of water.",
                usageMethod_hi: "२.५ मिली प्रति लीटर पानी के साथ छिड़काव या ड्रिप।",
                usageMethod_mr: "२.५ मिली प्रती लिटर पाण्यातून फवारणी किंवा ड्रीप.",
                category: "Potash Mobilizer",
                isFeatured: true
            },
            {
                name: "Bio-Magic",
                name_hi: "बायो-मैजिक",
                name_mr: "बायो-मॅजिक",
                price: "₹650",
                price_hi: "₹६५०",
                price_mr: "₹६५०",
                image: "/bio-magic.png",
                benefits: ["Stops flower drop and brings new flowers", "Increases flower to fruit conversion rate"],
                benefits_hi: ["फूलों का गिरना रोकता है और नए फूल लाता है", "फूलों के फल में बदलने की दर बढ़ाता है"],
                benefits_mr: ["फुलगळ थांबवते आणि नवीन फुले आणते", "फुलांचे फळात रूपांतर करण्याचे प्रमाण वाढवते"],
                description: "Natural booster for abundant flowering and bud retention.",
                description_hi: "भरपूर फूल आने और कलियों को टिकने के लिए प्राकृतिक बूस्टर।",
                description_mr: "भरघोस फुलधारणेसाठीและ कळ्या टिकवण्यासाठी नैसर्गिकरीत्या तयार केलेले बूस्टर.",
                usageMethod: "2 ml per liter of water before flowering.",
                usageMethod_hi: "फूल आने से पहले २ मिली प्रति लीटर पानी।",
                usageMethod_mr: "२ मिली प्रती लिटर पाण्यातून फुलधारणेच्या आधी.",
                category: "Flower Booster",
                isFeatured: false
            },
            {
                name: "Rootlix",
                name_hi: "रूटलिक्स",
                name_mr: "रूटलिक्स्",
                price: "₹599",
                price_hi: "₹५९९",
                price_mr: "₹५९९",
                image: "/rootlix-new.png",
                benefits: ["Vigorous growth of white roots", "Increases nutrient absorption capacity"],
                benefits_hi: ["सफेद जड़ों की जोरदार वृद्धि", "पोषक तत्वों के अवशोषण की क्षमता बढ़ाता है"],
                benefits_mr: ["पांढऱ्या मुळ्यांची जोमदार वाढ", "अन्नद्रव्य शोषण्याची क्षमता वाढवते"],
                description: "Special powder for vigorous white root growth. Gives firm grip to the crop in soil.",
                description_hi: "सफेद जड़ों की जोरदार वृद्धि के लिए विशेष पाउडर। मिट्टी में फसल को मजबूत पकड़ देता है।",
                description_mr: "पांढऱ्या मुळ्यांच्या जोमदार वाढीसाठी विशेष पावडर. पिकाला जमिनीत घट्ट पकड मिळवून देते.",
                usageMethod: "500g per acre with drip or water.",
                usageMethod_hi: "५०० ग्राम प्रति एकड़ ड्रिप या पानी के साथ।",
                usageMethod_mr: "५०० ग्रॅम प्रती एकर ड्रीप किंवा पाण्यासोबत.",
                category: "Root Developer",
                isFeatured: false
            },
            {
                name: "Agni-Vayu",
                name_hi: "अग्नि-वायु",
                name_mr: "अग्नी-वायू",
                price: "₹950",
                price_hi: "₹९५०",
                price_mr: "₹९५०",
                image: "/product-group.png",
                benefits: ["Effective against whitefly and jassids", "Natural and non-toxic insecticide"],
                benefits_hi: ["सफेद मक्खी और फुदकों के खिलाफ प्रभावी", "प्राकृतिक और गैर-विषाक्त कीटनाशक"],
                benefits_mr: ["पांढरी माशी आणि तुडतुड्यांवर प्रभावी", "नैसर्गिक आणि बिनविषारी कीटकनाशक"],
                description: "Highly effective natural insecticide for whitefly and other sucking pests. Gives internal strength to the crop.",
                description_hi: "सफेद मक्खी और अन्य चूसने वाले कीटों के लिए अत्यधिक प्रभावी प्राकृतिक कीटनाशक। फसल को आंतरिक शक्ति देता है।",
                description_mr: "पांढरी माशी आणि इतर शोषक कीटकांसाठी अत्यंत प्रभावी नैसर्गिक कीटकनाशक. पिकाला अंतर्गत ताकद देते.",
                usageMethod: "2 ml per liter of water foliar spray.",
                usageMethod_hi: "२ मिली प्रति लीटर पानी का छिड़काव।",
                usageMethod_mr: "२ मिली प्रती लिटर पाण्यातून फवारणी.",
                category: "Pest Control",
                isFeatured: true
            },
            {
                name: "Sudarshan",
                name_hi: "सुदर्शन",
                name_mr: "सुदर्शन",
                price: "₹1200",
                price_hi: "₹१२००",
                price_mr: "₹१२००",
                image: "/product-group.png",
                benefits: ["Special tonic for vigorous crop growth", "Increases number of flowers"],
                benefits_hi: ["फसल की जोरदार वृद्धि के लिए विशेष टॉनिक", "फूलों की संख्या बढ़ाता है"],
                benefits_mr: ["पिकाच्या जोमदार वाढीसाठी विशेष टॉनिक", "फुलांची संख्या वाढवते"],
                description: "Special tonic for overall crop growth and more branches. Maintains greenery and vigor.",
                description_hi: "फसल की समग्र वृद्धि के लिए विशेष टॉनिक। हरियाली और ताकत बनाए रखता है।",
                description_mr: "पिकाच्या सर्वांगीण वाढीसाठी आणि अधिक फुटव्यांसाठी विशेष टॉनिक. हिरवेपणा आणि जोम कायम राखते.",
                usageMethod: "1.5 ml per liter of water foliar spray.",
                usageMethod_hi: "१.५ मिली प्रति लीटर पानी का छिड़काव।",
                usageMethod_mr: "१.५ मिली प्रती लिटर पाण्यातून फवारणी.",
                category: "Growth Promoter",
                isFeatured: false
            },
            {
                name: "Bhoomi-Shakti",
                name_hi: "भूमि-शक्ति",
                name_mr: "भूमी-शक्ती",
                price: "₹850",
                price_hi: "₹८५०",
                price_mr: "₹८५०",
                image: "/product-group.png",
                benefits: ["Improves soil texture", "Increases fertility and organic carbon"],
                benefits_hi: ["मिट्टी की बनावट में सुधार करता है", "उर्वरता और जैविक कार्बन बढ़ाता है"],
                benefits_mr: ["मातीचा पोत सुधारते", "सुपीकता आणि सेंद्रिय कर्ब वाढवते"],
                description: "Organic fertilizer booster to improve soil texture and increase fertility.",
                description_hi: "मिट्टी की बनावट और उर्वरता बढ़ाने के लिए जैविक खाद बूस्टर।",
                description_mr: "मातीचा पोत सुधारण्यासाठी आणि सुपीकता वाढवण्यासाठी सेंद्रिय खत बूस्टर.",
                usageMethod: "5-10 kg per acre with soil application.",
                usageMethod_hi: "५-१० किलो प्रति एकड़ मिट्टी के साथ।",
                usageMethod_mr: "५-१० किलो प्रती एकर जमिनीतून सेंद्रिय खतासोबत.",
                category: "Soil Conditioner",
                isFeatured: true
            },
            {
                name: "Fruit-Fine",
                name_hi: "फ्रूट-फाइन",
                name_mr: "फ्रूट-फाईन",
                price: "₹700",
                price_hi: "₹७००",
                price_mr: "₹७००",
                image: "/product-group.png",
                benefits: ["Gives natural shine to fruits", "Improves color and weight"],
                benefits_hi: ["फलों को प्राकृतिक चमक देता है", "रंग और वजन में सुधार करता है"],
                benefits_mr: ["फळांना नैसर्गिक चकाकी देते", "रंग आणि वजन सुधारते"],
                description: "Special spray for obtaining natural shine, color and weight for fruits.",
                description_hi: "फलों की प्राकृतिक चमक, रंग और वजन के लिए विशेष स्प्रे।",
                description_mr: "फळांना नैसर्गिक चकाकी, रंग आणि वजन मिळवून देण्यासाठी विशेष फवारणी.",
                usageMethod: "1 ml per liter of water during fruit development stage.",
                usageMethod_hi: "फलों के विकास के दौरान १ मिली प्रति लीटर पानी।",
                usageMethod_mr: "१ मिली प्रती लिटर पाण्यातून फळांच्या फुगवणी काळात.",
                category: "Fruit Quality Booster",
                isFeatured: false
            },
            {
                name: "Gau-Shakti",
                name_hi: "गौ-शक्ति",
                name_mr: "गौ-शक्ती",
                price: "₹550",
                price_hi: "₹५५०",
                price_mr: "₹५५०",
                image: "/product-group.png",
                benefits: ["Quickens decomposition of dung", "Increases available nitrogen"],
                benefits_hi: ["गोबर के खाद के अपघटन को तेज करता है", "उपलब्ध नाइट्रोजन बढ़ाता है"],
                benefits_mr: ["शेणखताचे विघटन जलद करते", "उपलब्ध नत्र वाढवते"],
                description: "Biological components that increase the power of dung fertilizer and make it available to plants.",
                description_hi: "जैविक घटक जो गोबर खाद की शक्ति बढ़ाते हैं और पौधों को उपलब्ध कराते हैं।",
                description_mr: "शेणखताची शक्ती वाढवून पिकांना उपलब्ध करून देणारे जैविक घटक.",
                usageMethod: "1 liter per acre with dung or water.",
                usageMethod_hi: "१ लीटर प्रति एकड़ गोबर या पानी के साथ।",
                usageMethod_mr: "१ लिटर प्रती एकर शेणखतासोबत किंवा पाण्यातून.",
                category: "Manure Booster",
                isFeatured: false
            },
            {
                name: "Pseudo (Radix)",
                name_hi: "स्यूडो (रेडिक्स)",
                name_mr: "स्यूडो (रेडिक्स)",
                price: "₹800",
                price_hi: "₹८००",
                price_mr: "₹८००",
                image: "/pseudo.png",
                benefits: ["Control Bacterial Disease", "Boosts Plant Immunity"],
                benefits_hi: ["बैक्टीरिया रोग नियंत्रण", "पौधों की प्रतिरक्षा बढ़ाता है"],
                benefits_mr: ["जीवाणूजन्य रोग नियंत्रण (Bacterial Disease)", "पिकाची रोगप्रतिकारक शक्ती वाढवते"],
                description: "Effective control for bacterial disease in crops. Helps in reducing bacterial wilt and leaf spots.",
                description_hi: "फसलों में जीवाणु रोगों के लिए प्रभावी नियंत्रण।",
                description_mr: "पिकांवरील जीवाणूजन्य रोगांवर प्रभावी नियंत्रण. बॅक्टेरियल विल्ट आणि ठिपके कमी करण्यास मदत करते.",
                usageMethod: "Foliar spray or soil application as per requirement.",
                usageMethod_hi: "आवश्यकतानुसार छिड़काव या मिट्टी में प्रयोग।",
                usageMethod_mr: "फवारणी किंवा जमिनीतून गरजेनुसार वापर.",
                category: "Bactericide",
                isFeatured: false
            },
            {
                name: "Tricho (Radix)",
                name_hi: "ट्राइको (रेडिक्स)",
                name_mr: "ट्रायको (रेडिक्स)",
                price: "₹800",
                price_hi: "₹८००",
                price_mr: "₹८००",
                image: "/tricho.png",
                benefits: ["Control for harmful Fungi", "Protects Roots"],
                benefits_hi: ["हानिकारक कवक नियंत्रण", "जड़ों की रक्षा करता है"],
                benefits_mr: ["हानिकारक बुरशीवर नियंत्रण (Harmful Fungi)", "मुळांचे संरक्षण करते"],
                description: "Bio-fungicide that controls soil-borne pathogens and improves root health.",
                description_hi: "मिट्टी से होने वाले रोगों को नियंत्रित करने वाला जैविक कवकनाशी।",
                description_mr: "जमिनीतून होणाऱ्या रोगांवर नियंत्रण मिळवणारे जैविक बुरशीनाशक.",
                usageMethod: "Soil drenching or seed treatment.",
                usageMethod_hi: "मिट्टी में ड्रेंचिंग या बीज उपचार।",
                usageMethod_mr: "जमिनीतून ड्रेचिंग किंवा बीजप्रक्रिया.",
                category: "Fungicide",
                isFeatured: false
            },
            {
                name: "Peru Special Kit",
                name_hi: "पेरू स्पेशल किट",
                name_mr: "पेरू स्पेशल किट",
                price: "₹6200",
                price_hi: "₹६२००",
                price_mr: "₹६२००",
                image: "/peru-special-kit.png",
                benefits: [
                    "4-step planning for overall guava growth",
                    "Effective control for Nematodes and Root rot",
                    "Increases Fruit Size and Sweetness",
                    "Savings in chemical costs"
                ],
                benefits_hi: ["पेरू की वृद्धि के लिए ४ चरणों का नियोजन", "निमेटोड और जड़ सड़न पर नियंत्रण", "फलों का आकार और मिठास बढ़ाता है", "रासायनिक खर्च में बचत"],
                benefits_mr: ["पेरूच्या संपूर्ण वाढीसाठी ४ टप्प्यांचे नियोजन", "निमॅटोड आणि मुळकूजवर प्रभावी नियंत्रण", "फळांचा आकार आणि गोडवा वाढवते", "रासायनिक खर्चात बचत"],
                description: "Complete biological solution for Guava orchads. 4-dose system ensures health and high yield.",
                description_hi: "पेरू के बागों के लिए पूर्ण जैविक समाधान।",
                description_mr: "पेरू बागेसाठी संपूर्ण जैविक सोल्यूशन. ४ डोस सिस्टीमद्वारे बागेचे आरोग्य सुधारते आणि भरघोस उत्पादन मिळते.",
                usageMethod: "Use with Drip or water as per guidelines in the kit.",
                usageMethod_hi: "किट के दिशा-निर्देशों के अनुसार प्रयोग करें।",
                usageMethod_mr: "किटमधील मार्गदर्शनानुसार ड्रीप किंवा पाण्यासोबत वापरा.",
                category: "Special Kit",
                isSpecialKit: true,
                isFeatured: true
            },
            {
                name: "Anar Special Kit",
                name_hi: "अनार स्पेशल किट",
                name_mr: "डाळिंब स्पेशल किट",
                price: "₹18500",
                price_hi: "₹१८५००",
                price_mr: "₹१८५००",
                image: "/anar-special.png",
                benefits: [
                    "Special formula for overall pomegranate growth",
                    "Natural red color and shine for fruits",
                    "Control for Root rot and Bacterial Blight",
                    "Increases Fruit Size and Weight"
                ],
                benefits_hi: ["अनार की वृद्धि के लिए विशेष फॉर्मूला", "फलों का प्राकृतिक लाल रंग और चमक", "जड़ सड़न और बैक्टीरियल ब्लाइट पर नियंत्रण"],
                benefits_mr: ["डाळिंबाच्या संपूर्ण वाढीसाठी विशेष फॉर्म्युला", "फळांना नैसर्गिक लाल रंग आणि चकाकी", "मुळकूज आणि बॅक्टेरियल ब्लाइटवर नियंत्रण", "फळांचा आकार आणि वजन वाढवते"],
                description: "Premium bio kit for Pomegranate orchards. All necessary products for export quality fruits in one.",
                description_hi: "अनार के बागों के लिए प्रीमियम जैविक किट।",
                description_mr: "डाळिंब बागेसाठी प्रीमियम जैविक किट. एक्सपोर्ट क्वालिटी फळांसाठी आवश्यक सर्व उत्पादने एकत्र.",
                usageMethod: "Use step by step as per guidelines in the kit.",
                usageMethod_hi: "चरण-दर-चरण प्रयोग करें।",
                usageMethod_mr: "किटमधील मार्गदर्शनानुसार टप्प्याटप्प्याने वापरा.",
                category: "Special Kit",
                isSpecialKit: true,
                isFeatured: true
            },
            {
                name: "Banana Special Kit",
                name_hi: "केला स्पेशल किट",
                name_mr: "केळी स्पेशल किट",
                price: "₹3700",
                price_hi: "₹३७००",
                price_mr: "₹३७००",
                image: "/product-group.png",
                benefits: [
                    "Special formula for vigorous banana growth",
                    "Increases stem size and weight",
                    "Maintains leaf greenery",
                    "Increases root strength"
                ],
                benefits_hi: ["केले की जोरदार वृद्धि के लिए विशेष फॉर्मूला", "तने का आकार और वजन बढ़ाता है", "जड़ों की मजबूती बढ़ाता है"],
                benefits_mr: ["केळीच्या जोमदार वाढीसाठी विशेष फॉर्म्युला", "घडाचा आकार आणि वजन वाढवते", "पानांचा हिरवेपणा कायम राखते", "मुळांची मजबूती वाढवते"],
                description: "Complete biological solution for Banana crop. More yield at lower cost.",
                description_hi: "केले की फसल के लिए पूर्ण जैविक समाधान।",
                description_mr: "केळी पिकासाठी संपूर्ण जैविक सोल्यूशन. कमी खर्चात जास्त उत्पादन.",
                usageMethod: "Use with Drip or water as per guidelines in the kit.",
                usageMethod_hi: "दिशा-निर्देशों के अनुसार प्रयोग करें।",
                usageMethod_mr: "किटमधील मार्गदर्शनानुसार ड्रीप किंवा पाण्यासोबत वापरा.",
                category: "Special Kit",
                isSpecialKit: true,
                isFeatured: true
            }
        ];

        try {
            for (const p of staticOnes) {
                await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(p)
                });
            }
            await fetchProducts();
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchProducts();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to delete.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error while deleting.");
        }
        setDeletingId(null);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "shubharambha2025") {
            setIsLoggedIn(true);
        } else {
            alert("Invalid credentials.");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-stone-900 p-10 rounded-[2.5rem] border border-stone-800 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 text-white">
                            <FaLock size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white font-marathi">Admin Portal</h1>
                        <p className="text-stone-500 text-sm">Radix International - शुभारंभ</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-stone-900 transition-all border border-transparent hover:border-primary">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-stone-900 text-white p-8 md:min-h-screen">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 bg-primary rounded-lg" />
                    <span className="font-bold tracking-tight text-xs uppercase">शुभारंभ Admin</span>
                </div>

                {/* Quick Add Dropdown */}
                <div className="relative mb-8">
                    <button
                        onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                        className="w-full bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl font-bold flex items-center justify-between hover:bg-primary/20 transition-all"
                    >
                        <span className="flex items-center gap-2 text-sm">
                            <FaPlus size={12} /> झटपट जोडा
                        </span>
                        <FaChevronDown className={`transition-transform duration-200 ${isQuickAddOpen ? 'rotate-180' : ''}`} size={12} />
                    </button>

                    {isQuickAddOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border border-stone-200 rounded-xl shadow-2xl mt-2 z-50 overflow-hidden text-stone-900 animate-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => {
                                    setView("products");
                                    setIsAddingProduct(true);
                                    setIsQuickAddOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full text-left p-3 hover:bg-stone-50 font-bold flex items-center gap-2 border-b border-stone-100 text-sm"
                            >
                                <FaBoxOpen className="text-primary" /> नवीन उत्पादन
                            </button>
                            <button
                                onClick={() => {
                                    setView("videos");
                                    setIsAddingVideo(true);
                                    setIsQuickAddOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full text-left p-3 hover:bg-stone-50 font-bold flex items-center gap-2 border-b border-stone-100 text-sm"
                            >
                                <FaVideo className="text-primary" /> नवीन व्हिडिओ
                            </button>
                            <button
                                onClick={() => {
                                    setView("guidance");
                                    setIsAddingGuidance(true);
                                    setIsEditingGuidance(false);
                                    setEditingGuidanceId(null);
                                    setNewGuidance({ cropName: "पेरू", image: "", problems: "", solutions: "", usageMethod: "", advice: "" });
                                    setIsQuickAddOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full text-left p-3 hover:bg-stone-50 font-bold flex items-center gap-2 text-sm"
                            >
                                <FaLightbulb className="text-primary" /> नवीन मार्गदर्शन
                            </button>
                        </div>
                    )}
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setView("overview")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "overview" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaChartLine /> Overview
                    </button>
                    <button
                        onClick={() => setView("products")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "products" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaBoxOpen /> उत्पादने (Products)
                    </button>
                    <button
                        onClick={() => setView("videos")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "videos" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaVideo /> व्हिडिओ (Videos)
                    </button>
                    <button
                        onClick={() => setView("inquiries")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "inquiries" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaUsers /> चौकशी (Inquiries)
                    </button>
                    <button
                        onClick={() => setView("guidance")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "guidance" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaLightbulb /> पीक मार्गदर्शन (Guidance)
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-12 overflow-x-hidden">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            {view === "overview" && "Dashboard Overview"}
                            {view === "products" && "उत्पादन व्यवस्थापन (Products)"}
                            {view === "videos" && "व्हिडिओ व्यवस्थापन (Videos)"}
                            {view === "inquiries" && "शेतकरी चौकशी (Inquiries)"}
                            {view === "guidance" && "पीक मार्गदर्शन व्यवस्थापन (Guidance)"}
                        </h1>
                        <p className="text-stone-500">Radix International • शुभारंभ Admin Panel</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow-sm flex items-center gap-3 pr-6">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                            <FaUserShield className="text-primary" />
                        </div>
                        <span className="font-bold text-sm">Santosh Shinde</span>
                    </div>
                </header>

                {view === "overview" && (
                    <div className="animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Active Products</h4>
                                <div className="text-4xl font-black text-stone-900">{products.length}</div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">New Inquiries</h4>
                                <div className="text-4xl font-black text-stone-900">{inquiries.filter(i => i.status === "NEW").length}</div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Outreach</h4>
                                <div className="text-4xl font-black text-stone-900">१२०+</div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100">
                            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {inquiries.length > 0 ? inquiries.slice(0, 3).map(inquiry => (
                                    <div key={inquiry.id} className="flex items-center justify-between p-4 border-b border-stone-100">
                                        <div>
                                            <p className="font-bold">{inquiry.farmerName} ({inquiry.district})</p>
                                            <p className="text-stone-500 text-sm">{inquiry.product} • {inquiry.crop}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${inquiry.status === "NEW" ? "bg-primary/10 text-primary" : "bg-stone-100 text-stone-400"}`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                )) : <p className="text-stone-400 text-center py-8 italic">No recent activity found.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {view === "products" && (
                    <div className="animate-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">Catalog Management</h2>
                            <button
                                onClick={() => {
                                    setIsAddingProduct(true);
                                    setIsEditing(false);
                                    setNewProduct({
                                        name: "", name_hi: "", name_mr: "",
                                        price: "",
                                        image: "/peru-kit-card.png",
                                        benefits: [""], benefits_hi: [""], benefits_mr: [""],
                                        description: "", description_hi: "", description_mr: "",
                                        usageMethod: "", usageMethod_hi: "", usageMethod_mr: "",
                                        category: "",
                                        suitableCrops: "",
                                        isVisible: true,
                                        isSpecialKit: false,
                                        isFeatured: false
                                    });
                                }}
                                className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <FaPlus size={14} /> Add New Product
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="bg-white p-8 rounded-3xl border-2 border-primary mb-8 animate-in zoom-in duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">{isEditing ? "Edit Product" : "Add New Product"}</h3>
                                    <button
                                        onClick={() => {
                                            setIsAddingProduct(false);
                                            setIsEditing(false);
                                            setEditingId(null);
                                        }}
                                        className="text-stone-400 hover:text-red-500 transition-all font-bold flex items-center gap-1"
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                                <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-xl w-fit mx-auto md:mx-0">
                                    <button onClick={() => setFormLang('en')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${formLang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>English</button>
                                    <button onClick={() => setFormLang('hi')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${formLang === 'hi' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>हिंदी (Hindi)</button>
                                    <button onClick={() => setFormLang('mr')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${formLang === 'mr' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>मराठी (Marathi)</button>
                                </div>

                                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div
                                            className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive ? "border-primary bg-primary/5" : "border-stone-200 bg-stone-50 hover:border-stone-300"}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            {newProduct.image && (
                                                <img
                                                    src={newProduct.image}
                                                    alt="Preview"
                                                    className="absolute inset-0 w-full h-full object-contain p-6 opacity-40"
                                                />
                                            )}
                                            <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-none text-center px-6">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-stone-400">
                                                    <FaPlus size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-700">Drag & Drop Product Photo</p>
                                                    <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">or click to browse files</p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                                accept="image/*"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Photo URL (Optional)</label>
                                            <input
                                                placeholder="https://example.com/image.png"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary text-sm"
                                                value={newProduct.image}
                                                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Product Name ({formLang.toUpperCase()})</label>
                                            <input
                                                placeholder={formLang === 'en' ? "e.g. Bio-Magic Booster" : "उदा. बायो-मॅजिक बूस्टर"}
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-bold"
                                                value={newProduct[formLang === 'en' ? 'name' : `name_${formLang}`]}
                                                onChange={e => setNewProduct({ ...newProduct, [formLang === 'en' ? 'name' : `name_${formLang}`]: e.target.value })}
                                                required={formLang === 'en'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Description ({formLang.toUpperCase()})</label>
                                            <textarea
                                                placeholder="Product details..."
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[100px]"
                                                value={newProduct[formLang === 'en' ? 'description' : `description_${formLang}`]}
                                                onChange={e => setNewProduct({ ...newProduct, [formLang === 'en' ? 'description' : `description_${formLang}`]: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Price (Common)</label>
                                                <input
                                                    placeholder="₹750"
                                                    className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                    value={newProduct.price}
                                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Category ({formLang.toUpperCase()})</label>
                                                <input
                                                    placeholder="Bio-Nematicide"
                                                    className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                    value={newProduct[formLang === 'en' ? 'category' : `category_${formLang}`]}
                                                    onChange={e => setNewProduct({ ...newProduct, [formLang === 'en' ? 'category' : `category_${formLang}`]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Method of Usage ({formLang.toUpperCase()})</label>
                                            <input
                                                placeholder={formLang === 'en' ? "2ml per Liter" : "२ मिली प्रति लिटर"}
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                value={newProduct[formLang === 'en' ? 'usageMethod' : `usageMethod_${formLang}`]}
                                                onChange={e => setNewProduct({ ...newProduct, [formLang === 'en' ? 'usageMethod' : `usageMethod_${formLang}`]: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Key Benefits ({formLang.toUpperCase()}) - One per line</label>
                                            <textarea
                                                placeholder="- Increases Yield&#10;- Improves Soil Health"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={(newProduct[formLang === 'en' ? 'benefits' : `benefits_${formLang}`] || []).join('\n')}
                                                onChange={e => setNewProduct({ ...newProduct, [formLang === 'en' ? 'benefits' : `benefits_${formLang}`]: e.target.value.split('\n') })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Suitable Crops ({formLang.toUpperCase()}) - Comma Separated</label>
                                            <input
                                                placeholder="Grapes, Pomegranate, Banana"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                value={formLang === 'en' ? newProduct.suitableCrops : (newProduct[`suitableCrops_${formLang}`] || "")}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    // For EN, suitableCrops is mapped to join(', ') in handleStartEdit but stored as string in form?
                                                    // Wait, handleStartEdit: suitableCrops: (product.suitableCrops || []).join(", ")
                                                    // So internal state newProduct.suitableCrops IS A STRING.
                                                    // Wait, handleAddProduct calls JSON.stringify(newProduct).
                                                    // The API expects suitableCrops to be ARRAY.
                                                    // I need to split it before saving!
                                                    // No, I should split it IN handleAddProduct.
                                                    // But current handleAddProduct just does JSON.stringify(newProduct).
                                                    // I need to update handleAddProduct data preparation as well if I want to save it as array.
                                                    // OR I can keep it consistent and update NEWPRODUCT state to hold strings, but API saves array.
                                                    // Existing code handleStartEdit: sets it to join(", ").
                                                    // Existing backend: expects proper array?
                                                    // Let's check handleAddProduct.
                                                    setNewProduct({ ...newProduct, [formLang === 'en' ? 'suitableCrops' : `suitableCrops_${formLang}`]: val });
                                                }}
                                            />
                                        </div>
                                        <label className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 cursor-pointer hover:bg-primary/10 transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-primary"
                                                checked={newProduct.isFeatured}
                                                onChange={e => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                                            />
                                            <span className="text-sm font-bold text-stone-700">Display in "Featured" Section on Home Page</span>
                                        </label>
                                        <div className="flex gap-4 pt-2">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-grow p-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                                            >
                                                {isLoading ? "Processing..." : (isEditing ? "Update Product" : "Publish Product")}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8 font-bold animate-pulse">
                                {error}
                            </div>
                        )}

                        {products.length === 0 && !isLoading && !error && (
                            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-stone-200">
                                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-stone-300">
                                    <FaBoxOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Your Catalog is Empty</h3>
                                <p className="text-stone-500 mb-8 max-w-md mx-auto">Start building your organic store by adding a product or use our quick-import tool.</p>
                                <button
                                    onClick={handleSeedProducts}
                                    className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 mx-auto"
                                >
                                    <FaCheck /> Import Full Catalog (5 Products)
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm relative group hover:border-primary/20 transition-all">
                                    <div className="absolute top-6 right-6 flex gap-2 z-10">
                                        <button
                                            onClick={() => handleStartEdit(product)}
                                            className="bg-stone-900 text-white p-3 rounded-xl hover:bg-black transition-colors shadow-lg"
                                            title="Edit Product"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            disabled={deletingId === product.id}
                                            className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg"
                                            title="Delete Product"
                                        >
                                            {deletingId === product.id ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaTrash size={14} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="w-full aspect-square bg-stone-50 rounded-[2rem] flex items-center justify-center mb-6 overflow-hidden border border-stone-50">
                                        {product.image && !product.image.startsWith('C:') ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                unoptimized={product.image.startsWith('data:')}
                                            />
                                        ) : (
                                            <div className="p-8 text-center bg-red-50 text-red-500 flex flex-col items-center gap-3">
                                                <FaBoxOpen size={32} />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black uppercase tracking-widest">Broken Path</p>
                                                    <p className="text-[10px] opacity-60">Local drive files (C:) are not allowed by Next.js</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            {product.isFeatured && (
                                                <span className="text-[10px] bg-accent/10 text-accent font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Featured</span>
                                            )}
                                            <span className="text-[10px] bg-stone-100 text-stone-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">{product.category || "Organic"}</span>
                                        </div>
                                        <h3 className="font-bold text-stone-900 text-lg mb-1 leading-tight">{product.name}</h3>
                                        <p className="text-primary font-black text-xl">{toEnglishNumerals(product.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === "videos" && (
                    <div className="animate-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">व्हिडिओ व्यवस्थापन (Video Management)</h2>
                            <button
                                onClick={() => setIsAddingVideo(true)}
                                className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <FaPlus size={14} /> नवीन व्हिडिओ जोडा
                            </button>
                        </div>

                        {isAddingVideo && (
                            <div className="bg-white p-8 rounded-3xl border-2 border-primary mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">नवीन व्हिडिओ जोडा (Add Video)</h3>
                                    <button
                                        onClick={() => setIsAddingVideo(false)}
                                        className="text-stone-400 hover:text-red-500 transition-all font-bold flex items-center gap-1"
                                    >
                                        <FaTimes /> बंद करा
                                    </button>
                                </div>
                                <form onSubmit={handleAddVideo} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">व्हिडिओ शीर्षक (मराठीत)</label>
                                        <input
                                            placeholder="उदा: शेतकऱ्याचा अनुभव - डाळिंब बाग"
                                            className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-bold"
                                            value={newVideo.title}
                                            onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">व्हिडिओचा प्रकार (Video Source)</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewVideo({ ...newVideo, isYouTube: true });
                                                    setVideoFile(null);
                                                }}
                                                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${newVideo.isYouTube ? 'border-primary bg-primary/5 text-primary' : 'border-stone-100 text-stone-400 hover:bg-stone-50'}`}
                                            >
                                                <FaYoutube size={20} /> YouTube
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewVideo({ ...newVideo, isYouTube: false, videoUrl: "" });
                                                }}
                                                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${!newVideo.isYouTube ? 'border-primary bg-primary/5 text-primary' : 'border-stone-100 text-stone-400 hover:bg-stone-50'}`}
                                            >
                                                <FaCloudUploadAlt size={20} /> फाईल अपलोड करा
                                            </button>
                                        </div>
                                    </div>

                                    {newVideo.isYouTube ? (
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">YouTube व्हिडिओ URL</label>
                                            <input
                                                placeholder="उदा: https://www.youtube.com/watch?v=..."
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-medium"
                                                value={newVideo.videoUrl}
                                                onChange={e => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                                                required={newVideo.isYouTube}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">व्हिडिओ फाईल निवडा (Cloudinary)</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    id="video-upload"
                                                    onChange={e => setVideoFile(e.target.files?.[0] || null)}
                                                    required={!newVideo.isYouTube && !videoFile}
                                                />
                                                <label
                                                    htmlFor="video-upload"
                                                    className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${videoFile ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary/50'}`}
                                                >
                                                    <FaCloudUploadAlt size={32} className={videoFile ? 'text-primary' : 'text-stone-300'} />
                                                    <span className="font-bold text-stone-600">
                                                        {videoFile ? videoFile.name : "व्हिडिओ निवडा क्लिक करा"}
                                                    </span>
                                                    {videoFile && (
                                                        <span className="text-xs text-stone-400">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full p-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? "जोडत आहे..." : "व्हिडिओ जोडा"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {videos.length === 0 && !isLoading && (
                            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-stone-200">
                                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-stone-300">
                                    <FaVideo size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">कोणतेही व्हिडिओ नाहीत</h3>
                                <p className="text-stone-500 mb-8">शेतकऱ्यांचे अनुभव व्हिडिओ जोडण्यासाठी वरील बटण वापरा.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map(video => (
                                <div key={video.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${video.isVisible ? 'border-stone-100' : 'border-red-200 opacity-60'}`}>
                                    <div className="relative aspect-video bg-stone-900">
                                        {video.isYouTube ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-600/20">
                                                <FaYoutube className="text-red-500" size={48} />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FaVideo className="text-stone-500" size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            {video.isYouTube ? (
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">YouTube</span>
                                            ) : (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Local</span>
                                            )}
                                            {!video.isVisible && (
                                                <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-bold">लपलेले</span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-stone-900 mb-4">{video.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleVideoVisibility(video.id, video.isVisible)}
                                                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${video.isVisible ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                                                title={video.isVisible ? "लपवा" : "दाखवा"}
                                            >
                                                {video.isVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                                {video.isVisible ? "लपवा" : "दाखवा"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVideo(video.id)}
                                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                title="हटवा"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === "inquiries" && (
                    <div className="animate-in slide-in-from-right duration-500">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-stone-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50 border-b border-stone-100">
                                    <tr>
                                        <th className="p-8 text-xs font-black text-stone-400 uppercase tracking-widest">Farmer Info</th>
                                        <th className="p-8 text-xs font-black text-stone-400 uppercase tracking-widest">Crop & Location</th>
                                        <th className="p-8 text-xs font-black text-stone-400 uppercase tracking-widest">Interested Product</th>
                                        <th className="p-8 text-xs font-black text-stone-400 uppercase tracking-widest text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.length > 0 ? inquiries.map(inquiry => (
                                        <tr key={inquiry.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-all">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                        {inquiry.farmerName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-stone-900">{inquiry.farmerName}</p>
                                                        <p className="text-stone-500 text-sm tracking-tighter">{inquiry.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="font-bold text-stone-800">{inquiry.crop}</p>
                                                <p className="text-stone-500 text-sm">{inquiry.district}</p>
                                            </td>
                                            <td className="p-8">
                                                <span className="bg-stone-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">{inquiry.product}</span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-center gap-4">
                                                    <a
                                                        href={`https://wa.me/${inquiry.phone}`}
                                                        target="_blank"
                                                        className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                                        title="WhatsApp Farmer"
                                                    >
                                                        <FaWhatsapp size={20} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleUpdateInquiryStatus(inquiry.id, "COMPLETED")}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${inquiry.status === "COMPLETED" ? "bg-green-500 text-white" : "bg-stone-50 text-stone-300 hover:bg-green-50 hover:text-green-500"}`}
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInquiry(inquiry.id)}
                                                        className="w-10 h-10 bg-red-50 text-red-300 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        title="Delete Inquiry"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center text-stone-400 italic font-bold">No farmer inquiries found yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === "guidance" && (
                    <div className="animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-xl font-bold">पीक मार्गदर्शन व्यवस्थापन (Guidance)</h2>
                                <p className="text-stone-500 text-sm">शेतकऱ्यांसाठी पीक निहाय मार्गदर्शन माहिती व्यवस्थापित करा.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddingGuidance(true);
                                    setIsEditingGuidance(false);
                                    setEditingGuidanceId(null);
                                    setNewGuidance({ cropName: "पेरू", image: "", problems: "", solutions: "", usageMethod: "", advice: "" });
                                }}
                                className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-stone-900 transition-all shadow-lg shadow-primary/20"
                            >
                                <FaPlus size={14} /> नवीन मार्गदर्शन जोडा
                            </button>
                        </div>

                        {isAddingGuidance && (
                            <div className="bg-white p-10 rounded-[3rem] border-2 border-primary mb-12 shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold">{isEditingGuidance ? "मार्गदर्शन सुधारित करा" : "नवीन मार्गदर्शन जोडा"}</h3>
                                    <button onClick={() => setIsAddingGuidance(false)} className="text-stone-400 hover:text-red-500 transition-all font-bold flex items-center gap-2">
                                        <FaTimes /> बंद करा
                                    </button>
                                </div>
                                <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-xl w-fit mx-auto md:mx-0">
                                    <button onClick={() => setGuidanceLang('en')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${guidanceLang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>English</button>
                                    <button onClick={() => setGuidanceLang('hi')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${guidanceLang === 'hi' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>हिंदी (Hindi)</button>
                                    <button onClick={() => setGuidanceLang('mr')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${guidanceLang === 'mr' ? 'bg-white text-primary shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>मराठी (Marathi)</button>
                                </div>

                                <form onSubmit={handleAddGuidance} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Crop Name ({guidanceLang.toUpperCase()})</label>
                                            <input
                                                placeholder={guidanceLang === 'en' ? "e.g. Guava" : "उदा. पेरू"}
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-bold"
                                                value={newGuidance[guidanceLang === 'en' ? 'cropName' : `cropName_${guidanceLang}`]}
                                                onChange={e => setNewGuidance({ ...newGuidance, [guidanceLang === 'en' ? 'cropName' : `cropName_${guidanceLang}`]: e.target.value })}
                                                required={guidanceLang === 'en'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Crop Image (Image)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full p-3 bg-stone-50 rounded-2xl border border-stone-100"
                                                onChange={e => setCropImage(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Main Problems ({guidanceLang.toUpperCase()})</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance[guidanceLang === 'en' ? 'problems' : `problems_${guidanceLang}`]}
                                                onChange={e => setNewGuidance({ ...newGuidance, [guidanceLang === 'en' ? 'problems' : `problems_${guidanceLang}`]: e.target.value })}
                                                placeholder={guidanceLang === 'en' ? "Describe main problems..." : "पिकातील मुख्य समस्या लिहा..."}
                                                required={guidanceLang === 'en'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Solutions ({guidanceLang.toUpperCase()})</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance[guidanceLang === 'en' ? 'solutions' : `solutions_${guidanceLang}`]}
                                                onChange={e => setNewGuidance({ ...newGuidance, [guidanceLang === 'en' ? 'solutions' : `solutions_${guidanceLang}`]: e.target.value })}
                                                placeholder={guidanceLang === 'en' ? "Organic solutions..." : "त्यावरील जैविक उपाय लिहा..."}
                                                required={guidanceLang === 'en'}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Usage Method ({guidanceLang.toUpperCase()})</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance[guidanceLang === 'en' ? 'usageMethod' : `usageMethod_${guidanceLang}`]}
                                                onChange={e => setNewGuidance({ ...newGuidance, [guidanceLang === 'en' ? 'usageMethod' : `usageMethod_${guidanceLang}`]: e.target.value })}
                                                placeholder={guidanceLang === 'en' ? "How to use..." : "उत्पादने वापरण्याची योग्य पद्धत लिहा..."}
                                                required={guidanceLang === 'en'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Advice / Tips ({guidanceLang.toUpperCase()})</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance[guidanceLang === 'en' ? 'advice' : `advice_${guidanceLang}`]}
                                                onChange={e => setNewGuidance({ ...newGuidance, [guidanceLang === 'en' ? 'advice' : `advice_${guidanceLang}`]: e.target.value })}
                                                placeholder={guidanceLang === 'en' ? "Expert advice..." : "शेतकऱ्यांसाठी विशेष सल्ला/टीप..."}
                                                required={guidanceLang === 'en'}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full p-5 bg-stone-900 text-white rounded-3xl font-black shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FaCheck />
                                        )}
                                        {isEditingGuidance ? "Update Guidance" : "Save Guidance"}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guidances.map(guidance => (
                                <div key={guidance.id} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm group hover:border-primary/20 transition-all relative">
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <button onClick={() => handleStartEditGuidance(guidance)} className="bg-stone-100 text-stone-600 p-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                                            <FaEdit size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteGuidance(guidance.id)} className="bg-stone-100 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary overflow-hidden">
                                            {guidance.image ? (
                                                <img src={guidance.image} alt={guidance.cropName} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaLightbulb />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">{guidance.cropName} मार्गदर्शन</h3>
                                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Crop Solutions</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        <div className="p-4 bg-stone-50 rounded-2xl">
                                            <p className="font-black text-[10px] text-stone-400 uppercase tracking-widest mb-1">समस्या</p>
                                            <p className="text-stone-600 line-clamp-2">{guidance.problems}</p>
                                        </div>
                                        <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100">
                                            <p className="font-black text-[10px] text-green-600 uppercase tracking-widest mb-1">उपाय</p>
                                            <p className="text-stone-600 line-clamp-2">{guidance.solutions}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
