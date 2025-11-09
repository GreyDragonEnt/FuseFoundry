import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { AdminDatabase, type Customer } from '@/lib/admin-database';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all customers
    const customers = await AdminDatabase.getAllCustomers();

    // Create CSV content
    const csvHeaders = [
      'Customer ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Total Orders',
      'Total Spent',
      'Last Order Date',
      'Joined Date'
    ];

    const csvRows = customers.map((customer: Customer) => [
      customer.customer_id,
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.phone || '',
      customer.company || '',
      customer.total_orders,
      customer.total_spent,
      customer.last_order_date || '',
      new Date(customer.created_at).toISOString()
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row: (string | number)[]) => 
        row.map((field: string | number) => 
          typeof field === 'string' && field.includes(',') 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error exporting customers:', error);
    return NextResponse.json(
      { error: 'Failed to export customers' }, 
      { status: 500 }
    );
  }
}
