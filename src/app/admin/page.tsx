"use client";
import { useState, useEffect } from "react";
import { FaLock, FaUserShield, FaChartLine, FaBoxOpen, FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaWhatsapp } from "react-icons/fa";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    benefits: string[];
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
    const [password, setPassword] = useState("12345");
    const [view, setView] = useState<"overview" | "products" | "inquiries">("overview");
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "/peru-kit-card.png",
        benefits: [""],
        isFeatured: false
    });

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
            fetchInquiries();
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (e) { console.error(e); }
    };

    const fetchInquiries = async () => {
        // Mock data for now until API is ready
        setInquiries([
            { id: "1", farmerName: "Rahul Patil", phone: "7798693233", crop: "Peru", district: "Baramati", product: "Peru Special Kit", status: "NEW", createdAt: new Date().toISOString() },
            { id: "2", farmerName: "Sanjay Deshmukh", phone: "9876543210", crop: "Dalimb", district: "Indapur", product: "Nemato Super Killer", status: "COMPLETED", createdAt: new Date().toISOString() }
        ]);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                await fetchProducts();
                setIsAddingProduct(false);
                setNewProduct({ name: "", price: "", image: "/peru-kit-card.png", benefits: [""], isFeatured: false });
            }
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) fetchProducts();
        } catch (e) { console.error(e); }
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
        <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-stone-900 text-white p-8 md:min-h-screen">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 bg-primary rounded-lg" />
                    <span className="font-bold tracking-tight text-xs">GAURAI AGRO Admin</span>
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
                                {inquiries.slice(0, 3).map(inquiry => (
                                    <div key={inquiry.id} className="flex items-center justify-between p-4 border-b border-stone-100">
                                        <div>
                                            <p className="font-bold">{inquiry.farmerName} ({inquiry.district})</p>
                                            <p className="text-stone-500 text-sm">{inquiry.product} • {inquiry.crop}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${inquiry.status === "NEW" ? "bg-primary/10 text-primary" : "bg-stone-100 text-stone-400"}`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {view === "products" && (
                    <div className="animate-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">Catalog Management</h2>
                            <button
                                onClick={() => setIsAddingProduct(true)}
                                className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <FaPlus size={14} /> Add New Product
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="bg-white p-8 rounded-3xl border-2 border-primary mb-8 animate-in zoom-in duration-300">
                                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Product Name (e.g. Bio-Magic)"
                                            className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 focus:outline-none focus:border-primary"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Price or Category (e.g. ₹499 or Bio-Nematicide)"
                                            className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 focus:outline-none focus:border-primary"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                        />
                                        <label className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                            <input
                                                type="checkbox"
                                                checked={newProduct.isFeatured}
                                                onChange={e => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                                            />
                                            Show on Home Page
                                        </label>
                                    </div>
                                    <div className="space-y-4">
                                        <textarea
                                            placeholder="Benefits (One per line)"
                                            className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                            onBlur={e => setNewProduct({ ...newProduct, benefits: e.target.value.split('\n').filter(b => b.trim()) })}
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingProduct(false)}
                                                className="flex-grow p-4 rounded-xl border border-stone-100 font-bold hover:bg-stone-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-grow p-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                            >
                                                {isLoading ? "Saving..." : "Save Product"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="bg-stone-100 p-2 rounded-lg text-stone-600 hover:bg-stone-200"><FaEdit size={12} /></button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-50 p-2 rounded-lg text-red-500 hover:bg-red-100"><FaTrash size={12} /></button>
                                    </div>
                                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                                        <FaBoxOpen className="text-stone-300" size={24} />
                                    </div>
                                    <h3 className="font-bold text-stone-900 mb-1">{product.name}</h3>
                                    <p className="text-primary font-bold text-sm mb-4">{product.price}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.isFeatured && <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-1 rounded-full uppercase">Featured</span>}
                                        <span className="text-[10px] bg-stone-100 text-stone-500 font-bold px-2 py-1 rounded-full uppercase">In Stock</span>
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
                                        <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-widest">Farmer</th>
                                        <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-widest">Crop & Location</th>
                                        <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-widest">Product</th>
                                        <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(inquiry => (
                                        <tr key={inquiry.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-all">
                                            <td className="p-6">
                                                <p className="font-bold text-stone-900">{inquiry.farmerName}</p>
                                                <p className="text-stone-500 text-sm">{inquiry.phone}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-stone-900">{inquiry.crop}</p>
                                                <p className="text-stone-500 text-sm">{inquiry.district}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className="bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full">{inquiry.product}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-3">
                                                    <a
                                                        href={`https://wa.me/${inquiry.phone}`}
                                                        target="_blank"
                                                        className="text-primary hover:scale-110 transition-all"
                                                    >
                                                        <FaWhatsapp size={20} />
                                                    </a>
                                                    <button className="text-stone-300 hover:text-green-500 transition-all"><FaCheck size={18} /></button>
                                                    <button className="text-stone-300 hover:text-red-500 transition-all"><FaTimes size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
