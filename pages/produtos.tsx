import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      const response = await fetch('/api/produtos');
      const data = await response.json();
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        {/* Aqui removemos a tag <a> */}
        <Link href="/criar-produto" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Criar Produto
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map((produto: any) => (
          <div key={produto.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <img src={produto.image || 'https://via.placeholder.com/150'} alt={produto.name} className="mb-4 w-full rounded-md" />
            <h2 className="text-lg font-bold">{produto.name}</h2>
            <p className="text-sm text-gray-500 mb-4">R$ {produto.price.toFixed(2)}</p>
            <div className="flex justify-between">
              <button className="bg-yellow-400 text-white px-4 py-2 rounded-md">Editar</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
