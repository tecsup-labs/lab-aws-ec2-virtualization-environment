import { NextResponse } from 'next/server';
import { contactService } from '@/modules/contacts/services/contact.service';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await contactService.getDashboardMetrics(userId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('GET Contacts Metrics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}
