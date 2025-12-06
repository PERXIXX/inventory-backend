import React, { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Truck,
  Menu,
  X,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  DollarSign,
  RefreshCw,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

// ======================
// ตั้งค่า API (PHP + MySQL)
// ======================
const API_BASE_URL = "http://localhost/api";

// ใช้ SweetAlert2 ถ้ามีโหลดจาก CDN
const Swal = window.Swal || null;

const safeSwalFire = (options) => {
  if (Swal && typeof Swal.fire === "function") {
    Swal.fire(options);
  } else {
    console.log("Swal.fire:", options);
  }
};

const safeSwalClose = () => {
  if (Swal && typeof Swal.close === "function") {
    Swal.close();
  }
};

// =================================================================
// 1. Login Component (ใช้ PHP login.php)
// =================================================================

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        setLoading(false);
        return;
      }

      onLogin({
        username: data.username,
        retailerId: data.retailer_id,
        shopName: data.shop_name,
        role: data.role,
      });
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition">
            <Package size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ระบบหลังบ้าน</h1>
          <p className="text-blue-100">ระบบจัดการสต๊อกสินค้า</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            เข้าสู่ระบบ
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertTriangle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600">จดจำฉันไว้</span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </div>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              ข้อมูลทดสอบ:
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                👤 Admin:{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded">
                  admin / admin123
                </span>
              </p>
              <p>
                👤 Demo:{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded">
                  demo / demo
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          © 2024 ระบบจัดการสต๊อกสินค้า. All rights reserved.
        </p>
      </div>
    </div>
  );
};

// =================================================================
// 2. Inventory System Component (ดึงจาก MySQL ผ่าน PHP)
// =================================================================

const InventorySystem = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notification, setNotification] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const LOW_STOCK_THRESHOLD = 20;
  const RETAILER_ID = user.retailerId;
  const IS_ADMIN = user.role === "admin";

  // ==============================
  // ดึงสต๊อกจาก get_inventory.php
  // ==============================
  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/get_inventory.php?retailer_id=${RETAILER_ID}`
      );
      const data = await res.json();

      if (!data.success) {
        safeSwalFire({
          icon: "error",
          title: "โหลดข้อมูลไม่สำเร็จ",
          text: data.message || "ไม่สามารถดึงข้อมูลสต๊อกจากเซิร์ฟเวอร์ได้",
        });
        setInventory([]);
      } else {
        const list =
          data.data || data.inventory || data.items || []; // เผื่อชื่อ key ต่างกัน
        setInventory(list);

        // ตัวอย่างคำนวณยอดขาย/มูลค่าสินค้ารวม (mock)
        const totalValue = list.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * (Number(item.current_stock) || 0),
          0
        );
        setTotalRevenue(totalValue);
        setIsAnimating(true);
      }
    } catch (err) {
      console.error("Fetch inventory error:", err);
      safeSwalFire({
        icon: "error",
        title: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
        text: "กรุณาตรวจสอบ Apache/XAMPP และไฟล์ get_inventory.php",
      });
      setInventory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RETAILER_ID]);

  // Animation for revenue display
  useEffect(() => {
    if (isAnimating) {
      const duration = 2000;
      const steps = 60;
      const incrementValue = totalRevenue / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayRevenue(Math.floor(incrementValue * currentStep));
        } else {
          setDisplayRevenue(totalRevenue);
          setIsAnimating(false);
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isAnimating, totalRevenue]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshRevenue = () => {
    if (!isAnimating) {
      setDisplayRevenue(0);
      setIsAnimating(true);
    }
  };

  // ========================================
  // บันทึกการขาย/รับเข้า ผ่าน inventory_update.php
  // ========================================
  const handleTransaction = async (type) => {
  if (!selectedProduct || !quantity || quantity <= 0) {
    showNotification('error', 'กรุณาเลือกสินค้าและระบุจำนวนที่ถูกต้อง');
    return;
  }

  try {
    const res = await fetch('http://localhost/api/save_transaction.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        retailer_id: RETAILER_ID,
        transaction_type: type,
        product_sku: selectedProduct,
        quantity: Number(quantity),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'บันทึกรายการล้มเหลว');
    }

    // ✅ หลังบันทึกสำเร็จ ดึงข้อมูลใหม่จาก server
    await loadInventory();

    showNotification(
      'success',
      type === 'OUT' ? 'บันทึกการขายสำเร็จ' : 'รับสินค้าเข้าสต๊อกสำเร็จ'
    );

    setModalOpen(null);
    setSelectedProduct('');
    setQuantity('');
  } catch (err) {
    console.error(err);
    showNotification('error', `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกรายการ: ${err.message}`);
  }
};

  const filteredInventory = inventory.filter((item) => {
    const name = (item.product_name || "").toLowerCase();
    const sku = (item.sku_id || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());

    const stock = Number(item.current_stock) || 0;

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "low" && stock < LOW_STOCK_THRESHOLD) ||
      (filterStatus === "normal" && stock >= LOW_STOCK_THRESHOLD);

    return matchesSearch && matchesFilter;
  });

  const totalStock = inventory.reduce(
    (sum, item) => sum + (Number(item.current_stock) || 0),
    0
  );
  const lowStockCount = inventory.filter(
    (item) => Number(item.current_stock) < LOW_STOCK_THRESHOLD
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <Package size={28} className="text-blue-200" />
              <h1 className="text-xl font-bold">ระบบหลังบ้าน</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm">{user.shopName}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm font-medium"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <TrendingUp size={20} />
            <span className="font-medium">Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <Package size={20} />
            <span className="font-medium">จัดการสต๊อกของฉัน</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Package className="text-blue-600" size={32} />
              จัดการสต๊อกสินค้า
            </h2>
            <p className="text-slate-600">
              ระบบจัดการสต๊อกสำหรับผู้ค้าปลีก ({user.role.toUpperCase()})
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card - แสดงเฉพาะ Admin */}
            {user.role === "admin" && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign size={32} className="opacity-80" />
                  <button
                    onClick={refreshRevenue}
                    disabled={isAnimating}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition disabled:opacity-50"
                    title="รีเฟรชตัวเลข"
                  >
                    <RefreshCw
                      size={16}
                      className={isAnimating ? "animate-spin" : ""}
                    />
                  </button>
                </div>
                <h3 className="text-lg font-medium mb-2 opacity-90">
                  ยอดขายทั้งหมด (ประมาณ)
                </h3>
                <p className="text-4xl font-bold">
                  ฿{displayRevenue.toLocaleString()}
                </p>
                <p className="text-sm opacity-80 mt-1">บาท</p>
              </div>
            )}

            <div
              className={`bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition ${
                user.role === "admin" ? "" : "md:col-span-2"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Package size={32} className="opacity-80" />
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  รวม
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2 opacity-90">
                จำนวนสินค้าคงเหลือ
              </h3>
              <p className="text-4xl font-bold">
                {loading ? "..." : totalStock.toLocaleString()}
              </p>
              <p className="text-sm opacity-80 mt-1">ชิ้น</p>
            </div>

            <div
              className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition ${
                user.role === "admin" ? "" : "md:col-span-1"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle size={32} className="opacity-80" />
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  เตือน
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2 opacity-90">
                สินค้าที่ต้องสั่งเพิ่ม
              </h3>
              <p className="text-4xl font-bold">
                {loading ? "..." : lowStockCount}
              </p>
              <p className="text-sm opacity-80 mt-1">รายการ</p>
            </div>

            <div
              className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition ${
                user.role === "admin" ? "" : "md:col-span-1"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag size={32} className="opacity-80" />
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  ทั้งหมด
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2 opacity-90">
                จำนวนรายการสินค้า
              </h3>
              <p className="text-4xl font-bold">
                {loading ? "..." : inventory.length}
              </p>
              <p className="text-sm opacity-80 mt-1">ชนิด</p>
            </div>
          </div>

          {/* Actions & Filters */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า (SKU หรือชื่อ)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-auto">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl appearance-none focus:border-blue-500 focus:outline-none transition cursor-pointer"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="low">สินค้าเหลือน้อย</option>
                  <option value="normal">สินค้าปกติ</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={20}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setModalOpen("sale")}
                  className="flex-1 sm:flex-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition font-medium"
                >
                  <Minus size={18} />
                  บันทึกการขาย
                </button>

                {/* ปุ่มรับเข้าเฉพาะ Admin */}
                {user.role === "admin" && (
                  <button
                    onClick={() => setModalOpen("receive")}
                    className="flex-1 sm:flex-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:shadow-lg transition font-medium"
                  >
                    <Plus size={18} />
                    รับเข้า
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      ชื่อสินค้า
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      ราคาขาย
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      จำนวนคงเหลือ
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          กำลังโหลดข้อมูล...
                        </div>
                      </td>
                    </tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        ไม่พบสินค้าที่ค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const stock = Number(item.current_stock) || 0;
                      const low = stock < LOW_STOCK_THRESHOLD;
                      return (
                        <tr
                          key={item.sku_id}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-medium text-slate-700">
                              {item.sku_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-800 font-medium">
                              {item.product_name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-slate-700 font-semibold">
                              ฿
                              {(Number(item.price) || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-16 h-8 rounded-full font-bold ${
                                low
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                low
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {low ? (
                                <>
                                  <AlertTriangle size={14} />
                                  เหลือน้อย
                                </>
                              ) : (
                                "✓ ปกติ"
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Transaction Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`p-6 ${
                modalOpen === "sale"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : "bg-gradient-to-r from-slate-600 to-slate-700"
              } text-white rounded-t-2xl`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {modalOpen === "sale" ? (
                    <>
                      <ShoppingBag size={24} />
                      บันทึกการขาย
                    </>
                  ) : (
                    <>
                      <Truck size={24} />
                      รับสินค้าเข้า
                    </>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setModalOpen(null);
                    setSelectedProduct("");
                    setQuantity("");
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {modalOpen === "receive" && (
                <div className="flex items-start gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                  <AlertTriangle
                    className="text-orange-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-sm text-orange-800">
                    <strong>หมายเหตุ:</strong> การเพิ่มสต๊อกนี้จะไปอัปเดตฐานข้อมูล
                    MySQL ผ่าน inventory_update.php
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  เลือกสินค้า
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="" disabled>
                    กรุณาเลือกสินค้า
                  </option>
                  {inventory.map((item) => (
                    <option key={item.sku_id} value={item.sku_id}>
                      {item.sku_id} - {item.product_name} (เหลือ{" "}
                      {item.current_stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  จำนวน {modalOpen === "sale" ? "ที่ขาย" : "ที่รับเข้า"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="ระบุจำนวน"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(null);
                    setSelectedProduct("");
                    setQuantity("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleTransaction(modalOpen === "sale" ? "OUT" : "IN")
                  }
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg transition ${
                    modalOpen === "sale"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                >
                  {modalOpen === "sale" ? "บันทึกการขาย" : "ยืนยันการรับเข้า"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =================================================================
// 3. Main App Wrapper
// =================================================================

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <InventorySystem user={user} onLogout={handleLogout} />;
};

export default App;
