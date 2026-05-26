import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/prisma';
import { comparePassword } from '@/shared/lib/bcrypt';
import { signJWT } from '@/shared/lib/jwt';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Debe ser un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
    });

    // Create response
    const response = NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Error de validación', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Algo salió mal en el servidor' },
      { status: 500 }
    );
  }
}
