'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import Toast from '@/components/admin/Toast';
import { X, Eye } from 'lucide-react';

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  // Selected order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setToast({ message: 'Failed to load orders', type: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Listen to the ?view=orderId query parameter to open the modal automatically
  useEffect(() => {
    if (orders.length > 0) {
      const viewId = searchParams.get('view');
      if (viewId) {
        const matched = orders.find(o => o._id === viewId);
        if (matched) {
          setSelectedOrder(matched);
        }
      }
    }
  }, [searchParams, orders]);

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error();

      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
      }
      setToast({ message: 'Order status updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update order status', type: 'error' });
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error();

      setOrders(prev => prev.map(o => o._id === id ? { ...o, paymentStatus: status } : o));
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, paymentStatus: status }));
      }
      setToast({ message: 'Payment status updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update payment status', type: 'error' });
    }
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
    // Remove search param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    router.push(`/admin/orders?${params.toString()}`);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesOrderFilter = orderStatusFilter ? order.orderStatus === orderStatusFilter : true;
    const matchesPaymentFilter = paymentStatusFilter ? order.paymentStatus === paymentStatusFilter : true;
    return matchesOrderFilter && matchesPaymentFilter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Orders</h1>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <select 
            className="admin-select" 
            value={orderStatusFilter} 
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <select 
            className="admin-select" 
            value={paymentStatusFilter} 
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: 'auto' }}>
          {filteredOrders.length} orders found
        </span>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td><strong>#{order._id.substring(order._id.length - 8)}</strong></td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.totalAmount}</td>
                <td>
                  <span className={`badge status-${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge status-${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td>
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      router.push(`/admin/orders?view=${order._id}`);
                    }} 
                    className="table-btn edit"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="admin-empty">
                  <p>No orders found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeDetailsModal} style={{ zIndex: 1100 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '750px', 
              width: '95%', 
              textAlign: 'left', 
              padding: '2.5rem', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={closeDetailsModal} 
              style={{ position: 'absolute', top: '20px', right: '20px', color: '#666', border: 'none', background: 'none' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Order Detail #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
            </h2>

            {/* Grid customer and payment details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '25px' }}>
              
              {/* Customer Column */}
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Delivery Details</h4>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{selectedOrder.customerName}</p>
                <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                  {selectedOrder.address},<br />
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p style={{ fontSize: '0.9rem', marginTop: '2px' }}><strong>Email:</strong> {selectedOrder.email}</p>
                {selectedOrder.notes && (
                  <p style={{ fontSize: '0.85rem', color: '#777', backgroundColor: '#fcfcf0', padding: '10px', marginTop: '12px', borderLeft: '3px solid #d4af37' }}>
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Status Update Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Manage Order</h4>
                
                <div>
                  <label className="field-label" style={{ fontSize: '0.75rem' }}>Order Status</label>
                  <select 
                    className="admin-select"
                    value={selectedOrder.orderStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="field-label" style={{ fontSize: '0.75rem' }}>Payment Status</label>
                  <select 
                    className="admin-select"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => updatePaymentStatus(selectedOrder._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div style={{ marginTop: '10px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p><strong>Payment Method:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedOrder.paymentMethod}</span></p>
                  {selectedOrder.paymentProvider && (
                    <p><strong>Payment Provider:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedOrder.paymentProvider}</span></p>
                  )}
                  {selectedOrder.razorpayOrderId && (
                    <p><strong>Razorpay Order ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedOrder.razorpayOrderId}</span></p>
                  )}
                  {selectedOrder.razorpayPaymentId && (
                    <p><strong>Razorpay Payment ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedOrder.razorpayPaymentId}</span></p>
                  )}
                  <p style={{ fontSize: '1.1rem', marginTop: '6px' }}><strong>Total:</strong> <span style={{ color: '#d4af37', fontWeight: '600' }}>{selectedOrder.totalAmount}</span></p>
                </div>
              </div>
            </div>

            {/* Products List Summary */}
            <h4 style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              Order Items
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#fafafa', padding: '10px 15px', borderRadius: '4px' }}>
                  <img 
                    src={item.productImage || '/product_1.png'} 
                    alt={item.productName} 
                    style={{ width: '50px', height: '67px', objectFit: 'cover', borderRadius: '2px' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.productName}</h5>
                    <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '2px' }}>
                      Size: {item.size || 'Custom'}{item.color ? ` | Color: ${item.color}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                    <p>{item.unitPrice} × {item.quantity}</p>
                    <p style={{ fontWeight: '600', marginTop: '2px' }}>{item.lineTotal}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button onClick={closeDetailsModal} className="admin-btn secondary" style={{ padding: '8px 20px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrdersContent />
    </Suspense>
  );
}
