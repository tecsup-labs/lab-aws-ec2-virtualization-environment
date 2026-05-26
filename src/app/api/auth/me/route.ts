import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/prisma';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No estás autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth Me Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Algo salió mal en el servidor' },
      { status: 500 }
    );
  }
}
