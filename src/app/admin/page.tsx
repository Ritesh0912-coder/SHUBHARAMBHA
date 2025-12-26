"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaLock, FaUserShield, FaChartLine, FaBoxOpen, FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaWhatsapp } from "react-icons/fa";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
    description?: string;
    usageMethod?: string;
    category?: string;
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

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("gaurai2025");
    const [view, setView] = useState<"overview" | "products" | "inquiries">("overview");
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        isFeatured: false
    });

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
            fetchInquiries();
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
                image: "/product-group.png",
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
        if (password === "gaurai2025") {
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
                        <p className="text-stone-500 text-sm">Gaurai Agro Consultancy</p>
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
                    <span className="font-bold tracking-tight text-xs uppercase">GAURAI AGRO Admin</span>
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
                        <FaBoxOpen /> Manage Products
                    </button>
                    <button
                        onClick={() => setView("inquiries")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "inquiries" ? "bg-primary text-white" : "text-stone-400 hover:text-white"}`}
                    >
                        <FaUsers /> Inquiries
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-12 overflow-x-hidden">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            {view === "overview" && "Dashboard Overview"}
                            {view === "products" && "Product Management"}
                            {view === "inquiries" && "Farmer Inquiries"}
                        </h1>
                        <p className="text-stone-500">Gaurai Agro Consultancy • Administrative Control</p>
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
                                    setNewProduct({ name: "", price: "", image: "/peru-kit-card.png", benefits: [""], description: "", usageMethod: "", category: "", isFeatured: false });
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
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
            </main>
        </div>
    );
}
