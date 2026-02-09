import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { useMemo } from "react";

// Enhanced data structure
interface BeautifulSocialProofProps {
  productImage: string;
  productTitle: string;
  originalPrice: string;
  salePrice: string;
  rating: number;
  reviewCount: number;
  features: string[];
  reviews: Array<{
    id: number;
    name: string;
    avatar: string;
    text: string;
    rating: number;
    verified: boolean;
  }>;
}

export const BeautifulSocialProof: React.FC<BeautifulSocialProofProps> = ({
  productImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  productTitle = "Bose QuietComfort 45",
  originalPrice = "$329.00",
  salePrice = "$279.00",
  rating = 4.8,
  reviewCount = 2347,
  features = [
    "Noise cancelling",
    "24-hour battery",
    "Voice assistant",
    "Travel case included"
  ],
  reviews = [
    {
      id: 1,
      name: "Sarah M.",
      avatar: "👩🏽",
      text: "The noise cancellation is unreal! Perfect for flights.",
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: "James L.",
      avatar: "👨🏻",
      text: "Most comfortable headphones I've ever owned.",
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: "Alex T.",
      avatar: "🧑🏾",
      text: "Sound quality exceeded my expectations.",
      rating: 4,
      verified: true
    },
    {
      id: 4,
      name: "Emma R.",
      avatar: "👩🏼",
      text: "Battery lasts forever. Worth every penny!",
      rating: 5,
      verified: true
    }
  ]
}) => {
  const frame = useCurrentFrame();
  
  // Sophisticated animations
  const containerFadeIn = interpolate(frame, [0, 45], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateRight: "clamp",
  });
  
  const productFloat = Math.sin(frame / 30) * 8;
  const productGlow = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const reviewIndex = Math.floor(frame / 100) % reviews.length;
  const reviewProgress = frame % 100;
  
  const reviewSlide = interpolate(reviewProgress, [0, 20, 80, 100], [0, 0, 1, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  
  const pricePulse = 1 + Math.sin(frame / 10) * 0.03;
  const ctaBounce = spring({
    frame: frame - 180,
    fps: 30,
    config: { damping: 8, stiffness: 100 },
  });
  
  const featuresAnimation = useMemo(() => 
    features.map((_, i) => 
      spring({
        frame: frame - (i * 15),
        fps: 30,
        config: { damping: 12 }
      })
    ), [frame, features.length]
  );
  
  // Floating particles
  const particles = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      x: (i * 30 + frame * 0.5) % 1080,
      y: 200 + Math.sin(frame * 0.02 + i) * 100,
      size: 3 + Math.sin(frame * 0.03 + i) * 2,
      opacity: 0.1 + Math.sin(frame * 0.04 + i) * 0.1
    })), [frame]
  );

  return (
    <AbsoluteFill style={styles.container}>
      {/* Animated Gradient Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, 
          hsl(${220 + Math.sin(frame * 0.01) * 10}, 70%, 8%) 0%,
          hsl(${250 + Math.sin(frame * 0.02) * 15}, 80%, 12%) 50%,
          hsl(${280 + Math.sin(frame * 0.015) * 10}, 75%, 10%) 100%)`,
        opacity: containerFadeIn
      }} />
      
      {/* Animated Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          background: "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: p.opacity,
          filter: "blur(1px)"
        }} />
      ))}
      
      {/* Floating Product Image */}
      <div style={{
        position: "absolute",
        top: 100,
        right: 80,
        transform: `translateY(${productFloat}px) scale(0.9)`,
        opacity: containerFadeIn,
        zIndex: 10
      }}>
        {/* Glow Effect */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, rgba(59,130,246,${productGlow * 0.4}) 0%, transparent 70%)`,
          filter: "blur(40px)",
          zIndex: -1
        }} />
        
        <div style={styles.productCard}>
          <Img src={productImage} style={styles.productImage} />
          <div style={styles.productBadge}>
            <span style={styles.badgeIcon}>🔥</span>
            #1 BESTSELLER
          </div>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div style={{
        ...styles.content,
        opacity: containerFadeIn,
        transform: `translateX(${(1 - containerFadeIn) * -50}px)`
      }}>
        {/* Trust Badge */}
        <div style={styles.trustPill}>
          <span style={styles.trustIcon}>⭐</span>
          TRUSTED BY {reviewCount.toLocaleString()}+ CUSTOMERS
        </div>
        
        {/* Title with Gradient */}
        <h1 style={styles.title}>
          <span style={styles.titleHighlight}>Elevate Your Sound</span>
          <br />
          {productTitle}
        </h1>
        
        {/* Rating Display */}
        <div style={styles.ratingContainer}>
          <div style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                ...styles.star,
                color: i < Math.floor(rating) ? "#FFD700" : "#374151",
                transform: `scale(${1 + Math.sin(frame * 0.1 + i) * 0.05})`
              }}>
                ★
              </div>
            ))}
            <span style={styles.ratingText}>
              {rating.toFixed(1)} • {reviewCount.toLocaleString()} reviews
            </span>
          </div>
          <div style={styles.verifiedBadge}>
            ✅ Verified Purchase
          </div>
        </div>
        
        {/* Price Section */}
        <div style={styles.priceContainer}>
          <div style={styles.priceComparison}>
            <span style={styles.originalPrice}>{originalPrice}</span>
            <span style={styles.discountPill}>
              SAVE {Math.round((1 - parseFloat(salePrice.replace('$', '')) / parseFloat(originalPrice.replace('$', ''))) * 100)}%
            </span>
          </div>
          <div style={{
            ...styles.salePrice,
            transform: `scale(${pricePulse})`
          }}>
            {salePrice}
            <div style={styles.priceSubtext}>+ FREE Shipping</div>
          </div>
        </div>
        
        {/* Key Features */}
        <div style={styles.featuresGrid}>
          {features.map((feature, i) => (
            <div 
              key={i}
              style={{
                ...styles.featureCard,
                opacity: featuresAnimation[i],
                transform: `translateX(${(1 - featuresAnimation[i]) * 50}px)`
              }}
            >
              <div style={styles.featureIcon}>✓</div>
              {feature}
            </div>
          ))}
        </div>
        
        {/* Reviews Carousel */}
        <div style={styles.reviewsSection}>
          <div style={styles.reviewsHeader}>
            <span style={styles.reviewsTitle}>LOVED BY CUSTOMERS</span>
            <div style={styles.reviewsNav}>
              {reviews.map((_, i) => (
                <div 
                  key={i}
                  style={{
                    ...styles.navDot,
                    background: i === reviewIndex ? "#3b82f6" : "#4b5563",
                    transform: `scale(${i === reviewIndex ? 1.3 : 1})`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div style={styles.reviewer}>
                <div style={styles.avatar}>{reviews[reviewIndex].avatar}</div>
                <div>
                  <div style={styles.reviewerName}>{reviews[reviewIndex].name}</div>
                  <div style={styles.reviewMeta}>
                    {"★".repeat(reviews[reviewIndex].rating)}
                    {reviews[reviewIndex].verified && (
                      <span style={styles.verifiedTag}>Verified Buyer</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              ...styles.reviewText,
              opacity: reviewSlide
            }}>
              "{reviews[reviewIndex].text}"
            </div>
          </div>
        </div>
        
        {/* Animated CTA Button */}
        <div style={{
          ...styles.ctaContainer,
          transform: `translateY(${(1 - ctaBounce) * 100}px) scale(${ctaBounce})`,
          opacity: ctaBounce
        }}>
          <div style={styles.ctaButton}>
            <div style={styles.ctaContent}>
              <div style={styles.ctaIcon}>⚡</div>
              <div>
                <div style={styles.ctaMain}>GET YOURS NOW</div>
                <div style={styles.ctaSub}>Limited Time Offer • 30-Day Trial</div>
              </div>
            </div>
            <div style={styles.ctaArrow}>→</div>
          </div>
          
          <div style={styles.guarantee}>
            <span style={styles.guaranteeIcon}>🛡️</span>
            100% Satisfaction Guarantee • Free Returns
          </div>
        </div>
        
        {/* Footer Trust Signals */}
        <div style={styles.footerTrust}>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>🚚</div>
            Free 2-Day Shipping
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>💳</div>
            Secure Payment
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>⭐</div>
            5-Star Support
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
        pointerEvents: "none"
      }} />
    </AbsoluteFill>
  );
};

// Enhanced Styles
const styles = {
  container: {
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  } as React.CSSProperties,
  
  productCard: {
    width: 320,
    height: 320,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    border: "2px solid rgba(255,255,255,0.1)",
    boxShadow: `
      0 20px 60px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.05),
      inset 0 1px 0 rgba(255,255,255,0.1)
    `,
    transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)"
  } as React.CSSProperties,
  
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(1.05) contrast(1.1)"
  } as React.CSSProperties,
  
  productBadge: {
    position: "absolute" as const,
    top: 20,
    left: 20,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "10px 20px",
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 800 as const,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.4)",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  badgeIcon: {
    fontSize: 18
  } as React.CSSProperties,
  
  content: {
    position: "relative" as const,
    zIndex: 2,
    maxWidth: 700,
    marginLeft: 80,
    marginTop: 100,
    paddingRight: 400
  } as React.CSSProperties,
  
  trustPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(59, 130, 246, 0.15)",
    color: "#93c5fd",
    padding: "12px 24px",
    borderRadius: 50,
    fontSize: 16,
    fontWeight: 600 as const,
    marginBottom: 30,
    border: "1px solid rgba(59, 130, 246, 0.2)",
    backdropFilter: "blur(10px)"
  } as React.CSSProperties,
  
  trustIcon: {
    fontSize: 20
  } as React.CSSProperties,
  
  title: {
    fontSize: 72,
    fontWeight: 800 as const,
    lineHeight: 1.1,
    marginBottom: 25,
    background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #818cf8 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    textShadow: "0 4px 30px rgba(129, 140, 248, 0.3)"
  } as React.CSSProperties,
  
  titleHighlight: {
    fontSize: 56,
    fontWeight: 700 as const,
    opacity: 0.9
  } as React.CSSProperties,
  
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 35
  } as React.CSSProperties,
  
  starsContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8
  } as React.CSSProperties,
  
  star: {
    fontSize: 32,
    filter: "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))"
  } as React.CSSProperties,
  
  ratingText: {
    fontSize: 24,
    color: "#d1d5db",
    marginLeft: 15,
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  verifiedBadge: {
    background: "rgba(34, 197, 94, 0.15)",
    color: "#86efac",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 15,
    fontWeight: 600 as const,
    border: "1px solid rgba(34, 197, 94, 0.2)"
  } as React.CSSProperties,
  
  priceContainer: {
    marginBottom: 40
  } as React.CSSProperties,
  
  priceComparison: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 10
  } as React.CSSProperties,
  
  originalPrice: {
    fontSize: 32,
    color: "#9ca3af",
    textDecoration: "line-through",
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  discountPill: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "6px 16px",
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 700 as const,
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  salePrice: {
    fontSize: 82,
    fontWeight: 800 as const,
    color: "#10b981",
    lineHeight: 1,
    textShadow: "0 8px 40px rgba(16, 185, 129, 0.4)",
    position: "relative" as const,
    display: "inline-block"
  } as React.CSSProperties,
  
  priceSubtext: {
    fontSize: 20,
    color: "#86efac",
    fontWeight: 500 as const,
    marginTop: 8
  } as React.CSSProperties,
  
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 15,
    marginBottom: 40
  } as React.CSSProperties,
  
  featureCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "18px 20px",
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500 as const,
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  } as React.CSSProperties,
  
  featureIcon: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "bold" as const
  } as React.CSSProperties,
  
  reviewsSection: {
    marginBottom: 40
  } as React.CSSProperties,
  
  reviewsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  } as React.CSSProperties,
  
  reviewsTitle: {
    fontSize: 20,
    color: "#a5b4fc",
    fontWeight: 600 as const,
    letterSpacing: "1px"
  } as React.CSSProperties,
  
  reviewsNav: {
    display: "flex",
    gap: 8
  } as React.CSSProperties,
  
  navDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "all 0.3s ease"
  } as React.CSSProperties,
  
  reviewCard: {
    background: "rgba(17, 24, 39, 0.7)",
    borderRadius: 24,
    padding: 30,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
  } as React.CSSProperties,
  
  reviewHeader: {
    marginBottom: 20
  } as React.CSSProperties,
  
  reviewer: {
    display: "flex",
    alignItems: "center",
    gap: 15
  } as React.CSSProperties,
  
  avatar: {
    width: 50,
    height: 50,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24
  } as React.CSSProperties,
  
  reviewerName: {
    fontSize: 20,
    fontWeight: 600 as const,
    color: "white"
  } as React.CSSProperties,
  
  reviewMeta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 5
  } as React.CSSProperties,
  
  verifiedTag: {
    fontSize: 14,
    color: "#86efac",
    background: "rgba(34, 197, 94, 0.15)",
    padding: "2px 10px",
    borderRadius: 12,
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  reviewText: {
    fontSize: 24,
    lineHeight: 1.4,
    color: "#e5e7eb",
    fontStyle: "italic" as const,
    fontWeight: 400 as const
  } as React.CSSProperties,
  
  ctaContainer: {
    marginBottom: 30
  } as React.CSSProperties,
  
  ctaButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    padding: "28px 40px",
    borderRadius: 20,
    fontSize: 24,
    fontWeight: 700 as const,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    boxShadow: `
      0 20px 60px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transition: "all 0.3s ease",
    position: "relative" as const,
    overflow: "hidden"
  } as React.CSSProperties,
  
  ctaContent: {
    display: "flex",
    alignItems: "center",
    gap: 20
  } as React.CSSProperties,
  
  ctaIcon: {
    fontSize: 36
  } as React.CSSProperties,
  
  ctaMain: {
    fontSize: 28,
    fontWeight: 700 as const,
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  ctaSub: {
    fontSize: 18,
    opacity: 0.9,
    marginTop: 4,
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  ctaArrow: {
    fontSize: 32,
    opacity: 0.8
  } as React.CSSProperties,
  
  guarantee: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 18,
    color: "#a5b4fc",
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  guaranteeIcon: {
    fontSize: 22
  } as React.CSSProperties,
  
  footerTrust: {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    marginTop: 30,
    flexWrap: "wrap" as const
  } as React.CSSProperties,
  
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    color: "#cbd5e1",
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  trustIcon: {
    fontSize: 22
  } as React.CSSProperties
};