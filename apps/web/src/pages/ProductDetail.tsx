import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Card, Skeleton } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import { useCartStore } from '../store/cart.js';
import API from '../api/index.js';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Vendor {
  id: string;
  businessName: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: Category | string;
  vendorId: Vendor;
  material: string;
  dimensions: { width: number; height: number; depth: number; unit: string };
  colorVariants: { name: string; hex: string; stock: number; priceOffset: number }[];
  images: string[];
  stock: number;
  status: 'draft' | 'active';
  rating: number;
  numReviews: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selector states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // Form states
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data.data.product);
      setReviews(response.data.data.reviews);
      setComments(response.data.data.comments || []);
      setRelatedProducts(response.data.data.relatedProducts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setErrorMsg(null);
    setCommentSuccess(false);
    try {
      const response = await API.post(`/products/${id}/comments`, {
        content: commentContent
      });
      setComments(prev => [response.data.data, ...prev]);
      setCommentContent('');
      setCommentSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.colorVariants[selectedVariantIdx];
    // Cast type because sharing structure between modules
    addItem(product as any, variant?.name, variant?.name, qty);
    alert(`Added ${qty}x ${product.name} (₹{variant?.name || 'Default'}) to your cart.`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryMsg.trim()) return;
    setErrorMsg(null);
    setEnquirySuccess(false);
    try {
      await API.post('/enquiries', {
        productId: product?.id,
        message: enquiryMsg
      });
      setEnquiryMsg('');
      setEnquirySuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit enquiry.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setErrorMsg(null);
    setReviewSuccess(false);
    try {
      await API.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewComment('');
      setReviewSuccess(true);
      fetchProductDetails(); // reload to get new avg ratings and reviews list
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to post review.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        <Skeleton variant="rect" className="aspect-[4/5]" />
        <div className="space-y-6">
          <Skeleton variant="text" className="w-1/2 h-8" />
          <Skeleton variant="text" className="w-1/3 h-5" />
          <Skeleton variant="rect" className="h-40" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-serif text-2xl font-bold mb-2">Piece Not Found</h2>
        <p className="text-brand-clay text-sm mb-6">The requested catalog item could not be retrieved from the database.</p>
        <Link to="/products">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const variant = product.colorVariants[selectedVariantIdx];
  const finalPrice = product.price + (variant?.priceOffset || 0);
  const totalStock = variant?.stock || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Images Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-brand-sand/10 overflow-hidden relative border border-brand-sand-dark/15">
            <img 
              src={product.images[activeImageIdx]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-500"
            />
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-brand-terracotta text-brand-linen text-[9px] uppercase tracking-widest font-bold px-3 py-1">
                Sale
              </span>
            )}
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImageIdx(idx)}
                className={`w-20 h-24 overflow-hidden border-2 flex-shrink-0 transition-all 
                  ${idx === activeImageIdx ? 'border-brand-terracotta' : 'border-transparent opacity-65 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-clay mb-2 block">
              <Link 
                to={`/vendors/${product.vendorId?.id || (product.vendorId as any)._id}`} 
                className="hover:underline text-brand-terracotta transition-colors font-bold"
              >
                {product.vendorId?.businessName} Showroom
              </Link>
            </span>
            <h1 className="font-serif text-3xl font-bold text-brand-walnut mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-sans text-brand-clay mb-4">
              <span className="text-brand-terracotta">★ {product.rating}</span>
              <span>•</span>
              <span>{product.numReviews} Editorial Reviews</span>
            </div>
            <p className="font-serif text-2xl font-semibold text-brand-walnut">₹{finalPrice}.00</p>
          </div>

          <div className="border-t border-b border-brand-sand-dark/20 py-6 space-y-4 font-sans text-xs leading-relaxed text-brand-clay">
            <p className="text-brand-walnut leading-relaxed">{product.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 text-[11px]">
              <div>
                <strong className="block text-brand-walnut uppercase tracking-wide mb-1">Materials</strong>
                <span>{product.material}</span>
              </div>
              <div>
                <strong className="block text-brand-walnut uppercase tracking-wide mb-1">Dimensions</strong>
                <span>
                  {product.dimensions.width}w x {product.dimensions.height}h x {product.dimensions.depth}d {product.dimensions.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Selector Swatches */}
          {product.colorVariants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-clay">
                Finish Variant: <span className="text-brand-walnut">{variant?.name}</span>
              </label>
              <div className="flex gap-3">
                {product.colorVariants.map((v, idx) => (
                  <button
                    key={v.name}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setQty(1);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                      ${idx === selectedVariantIdx ? 'border-brand-terracotta scale-105' : 'border-brand-sand-dark/25'}`}
                    style={{ backgroundColor: v.hex }}
                    title={v.name}
                  >
                    {idx === selectedVariantIdx && (
                      <span className="w-2 h-2 rounded-full invert mix-blend-difference bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-sand-dark/30 bg-white">
                <button 
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 hover:bg-brand-sand-light text-sm font-semibold"
                >
                  -
                </button>
                <span className="px-6 py-2 font-mono text-sm">{qty}</span>
                <button 
                  onClick={() => setQty(prev => Math.min(totalStock, prev + 1))}
                  className="px-4 py-2 hover:bg-brand-sand-light text-sm font-semibold"
                  disabled={qty >= totalStock}
                >
                  +
                </button>
              </div>

              <div className="text-[11px] text-brand-clay font-sans">
                {totalStock > 0 ? (
                  <span>In stock: <strong className="text-brand-walnut">{totalStock} items</strong></span>
                ) : (
                  <span className="text-brand-terracotta font-semibold">Out of Stock</span>
                )}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-center" 
              onClick={handleAddToCart}
              disabled={totalStock <= 0}
            >
              {totalStock > 0 ? 'Add to Spaces' : 'Out of Stock'}
            </Button>
          </div>

          {/* Custom Enquiry Form */}
          <Card className="p-6 bg-brand-sand-light/45 border border-brand-sand-dark/20 text-left" hoverEffect={false}>
            <h3 className="font-serif text-sm font-bold text-brand-walnut mb-2">Custom Dimensions or Finishes?</h3>
            <p className="text-brand-clay text-[10px] font-sans leading-relaxed mb-4">
              Submit a custom size, wood stain, or upholstery fabric enquiry directly to the designer.
            </p>
            {enquirySuccess && (
              <div className="p-3 bg-brand-sage/10 text-brand-sage text-[10px] font-semibold uppercase tracking-wider border border-brand-sage/20 mb-4">
                Enquiry posted successfully! The studio will reply shortly.
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta text-[10px] font-semibold uppercase tracking-wider border border-brand-terracotta/20 mb-4">
                {errorMsg}
              </div>
            )}
            {isAuthenticated ? (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <textarea
                  value={enquiryMsg}
                  onChange={e => setEnquiryMsg(e.target.value)}
                  placeholder="e.g. Can you make this sideboard in 180cm width instead of 160cm? What is the pricing adjustment?"
                  rows={3}
                  className="w-full bg-white border border-brand-sand-dark/30 px-3 py-2 text-xs focus:outline-none"
                />
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  Send Enquiry to Studio
                </Button>
              </form>
            ) : (
              <p className="text-brand-terracotta text-[10px] font-semibold">
                Please <Link to="/login" className="underline">sign in</Link> to submit custom product enquiries.
              </p>
            )}
          </Card>

        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 border-t border-brand-sand-dark/20 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Write review */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-walnut">Editorial Feedback</h3>
            <p className="text-brand-clay text-xs leading-relaxed font-sans">
              Purchased this design? Leave your feedback on construction detail and finishing oils for the Lookbook.
            </p>

            {reviewSuccess && (
              <div className="p-3 bg-brand-sage/10 text-brand-sage text-[10px] font-semibold uppercase border border-brand-sage/20 mb-4">
                Review posted successfully!
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta text-[10px] font-semibold uppercase border border-brand-terracotta/20 mb-4">
                {errorMsg}
              </div>
            )}

            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay mb-2">Rating</label>
                  <select 
                    value={reviewRating} 
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="w-full bg-brand-linen border border-brand-sand-dark/30 px-3 py-2 text-xs focus:outline-none rounded-none"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay mb-2">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts on craftsmanship..."
                    className="w-full bg-brand-linen border border-brand-sand-dark/30 px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Post Feedback
                </Button>
              </form>
            ) : (
              <p className="text-brand-terracotta text-[10px] font-semibold">
                Please <Link to="/login" className="underline">sign in</Link> to post feedback.
              </p>
            )}
          </div>

          {/* List reviews */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-walnut">Product Ratings ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white border border-brand-sand-dark/15 text-brand-clay text-xs font-sans">
                No reviews have been posted for this piece yet. Be the first to share your feedback!
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(rev => (
                  <div key={rev.id} className="pb-6 border-b border-brand-sand-dark/15 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-brand-walnut font-serif font-bold">{rev.userName}</strong>
                      <span className="text-[10px] text-brand-clay">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-brand-terracotta text-xs">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p className="text-brand-clay text-xs font-sans leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Public Q&A & Comments Section */}
      <section className="mt-20 border-t border-brand-sand-dark/20 pt-16 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          {/* Ask question form */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-walnut">Product Q&A / Ask a Designer</h3>
            <p className="text-brand-clay text-xs leading-relaxed font-sans">
              Have a question about spacing, custom materials, or color swatches? Post a public query for our design studios to reply.
            </p>

            {commentSuccess && (
              <div className="p-3 bg-brand-sage/10 text-brand-sage text-[10px] font-semibold uppercase border border-brand-sage/20 mb-4">
                Question submitted to the studio boards!
              </div>
            )}

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay mb-2">Your Question</label>
                  <textarea
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    rows={4}
                    placeholder="Ask about joinery details, finishes..."
                    className="w-full bg-brand-linen border border-brand-sand-dark/30 px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Post Public Question
                </Button>
              </form>
            ) : (
              <p className="text-brand-terracotta text-[10px] font-semibold">
                Please <Link to="/login" className="underline">sign in</Link> to ask questions.
              </p>
            )}
          </div>

          {/* List Q&A */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-walnut">Active Q&A Threads ({comments.length})</h3>

            {comments.length === 0 ? (
              <div className="p-8 text-center bg-white border border-brand-sand-dark/15 text-brand-clay text-xs font-sans">
                No active questions on this piece yet. Feel free to enquire above!
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map(c => (
                  <div key={c.id || c._id} className="p-6 bg-brand-linen-dark/20 border border-brand-sand-dark/15 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-brand-walnut font-sans">Q: {c.content}</span>
                        <span className="text-[9px] text-brand-clay">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="block text-[9px] text-brand-clay uppercase tracking-widest">Asked by {c.userName}</span>
                    </div>

                    {c.reply ? (
                      <div className="pt-4 border-t border-brand-sand-dark/15 bg-brand-linen/40 p-4 space-y-1">
                        <p className="text-brand-walnut text-xs font-sans italic">
                          <strong className="text-brand-sage uppercase tracking-wider text-[9px] not-italic mr-2">Studio Response:</strong>
                          "{c.reply}"
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-brand-clay italic font-serif">Awaiting reply from designer studio...</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* You May Also Like Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-brand-sand-dark/20 pt-16 mb-20">
          <div className="text-left mb-10">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-sage block mb-1">
              Curated pairings
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-walnut">
              You May Also Like
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(rel => (
              <Card key={rel.id} className="relative group flex flex-col h-full bg-brand-linen dark:bg-brand-charcoal/40" hoverEffect={true}>
                <Link to={`/products/${rel.id}`}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-sand-light cursor-pointer">
                    <img 
                      src={rel.images[0]} 
                      alt={rel.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-5 text-left flex flex-col justify-between flex-grow">
                  <div>
                    <Link to={`/products/${rel.id}`}>
                      <h4 className="font-serif text-sm font-bold text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors cursor-pointer mb-1 truncate">
                        {rel.name}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-brand-clay font-sans uppercase tracking-widest mb-3">
                      {typeof rel.categoryId === 'object' ? (rel.categoryId as any).name : 'Collection Piece'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-brand-sand-dark/15">
                    <span className="text-brand-terracotta text-sm font-bold">
                      ₹{rel.price}
                    </span>
                    <Link to={`/products/${rel.id}`} className="text-[10px] font-bold uppercase tracking-wider text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors">
                      View →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
