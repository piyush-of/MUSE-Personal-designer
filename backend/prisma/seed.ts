import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PLANS = [
  {
    slug: 'free',
    name: 'Free',
    description: '10 outfit analyses per month',
    priceMonthly: 0,
    priceYearly: 0,
    analysesLimit: 10,
    features: ['10 analyses/month', 'Basic shopping picks', 'Trend radar'],
  },
  {
    slug: 'premium',
    name: 'Premium',
    description: '50 analyses with AI enhancement',
    priceMonthly: 499,
    priceYearly: 4990,
    analysesLimit: 50,
    features: ['50 analyses/month', 'AI-enhanced reports', 'Wardrobe history', 'Priority support'],
  },
  {
    slug: 'pro',
    name: 'Pro',
    description: 'Unlimited analyses for fashion professionals',
    priceMonthly: 999,
    priceYearly: 9990,
    analysesLimit: 9999,
    features: ['Unlimited analyses', 'Cloudinary image storage', 'Style profile', 'API access'],
  },
];

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const demoPassword = await bcrypt.hash('Demo1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@muse.style' },
    update: {},
    create: {
      name: 'MUSE Admin',
      email: 'admin@muse.style',
      password: adminPassword,
      role: 'admin',
      plan: 'pro',
      isVerified: true,
      analysesLimit: 999,
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: 'demo@muse.style' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@muse.style',
      password: demoPassword,
      role: 'member',
      plan: 'free',
      isVerified: true,
      analysesUsed: 2,
      analysesLimit: 10,
    },
  });

  const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } });
  const proPlan = await prisma.plan.findUnique({ where: { slug: 'pro' } });

  if (freePlan) {
    await prisma.subscription.upsert({
      where: { id: `${demo.id}-sub` },
      update: {},
      create: {
        id: `${demo.id}-sub`,
        userId: demo.id,
        planId: freePlan.id,
        status: 'active',
      },
    });
  }

  if (proPlan) {
    await prisma.subscription.upsert({
      where: { id: `${admin.id}-sub` },
      update: {},
      create: {
        id: `${admin.id}-sub`,
        userId: admin.id,
        planId: proPlan.id,
        status: 'active',
      },
    });
  }

  console.log('✅ Seed complete — admin@muse.style / Admin123! | demo@muse.style / Demo1234!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
