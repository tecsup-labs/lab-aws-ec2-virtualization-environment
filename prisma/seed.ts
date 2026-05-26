import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean database
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  // Create demo user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      nombre: 'Antony Demo',
    },
  });

  console.log(`👤 Demo User created: ${demoUser.email} (Password: admin123)`);

  // Demo contacts
  const contactsData = [
    {
      nombre: 'Guillermo',
      apellido: 'Rauch',
      correo: 'rauchg@vercel.com',
      telefono: '+1 (555) 019-2834',
      empresa: 'Vercel',
      cargo: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Co-creator of Next.js. Great meeting at Next.js Conf. Interested in enterprise integration plans.',
    },
    {
      nombre: 'Karri',
      apellido: 'Saarinen',
      correo: 'karri@linear.app',
      telefono: '+1 (555) 012-9843',
      empresa: 'Linear',
      cargo: 'Co-Founder & Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Obsessed with design and micro-interactions. Met him at a Design Systems meetup in SF.',
    },
    {
      nombre: 'Ivan',
      apellido: 'Zhao',
      correo: 'ivan@makenotion.com',
      telefono: '+1 (555) 014-4321',
      empresa: 'Notion',
      cargo: 'Co-Founder & CEO',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Discussed block-based editor strategies. Highly minimalist mindset. Keep updated on new products.',
    },
    {
      nombre: 'Sarah',
      apellido: 'Drasner',
      correo: 'sarah.drasner@google.com',
      telefono: '+1 (555) 017-8822',
      empresa: 'Google',
      cargo: 'Engineering Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Author and speaker. Expert in web animations and Vue.js ecosystem. Working on cloud web tools now.',
    },
    {
      nombre: 'Lee',
      apellido: 'Robinson',
      correo: 'leerob@vercel.com',
      telefono: '+1 (555) 016-5544',
      empresa: 'Vercel',
      cargo: 'VP of Product',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'DevRel leader. Next.js App Router advocate. Shared valuable feedback on our deploy automation strategy.',
    },
    {
      nombre: 'Arvid',
      apellido: 'Lunnemark',
      correo: 'arvid@tldraw.com',
      telefono: '+1 (555) 018-7711',
      empresa: 'Tldraw',
      cargo: 'Founder',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Creator of the tldraw library. Excellent canvas performance engineer. Discussed multiplayer CRDTs.',
    },
    {
      nombre: 'Nat',
      apellido: 'Friedman',
      correo: 'nat@github.com',
      telefono: '+1 (555) 011-3388',
      empresa: 'AI Grant / GitHub',
      cargo: 'Investor & Former CEO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
      notas: 'Prolific AI investor. Shared insights on agentic workflows and developer productivity.',
    }
  ];

  for (const contact of contactsData) {
    await prisma.contact.create({
      data: {
        ...contact,
        userId: demoUser.id,
      },
    });
  }

  console.log(`🎉 Seeding complete. Added ${contactsData.length} premium demo contacts!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
