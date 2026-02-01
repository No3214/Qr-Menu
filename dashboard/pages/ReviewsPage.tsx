import { useEffect, useState } from 'react';
import { Star, MessageSquare, Clock } from 'lucide-react';
import { ReviewService, Review } from '../../services/ReviewService';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        ReviewService.getReviews(),
        ReviewService.getStats()
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      toast.error(t('dash.reviews.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dash.reviews.title')}</h1>
          <p className="text-gray-500">{t('dash.reviews.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('dash.reviews.avgRating')}</p>
            <h2 className="text-2xl font-bold text-gray-900">{stats.average} / 5.0</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('dash.reviews.totalReviews')}</p>
            <h2 className="text-2xl font-bold text-gray-900">{stats.total}</h2>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('dash.reviews.recent')}</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">{t('dash.reviews.loading')}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">{t('dash.reviews.empty')}</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= review.rating ? '#FFC107' : 'none'}
                          color={s <= review.rating ? '#FFC107' : '#D1D5DB'}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">{review.rating}.0</span>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  "{review.comment}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {(review.customer_name?.[0] || t('dash.reviews.guest')[0]).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {review.customer_name || t('dash.reviews.guest')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
