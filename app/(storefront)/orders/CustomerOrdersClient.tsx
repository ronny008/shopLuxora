"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, Product } from '@/types';
import { Search, Package, Eye, FileText, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';

interface CustomerOrdersClientProps {
  orders: Order[];
  products: Product[];
}

export function CustomerOrdersClient({ orders, products }: CustomerOrdersClientProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getProductDetails = (productId: string) => {
    return products.find((p) => p._id === productId);
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by tab status
    if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchItemName = order.items.some((item) => {
        const product = getProductDetails(item.productId);
        return product?.name.toLowerCase().includes(q);
      });
      return matchOrderNum || matchItemName;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        );
      case 'processing':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
            {status}
          </span>
        );
    }
  };

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => ['processing', 'pending'].includes(o.status.toLowerCase())).length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status.toLowerCase() === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status.toLowerCase() === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status.toLowerCase() === 'cancelled').length },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                  activeTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order # or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <FadeIn>
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              {searchQuery || activeTab !== 'all'
                ? "We couldn't find any orders matching your search filters."
                : "You haven't placed any orders yet."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <FadeIn key={order._id}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order Placed</span>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order Number</span>
                      <p className="text-sm font-bold text-slate-900 font-mono">#{order.orderNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount</span>
                      <p className="text-base font-bold text-slate-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 divide-y divide-slate-100">
                  {order.items.map((item, idx) => {
                    const product = getProductDetails(item.productId);
                    return (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            {product?.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                              {product?.name || 'Item Details'}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Qty: <span className="font-medium text-slate-700">{item.quantity}</span> &bull; Unit Price: ${item.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 capitalize">
                              Payment: {order.payment.method} ({order.payment.status})
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span>Delivering to: <strong className="text-slate-700 truncate max-w-[200px] sm:max-w-xs inline-block align-bottom">{order.address}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/orders/${order._id}/invoice`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Invoice
                    </Link>
                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Order & Track
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
