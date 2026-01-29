import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  Search,
  User,
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Ahmet Y.',
    rating: 5,
    comment:
      'Harika bir deneyimdi! Menü çok zengin ve sunumlar muhteşem. Özellikle mantı tavsiye ederim.',
    date: '2025-01-20',
    reply: 'Teşekkür ederiz Ahmet Bey, tekrar bekleriz!',
  },
  {
    id: '2',
    author: 'Elif K.',
    rating: 4,
    comment:
      'Yemekler lezzetli, ortam çok güzel. Servis biraz yavaş olabilir ama genel olarak memnunum.',
    date: '2025-01-18',
  },
  {
    id: '3',
    author: 'Mehmet S.',
    rating: 5,
    comment:
      'Kozbeyli Konağı her zamanki gibi harika. QR menü sistemi çok kullanışlı, kolay sipariş verdik.',
    date: '2025-01-15',
    reply: 'Değerli yorumunuz için teşekkürler!',
  },
  {
    id: '4',
    author: 'Ayşe D.',
    rating: 3,
    comment:
      'Kahvaltı menüsü daha çeşitli olabilir. Ancak manzara ve ortam çok güzel.',
    date: '2025-01-12',
  },
  {
    id: '5',
    author: 'Can B.',
    rating: 5,
    comment:
      'Özel günümüzü burada kutladık, ekip çok ilgili ve yardımcıydı. Kesinlikle tekrar geleceğiz!',
    date: '2025-01-10',
  },
  {
    id: '6',
    author: 'Zeynep A.',
    rating: 4,
    comment: 'Lezzetli yemekler, uygun fiyatlar. Porsiyon boyutları ideal.',
    date: '2025-01-08',
  },
];

export function ReviewsPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = (
    sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length
  ).toFixed(1);

  const filtered = sampleReviews.filter((r) => {
    if (filterRating && r.rating !== filterRating) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.author.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-text">Yorumlar</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-text">{avgRating}</p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={14}
                className={
                  i <= Math.round(Number(avgRating))
                    ? 'fill-warning text-warning'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-xs text-text-muted mt-1">Ortalama Puan</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-text">{sampleReviews.length}</p>
          <p className="text-xs text-text-muted mt-1">Toplam Yorum</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-text">
            {sampleReviews.filter((r) => r.reply).length}
          </p>
          <p className="text-xs text-text-muted mt-1">Yanıtlanan</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Yorum veya yazar ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide shrink-0">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !filterRating
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-muted'
            }`}
          >
            Tümü
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(filterRating === r ? null : r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterRating === r
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-text-muted'
              }`}
            >
              {r}
              <Star size={12} className={filterRating === r ? 'fill-white' : 'fill-warning text-warning'} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-border rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">
                      {review.author}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i <= review.rating
                              ? 'fill-warning text-warning'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(review.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-text mt-2">{review.comment}</p>

                {/* Reply */}
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-primary/20">
                    <p className="text-xs font-medium text-primary mb-0.5">
                      Yanıtınız
                    </p>
                    <p className="text-sm text-text-muted">{review.reply}</p>
                  </div>
                )}

                {/* Reply input */}
                {replyingTo === review.id ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
                      Gönder
                    </button>
                  </div>
                ) : (
                  !review.reply && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                    >
                      <MessageCircle size={13} />
                      Yanıtla
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-text-muted">Yorum bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
