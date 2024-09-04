import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/trpc'; // Importa o tipo de rotas

export const trpc = createTRPCReact<AppRouter>();
