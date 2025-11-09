import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { AdminDatabase } from '@/lib/admin-database';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
  const reportType = searchParams.get('type') as 'orders' | 'customers' | 'revenue' | 'services' | 'service-analytics' | 'service-trends' | 'customer-preferences' | 'conversion-funnel';
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const serviceIdsParam = searchParams.get('serviceIds');
  const statusesParam = searchParams.get('statuses');
  const serviceIds = serviceIdsParam ? serviceIdsParam.split(',').filter(Boolean) : undefined;
  const statuses = statusesParam ? statusesParam.split(',').filter(Boolean) : undefined;

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: type, start, end' }, 
        { status: 400 }
      );
    }

    let csvContent = '';
    const filename = `${reportType}-report-${startDate}-to-${endDate}.csv`;

    switch (reportType) {
      case 'orders':
        csvContent = await generateOrdersReport(startDate, endDate, serviceIds, statuses);
        break;
      case 'customers':
        csvContent = await generateCustomersReport(startDate, endDate);
        break;
      case 'revenue':
        csvContent = await generateRevenueReport(startDate, endDate, serviceIds);
        break;
      case 'services':
        csvContent = await generateServicesReport(startDate, endDate, serviceIds, statuses);
        break;
      case 'service-analytics':
        csvContent = await generateDetailedServiceAnalyticsReport(startDate, endDate, serviceIds, statuses);
        break;
      case 'service-trends':
        csvContent = await generateServiceTrendsReport(startDate, endDate, serviceIds, statuses);
        break;
      case 'customer-preferences':
        csvContent = await generateCustomerPreferencesReport(startDate, endDate, serviceIds);
        break;
      case 'conversion-funnel':
        csvContent = await generateConversionFunnelReport(startDate, endDate, serviceIds, statuses);
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' }, 
      { status: 500 }
    );
  }
}

async function generateOrdersReport(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<string> {
  const orders = await AdminDatabase.getFilteredOrders(startDate, endDate, serviceIds, statuses);
  
  const headers = [
    'Order ID',
    'Service',
    'Price',
    'Status',
    'Payment Status',
    'Customer Email',
    'Customer Phone',
    'Website URL',
    'Business Concerns',
    'Consultation Time',
    'Created Date',
    'Updated Date'
  ];

  const rows = orders.map(order => {
    try {
      const createdDate = order.created_at ? new Date(order.created_at).toISOString() : '';
      const updatedDate = order.updated_at ? new Date(order.updated_at).toISOString() : createdDate;
      
      return [
        order.id,
        order.service_title,
        order.service_price,
        order.status,
        order.payment_status,
        order.customer_email,
        order.customer_phone || '',
        order.website_url,
        order.business_concerns || '',
        order.preferred_consultation_time || '',
        createdDate,
        updatedDate
      ];
    } catch (error) {
      console.error('Error processing order date:', error, order);
      return [
        order.id,
        order.service_title,
        order.service_price,
        order.status,
        order.payment_status,
        order.customer_email,
        order.customer_phone || '',
        order.website_url,
        order.business_concerns || '',
        order.preferred_consultation_time || '',
        '',
        ''
      ];
    }
  });

  return createCSV(headers, rows);
}

async function generateCustomersReport(startDate: string, endDate: string): Promise<string> {
  const customers = await AdminDatabase.getCustomersInDateRange(startDate, endDate);
  
  const headers = [
    'Customer Email',
    'First Name',
    'Last Name',
    'Phone',
    'Company',
    'Total Orders',
    'Total Spent',
    'Last Order Date',
    'First Order Date'
  ];

  const rows = customers.map(customer => [
    customer.email,
    customer.first_name,
    customer.last_name,
    customer.phone || '',
    customer.company || '',
    customer.total_orders,
    customer.total_spent,
    customer.last_order_date || '',
    customer.created_at
  ]);

  return createCSV(headers, rows);
}

async function generateRevenueReport(startDate: string, endDate: string, serviceIds?: string[]): Promise<string> {
  const revenueData = await AdminDatabase.getRevenueInDateRange(startDate, endDate, serviceIds);
  
  const headers = [
    'Date',
    'Service ID',
    'Service Title',
    'Orders Count',
    'Total Revenue',
    'Average Order Value'
  ];

  const rows = revenueData.map(item => [
    item.date,
    item.service_id,
    item.service_title,
    item.orders_count,
    item.total_revenue,
    item.average_order_value
  ]);

  return createCSV(headers, rows);
}

async function generateServicesReport(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<string> {
  const serviceStats = await AdminDatabase.getServiceStatsInDateRange(startDate, endDate, serviceIds, statuses);
  
  const headers = [
    'Service ID',
    'Service Title',
    'Total Orders',
    'Total Revenue',
    'Average Price',
    'Completed Orders',
    'Completion Rate (%)'
  ];

  const rows = serviceStats.map(service => [
    service.service_id,
    service.service_title,
    service.order_count,
    service.total_revenue,
    service.average_price,
    service.completed_count,
    service.order_count > 0 ? ((service.completed_count / service.order_count) * 100).toFixed(2) : '0'
  ]);

  return createCSV(headers, rows);
}

async function generateDetailedServiceAnalyticsReport(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<string> {
  const analytics = await AdminDatabase.getDetailedServiceAnalytics(startDate, endDate, serviceIds, statuses);
  
  const headers = [
    'Service ID',
    'Service Title',
    'Total Orders',
    'Total Revenue',
    'Average Price',
    'Min Price',
    'Max Price',
    'Completed Orders',
    'Pending Orders',
    'Processing Orders',
    'Cancelled Orders',
    'Completion Rate (%)',
    'Cancellation Rate (%)',
    'Unique Customers',
    'Revenue per Customer',
    'Avg Completion Days'
  ];

  const rows = analytics.map(item => [
    item.service_id,
    item.service_title,
    item.total_orders,
    item.total_revenue,
    item.average_price,
    item.min_price,
    item.max_price,
    item.completed_orders,
    item.pending_orders,
    item.processing_orders,
    item.cancelled_orders,
    item.completion_rate,
    item.cancellation_rate,
    item.unique_customers,
    item.revenue_per_customer,
    item.avg_completion_days || 0
  ]);

  return createCSV(headers, rows);
}

async function generateServiceTrendsReport(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<string> {
  const trends = await AdminDatabase.getServiceTrends(startDate, endDate, serviceIds, statuses);
  
  const headers = [
    'Date',
    'Service ID',
    'Service Title',
    'Daily Orders',
    'Daily Revenue',
    'Daily Completed'
  ];

  const rows = trends.map(item => [
    item.date,
    item.service_id,
    item.service_title,
    item.daily_orders,
    item.daily_revenue,
    item.daily_completed
  ]);

  return createCSV(headers, rows);
}

async function generateCustomerPreferencesReport(startDate: string, endDate: string, serviceIds?: string[]): Promise<string> {
  const preferences = await AdminDatabase.getCustomerServicePreferences(startDate, endDate, serviceIds);
  
  const headers = [
    'Service ID',
    'Service Title',
    'Unique Customers',
    'Total Orders',
    'Total Revenue',
    'Avg Customer Spend',
    'Avg Orders per Customer'
  ];

  const rows = preferences.map(item => [
    item.service_id,
    item.service_title,
    item.unique_customers,
    item.total_orders,
    item.total_revenue,
    item.avg_customer_spend,
    item.avg_orders_per_customer
  ]);

  return createCSV(headers, rows);
}

async function generateConversionFunnelReport(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<string> {
  const funnel = await AdminDatabase.getServiceConversionFunnel(startDate, endDate, serviceIds, statuses);
  
  const headers = [
    'Service ID',
    'Service Title',
    'Total Started',
    'Total Progressed',
    'Total Completed',
    'Progress Rate (%)',
    'Completion Rate (%)',
    'Finish Rate (%)'
  ];

  const rows = funnel.map(item => [
    item.service_id,
    item.service_title,
    item.total_started,
    item.total_progressed,
    item.total_completed,
    item.progress_rate,
    item.completion_rate,
    item.finish_rate
  ]);

  return createCSV(headers, rows);
}

function createCSV(headers: string[], rows: (string | number)[][]): string {
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      row.map(field => 
        typeof field === 'string' && (field.includes(',') || field.includes('"')) 
          ? `"${field.replace(/"/g, '""')}"` 
          : field
      ).join(',')
    )
  ];
  
  return csvRows.join('\n');
}
