'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product, ProductSize } from '@/types';
import { 
  AiAction, 
  Message, 
  ChatSession, 
  AiStudioView, 
  AiCompactView 
} from './ai';

export default function AiAssistant() {
  const router = useRouter();
  const { 
    isAiOpen, 
    setIsAiOpen, 
    isCartOpen,
    items,
    addToCart, 
    removeFromCart, 
    clearCart,
    applyCoupon,
    removeCoupon,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsTrackingOpen,
    setIsAccountOpen,
    setIsCategoriesOpen,
    setCategoryFilter
  } = useCart();
  const { language } = useLanguage();

  const [clientProfile, setClientProfile] = useState<any>(null);
  const [clientOrders, setClientOrders] = useState<any[]>([]);
  const [clientPqrs, setClientPqrs] = useState<any[]>([]);

  // Load client profile, orders, and PQRS
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('noctis_client_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setClientProfile(parsed);
        if (parsed.email) {
          fetch(`/api/client/profile?email=${encodeURIComponent(parsed.email)}`)
            .then(res => res.json())
            .then(data => {
              if (data.user) setClientProfile(data.user);
              if (data.orders) setClientOrders(data.orders);
              if (data.pqrs) setClientPqrs(data.pqrs);
            })
            .catch(() => {});
        }
      }
    } catch {
      // ignore
    }
  }, [isAiOpen]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: language === 'EN'
        ? 'Hi! I am **NOCTIS AI**, your Personalized Web MCP Shopping Copilot. I know your **order history, delivery address, wishlist**, and **live warehouse inventory**.'
        : '¡Hola! Soy **NOCTIS AI**, tu Copiloto y Web MCP de **NOCTIS URBANO Bogotá**. Tengo acceso a tu **perfil, dirección de entrega, compras, favoritos, seguimiento y PQRS** para darte una asesoría 100% precisa.',
      actions: [
        { type: 'go_to_catalog', label: '⚡ Ver Colección / Drop 001' },
        { type: 'open_cart', label: '🛒 Ver Bolsa de Compras' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `session-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar historial de sesiones guardadas en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('noctis_ai_chat_sessions');
      if (saved) {
        setSessions(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Guardar automáticamente la conversación actual en las sesiones
  useEffect(() => {
    if (messages.length <= 1) return;
    const firstUserMsg = messages.find(m => m.sender === 'user');
    const title = firstUserMsg 
      ? (firstUserMsg.text.slice(0, 36) + (firstUserMsg.text.length > 36 ? '...' : ''))
      : (language === 'EN' ? 'Consultation Session' : 'Conversación de Asesoría');

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === currentSessionId);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedSession: ChatSession = {
        id: currentSessionId,
        title,
        createdAt: existingIdx >= 0 ? prev[existingIdx].createdAt : timeStr,
        messages
      };

      let nextList: ChatSession[];
      if (existingIdx >= 0) {
        nextList = [...prev];
        nextList[existingIdx] = updatedSession;
      } else {
        nextList = [updatedSession, ...prev].slice(0, 25);
      }

      try {
        localStorage.setItem('noctis_ai_chat_sessions', JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
  }, [messages, currentSessionId, language]);

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([
      {
        id: 'msg-1',
        sender: 'ai',
        text: language === 'EN'
          ? 'Hi! I am **NOCTIS AI**, your Personalized Web MCP Shopping Copilot. New conversation started with clean session memory.'
          : '¡Hola! Soy **NOCTIS AI**, tu Copiloto y Web MCP de **NOCTIS URBANO Bogotá**. Nueva conversación iniciada con memoria de sesión limpia.',
        actions: [
          { type: 'go_to_catalog', label: '⚡ Ver Colección / Drop 001' },
          { type: 'open_cart', label: '🛒 Ver Bolsa de Compras' }
        ]
      }
    ]);
    setShowHistory(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId);
      try {
        localStorage.setItem('noctis_ai_chat_sessions', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const activeMemoryTurns = messages.filter(m => m.sender === 'user').length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Execute MCP Web Action (Full Interactive Control over Storefront)
  const executeAction = (action: AiAction) => {
    switch (action.type) {
      case 'clear_cart': {
        clearCart();
        break;
      }
      case 'remove_from_cart': {
        if (action.productId && action.size) {
          removeFromCart(action.productId, action.size as ProductSize, action.color);
        } else if (items.length > 0) {
          const target = items.find(it => 
            (action.productId && it.product.id === action.productId) || 
            (action.label && action.label.toLowerCase().includes(it.product.name.toLowerCase()))
          ) || items[0];
          if (target) {
            removeFromCart(target.product.id, target.size, target.color);
          }
        }
        break;
      }
      case 'open_cart': {
        setIsCartOpen(true);
        break;
      }
      case 'close_cart': {
        setIsCartOpen(false);
        break;
      }
      case 'apply_coupon': {
        if (action.couponCode) {
          applyCoupon(action.couponCode);
          setIsCartOpen(true);
        }
        break;
      }
      case 'remove_coupon': {
        removeCoupon();
        break;
      }
      case 'open_checkout': {
        setIsCheckoutOpen(true);
        setIsCartOpen(false);
        break;
      }
      case 'close_checkout': {
        setIsCheckoutOpen(false);
        break;
      }
      case 'open_tracking': {
        setIsTrackingOpen(true);
        break;
      }
      case 'close_tracking': {
        setIsTrackingOpen(false);
        break;
      }
      case 'open_account': {
        setIsAccountOpen(true);
        break;
      }
      case 'close_account': {
        setIsAccountOpen(false);
        break;
      }
      case 'filter_category': {
        if (action.category) {
          setCategoryFilter(action.category);
          const catalogEl = document.getElementById('drop') || document.getElementById('collections');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        break;
      }
      case 'open_categories': {
        setIsCategoriesOpen(true);
        break;
      }
      case 'go_to_catalog': {
        const catalogEl = document.getElementById('drop') || document.getElementById('collections');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          catalogEl.style.transition = 'outline 0.4s ease';
          catalogEl.style.outline = '2px solid #ff5500';
          setTimeout(() => {
            if (catalogEl) catalogEl.style.outline = 'none';
          }, 2000);
        }
        break;
      }
      case 'scroll_to_section': {
        const targetId = action.sectionId || 'drop';
        const secEl = document.getElementById(targetId);
        if (secEl) {
          secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
      case 'open_product': {
        const prodId = action.productId || action.product?.id;
        if (prodId) {
          router.push(`/producto/${prodId}`);
        }
        break;
      }
      case 'close_product': {
        break;
      }
      case 'add_to_cart': {
        if (action.product) {
          addToCart(
            action.product, 
            (action.size as ProductSize) || 'M', 
            action.quantity || 1, 
            action.color || 'Negro'
          );
        }
        break;
      }
      case 'add_to_wishlist': {
        const prodId = action.productId || action.product?.id;
        if (prodId) {
          try {
            const saved = localStorage.getItem('noctis_wishlist');
            let list: string[] = saved ? JSON.parse(saved) : [];
            if (!list.includes(prodId)) {
              list.push(prodId);
              localStorage.setItem('noctis_wishlist', JSON.stringify(list));
              window.dispatchEvent(new Event('noctis-wishlist-updated'));
            }
          } catch {}
        }
        break;
      }
      case 'remove_from_wishlist': {
        const prodId = action.productId || action.product?.id;
        if (prodId) {
          try {
            const saved = localStorage.getItem('noctis_wishlist');
            let list: string[] = saved ? JSON.parse(saved) : [];
            list = list.filter(id => id !== prodId);
            localStorage.setItem('noctis_wishlist', JSON.stringify(list));
            window.dispatchEvent(new Event('noctis-wishlist-updated'));
          } catch {}
        }
        break;
      }
      case 'open_wishlist': {
        setIsAccountOpen(true);
        break;
      }
      default:
        break;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build comprehensive real-time user context (Profile, Wishlist, Orders, PQRS, Cart)
    let wishlistItems: any[] = [];
    try {
      const savedWishlist = localStorage.getItem('noctis_wishlist');
      if (savedWishlist) {
        const ids: string[] = JSON.parse(savedWishlist);
        wishlistItems = ids.map(id => ({ id }));
      }
    } catch {}

    const userContext = {
      name: clientProfile?.name,
      email: clientProfile?.email,
      city: clientProfile?.city || 'Bogotá D.C.',
      department: clientProfile?.department || 'Cundinamarca',
      address: clientProfile?.address,
      phone: clientProfile?.phone,
      wishlist: wishlistItems,
      cart: items.map(it => ({
        name: it.product.name,
        size: it.size,
        quantity: it.quantity,
        color: it.color || 'Negro',
        price: it.product.price
      })),
      orders: clientOrders.map(o => ({
        orderNumber: o.orderNumber,
        reference: o.reference,
        total: o.total,
        deliveryStatus: o.deliveryStatus,
        trackingNumber: o.trackingNumber,
        items: o.items
      })),
      pqrs: clientPqrs.map(p => ({
        radicado: p.radicado,
        type: p.type,
        status: p.status,
        description: p.description
      }))
    };

    // Extract conversation history for multi-turn contextual memory
    const conversationHistory = messages.slice(-8).map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text
    }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, userContext, history: conversationHistory })
      });

      const data = await res.json();
      const fullReply = data.reply || (language === 'EN' ? 'I checked the catalog for you.' : 'He consultado el catálogo para ti.');
      const msgId = `ai-${Date.now()}`;

      // Initialize message for real-time typewriter streaming effect
      const initialAiMsg: Message = {
        id: msgId,
        sender: 'ai',
        text: '',
        source: data.source || 'NOCTIS AI • OpenRouter (Memoria Activa)',
        products: data.recommendedProducts,
        actions: data.actions
      };

      setMessages(prev => [...prev, initialAiMsg]);
      setLoading(false);

      // Auto-Execute Web MCP Actions returned from AI
      if (data.actions && Array.isArray(data.actions)) {
        data.actions.forEach((act: AiAction) => {
          if (act.autoExecute) {
            executeAction(act);
          }
        });
      }

      // Real-time progressive streaming animation
      let currentPos = 0;
      const step = Math.max(2, Math.floor(fullReply.length / 50));
      const interval = setInterval(() => {
        currentPos += step;
        if (currentPos >= fullReply.length) {
          clearInterval(interval);
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fullReply } : m));
        } else {
          const sliced = fullReply.slice(0, currentPos);
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: sliced } : m));
        }
      }, 16);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: language === 'EN' ? 'Error communicating with AI Copilot. Please try again.' : 'Error al procesar con el copiloto de IA. Inténtalo de nuevo.'
        }
      ]);
      setLoading(false);
    }
  };

  if (!isAiOpen) {
    return (
      <button
        onClick={() => setIsAiOpen(true)}
        className={`noir-ai-float ${isCartOpen ? 'with-cart-open' : ''}`}
        title="Abrir Asesor y Copiloto Web con NOCTIS AI (OpenRouter)"
      >
        <span>✦ NOCTIS AI</span>
      </button>
    );
  }

  if (isExpanded) {
    return (
      <AiStudioView
        clientProfile={clientProfile}
        clientOrders={clientOrders}
        items={items}
        sessions={sessions}
        currentSessionId={currentSessionId}
        activeMemoryTurns={activeMemoryTurns}
        handleNewChat={handleNewChat}
        handleLoadSession={handleLoadSession}
        handleDeleteSession={handleDeleteSession}
        messages={messages}
        loading={loading}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        executeAction={executeAction}
        openProductDetail={(p: Product) => router.push(`/producto/${p.id}`)}
        addToCart={addToCart}
        language={language}
        setIsExpanded={setIsExpanded}
        setIsAiOpen={setIsAiOpen}
        scrollRef={scrollRef}
      />
    );
  }

  return (
    <AiCompactView
      handleNewChat={handleNewChat}
      showHistory={showHistory}
      setShowHistory={setShowHistory}
      setIsExpanded={setIsExpanded}
      setIsAiOpen={setIsAiOpen}
      activeMemoryTurns={activeMemoryTurns}
      language={language}
      sessions={sessions}
      currentSessionId={currentSessionId}
      handleLoadSession={handleLoadSession}
      handleDeleteSession={handleDeleteSession}
      messages={messages}
      loading={loading}
      input={input}
      setInput={setInput}
      handleSendMessage={handleSendMessage}
      executeAction={executeAction}
      openProductDetail={(p: Product) => router.push(`/producto/${p.id}`)}
      addToCart={addToCart}
      scrollRef={scrollRef}
      isCartOpen={isCartOpen}
    />
  );
}
