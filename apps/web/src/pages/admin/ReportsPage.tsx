import React, { useEffect, useState } from 'react';
import { Card, Skeleton, Table } from '@hommiespace/ui';
import API from '../../api/index.js';

interface AnalyticsData {
  totalSalesVolume: number;
  totalOrdersCount: number;
  totalVendorsCount: number;
  totalCustomersCount: number;
  lowStockCount: number;
  latestOrders: Array<{
    id: string;
    customerName?: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
  }>;
}

export const ReportsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsAndLogs = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          API.get('/reports/stats'),
          API.get('/reports/activity-logs')
        ]);
        setData(statsRes.data.data);
        setLogs(logsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsAndLogs();
  }, []);

  const handleDownloadCSV = async (type: string) => {
    try {
      console.log('Initiating CSV download for type:', type);
      const response = await API.get(`/reports/csv?type=${type}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.csv`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      console.error('CSV Download Failure:', err);
      alert('Failed to download CSV report. Please ensure your session is active.');
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Platform Reports & Analytics</h1>
        <p className="text-brand-clay text-sm font-sans">Analyze real-time transaction graphs, catalog health metrics, and export data tables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <p className="text-[10px] uppercase tracking-widest text-brand-clay font-semibold">Gross Sales Volume</p>
          <h2 className="font-serif text-3xl font-bold text-brand-terracotta mt-2">₹{data.totalSalesVolume.toLocaleString()}</h2>
        </Card>
        <Card className="p-6 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <p className="text-[10px] uppercase tracking-widest text-brand-clay font-semibold">Orders Checked Out</p>
          <h2 className="font-serif text-3xl font-bold text-brand-walnut mt-2">{data.totalOrdersCount}</h2>
        </Card>
        <Card className="p-6 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <p className="text-[10px] uppercase tracking-widest text-brand-clay font-semibold">Active Design Studios</p>
          <h2 className="font-serif text-3xl font-bold text-brand-walnut mt-2">{data.totalVendorsCount}</h2>
        </Card>
        <Card className="p-6 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <p className="text-[10px] uppercase tracking-widest text-brand-clay font-semibold">Low Stock Products</p>
          <h2 className="font-serif text-3xl font-bold text-brand-terracotta mt-2">{data.lowStockCount}</h2>
        </Card>
      </div>

      <Card className="p-8 bg-white border border-brand-sand-dark/25 text-left" hoverEffect={false}>
        <h3 className="font-serif text-lg font-bold text-brand-walnut mb-4">Export Platform Data Reports</h3>
        <p className="text-xs text-brand-clay font-sans mb-6">Generate and save spreadsheet records directly to your machine.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            type="button" 
            onClick={() => handleDownloadCSV('sales')}
            className="py-3 px-4 text-xs font-serif uppercase tracking-wider font-bold border border-brand-walnut text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-all cursor-pointer shadow-xs active:scale-95 text-center"
          >
            Export Sales (CSV)
          </button>
          <button 
            type="button" 
            onClick={() => handleDownloadCSV('product')}
            className="py-3 px-4 text-xs font-serif uppercase tracking-wider font-bold border border-brand-walnut text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-all cursor-pointer shadow-xs active:scale-95 text-center"
          >
            Export Catalog (CSV)
          </button>
          <button 
            type="button" 
            onClick={() => handleDownloadCSV('vendor')}
            className="py-3 px-4 text-xs font-serif uppercase tracking-wider font-bold border border-brand-walnut text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-all cursor-pointer shadow-xs active:scale-95 text-center"
          >
            Export Studios (CSV)
          </button>
          <button 
            type="button" 
            onClick={() => handleDownloadCSV('customer')}
            className="py-3 px-4 text-xs font-serif uppercase tracking-wider font-bold border border-brand-walnut text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-all cursor-pointer shadow-xs active:scale-95 text-center"
          >
            Export Customers (CSV)
          </button>
        </div>
      </Card>

      <Card className="p-8 bg-white border border-brand-sand-dark/25 text-left" hoverEffect={false}>
        <h3 className="font-serif text-lg font-bold text-brand-walnut mb-2">Administrator Activity Logs</h3>
        <p className="text-xs text-brand-clay font-sans mb-6">Audited track record of configuration updates, product inventory adjustments, and status changes.</p>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans bg-brand-linen-dark/10">
            No administrator activities recorded in the system logs yet.
          </div>
        ) : (
          <Table headers={['Timestamp', 'User', 'Action', 'Details']}>
            {logs.map(log => (
              <tr key={log.id || log._id} className="hover:bg-brand-sand-light/35 transition-colors border-b border-brand-sand-dark/10">
                <td className="p-4 text-xs font-mono text-brand-clay">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 text-xs font-semibold text-brand-walnut">{log.userName}</td>
                <td className="p-4 text-xs text-brand-terracotta font-serif font-bold">{log.action}</td>
                <td className="p-4 text-xs text-brand-clay font-sans">{log.details}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;
