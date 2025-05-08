import MenuItem from '@/components/MenuItem';
import menuData from '@/lib/menuData.json';
import Image from 'next/image'; // Assuming you might want to add a logo image later

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        {/* Espaço para a logomarca */}
        <div className="h-24 bg-gray-200 flex items-center justify-center mb-4">
          <p className="text-gray-500">Espaço para Logomarca</p>
          {/* Exemplo de como adicionar uma imagem de logo depois:
          <Image src="/logo.png" alt="Logo da Loja" width={150} height={50} />
          */}
        </div>
        <h1 className="text-4xl font-bold text-red-600">Cardápio Digital</h1>
      </header>

      <main>
        {menuData.categorias.map((categoria) => (
          <section key={categoria.nome} className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 border-b-2 border-yellow-400 pb-2">{categoria.nome}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoria.itens.map((item) => (
                <MenuItem key={item.nome} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="text-center mt-12 py-4 border-t">
        <p>&copy; {new Date().getFullYear()} Seu Restaurante. Todos os direitos reservados.</p>
        {/* Barra de navegação inferior como na referência IMG_7014.png */}
        <nav className="fixed bottom-0 left-0 right-0 bg-red-600 text-white flex justify-around p-3 shadow-lg md:hidden">
          <a href="#" className="flex flex-col items-center">
            {/* Ícone de Cardápio (exemplo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Cardápio</span>
          </a>
          <a href="#" className="flex flex-col items-center">
            {/* Ícone de Carrinho (exemplo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Meu Carrinho</span>
          </a>
          <a href="#" className="flex flex-col items-center">
            {/* Ícone de Meus Pedidos (exemplo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Meus Pedidos</span>
          </a>
          <a href="#" className="flex flex-col items-center">
            {/* Ícone de Fechar Pedido (exemplo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Fechar Pedido</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}

