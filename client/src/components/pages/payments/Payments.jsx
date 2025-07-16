// payment-page.jsx
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/api";

export default function Payments() {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("tp_user"));
  const userName = user?.full_name?.split(" ")[0] || "User";

  async function getUserPayments() {
    const id = user?.user_id;
    const response = await fetch(`${API_ENDPOINTS.PAYMENTS}/${id}`);
    const data = await response.json();
    // If backend returns a single object, wrap in array
    setPaymentDetails(Array.isArray(data) ? data : [data]);
    setLoading(false);
  }

  useEffect(() => {
    getUserPayments();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Welcome {userName},</h2>
      <p style={{ marginBottom: '2rem', color: '#555' }}>Please refer to your payment records below.</p>
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.5rem' }}>
        {loading ? (
          <p>Loading payment records...</p>
        ) : paymentDetails && paymentDetails.length > 0 && paymentDetails[0]?.payment_id ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ background: '#f7f7f7', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eee', color:'black' }}>Payment ID</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eee',color:'black' }}>Amount (INR)</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eee',color:'black' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eee',color:'black' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.map((e, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#888' }}>{e.payment_id}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#888' }}>{e.amount}</td>
                  <td style={{ padding: '0.75rem 1rem', color: e.payment_status === 'success' ? '#27ae60' : '#c0392b', fontWeight: 500 }}>{e.payment_status}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#888' }}>{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>No payment records found.</p>
        )}
      </div>
    </div>
  );
}
