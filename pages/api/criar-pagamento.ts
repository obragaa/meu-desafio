import type { NextApiRequest, NextApiResponse } from 'next';
import { criarPagamento } from '../../lib/mercadopago'; // Função criada anteriormente para gerar pagamento

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const pagamentoData = req.body;
    try {
      const pagamento = await criarPagamento(pagamentoData);
      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar pagamento' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
