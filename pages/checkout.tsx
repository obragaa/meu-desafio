import { useState } from 'react';

export default function Checkout() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [pagamentoEnviado, setPagamentoEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para criar pagamento e gerar QR Code via API do MercadoPago
    const pagamentoData = {
      transaction_amount: 19.9,
      description: "Compra de Produto",
      payment_method_id: "pix",
      payer: {
        email,
        first_name: nome.split(' ')[0],
        last_name: nome.split(' ')[1] || '',
        identification: {
          type: "CPF",
          number: cpf,
        },
      },
    };

    try {
      const response = await fetch('/api/criar-pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagamentoData),
      });

      const data = await response.json();
      setQrCode(data.point_of_interaction.transaction_data.qr_code_base64);
      setPagamentoEnviado(true);
    } catch (error) {
      console.error('Erro ao gerar pagamento', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {!pagamentoEnviado ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Comprar agora
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Pague com Pix</h2>
          {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="mx-auto mb-4" />}
          <p className="text-sm text-gray-500">Copie o código Pix e cole no seu banco:</p>
          <button
            onClick={() => navigator.clipboard.writeText(qrCode)}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Copiar código Pix
          </button>
        </div>
      )}
    </div>
  );
}
