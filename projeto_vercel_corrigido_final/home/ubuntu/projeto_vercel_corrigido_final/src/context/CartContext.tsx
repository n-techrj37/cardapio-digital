"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Interface para um item como ele vem do menuData.json
export interface MenuItemData {
  id: string; // ID original do produto no menu
  nome: string;
  preco: string;
  descricao: string;
  imagem: string;
}

// Interface para um item no carrinho
export interface CartItem extends MenuItemData {
  cartItemId: string; // ID único para esta instância específica no carrinho
  quantity: number;
  observacao?: string;
}

// Interface para o estado do checkout
export interface CheckoutState {
  deliveryOption: "local" | "retirada" | "delivery" | null;
  customerName: string;
  customerPhone: string;
  customerAddress: {
    rua: string;
    numero: string;
    complemento?: string;
    referencia?: string;
  } | null;
  paymentMethod: "dinheiro" | "cartao" | null;
  changeFor: string;
  shippingFee: number;
}

interface CartContextType {
  cart: CartItem[];
  checkoutState: CheckoutState;
  addToCart: (item: MenuItemData) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateObservacao: (cartItemId: string, observacao: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getWhatsAppMessageUrl: () => string | null;
  // Funções para atualizar o estado do checkout
  setDeliveryOption: (option: "local" | "retirada" | "delivery") => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerAddress: (address: CheckoutState["customerAddress"]) => void;
  setPaymentMethod: (method: "dinheiro" | "cartao") => void;
  setChangeFor: (value: string) => void;
  resetCheckoutState: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const initialCheckoutState: CheckoutState = {
  deliveryOption: null,
  customerName: "",
  customerPhone: "",
  customerAddress: null,
  paymentMethod: null,
  changeFor: "",
  shippingFee: 0,
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialCheckoutState);

  const addToCart = (itemData: MenuItemData) => {
    setCart((prevCart) => {
      const newCartItemId = `${itemData.id}-${Date.now()}`;
      const newItem: CartItem = {
        ...itemData,
        cartItemId: newCartItemId,
        quantity: 1,
        observacao: "",
      };
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  const updateObservacao = (cartItemId: string, observacao: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, observacao: observacao } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const priceString = item.preco.replace("R$", "").replace(",", ".").trim();
      const price = parseFloat(priceString);
      return total + price * item.quantity;
    }, 0);
  };

  const setDeliveryOption = (option: "local" | "retirada" | "delivery") => {
    setCheckoutState((prevState) => ({
      ...prevState,
      deliveryOption: option,
      shippingFee: option === "delivery" ? 6.00 : 0, // Adiciona taxa de entrega se for delivery
    }));
  };

  const setCustomerName = (name: string) => {
    setCheckoutState((prevState) => ({ ...prevState, customerName: name }));
  };

  const setCustomerPhone = (phone: string) => {
    setCheckoutState((prevState) => ({ ...prevState, customerPhone: phone }));
  };

  const setCustomerAddress = (address: CheckoutState["customerAddress"]) => {
    setCheckoutState((prevState) => ({ ...prevState, customerAddress: address }));
  };

  const setPaymentMethod = (method: "dinheiro" | "cartao") => {
    setCheckoutState((prevState) => ({ ...prevState, paymentMethod: method }));
  };

  const setChangeFor = (value: string) => {
    setCheckoutState((prevState) => ({ ...prevState, changeFor: value }));
  };

  const resetCheckoutState = () => {
    setCheckoutState(initialCheckoutState);
  };

  const getWhatsAppMessageUrl = () => {
    if (cart.length === 0) return null;

    const numeroLoja = "+5521981781693";
    let mensagem = "Olá, Chiqburgs! Gostaria de fazer o seguinte pedido:\n\n";
    
    mensagem += "*Cliente:* " + (checkoutState.customerName || "Não informado") + "\n";
    mensagem += "*Telefone:* " + (checkoutState.customerPhone || "Não informado") + "\n\n";

    mensagem += "*Itens do Pedido:*\n";
    cart.forEach((item) => {
      mensagem += `*${item.nome}* (Qtd: ${item.quantity}) - ${item.preco}\n`;
      if (item.observacao && item.observacao.trim() !== "") {
        mensagem += `  Observação: ${item.observacao.trim()}\n`;
      }
      mensagem += "---\n";
    });

    const subtotal = getCartTotal();
    mensagem += `\n*Subtotal dos Produtos: R$ ${subtotal.toFixed(2)}*\n`;

    if (checkoutState.deliveryOption) {
      mensagem += `*Tipo de Entrega:* ${checkoutState.deliveryOption}\n`;
      if (checkoutState.deliveryOption === "delivery") {
        mensagem += `*Taxa de Entrega:* R$ ${checkoutState.shippingFee.toFixed(2)}\n`;
        if (checkoutState.customerAddress) {
          mensagem += `*Endereço de Entrega:*\n`;
          mensagem += `  Rua: ${checkoutState.customerAddress.rua}\n`;
          mensagem += `  Número: ${checkoutState.customerAddress.numero}\n`;
          if (checkoutState.customerAddress.complemento) {
            mensagem += `  Complemento: ${checkoutState.customerAddress.complemento}\n`;
          }
          if (checkoutState.customerAddress.referencia) {
            mensagem += `  Ponto de Referência: ${checkoutState.customerAddress.referencia}\n`;
          }
        }
      }
    }
    
    const totalPedido = subtotal + checkoutState.shippingFee;
    mensagem += `*Total do Pedido: R$ ${totalPedido.toFixed(2)}*\n`;

    if (checkoutState.paymentMethod) {
      mensagem += `*Forma de Pagamento:* ${checkoutState.paymentMethod}\n`;
      if (checkoutState.paymentMethod === "dinheiro" && checkoutState.changeFor) {
        mensagem += `  Levar troco para: R$ ${checkoutState.changeFor}\n`;
      }
    }

    mensagem += "\nPor favor, confirme meu pedido.";

    return `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        checkoutState,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateObservacao,
        clearCart,
        getCartTotal,
        getWhatsAppMessageUrl,
        setDeliveryOption,
        setCustomerName,
        setCustomerPhone,
        setCustomerAddress,
        setPaymentMethod,
        setChangeFor,
        resetCheckoutState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

