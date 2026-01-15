'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Gift } from '@/types/gift';
import { Gift as GiftIcon, Trash2, ArrowLeft, Sparkles, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLogin from '@/components/AdminLogin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    imageUrls: ['', '', '', ''],
    purchaseLink: '',
    purchaseLinks: ['', '', '', ''],
    isShared: false,
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const giftsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Gift[];
      setGifts(giftsData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.imageUrl) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const filteredImageUrls = formData.imageUrls.filter(url => url.trim() !== '');
      const filteredPurchaseLinks = formData.purchaseLinks.filter(link => link.trim() !== '');

      const giftData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        imageUrls: filteredImageUrls.length > 0 ? filteredImageUrls : undefined,
        purchaseLink: formData.purchaseLink || '',
        purchaseLinks: filteredPurchaseLinks.length > 0 ? filteredPurchaseLinks : undefined,
        isShared: formData.isShared,
      };

      if (editingGiftId) {
        await updateDoc(doc(db, 'gifts', editingGiftId), giftData);
        alert('¡Regalo actualizado exitosamente! 🎁');
        setEditingGiftId(null);
      } else {
        await addDoc(collection(db, 'gifts'), {
          ...giftData,
          claimedBy: [],
          createdAt: Date.now(),
        });
        alert('¡Regalo agregado exitosamente! 🎁');
      }

      setFormData({ name: '', description: '', imageUrl: '', imageUrls: ['', '', '', ''], purchaseLink: '', purchaseLinks: ['', '', '', ''], isShared: false });
      setLoading(false);
    } catch (error) {
      console.error('Error saving gift:', error);
      alert('Error al guardar el regalo. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gift: Gift) => {
    setEditingGiftId(gift.id);
    setFormData({
      name: gift.name,
      description: gift.description,
      imageUrl: gift.imageUrl,
      imageUrls: gift.imageUrls && gift.imageUrls.length > 0 
        ? [...gift.imageUrls, ...Array(4 - gift.imageUrls.length).fill('')].slice(0, 4)
        : ['', '', '', ''],
      purchaseLink: gift.purchaseLink || '',
      purchaseLinks: gift.purchaseLinks && gift.purchaseLinks.length > 0
        ? [...gift.purchaseLinks, ...Array(4 - gift.purchaseLinks.length).fill('')].slice(0, 4)
        : ['', '', '', ''],
      isShared: gift.isShared,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingGiftId(null);
    setFormData({ name: '', description: '', imageUrl: '', imageUrls: ['', '', '', ''], purchaseLink: '', purchaseLinks: ['', '', '', ''], isShared: false });
  };

  const handleDelete = async (giftId: string) => {
    if (!confirm('¿Estás seguro de eliminar este regalo?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'gifts', giftId));
      alert('Regalo eliminado exitosamente');
      if (editingGiftId === giftId) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error deleting gift:', error);
      alert('Error al eliminar el regalo');
    }
  };

  const handleLogin = (password: string) => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-pink-200 opacity-20 animate-sparkle">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-20 left-10 text-purple-200 opacity-20 animate-float">
          <GiftIcon size={45} />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la lista
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Gestiona los regalos para el baby shower de Abigail</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {editingGiftId ? <Edit2 className="w-6 h-6 text-blue-500" /> : <GiftIcon className="w-6 h-6 text-pink-500" />}
                {editingGiftId ? 'Editar Regalo' : 'Agregar Nuevo Regalo'}
              </h2>
              {editingGiftId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Regalo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="Ej: Cuna de bebé"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="Ej: Cuna de madera blanca con colchón incluido"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL de la Imagen Principal *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-4 relative h-48 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imágenes Adicionales (opcional, hasta 4)
                </label>
                <div className="space-y-3">
                  {formData.imageUrls.map((url, index) => (
                    <input
                      key={index}
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...formData.imageUrls];
                        newUrls[index] = e.target.value;
                        setFormData({ ...formData, imageUrls: newUrls });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder={`Imagen ${index + 2} (opcional)`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link de Compra Principal (opcional)
                </label>
                <input
                  type="url"
                  value={formData.purchaseLink}
                  onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="https://ejemplo.com/producto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Links de Compra Adicionales (opcional, hasta 4)
                </label>
                <div className="space-y-3">
                  {formData.purchaseLinks.map((link, index) => (
                    <input
                      key={index}
                      type="url"
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...formData.purchaseLinks];
                        newLinks[index] = e.target.value;
                        setFormData({ ...formData, purchaseLinks: newLinks });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder={`Link ${index + 2} (opcional)`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <input
                  type="checkbox"
                  id="isShared"
                  checked={formData.isShared}
                  onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-400"
                />
                <label htmlFor="isShared" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  🎁 Regalo múltiple (varias personas pueden apartarlo)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingGiftId ? 'Actualizando...' : 'Agregando...') : (editingGiftId ? 'Actualizar Regalo' : 'Agregar Regalo')}
              </button>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Regalos Actuales ({gifts.length})
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {gifts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay regalos aún</p>
              ) : (
                gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border-2 border-pink-100 hover:border-pink-300 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                        <Image
                          src={gift.imageUrl}
                          alt={gift.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-800 truncate">{gift.name}</h3>
                          {gift.isShared && (
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full font-semibold">
                              Múltiple
                            </span>
                          )}
                          {gift.imageUrls && gift.imageUrls.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              {gift.imageUrls.length + 1} fotos
                            </span>
                          )}
                          {gift.purchaseLinks && gift.purchaseLinks.length > 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              {gift.purchaseLinks.filter(l => l).length + (gift.purchaseLink ? 1 : 0)} links
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{gift.description}</p>
                        {gift.claimedBy && gift.claimedBy.length > 0 ? (
                          <div className="text-sm text-purple-600 font-semibold">
                            <p className="text-xs text-gray-600">Apartado por:</p>
                            <p className="line-clamp-2">{gift.claimedBy.join(', ')}</p>
                            {gift.claimedBy.length > 1 && (
                              <p className="text-xs text-purple-500">({gift.claimedBy.length} personas)</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Disponible</p>
                        )}
                        <a
                          href={gift.purchaseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate block mt-1"
                        >
                          Ver producto
                        </a>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(gift)}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                          title="Editar regalo"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(gift.id)}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                          title="Eliminar regalo"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
