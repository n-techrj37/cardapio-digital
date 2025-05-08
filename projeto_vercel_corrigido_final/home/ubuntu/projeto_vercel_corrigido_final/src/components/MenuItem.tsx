// /home/ubuntu/cardapio-digital/src/components/MenuItem.tsx
"use client";

import React from "react";
import { MenuItemData, useCart } from "@/context/CartContext"; // Corrigido: Importar MenuItemData e useCart
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MenuItemProps {
  item: MenuItemData; // Usar MenuItemData que não tem quantity nem observacao
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart, getItemQuantity } = useCart();
  const router = useRouter();
  const quantityInCart = getItemQuantity(item.id);

  const handleAddToCart = () => {
    addToCart(item); // Passar o item como MenuItemData
    router.push("/cart");
  };

  return (
    <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white">
      {item.imagem && item.imagem.trim() !== "" ? (
        <div className="w-full h-48 relative mb-4 rounded-md overflow-hidden">
          <Image
            src={item.imagem}
            alt={item.nome}
            layout="fill"
            objectFit="cover"
            onError={(e) => {
              // Em caso de erro ao carregar a imagem (ex: imagem não encontrada ou formato inválido)
              // Idealmente, teríamos uma imagem placeholder no /public/images
              // e.currentTarget.src = "/images/placeholder_default.png"; 
              // Por ora, vamos apenas mostrar um texto ou nada
              (e.target as HTMLImageElement).style.display = 'none'; // Oculta a imagem quebrada
              // Ou substitui por um span com texto:
              // const parent = (e.target as HTMLImageElement).parentElement;
              // if (parent) {
              //   parent.innerHTML = '<span class="text-gray-500">Imagem indisponível</span>';
              // }
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 relative mb-4 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sem imagem</span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.nome}</h3>
      <p className="text-gray-600 mb-1 text-sm min-h-[40px]">{item.descricao || " "}</p> {/* Garante altura mínima para descrições vazias */}
      <p className="text-lg font-bold text-green-600 mb-3">{item.preco}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out"
      >
        Adicionar ao Carrinho {quantityInCart > 0 ? `(${quantityInCart})` : ""}
      </button>
    </div>
  );
};

export default MenuItem;

