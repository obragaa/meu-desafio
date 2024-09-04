import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const api = axios.create({
  baseURL: 'https://api.mercadopago.com/v1',
  headers: {
    Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
  },
});

export async function criarPagamento(pagamentoData: any) {
  try {
    const respostaPagamento = await api.post('/payments', pagamentoData, {
      headers: {
        'X-Idempotency-Key': uuidv4(),
      },
    });
    return respostaPagamento.data;
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error.response?.data || error.message);
    throw error;
  }
}
