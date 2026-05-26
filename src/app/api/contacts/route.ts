import { NextResponse } from 'next/server';
import { contactService } from '@/modules/contacts/services/contact.service';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const empresa = searchParams.get('empresa') || undefined;
    const cargo = searchParams.get('cargo') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const result = await contactService.getContacts(userId, {
      search,
      empresa,
      cargo,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET Contacts API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Bad Request', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newContact = await contactService.createContact(userId, body);

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('POST Contact API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Validación fallida', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}
