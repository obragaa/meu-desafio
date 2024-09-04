import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable'; 
import fs from 'fs';
import prisma from '../../server/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);

      const nomeProduto = Array.isArray(fields.nome) ? fields.nome[0] : fields.nome;
      const descricaoProduto = Array.isArray(fields.descricao) ? fields.descricao[0] : fields.descricao;
      const precoProduto = Array.isArray(fields.preco) ? fields.preco[0] : fields.preco;

      let imagem: formidable.File | undefined;
      if (Array.isArray(files.imagem)) {
        imagem = files.imagem[0];
      } else {
        imagem = files.imagem;
      }

      if (!imagem) {
        return res.status(400).json({ error: 'Imagem não enviada' });
      }

      const imagePath = `./public/uploads/${imagem.originalFilename}`;
      fs.copyFileSync(imagem.filepath, imagePath);

      const produto = await prisma.product.create({
        data: {
          name: nomeProduto as string,
          description: descricaoProduto as string,
          price: parseFloat(precoProduto as string),
          image: imagePath,
        },
      });

      return res.status(200).json(produto);
    } catch (error) {
      console.error('Erro ao processar o formulário:', error);
      return res.status(500).json({ error: 'Erro ao processar o formulário' });
    }
  } else if (req.method === 'GET') {
    // Método para lidar com requisições GET (Listagem de produtos)
    try {
      const produtos = await prisma.product.findMany(); // Busque todos os produtos
      return res.status(200).json(produtos); // Envie a lista de produtos como resposta
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
