import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, Sequence } from "remotion";
import { useState, useEffect } from "react";

// Sample data structure
interface SocialProofProps {
  productImage: string;
  productTitle: string;
  originalPrice: string;
  salePrice: string;
  rating: number;
  reviewCount: number;
  reviews: Array<{
    id: number;
    name: string;
    text: string;
    rating: number;
    date: string;
  }>;
}

export const SocialProofScene: React.FC<SocialProofProps> = ({
  productImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  productTitle = "Wireless Noise-Cancelling Headphones",
  originalPrice = "$249.99",
  salePrice = "$199.99",
  rating = 4.7,
  reviewCount = 1284,
  reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      text: "Best purchase this year! Sound quality is incredible and battery lasts forever.",
      rating: 5,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Sam Wilson",
      text: "The noise cancellation is a game changer for my daily commute. Highly recommended!",
      rating: 5,
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Taylor Swift",
      text: "Perfect for workouts. They stay in place and the sound is amazing!",
      rating: 4,
      date: "3 days ago"
    },
    {
      id: 4,
      name: "Chris Martin",
      text: "Worth every penny. Comfortable for all-day wear and the bass is perfect.",
      rating: 5,
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Jamie Lee",
      text: "Bought these for my husband, he hasn't taken them off since. Great gift idea!",
      rating: 5,
      date: "1 week ago"
    }
  ]
}) => {
  const frame = useCurrentFrame();
  
  // Animations
  const productSlide = spring({
    frame: frame - 15,
    fps: 30,
    config: { damping: 20 }
  });
  
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const priceScale = spring({
    frame: frame - 45,
    fps: 30,
    config: { damping: 15 }
  });
  
  const ctaAnimation = spring({
    frame: frame - 180, // Start at 6 seconds
    fps: 30,
    config: { damping: 10 }
  });

  // Calculate which review to show (rotate every 3 seconds)
  const reviewIndex = Math.floor(frame / 90) % reviews.length;
  const currentReview = reviews[reviewIndex];
  
  // Review enter animation
  const reviewSlide = spring({
    frame: frame % 90,
    fps: 30,
    config: { damping: 20 }
  });

  return (
    <AbsoluteFill style={styles.container}>
      {/* Background Gradient */}
      <div style={styles.background} />
      
      {/* Product Thumbnail (Top Left) */}
      <div style={{
        ...styles.productThumbnail,
        transform: `translateX(${(1 - productSlide) * -100}px)`,
      }}>
        <Img src={productImage} style={styles.productImage} />
        <div style={styles.productBadge}>🔥 HOT</div>
      </div>
      
      {/* Main Content */}
      <div style={styles.content}>
        {/* Title */}
        <h1 style={{...styles.title, opacity: titleOpacity}}>
          {productTitle}
        </h1>
        
        {/* Rating & Reviews */}
        <div style={styles.ratingSection}>
          <div style={styles.stars}>
            {"★".repeat(5).split('').map((star, i) => (
              <span key={i} style={{
                color: i < Math.floor(rating) ? "#FFD700" : "#CCCCCC",
                fontSize: 36,
                marginRight: 5
              }}>
                {star}
              </span>
            ))}
            <span style={styles.ratingText}>
              {rating.toFixed(1)} • {reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </div>
        
        {/* Price Section */}
        <div style={{
          ...styles.priceSection,
          transform: `scale(${priceScale})`
        }}>
          <div style={styles.originalPrice}>{originalPrice}</div>
          <div style={styles.salePrice}>{salePrice}</div>
          <div style={styles.discountBadge}>
            SAVE {Math.round((1 - parseFloat(salePrice.replace('$', '')) / parseFloat(originalPrice.replace('$', ''))) * 100)}%
          </div>
        </div>
        
        {/* Reviews Carousel */}
        <div style={styles.reviewCarousel}>
          <div style={{
            transform: `translateX(${(1 - reviewSlide) * 50}px)`,
            opacity: reviewSlide
          }}>
            <div style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewerName}>{currentReview.name}</div>
                <div style={styles.reviewStars}>
                  {"★".repeat(currentReview.rating)}
                  <span style={styles.reviewDate}>{currentReview.date}</span>
                </div>
              </div>
              <div style={styles.reviewText}>"{currentReview.text}"</div>
              <div style={styles.reviewIndicator}>
                {reviews.map((_, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.dot,
                      backgroundColor: idx === reviewIndex ? "#3b82f6" : "#ccc"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <div style={{
          ...styles.ctaContainer,
          transform: `translateY(${(1 - ctaAnimation) * 100}px)`,
          opacity: ctaAnimation
        }}>
          <button style={styles.ctaButton}>
            <span style={styles.ctaIcon}>🛒</span>
            SHOP NOW - LIMITED TIME OFFER
          </button>
          <div style={styles.ctaSubtext}>
            ✅ 30-day money-back guarantee • 🚚 Free shipping • ⚡ 24/7 support
          </div>
        </div>
        
        {/* Trust Badges */}
        <div style={styles.trustBadges}>
          <div style={styles.badge}>🔒 Secure Checkout</div>
          <div style={styles.badge}>⭐ 4.9/5 Customer Rating</div>
          <div style={styles.badge}>🚚 Free 2-Day Shipping</div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        fontSize: 24,
        color: "#3b82f6",
        opacity: 0.1,
        transform: `rotate(${frame * 0.5}deg)`,
        fontWeight: "bold"
      }}>
        TRENDING
      </div>
    </AbsoluteFill>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "white",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: 60,
    overflow: "hidden"
  } as React.CSSProperties,
  
  background: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
    zIndex: 0
  } as React.CSSProperties,
  
  productThumbnail: {
    position: "absolute" as const,
    top: 40,
    left: 40,
    width: 200,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    border: "3px solid rgba(59, 130, 246, 0.5)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    zIndex: 10
  } as React.CSSProperties,
  
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const
  },
  
  productBadge: {
    position: "absolute" as const,
    top: 10,
    right: -15,
    background: "#ef4444",
    color: "white",
    padding: "5px 15px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "bold" as const,
    transform: "rotate(15deg)",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)"
  } as React.CSSProperties,
  
  content: {
    position: "relative" as const,
    zIndex: 1,
    maxWidth: 800,
    marginLeft: 280, // Make room for thumbnail
    marginTop: 40
  } as React.CSSProperties,
  
  title: {
    fontSize: 56,
    fontWeight: "bold" as const,
    marginBottom: 20,
    lineHeight: 1.2,
    background: "linear-gradient(90deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const
  } as React.CSSProperties,
  
  ratingSection: {
    marginBottom: 30
  } as React.CSSProperties,
  
  stars: {
    display: "flex" as const,
    alignItems: "center" as const,
    marginBottom: 10
  } as React.CSSProperties,
  
  ratingText: {
    fontSize: 28,
    marginLeft: 15,
    opacity: 0.9
  } as React.CSSProperties,
  
  priceSection: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 20,
    marginBottom: 40,
    transformOrigin: "left center" as const
  } as React.CSSProperties,
  
  originalPrice: {
    fontSize: 42,
    textDecoration: "line-through" as const,
    opacity: 0.5,
    color: "#94a3b8"
  } as React.CSSProperties,
  
  salePrice: {
    fontSize: 72,
    fontWeight: "bold" as const,
    color: "#10b981",
    textShadow: "0 4px 20px rgba(16, 185, 129, 0.3)"
  } as React.CSSProperties,
  
  discountBadge: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "8px 20px",
    borderRadius: 30,
    fontSize: 24,
    fontWeight: "bold" as const,
    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)"
  } as React.CSSProperties,
  
  reviewCarousel: {
    marginBottom: 40,
    minHeight: 180
  } as React.CSSProperties,
  
  reviewCard: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)" as const,
    borderRadius: 20,
    padding: 25,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    maxWidth: 600
  } as React.CSSProperties,
  
  reviewHeader: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 15
  } as React.CSSProperties,
  
  reviewerName: {
    fontSize: 24,
    fontWeight: "bold" as const
  } as React.CSSProperties,
  
  reviewStars: {
    color: "#FFD700",
    fontSize: 20,
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 5
  } as React.CSSProperties,
  
  reviewDate: {
    fontSize: 16,
    color: "#94a3b8",
    marginLeft: 10
  } as React.CSSProperties,
  
  reviewText: {
    fontSize: 22,
    lineHeight: 1.4,
    fontStyle: "italic" as const,
    color: "#e2e8f0"
  } as React.CSSProperties,
  
  reviewIndicator: {
    display: "flex" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginTop: 20
  } as React.CSSProperties,
  
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    transition: "background-color 0.3s"
  } as React.CSSProperties,
  
  ctaContainer: {
    marginTop: 30
  } as React.CSSProperties,
  
  ctaButton: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "25px 50px",
    fontSize: 32,
    fontWeight: "bold" as const,
    borderRadius: 50,
    cursor: "pointer",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 15,
    marginBottom: 15,
    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)",
    transform: "scale(1)",
    transition: "transform 0.2s",
    margin: "0 auto"
  } as React.CSSProperties,
  
  ctaIcon: {
    fontSize: 36
  } as React.CSSProperties,
  
  ctaSubtext: {
    fontSize: 20,
    textAlign: "center" as const,
    opacity: 0.8,
    color: "#cbd5e1"
  } as React.CSSProperties,
  
  trustBadges: {
    display: "flex" as const,
    justifyContent: "center" as const,
    gap: 30,
    marginTop: 40,
    flexWrap: "wrap" as const
  } as React.CSSProperties,
  
  badge: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "12px 25px",
    borderRadius: 30,
    fontSize: 18,
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 8,
    border: "1px solid rgba(255, 255, 255, 0.1)"
  } as React.CSSProperties
};