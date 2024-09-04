import { trpc } from '../lib/trpc'; // Importa o cliente tRPC

const ProdutosPage = () => {
  const { data, isLoading, error } = trpc.getProducts.useQuery(); // Chamando a API de produtos

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os produtos</div>;

  return (
    <div>
      <h1>Produtos Disponíveis</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            {product.name} - R$ {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProdutosPage;
