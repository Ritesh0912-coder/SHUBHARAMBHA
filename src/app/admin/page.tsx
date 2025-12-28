"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaLock, FaUserShield, FaChartLine, FaBoxOpen, FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaWhatsapp, FaVideo, FaYoutube, FaEye, FaEyeSlash, FaChevronDown, FaLightbulb, FaCloudUploadAlt } from "react-icons/fa";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
    description?: string;
    usageMethod?: string;
    category?: string;
    suitableCrops?: string[];
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
    image?: string;
    problems: string;
    solutions: string;
    usageMethod: string;
    advice: string;
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
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "/peru-kit-card.png",
        benefits: [""],
        description: "",
        usageMethod: "",
        category: "",
        suitableCrops: "",
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
    const [newGuidance, setNewGuidance] = useState({
        cropName: "पेरू",
        image: "",
        problems: "",
        solutions: "",
        usageMethod: "",
        advice: ""
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
                setNewGuidance({ cropName: "पेरू", image: "", problems: "", solutions: "", usageMethod: "", advice: "" });
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
            image: guidance.image || "",
            problems: guidance.problems,
            solutions: guidance.solutions,
            usageMethod: guidance.usageMethod,
            advice: guidance.advice
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
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                await fetchProducts();
                setIsAddingProduct(false);
                setIsEditing(false);
                setEditingId(null);
                setNewProduct({
                    name: "",
                    price: "",
                    image: "/peru-kit-card.png",
                    benefits: [""],
                    description: "",
                    usageMethod: "",
                    category: "",
                    suitableCrops: "",
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
            price: product.price,
            image: product.image,
            benefits: product.benefits,
            description: product.description || "",
            usageMethod: product.usageMethod || "",
            category: product.category || "",
            suitableCrops: (product.suitableCrops || []).join(", "),
            isVisible: product.isVisible !== false,
            isSpecialKit: product.isSpecialKit || false,
            isFeatured: product.isFeatured
        });
        setEditingId(product.id);
        setIsEditing(true);
        setIsAddingProduct(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                name: "श्री गौराई ॲग्रो पेरू स्पेशल कीट",
                price: "₹४५००",
                image: "/peru-kit-card.png",
                benefits: ["पेरूच्या आकारासाठी ४ टप्प्यांचे नियोजन", "निमॅटोड आणि मुळकूजवर १००% मात"],
                description: "आता पेरूवरील प्रत्येक रोगासाठी वेगळे औषध खरेदी करण्याची गरज नाही. आमचे हे कीट ४ टप्प्यात संपूर्ण बागेचे आरोग्य सुधारते.",
                usageMethod: "तज्ञांच्या सल्ल्यानुसार ड्रीप किंवा पाण्यासोबत.",
                category: "Special Kit",
                isFeatured: true
            },
            {
                name: "Nemato Super Killer (निमॅटो किलर)",
                price: "₹८९९",
                image: "/nemato.png",
                benefits: ["मुळांवरील गाठी (Nematodes) नष्ट करते", "मुळकूज आणि कोमेजणे थांबवते"],
                description: "मुळांवरील निमॅटोड (गाठी) आणि मर रोगावर अत्यंत प्रभावी जैविक सोल्यूशन. मातीतील हानिकारक सूक्ष्मजीव नष्ट करते.",
                usageMethod: "२-३ मिली प्रती लिटर पाण्यातून ड्रेचिंग (Drenching) द्वारे.",
                category: "Bio-Nematicide",
                isFeatured: false
            },
            {
                name: "K-Lifter (के-लिफ्टर)",
                price: "₹७५०",
                image: "/k-lifter.png",
                benefits: ["फळांचा आकार आणि वजन वाढवते", "फळांना उत्तम रंग आणि गोडवा देते", "जमिनीतील स्थिर पालाश उपलब्ध करून देते"],
                description: "फळांच्या उत्तम फुगवणीसाठी आणि चकाकीसाठी विशेषतः तयार केलेले पोटॅश मोबिलायझर.",
                usageMethod: "२.५ मिली प्रती लिटर पाण्यातून फवारणी किंवा ड्रीप.",
                category: "Potash Mobilizer",
                isFeatured: true
            },
            {
                name: "Bio-Magic (बायो-मॅजिक)",
                price: "₹६५०",
                image: "/bio-magic.png",
                benefits: ["फुलगळ थांबवते आणि नवीन फुले आणते", "फुलांचे फळात रूपांतर करण्याचे प्रमाण वाढवते"],
                description: "भरघोस फुलधारणेसाठी आणि कळ्या टिकवण्यासाठी नैसर्गिकरीत्या तयार केलेले बूस्टर.",
                usageMethod: "२ मिली प्रती लिटर पाण्यातून फुलधारणेच्या आधी.",
                category: "Flower Booster",
                isFeatured: false
            },
            {
                name: "Rootlix (रूटलिक्स्)",
                price: "₹५९९",
                image: "/rootlix-new.png",
                benefits: ["पांढऱ्या मुळ्यांची जोमदार वाढ", "अन्नद्रव्य शोषण्याची क्षमता वाढवते"],
                description: "पांढऱ्या मुळ्यांच्या जोमदार वाढीसाठी विशेष पावडर. पिकाला जमिनीत घट्ट पकड मिळवून देते.",
                usageMethod: "५०० ग्रॅम प्रती एकर ड्रीप किंवा पाण्यासोबत.",
                category: "Root Developer",
                isFeatured: false
            },
            {
                name: "Agni-Vayu (अग्नी-वायू)",
                price: "₹९५०",
                image: "/product-group.png",
                benefits: ["पांढरी माशी आणि तुडतुड्यांवर प्रभावी", "नैसर्गिक आणि बिनविषारी कीटकनाशक"],
                description: "पांढरी माशी आणि इतर शोषक कीटकांसाठी अत्यंत प्रभावी नैसर्गिक कीटकनाशक. पिकाला अंतर्गत ताकद देते.",
                usageMethod: "२ मिली प्रती लिटर पाण्यातून फवारणी.",
                category: "Pest Control",
                isFeatured: true
            },
            {
                name: "Sudarshan (सुदर्शन)",
                price: "₹१२००",
                image: "/product-group.png",
                benefits: ["पिकाच्या जोमदार वाढीसाठी विशेष टॉनिक", "फुलांची संख्या वाढवते"],
                description: "पिकाच्या सर्वांगीण वाढीसाठी आणि अधिक फुटव्यांसाठी विशेष टॉनिक. हिरवेपणा आणि जोम कायम राखते.",
                usageMethod: "१.५ मिली प्रती लिटर पाण्यातून फवारणी.",
                category: "Growth Promoter",
                isFeatured: false
            },
            {
                name: "Bhoomi-Shakti (भूमी-शक्ती)",
                price: "₹८५०",
                image: "/product-group.png",
                benefits: ["मातीचा पोत सुधारते", "सुपीकता आणि सेंद्रिय कर्ब वाढवते"],
                description: "मातीचा पोत सुधारण्यासाठी आणि सुपीकता वाढवण्यासाठी सेंद्रिय खत बूस्टर.",
                usageMethod: "५-१० किलो प्रती एकर जमिनीतून सेंद्रिय खतासोबत.",
                category: "Soil Conditioner",
                isFeatured: true
            },
            {
                name: "Fruit-Fine (फ्रूट-फाईन)",
                price: "₹७००",
                image: "/product-group.png",
                benefits: ["फळांना नैसर्गिक चकाकी देते", "रंग आणि वजन सुधारते"],
                description: "फळांना नैसर्गिक चकाकी, रंग आणि वजन मिळवून देण्यासाठी विशेष फवारणी.",
                usageMethod: "१ मिली प्रती लिटर पाण्यातून फळांच्या फुगवणी काळात.",
                category: "Fruit Quality Booster",
                isFeatured: false
            },
            {
                name: "Gau-Shakti (गौ-शक्ती)",
                price: "₹५५०",
                image: "/product-group.png",
                benefits: ["शेणखताचे विघटन जलद करते", "उपलब्ध नत्र वाढवते"],
                description: "शेणखताची शक्ती वाढवून पिकांना उपलब्ध करून देणारे जैविक घटक.",
                usageMethod: "१ लिटर प्रती एकर शेणखतासोबत किंवा पाण्यातून.",
                category: "Manure Booster",
                isFeatured: false
            },
            {
                name: "Pseudo (Radix)",
                price: "₹८००",
                image: "/pseudo.png",
                benefits: ["Control Bacterial Disease", "Boosts Plant Immunity"],
                description: "Effective control for bacterial disease in crops. Helps in reducing bacterial wilt and leaf spots.",
                usageMethod: "Foliar spray or soil application as per requirement.",
                category: "Bactericide",
                isFeatured: false
            },
            {
                name: "Tricho (Radix)",
                price: "₹८००",
                image: "/tricho.png",
                benefits: ["Control for harmful Fungi", "Protects Roots"],
                description: "Bio-fungicide that controls soil-borne pathogens and improves root health.",
                usageMethod: "Soil drenching or seed treatment.",
                category: "Fungicide",
                isFeatured: false
            },
            {
                name: "Anar Special Kit",
                price: "₹१५००",
                image: "/anar-special.png",
                benefits: ["Complete Nutrition for Pomegranate", "Improves Fruit Size & Color"],
                description: "Specialized kit for pomegranate (Anar) crops to ensure high yield and quality fruit.",
                usageMethod: "Use as per schedule provided in the box.",
                category: "Special Kit",
                isFeatured: true
            },
            {
                name: "CIBA (Radix)",
                price: "₹९००",
                image: "/ciba.png",
                benefits: ["Special for flower initiation", "Reduces Flower Drop"],
                description: "Promotes profuse flowering and reduces flower dropping in various crops.",
                usageMethod: "Spray during flowering stage.",
                category: "Flower Booster",
                isFeatured: true
            },
            {
                name: "Croptonic (Radix)",
                price: "₹१०००",
                image: "/croptonic.png",
                benefits: ["Advance Bio Stimulant", "Increases Yield"],
                description: "Advanced bio-stimulant for overall crop growth, stress resistance, and yield improvement.",
                usageMethod: "Foliar spray during active growth period.",
                category: "Bio Stimulant",
                isFeatured: false
            },
            {
                name: "Shubharambha Peru Special Kit",
                price: "₹१२००",
                image: "/shubharambha-kit.png",
                benefits: ["Complete Nutrition for Guava", "Improves Size & Sweetness"],
                description: "All-in-one kit for Guava (Peru) cultivation. Ensures balanced nutrition and protection.",
                usageMethod: "Use as per kit instructions.",
                category: "Special Kit",
                isFeatured: true
            },
            {
                name: "Subtilis (Radix)",
                price: "₹८००",
                image: "/subtilis.png",
                benefits: ["Controls Bacterial Wilt", "Soil Health Improvement"],
                description: "Bacillus Subtilis based bio-bactericide. Effective against soil-borne bacterial pathogens.",
                usageMethod: "Drenching or soil application.",
                category: "Bactericide",
                isFeatured: false
            },
            {
                name: "Bio-Magic (Radix Premium)",
                price: "₹९५०",
                image: "/bio-magic-radix.png",
                benefits: ["Enhanced Flowering", "Reduces Flower Drop"],
                description: "Premium flowering stimulant. Ensures maximum conversion of flowers to fruit.",
                usageMethod: "Foliar spray during pre-flowering.",
                category: "Flower Booster",
                isFeatured: true
            },
            {
                name: "Evitor (Radix)",
                price: "₹८५०",
                image: "/evitor.png",
                benefits: ["Controls Larvae & Sucking Pests", "Eco-friendly"],
                description: "Effective bio-pesticide for controlling larvae and sucking pests without chemical residue.",
                usageMethod: "Spray 2ml per liter of water.",
                category: "Pest Control",
                isFeatured: false
            },
            {
                name: "P-Lifter & K-Lifter Combo",
                price: "₹१२००",
                image: "/lifter-combo.png",
                benefits: ["Mobilizes Phosphorous & Potash", "Improves Fruit Quality"],
                description: "Combo pack of Phosphate Solubilizing Bacteria (PSB) and Potash Mobilizer. Essential for fruit development.",
                usageMethod: "Drip irrigation or drenching.",
                category: "Soil Health",
                isFeatured: true
            },
            {
                name: "Nutrimax (Radix)",
                price: "₹७५०",
                image: "/nutrimax.png",
                benefits: ["Complete Micronutrient Mix", "Enriched with Amino & Seaweed"],
                description: "Liquid micronutrient formula (Grade II) for resolving nutrient deficiencies.",
                usageMethod: "Foliar spray.",
                category: "Micronutrients",
                isFeatured: false
            },
            {
                name: "Spark (Radix)",
                price: "₹५५०",
                image: "/spark.png",
                benefits: ["Neem/Karanj Oil Combo", "Effective Pest Repellent"],
                description: "Herbal combination for pest control. 10000 ppm formulation.",
                usageMethod: "Spray as preventative measure.",
                category: "Pest Control",
                isFeatured: false
            },
            {
                name: "Zycoprime (Radix)",
                price: "₹१४००",
                image: "/zycoprime.png",
                benefits: ["All-in-one Growth Booster", "High Solubility"],
                description: "Comprehensive plant food for vegetative growth and root development.",
                usageMethod: "Drip or drenching.",
                category: "Growth Promoter",
                isFeatured: true
            },
            {
                name: "Bio-Strock (Radix)",
                price: "₹६५०",
                image: "/bio-strock.png",
                benefits: ["Multipurpose Plant Food", "Improves Greenery"],
                description: "Organic plant food supplement for overall health and vigor.",
                usageMethod: "Foliar spray or soil application.",
                category: "Plant Food",
                isFeatured: false
            },
            // ============ SPECIAL KITS (3 Main Kits) ============
            {
                name: "पेरू स्पेशल किट",
                price: "₹6,200",
                image: "/peru-special-kit.png",
                benefits: [
                    "पेरूच्या संपूर्ण वाढीसाठी ४ टप्प्यांचे नियोजन",
                    "निमॅटोड आणि मुळकूजवर प्रभावी नियंत्रण",
                    "फळांचा आकार आणि गोडवा वाढवते",
                    "रासायनिक खर्चात बचत"
                ],
                description: "पेरू बागेसाठी संपूर्ण जैविक सोल्यूशन. ४ डोस सिस्टीमद्वारे बागेचे आरोग्य सुधारते आणि भरघोस उत्पादन मिळते.",
                usageMethod: "किटमधील मार्गदर्शनानुसार ड्रीप किंवा पाण्यासोबत वापरा.",
                category: "Special Kit",
                isSpecialKit: true,
                isFeatured: true
            },
            {
                name: "डाळिंब स्पेशल किट",
                price: "₹18,500",
                image: "/anar-special.png",
                benefits: [
                    "डाळिंबाच्या संपूर्ण वाढीसाठी विशेष फॉर्म्युला",
                    "फळांना नैसर्गिक लाल रंग आणि चकाकी",
                    "मुळकूज आणि बॅक्टेरियल ब्लाइटवर नियंत्रण",
                    "फळांचा आकार आणि वजन वाढवते"
                ],
                description: "डाळिंब बागेसाठी प्रीमियम जैविक किट. एक्सपोर्ट क्वालिटी फळांसाठी आवश्यक सर्व उत्पादने एकत्र.",
                usageMethod: "किटमधील मार्गदर्शनानुसार टप्प्याटप्प्याने वापरा.",
                category: "Special Kit",
                isSpecialKit: true,
                isFeatured: true
            },
            {
                name: "केळी स्पेशल किट",
                price: "₹3,700",
                image: "/product-group.png",
                benefits: [
                    "केळीच्या जोमदार वाढीसाठी विशेष फॉर्म्युला",
                    "घडाचा आकार आणि वजन वाढवते",
                    "पानांचा हिरवेपणा कायम राखते",
                    "मुळांची मजबूती वाढवते"
                ],
                description: "केळी पिकासाठी संपूर्ण जैविक सोल्यूशन. कमी खर्चात जास्त उत्पादन.",
                usageMethod: "किटमधील मार्गदर्शनानुसार ड्रीप किंवा पाण्यासोबत वापरा.",
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
                                    setNewProduct({ name: "", price: "", image: "/peru-kit-card.png", benefits: [""], description: "", usageMethod: "", category: "", suitableCrops: "", isVisible: true, isSpecialKit: false, isFeatured: false });
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
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                                            <input
                                                placeholder="e.g. Bio-Magic Booster"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-bold"
                                                value={newProduct.name}
                                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Price</label>
                                                <input
                                                    placeholder="₹750"
                                                    className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                    value={newProduct.price}
                                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                                <input
                                                    placeholder="Bio-Nematicide"
                                                    className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                    value={newProduct.category}
                                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Method of Usage</label>
                                            <input
                                                placeholder="2ml per Liter or Drip Irrigation"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary"
                                                value={newProduct.usageMethod}
                                                onChange={e => setNewProduct({ ...newProduct, usageMethod: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Key Benefits (One per line)</label>
                                            <textarea
                                                placeholder="- Increases Yield&#10;- Improves Soil Health"
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newProduct.benefits.join('\n')}
                                                onChange={e => setNewProduct({ ...newProduct, benefits: e.target.value.split('\n') })}
                                                required
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
                                        <p className="text-primary font-black text-xl">{product.price}</p>
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
                                <form onSubmit={handleAddGuidance} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">पीक निवडा</label>
                                            <select
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary font-bold appearance-none"
                                                value={newGuidance.cropName}
                                                onChange={e => setNewGuidance({ ...newGuidance, cropName: e.target.value })}
                                            >
                                                <option value="पेरू">पेरू (Guava)</option>
                                                <option value="डाळिंब">डाळिंब (Pomegranate)</option>
                                                <option value="केळी">केळी (Banana)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">पिकाचे छायाचित्र (Image)</label>
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
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">मुख्य समस्या (Problems)</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance.problems}
                                                onChange={e => setNewGuidance({ ...newGuidance, problems: e.target.value })}
                                                placeholder="पिकातील मुख्य समस्या लिहा..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">जैविक उपाय (Solutions)</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance.solutions}
                                                onChange={e => setNewGuidance({ ...newGuidance, solutions: e.target.value })}
                                                placeholder="त्यावरील जैविक उपाय लिहा..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">वापरण्याची पद्धत</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance.usageMethod}
                                                onChange={e => setNewGuidance({ ...newGuidance, usageMethod: e.target.value })}
                                                placeholder="उत्पादने वापरण्याची योग्य पद्धत लिहा..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">मार्गदर्शन / सल्ला</label>
                                            <textarea
                                                className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                                value={newGuidance.advice}
                                                onChange={e => setNewGuidance({ ...newGuidance, advice: e.target.value })}
                                                placeholder="शेतकऱ्यांसाठी विशेष सल्ला/टीप..."
                                                required
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
                                        {isEditingGuidance ? "माहिती अपडेट करा" : "मार्गदर्शन माहिती जतन करा"}
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
