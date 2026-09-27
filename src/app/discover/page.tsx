'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw, X, Sparkles } from 'lucide-react';

export default function DiscoverPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedSize, selectedColor, minPrice, maxPrice, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedCategory) queryParams.set('category', selectedCategory);
      if (selectedSize) queryParams.set('size', selectedSize);
      if (selectedColor) queryParams.set('color', selectedColor);
      if (minPrice > 0) queryParams.set('minPrice', minPrice.toString());
      if (maxPrice < 10000) queryParams.set('maxPrice', maxPrice.toString());
      if (sortBy) queryParams.set('sortBy', sortBy);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy('newest');
  };

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const colorOptions = ['Black', 'White', 'Beige', 'Navy', 'Indigo', 'Gold', 'Sage', 'Red'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FFF8EC]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#6C3B8F]/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Editorial Collection</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#432457] mt-1">Discover Fashion</h1>
          <p className="text-[#746A78] text-sm mt-1">Browse apparel from boutique partner shops on LUXU E-STORE.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#746A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clothes, brands, materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] placeholder-[#746A78] text-xs focus:outline-none focus:border-[#6C3B8F] transition font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#746A78] hover:text-[#241B29]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition ${
            selectedCategory === ''
              ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md'
              : 'bg-[#F6EEDC] text-[#241B29] hover:bg-[#E9DDF0] border border-[#6C3B8F]/10'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition ${
              selectedCategory === cat.slug
                ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md'
                : 'bg-[#F6EEDC] text-[#241B29] hover:bg-[#E9DDF0] border border-[#6C3B8F]/10'
            }`}
          >
            {cat.name} ({cat._count?.products || 0})
          </button>
        ))}
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="flex items-center justify-between text-xs text-[#241B29] bg-[#F6EEDC] p-4 rounded-2xl border border-[#6C3B8F]/15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E9DDF0] text-[#432457] font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#6C3B8F]" />
            <span>Filters</span>
          </button>

          <span className="text-[#746A78]">
            Showing <strong className="text-[#432457]">{products.length}</strong> items
          </span>

          {(selectedCategory || selectedSize || selectedColor || minPrice > 0 || maxPrice < 10000 || search) && (
            <button
              onClick={resetFilters}
              className="text-[#6C3B8F] hover:underline flex items-center gap-1 ml-2 font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-[#746A78] hidden sm:inline font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FFF8EC] border border-[#6C3B8F]/20 rounded-xl px-3 py-1.5 text-xs text-[#241B29] font-semibold focus:outline-none focus:border-[#6C3B8F]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Most Liked / Popular</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Sidebar Filters Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar (Desktop) */}
        <aside className={`md:block space-y-6 bg-[#F6EEDC] p-6 rounded-3xl border border-[#6C3B8F]/15 h-fit ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between border-b border-[#6C3B8F]/15 pb-4">
            <h3 className="font-serif font-bold text-[#432457] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6C3B8F]" />
              <span>Filter Apparel</span>
            </h3>
            <button onClick={() => setMobileFilterOpen(false)} className="md:hidden text-[#746A78]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#432457]">Size</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {sizeOptions.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedSize === sz
                      ? 'bg-[#6C3B8F] text-[#FFF8EC]'
                      : 'bg-[#FFF8EC] text-[#241B29] border border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#432457]">Color</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {colorOptions.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedColor === col
                      ? 'bg-[#6C3B8F] text-[#FFF8EC]'
                      : 'bg-[#FFF8EC] text-[#241B29] border border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-[#432457]">Max Price</label>
              <span className="font-mono text-[#6C3B8F] font-bold">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#6C3B8F]"
            />
          </div>

          {/* Social Impact Margin Note */}
          <div className="p-4 rounded-2xl bg-[#E9DDF0] border border-[#6C3B8F]/20 text-xs text-[#241B29] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#432457]">
              <Sparkles className="w-3.5 h-3.5 text-[#6C3B8F]" />
              <span>LUXU Referral Commerce</span>
            </div>
            <p className="text-[11px] text-[#746A78] leading-relaxed">
              When you click "Shop Now", you visit the boutique's original website while supporting NGO clothing donation drives.
            </p>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[4/5] rounded-2xl bg-[#F6EEDC] animate-pulse border border-[#6C3B8F]/10" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E9DDF0] flex items-center justify-center text-[#6C3B8F]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#432457]">No products found matching filters</h3>
              <p className="text-xs text-[#746A78] max-w-sm mx-auto">Try clearing search terms or adjusting size, color, or price range filters.</p>
              <button
                onClick={resetFilters}
                className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
