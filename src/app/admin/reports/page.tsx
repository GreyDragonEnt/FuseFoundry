'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  BarChart3,
  Target,
  Heart
} from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [reportType, setReportType] = useState<
    'orders' | 'customers' | 'revenue' | 'services' | 
    'service-analytics' | 'service-trends' | 'customer-preferences' | 'conversion-funnel'
  >('orders');
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const allServices = useMemo(() => ([
    { id: 'health-check', label: 'Health Check' },
    { id: 'strategy-package', label: 'Strategy Package' },
    { id: 'transformation-blueprint', label: 'Transformation Blueprint' },
    { id: 'strategy-consultation', label: 'Strategy Consultation' }
  ]), []);

  const allStatuses = ['pending','processing','completed','cancelled'];

  const generateReport = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select a date range');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: reportType,
        start: dateRange.start,
        end: dateRange.end
      });
      if (selectedServices.length) params.set('serviceIds', selectedServices.join(','));
      if (selectedStatuses.length) params.set('statuses', selectedStatuses.join(','));

      const response = await fetch(`/api/admin/reports?${params}`);
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${reportType}-report-${dateRange.start}-to-${dateRange.end}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'orders' as const,
      name: 'Orders Report',
      description: 'Detailed order information and status',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 'customers' as const,
      name: 'Customer Report',
      description: 'Customer demographics and purchase history',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'revenue' as const,
      name: 'Revenue Report',
      description: 'Revenue breakdown by service and time period',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      id: 'services' as const,
      name: 'Service Performance',
      description: 'Service popularity and conversion metrics',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      id: 'service-analytics' as const,
      name: 'Service Analytics',
      description: 'Detailed analytics for each service offering',
      icon: BarChart3,
      color: 'text-indigo-600'
    },
    {
      id: 'service-trends' as const,
      name: 'Service Trends',
      description: 'Service performance trends over time',
      icon: TrendingUp,
      color: 'text-emerald-600'
    },
    {
      id: 'customer-preferences' as const,
      name: 'Customer Preferences',
      description: 'Customer service preferences and patterns',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      id: 'conversion-funnel' as const,
      name: 'Conversion Funnel',
      description: 'Service conversion rates and funnel analysis',
      icon: Target,
      color: 'text-amber-600'
    }
  ];

  const quickDateRanges = [
    {
      label: 'Last 7 days',
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    {
      label: 'Last 30 days',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    {
      label: 'Last 90 days',
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    {
      label: 'This year',
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Generate detailed reports for business insights
            </p>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="space-y-6">
          {/* Basic Reports */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.slice(0, 4).map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      reportType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${type.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced Service Analytics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Service Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.slice(4).map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      reportType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${type.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

  {/* Date & Filter Selection */}
  <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Date Range</h2>
          </div>

          {/* Quick Date Range Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickDateRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ start: range.start, end: range.end })}
                className="text-sm"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setDateRange(prev => ({ ...prev, start: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setDateRange(prev => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-800">Services</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allServices.map(s => {
                  const active = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServices(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                      className={`px-3 py-1 rounded-full text-xs border transition ${active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {s.label}
                    </button>
                  )
                })}
                {selectedServices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedServices([])}
                    className="px-2 py-1 text-xs text-gray-500 underline"
                  >Clear</button>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-800">Statuses</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map(st => {
                  const active = selectedStatuses.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatuses(prev => prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st])}
                      className={`px-3 py-1 rounded-full text-xs border capitalize transition ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {st}
                    </button>
                  )
                })}
                {selectedStatuses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatuses([])}
                    className="px-2 py-1 text-xs text-gray-500 underline"
                  >Clear</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Report Preview</h2>
            <Button
              onClick={generateReport}
              disabled={loading || !dateRange.start || !dateRange.end}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Generate Report
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reportTypes.find(t => t.id === reportType)?.name}
            </h3>
            <p className="text-gray-500 mb-4">
              {dateRange.start && dateRange.end ? (
                <>Report period: {dateRange.start} to {dateRange.end}</>
              ) : (
                'Select a date range to preview report details'
              )}
            </p>
            
            {dateRange.start && dateRange.end && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Export format: CSV</p>
                {reportType === 'orders' && (
                  <>
                    <p>• Includes order details, status, and customer information</p>
                    <p>• Service breakdown and pricing data</p>
                  </>
                )}
                {reportType === 'customers' && (
                  <>
                    <p>• Customer demographics and contact information</p>
                    <p>• Purchase history and service preferences</p>
                  </>
                )}
                {reportType === 'revenue' && (
                  <>
                    <p>• Revenue breakdown by service category</p>
                    <p>• Monthly and daily revenue trends</p>
                  </>
                )}
                {reportType === 'services' && (
                  <>
                    <p>• Service popularity and conversion metrics</p>
                    <p>• Performance comparison across services</p>
                  </>
                )}
                {reportType === 'service-analytics' && (
                  <>
                    <p>• Detailed analytics for each service offering</p>
                    <p>• Order counts, revenue, completion rates by service</p>
                    <p>• Customer counts and average order values</p>
                  </>
                )}
                {reportType === 'service-trends' && (
                  <>
                    <p>• Service performance trends over time</p>
                    <p>• Monthly progression of orders and revenue</p>
                    <p>• Trend analysis for business forecasting</p>
                  </>
                )}
                {reportType === 'customer-preferences' && (
                  <>
                    <p>• Customer service preferences and patterns</p>
                    <p>• Most popular services by customer segment</p>
                    <p>• Customer lifetime value by service preference</p>
                  </>
                )}
                {reportType === 'conversion-funnel' && (
                  <>
                    <p>• Service conversion rates and funnel analysis</p>
                    <p>• Quote-to-order conversion by service type</p>
                    <p>• Optimization insights for service offerings</p>
                  </>
                )}
                <p>• Compatible with Excel and Google Sheets</p>
                <p>• Data filtered by selected date range</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Schedule (Future Enhancement) */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Scheduled Reports</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Coming Soon
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Automatically generate and email reports on a schedule. Perfect for weekly or monthly business reviews.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
