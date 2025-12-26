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
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
                if (data.length === 0) {
                    // Check if fallback is happening silently
                    console.log("No products returned from API");
                }
            } else {
                setError("Failed to parse products.");
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
                                        <textarea
                                            placeholder="Product Benefits (One per line)
Example:
- Improves soil health
- Boosts yield"
                                            className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 focus:outline-none focus:border-primary min-h-[120px]"
                                            value={newProduct.benefits.join('\n')}
                                            onChange={e => setNewProduct({ ...newProduct, benefits: e.target.value.split('\n') })}
                                            required
                                        />
                                        <label className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                            <input
                                                type="checkbox"
                                                checked={newProduct.isFeatured}
                                                onChange={e => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                                            />
                                            Show on Home Page (Featured)
                                        </label>
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

                        {error && (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8 font-bold">
                                {error}
                            </div>
                        )}

                        {products.length === 0 && !isLoading && !error && (
                            <div className="bg-stone-100 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-stone-200">
                                <FaBoxOpen className="mx-auto text-stone-300 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-stone-600 mb-2">No products found.</h3>
                                <p className="text-stone-400">Add your first product to see it here.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm relative group hover:border-primary/20 transition-all">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            className="bg-stone-100 p-2.5 rounded-xl text-stone-600 hover:bg-stone-200 transition-colors"
                                            title="Edit Product"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            disabled={deletingId === product.id}
                                            className="bg-red-50 p-2.5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                            title="Delete Product"
                                        >
                                            {deletingId === product.id ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaTrash size={14} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4">
                                        <FaBoxOpen className="text-stone-300" size={24} />
                                    </div>
                                    <h3 className="font-bold text-stone-900 mb-1 leading-tight pr-12">{product.name}</h3>
                                    <p className="text-primary font-bold text-sm mb-4">{product.price}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.isFeatured && (
                                            <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-1 rounded-full uppercase">Featured</span>
                                        )}
                                        <span className="text-[10px] bg-stone-100 text-stone-500 font-bold px-2 py-1 rounded-full uppercase">Live</span>
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
                                                    <button
                                                        onClick={() => handleUpdateInquiryStatus(inquiry.id, "COMPLETED")}
                                                        className={`transition-all ${inquiry.status === "COMPLETED" ? "text-green-500" : "text-stone-300 hover:text-green-500"}`}
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInquiry(inquiry.id)}
                                                        className="text-stone-300 hover:text-red-500 transition-all"
                                                        title="Delete Inquiry"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
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
