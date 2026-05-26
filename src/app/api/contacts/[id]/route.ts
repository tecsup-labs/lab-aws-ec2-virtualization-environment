import { NextResponse } from 'next/server';
import { contactService } from '@/modules/contacts/services/contact.service';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contact = await contactService.getContactById(id, userId);

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('GET Contact by ID API Error:', error);
    if (error.message && error.message.includes('no encontrado')) {
      return NextResponse.json({ error: 'Not Found', message: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updatedContact = await contactService.updateContact(id, userId, body);

    return NextResponse.json(updatedContact);
  } catch (error: any) {
    console.error('PUT Contact API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Validación fallida', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error.message && error.message.includes('unauthorized')) {
      return NextResponse.json({ error: 'Forbidden', message: 'Acceso denegado' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await contactService.deleteContact(id, userId);

    return NextResponse.json({ message: 'Contacto eliminado con éxito' });
  } catch (error: any) {
    console.error('DELETE Contact API Error:', error);
    if (error.message && error.message.includes('unauthorized')) {
      return NextResponse.json({ error: 'Forbidden', message: 'Acceso denegado' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: 'Algo salió mal' }, { status: 500 });
  }
}
