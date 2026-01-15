'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Gift } from '@/types/gift';
import { Gift as GiftIcon, Heart, Sparkles, Baby, ExternalLink, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingGift, setClaimingGift] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<{[key: string]: number}>({});
  const [isTransitioning, setIsTransitioning] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const giftsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Gift[];
      setGifts(giftsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent, giftId: string) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsTransitioning({ ...isTransitioning, [giftId]: false });
  };

  const onTouchMove = (e: React.TouchEvent, giftId: string) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    const diff = currentTouch - touchStart;
    setSwipeOffset({ ...swipeOffset, [giftId]: diff });
  };

  const onTouchEnd = (giftId: string, allImages: string[]) => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset({ ...swipeOffset, [giftId]: 0 });
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const currentIndex = currentImageIndex[giftId] || 0;
    
    setIsTransitioning({ ...isTransitioning, [giftId]: true });
    
    if (isLeftSwipe) {
      setCurrentImageIndex({
        ...currentImageIndex,
        [giftId]: (currentIndex + 1) % allImages.length
      });
    } else if (isRightSwipe) {
      setCurrentImageIndex({
        ...currentImageIndex,
        [giftId]: currentIndex === 0 ? allImages.length - 1 : currentIndex - 1
      });
    }
    
    setSwipeOffset({ ...swipeOffset, [giftId]: 0 });
    
    setTimeout(() => {
      setIsTransitioning({ ...isTransitioning, [giftId]: false });
    }, 300);
  };

  const handleClaimGift = async (giftId: string, isShared: boolean, currentClaimedBy: string[]) => {
    if (!guestName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const trimmedName = guestName.trim();

    // Check if name already exists
    if (currentClaimedBy.includes(trimmedName)) {
      alert('Este nombre ya apartó este regalo');
      return;
    }

    // Close input immediately
    setClaimingGift(null);
    setGuestName('');

    try {
      const giftRef = doc(db, 'gifts', giftId);
      
      if (isShared) {
        // For shared gifts, add to the array
        await updateDoc(giftRef, {
          claimedBy: [...currentClaimedBy, trimmedName],
        });
      } else {
        // For non-shared gifts, replace with single name
        await updateDoc(giftRef, {
          claimedBy: [trimmedName],
        });
      }
      
      alert('¡Regalo apartado exitosamente! 🎁');
    } catch (error) {
      console.error('Error claiming gift:', error);
      alert('Error al apartar el regalo. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200 opacity-20 animate-float">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-20 right-20 text-purple-200 opacity-20 animate-sparkle">
          <Heart size={50} />
        </div>
        <div className="absolute bottom-20 left-20 text-pink-200 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Baby size={45} />
        </div>
        <div className="absolute bottom-40 right-10 text-purple-200 opacity-20 animate-sparkle" style={{ animationDelay: '0.5s' }}>
          <Sparkles size={35} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Baby className="w-16 h-16 text-pink-400 mx-auto animate-float" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-4">
            Baby Shower
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-purple-700 mb-2">
            Abigail Gutierrez Tapiero
          </h2>
          <p className="text-lg text-gray-600 italic mb-8">
            Abigail significa &quot;alegría del padre&quot;
          </p>

          <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-2xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">Fecha</p>
                  <p className="text-lg font-bold text-gray-800">07 de Febrero, 2026</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">Dirección</p>
                  <a 
                    href="https://share.google/GctP29NDF1LscHKXQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-purple-700 hover:text-purple-800 hover:underline"
                  >
                    Carrera 82a # 42-47
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-pink-600">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Lista de Regalos</span>
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <Link
          href="/admin"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-50"
        >
          <GiftIcon className="w-5 h-5" />
          <span className="font-medium">Admin</span>
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando regalos...</p>
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl">
            <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aún no hay regalos en la lista</p>
            <p className="text-gray-500 text-sm mt-2">¡Pronto habrá opciones disponibles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div 
                  className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100 group overflow-hidden"
                  onTouchStart={(e) => onTouchStart(e, gift.id)}
                  onTouchMove={(e) => onTouchMove(e, gift.id)}
                  onTouchEnd={() => {
                    const allImages = [gift.imageUrl, ...(gift.imageUrls || [])];
                    onTouchEnd(gift.id, allImages);
                  }}
                >
                  {(() => {
                    const allImages = [gift.imageUrl, ...(gift.imageUrls || [])];
                    const currentIndex = currentImageIndex[gift.id] || 0;
                    return (
                      <>
                        <div
                          className="w-full h-full"
                          style={{
                            transform: `translateX(${swipeOffset[gift.id] || 0}px)`,
                            transition: isTransitioning[gift.id] ? 'transform 0.3s ease-out' : 'none',
                          }}
                        >
                          <Image
                            src={allImages[currentIndex]}
                            alt={gift.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={() => {
                                setCurrentImageIndex({
                                  ...currentImageIndex,
                                  [gift.id]: currentIndex === 0 ? allImages.length - 1 : currentIndex - 1
                                });
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => {
                                setCurrentImageIndex({
                                  ...currentImageIndex,
                                  [gift.id]: (currentIndex + 1) % allImages.length
                                });
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              →
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {allImages.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                  {gift.isShared && (
                    <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      🎁 Múltiple
                    </div>
                  )}
                  {gift.claimedBy && gift.claimedBy.length > 0 && !gift.isShared && (
                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-current" />
                      Apartado
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{gift.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{gift.description}</p>

                  {gift.claimedBy && gift.claimedBy.length > 0 && !gift.isShared ? (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border-2 border-pink-200">
                      <p className="text-sm text-gray-600 mb-1">Apartado por:</p>
                      <p className="text-lg font-semibold text-purple-700">{gift.claimedBy[0]}</p>
                    </div>
                  ) : gift.claimedBy && gift.claimedBy.length > 0 && gift.isShared ? (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mb-4">
                      <p className="text-sm text-gray-600 mb-2">✨ Apartado por {gift.claimedBy.length} {gift.claimedBy.length === 1 ? 'persona' : 'personas'}:</p>
                      <div className="flex flex-wrap gap-2">
                        {gift.claimedBy.map((name, index) => (
                          <span key={index} className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  
                  {(gift.isShared || (!gift.claimedBy || gift.claimedBy.length === 0)) && (
                    <div>
                      {claimingGift === gift.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Tu nombre completo"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleClaimGift(gift.id, gift.isShared, gift.claimedBy || [])}
                              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => {
                                setClaimingGift(null);
                                setGuestName('');
                              }}
                              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={() => setClaimingGift(gift.id)}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <Heart className="w-5 h-5" />
                            {gift.isShared ? 'Apartar También' : 'Apartar Regalo'}
                          </button>
                          {(() => {
                            const allLinks = [gift.purchaseLink, ...(gift.purchaseLinks || [])].filter(link => link);
                            if (allLinks.length === 0) return null;
                            if (allLinks.length === 1) {
                              return (
                                <a
                                  href={allLinks[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full bg-white border-2 border-purple-300 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                  Ver Producto
                                </a>
                              );
                            }
                            return (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-600 font-semibold">Opciones de compra:</p>
                                {allLinks.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white border-2 border-purple-300 text-purple-700 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-sm"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Opción {idx + 1}
                                  </a>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-xl">
            <p className="text-gray-700 text-lg mb-2">
              💝 Gracias por celebrar con nosotros la llegada de Abigail 💝
            </p>
            <p className="text-gray-500 text-sm">
              Cada regalo es una bendición para nuestra pequeña
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
