import { initTRPC } from '@trpc/server';
import prisma from './prisma'; // Importa o Prisma Client

const t = initTRPC.create();

export const appRouter = t.router({
  getProducts: t.procedure.query(async () => {
    const products = await prisma.product.findMany(); // Busca todos os produtos no banco
    return products;
  }),
});

export type AppRouter = typeof appRouter;
