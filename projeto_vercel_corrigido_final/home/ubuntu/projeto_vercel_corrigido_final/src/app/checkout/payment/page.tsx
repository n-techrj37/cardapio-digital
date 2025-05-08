"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type PaymentMethod = "dinheiro" | "cartao";

const PaymentPage: React.FC = () => {
  const { checkoutState, setPaymentMethod, setChangeFor, getWhatsAppMessageUrl, clearCart, resetCheckoutState } = useCart();
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(checkoutState.paymentMethod);
  const [changeValue, setChangeValue] = useState(checkoutState.changeFor || '');

  useEffect(() => {
    // Basic validation to ensure the user has gone through the necessary steps
    if (!checkoutState.deliveryOption) {
      router.replace('/checkout/delivery-options');
      return;
    }
    if (!checkoutState.customerName || !checkoutState.customerPhone) {
      router.replace('/checkout/customer-info');
      return;
    }
    if (checkoutState.deliveryOption === 'delivery' && !checkoutState.customerAddress) {
      router.replace('/checkout/address');
      return;
    }
    // Could also check if cart is empty and redirect to home or cart page
  }, [checkoutState, router]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    if (method === 'cartao') {
      setChangeValue(''); // Clear change value if card is selected
    }
  };

  const handleSubmitOrder = () => {
    if (!selectedPaymentMethod) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }
    if (selectedPaymentMethod === 'dinheiro' && !changeValue.trim()) {
        // Optionally make change field mandatory or handle it
        // For now, we allow it to be empty, meaning exact change or no info provided
    }

    setPaymentMethod(selectedPaymentMethod);
    setChangeFor(changeValue);

    // Ensure all state updates are processed before generating URL
    // A small timeout can help, or ideally, a state update callback if context was more complex
    setTimeout(() => {
        const whatsappUrl = getWhatsAppMessageUrl();
        if (whatsappUrl) {
            // Simulate sending by opening in new tab
            window.open(whatsappUrl, '_blank');
            // Clear cart and checkout state after sending
            clearCart();
            resetCheckoutState();
            // Redirect to a thank you page or home
            router.push('/checkout/thank-you'); // Placeholder for a thank you page
        } else {
            alert("Não foi possível gerar a mensagem do pedido. Verifique os dados e tente novamente.");
        }
    }, 100); // Small delay to ensure state is updated in context
  };
  
  // Render null or a loader if we are about to redirect
  if (!checkoutState.deliveryOption || !checkoutState.customerName || !checkoutState.customerPhone || (checkoutState.deliveryOption === 'delivery' && !checkoutState.customerAddress) ){
      return <div className="container mx-auto p-4 text-center"><p>Carregando ou redirecionando...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="bg-red-700 text-white p-6 shadow-md sticky top-0 z-50 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Forma de Pagamento</h1>
          <Link href="/checkout/summary" className="text-orange-300 hover:text-orange-200 transition-colors">
            &larr; Voltar para Resumo
          </Link>
        </div>
      </header>

      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Escolha como pagar:</h2>
        
        <div className="space-y-4 mb-6">
          {(
            [
              { id: 'dinheiro', label: 'Dinheiro' },
              { id: 'cartao', label: 'Cartão (Maquininha na entrega/retirada)' },
            ] as { id: PaymentMethod; label: string }[]
          ).map((method) => (
            <button
              key={method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
              className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ease-in-out 
                ${selectedPaymentMethod === method.id 
                  ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500 ring-offset-2'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                }
              `}
            >
              <span className="text-lg font-medium">{method.label}</span>
            </button>
          ))}
        </div>

        {selectedPaymentMethod === 'dinheiro' && (
          <div className="mb-8">
            <label htmlFor="changeValue" className="block text-sm font-medium text-gray-700 mb-1">Precisa de troco para quanto? (Opcional)</label>
            <input 
              type="text" 
              id="changeValue"
              value={changeValue}
              onChange={(e) => setChangeValue(e.target.value.replace(/[^0-9,.]/g, ''))} // Allow only numbers, comma, dot
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 50,00 ou deixe em branco"
            />
            <p className="text-xs text-gray-500 mt-1">Informe o valor em dinheiro que você levará para facilitar o troco.</p>
          </div>
        )}

        <button 
          onClick={handleSubmitOrder}
          disabled={!selectedPaymentMethod}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Pedido para WhatsApp
        </button>
      </div>

      <footer className="text-center p-4 mt-12 bg-gray-800 text-white">
        <p>&copy; {new Date().getFullYear()} Chiqburgs. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default PaymentPage;

