import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, Easing, useVideoConfig } from "remotion";

interface SocialProofStoryboardProps {
  productImage: string;
  productTitle: string;
  originalPrice: string;
  salePrice: string;
  rating: number;
  reviewCount: number;
  reviews: string[];
}

export const SocialProofStoryboard: React.FC<SocialProofStoryboardProps> = ({
  productImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
  productTitle = "Premium Wireless Headphones",
  originalPrice = "$99.00",
  salePrice = "$59.00",
  rating = 4.8,
  reviewCount = 2341,
  reviews = [
    "🔥 Best purchase this year!",
    "Didn't expect this quality!",
    "Worth every dollar.",
    "Sound quality is unreal.",
    "Perfect for daily commute."
  ]
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Convert seconds to frames
  const secondsToFrames = (sec: number) => Math.floor(sec * fps);
  
  // Timeline sections (in frames)
  const sections = {
    productEntry: { start: 0, end: secondsToFrames(1.5) },      // 0-1.5s
    socialProof: { start: secondsToFrames(1.5), end: secondsToFrames(3.5) }, // 1.5-3.5s
    priceImpact: { start: secondsToFrames(3.5), end: secondsToFrames(5.5) }, // 3.5-5.5s
    ctaMoment: { start: secondsToFrames(5.5), end: secondsToFrames(7) },    // 5.5-7s
    holdEnd: { start: secondsToFrames(7), end: secondsToFrames(8) }         // 7-8s
  };

  // SECTION 1: Product Entry (0-1.5s)
  const productEntryProgress = interpolate(
    frame,
    [sections.productEntry.start, sections.productEntry.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  const productSlide = spring({
    frame: frame - sections.productEntry.start,
    fps,
    config: { damping: 25, stiffness: 100 },
    durationInFrames: sections.productEntry.end - sections.productEntry.start
  });
  
  const productScale = interpolate(
    productEntryProgress,
    [0, 0.3, 1],
    [0.8, 1.1, 1],
    { easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );
  
  const productShadow = interpolate(productEntryProgress, [0, 1], [0, 0.4]);
  const productGlow = interpolate(productEntryProgress, [0, 1], [0, 1]);

  // SECTION 2: Social Proof Kick (1.5-3.5s)
  const socialProofProgress = interpolate(
    frame,
    [sections.socialProof.start, sections.socialProof.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  const starsProgress = spring({
    frame: frame - sections.socialProof.start,
    fps,
    config: { damping: 20 },
    durationInFrames: 15
  });
  
  const reviewCountProgress = spring({
    frame: frame - sections.socialProof.start - 10,
    fps,
    config: { damping: 20 }
  });
  
  // Review carousel - change every 0.8 seconds
  const reviewIndex = Math.floor(
    (frame - sections.socialProof.start) / (0.8 * fps)
  ) % reviews.length;
  
  const reviewSlide = spring({
    frame: (frame - sections.socialProof.start) % (0.8 * fps),
    fps,
    config: { damping: 25 },
    durationInFrames: 0.8 * fps
  });

  // SECTION 3: Price Impact (3.5-5.5s)
  const priceImpactProgress = interpolate(
    frame,
    [sections.priceImpact.start, sections.priceImpact.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  const originalPriceOpacity = interpolate(
    frame,
    [sections.priceImpact.start, sections.priceImpact.start + 15],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const salePriceBounce = spring({
    frame: frame - sections.priceImpact.start - 10,
    fps,
    config: { damping: 8, stiffness: 120 },
    durationInFrames: 20
  });
  
  const discountPulse = 1 + Math.sin(frame * 0.2) * 0.05;

  // SECTION 4: CTA Moment (5.5-7s)
  const ctaProgress = interpolate(
    frame,
    [sections.ctaMoment.start, sections.ctaMoment.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  const ctaSlide = spring({
    frame: frame - sections.ctaMoment.start,
    fps,
    config: { damping: 15 },
    durationInFrames: sections.ctaMoment.end - sections.ctaMoment.start
  });
  
  const ctaGlow = 0.5 + 0.5 * Math.sin(frame * 0.1);

  // SECTION 5: Background motion (7-8s)
  const backgroundShift = interpolate(
    frame,
    [sections.holdEnd.start, sections.holdEnd.end],
    [0, 100],
    { extrapolateLeft: "clamp" }
  );

  // Animated gradient background
  const gradientAngle = (frame * 0.2) % 360;
  
  return (
    <AbsoluteFill style={styles.container}>
      {/* Animated Gradient Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(${gradientAngle}deg, 
          #0f172a 0%,
          #1e293b ${50 + Math.sin(frame * 0.02) * 10}%,
          #0f172a 100%)`,
        opacity: 0.95
      }} />
      
      {/* Subtle Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${20 + (i * 10) + Math.sin(frame * 0.05 + i) * 5}%`,
          left: `${backgroundShift + i * 5}%`,
          width: 3,
          height: 3,
          background: "rgba(59, 130, 246, 0.3)",
          borderRadius: "50%",
          filter: "blur(1px)"
        }} />
      ))}
      
      {/* SECTION 1: Product Entry */}
      <div style={{
        ...styles.productContainer,
        transform: `
          translateY(${(1 - productSlide) * -100}px)
          scale(${productScale})
          rotate(${(1 - productSlide) * -5}deg)
        `,
        opacity: productEntryProgress,
        filter: `
          drop-shadow(0 ${10 * productShadow}px ${20 * productShadow}px rgba(0,0,0,0.3))
          brightness(${1 + productGlow * 0.1})
        `
      }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, rgba(59,130,246,${0.3 * productGlow}) 0%, transparent 70%)`,
          filter: "blur(40px)",
          zIndex: -1
        }} />
        
        <div style={styles.productCard}>
          <Img src={productImage} style={styles.productImage} />
        </div>
      </div>
      
      {/* Product Title (Subtle) */}
      <div style={{
        ...styles.productTitle,
        opacity: productEntryProgress * 0.7
      }}>
        {productTitle}
      </div>
      
      {/* SECTION 2: Social Proof Kick */}
      <div style={{
        ...styles.socialProofContainer,
        opacity: socialProofProgress
      }}>
        {/* Star Rating */}
        <div style={{
          ...styles.starsContainer,
          transform: `scale(${starsProgress})`,
          opacity: starsProgress
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{
              color: i < Math.floor(rating) ? "#FFD700" : "#374151",
              fontSize: 36,
              marginRight: 8,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }}>
              ★
            </span>
          ))}
        </div>
        
        {/* Review Count */}
        <div style={{
          ...styles.reviewCount,
          transform: `translateY(${(1 - reviewCountProgress) * 20}px)`,
          opacity: reviewCountProgress
        }}>
          ⭐ {rating.toFixed(1)} · {reviewCount.toLocaleString()} reviews
        </div>
        
        {/* Reviews Carousel */}
        <div style={styles.reviewsCarousel}>
          <div style={{
            transform: `translateX(${(1 - reviewSlide) * 50}px)`,
            opacity: reviewSlide
          }}>
            <div style={styles.reviewCard}>
              <div style={styles.reviewQuote}>
                "{reviews[reviewIndex]}"
              </div>
              <div style={styles.reviewIndicator}>
                {reviews.map((_, idx) => (
                  <div 
                    key={idx}
                    style={{
                      ...styles.reviewDot,
                      backgroundColor: idx === reviewIndex ? "#3b82f6" : "#4b5563",
                      transform: `scale(${idx === reviewIndex ? 1.3 : 1})`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION 3: Price Impact */}
      <div style={{
        ...styles.priceContainer,
        opacity: priceImpactProgress
      }}>
        {/* Original Price (Crossed Out) */}
        <div style={{
          ...styles.originalPrice,
          opacity: originalPriceOpacity,
          transform: `translateY(${(1 - originalPriceOpacity) * 20}px)`
        }}>
          {originalPrice}
        </div>
        
        {/* Sale Price with Bounce */}
        <div style={{
          ...styles.salePrice,
          transform: `scale(${salePriceBounce})`
        }}>
          {salePrice}
        </div>
        
        {/* Discount Badge with Pulse */}
        <div style={{
          ...styles.discountBadge,
          transform: `scale(${discountPulse})`
        }}>
          {Math.round((1 - parseFloat(salePrice.replace('$', '')) / parseFloat(originalPrice.replace('$', ''))) * 100)}% OFF
        </div>
      </div>
      
      {/* SECTION 4: CTA Moment */}
      <div style={{
        ...styles.ctaContainer,
        transform: `translateY(${(1 - ctaSlide) * 100}px)`,
        opacity: ctaSlide
      }}>
        <button style={{
          ...styles.ctaButton,
          boxShadow: `0 0 ${30 * ctaGlow}px rgba(59, 130, 246, ${0.3 * ctaGlow})`
        }}>
          <span style={styles.ctaIcon}>🛒</span>
          Shop Now
          <span style={styles.ctaArrow}>→</span>
        </button>
        
        {/* Trust Text */}
        <div style={styles.trustText}>
          30-day money-back guarantee • Free shipping
        </div>
      </div>
      
      {/* SECTION 5: Timeline Visualizer (Debug - remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={styles.timelineDebug}>
          <div style={styles.timeline}>
            <div style={{
              ...styles.timelineProgress,
              width: `${(frame / (8 * fps)) * 100}%`
            }} />
          </div>
          <div style={styles.timelineLabels}>
            <span>Product Entry</span>
            <span>Social Proof</span>
            <span>Price Impact</span>
            <span>CTA</span>
            <span>Hold</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Clean, modern styles
const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "white",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    overflow: "hidden"
  } as React.CSSProperties,
  
  productContainer: {
    position: "absolute" as const,
    top: 100,
    right: 60,
    width: 280,
    height: 280,
    zIndex: 10
  } as React.CSSProperties,
  
  productCard: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,0.1)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
    background: "rgba(0,0,0,0.2)"
  } as React.CSSProperties,
  
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(1.05) contrast(1.05)"
  } as React.CSSProperties,
  
  productTitle: {
    position: "absolute" as const,
    top: 120,
    left: 60,
    fontSize: 32,
    fontWeight: 600 as const,
    color: "#94a3b8",
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  socialProofContainer: {
    position: "absolute" as const,
    top: 220,
    left: 60,
    maxWidth: 600
  } as React.CSSProperties,
  
  starsContainer: {
    marginBottom: 10
  } as React.CSSProperties,
  
  reviewCount: {
    fontSize: 24,
    color: "#cbd5e1",
    marginBottom: 40,
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  reviewsCarousel: {
    minHeight: 120
  } as React.CSSProperties,
  
  reviewCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    padding: "25px 30px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    maxWidth: 500
  } as React.CSSProperties,
  
  reviewQuote: {
    fontSize: 28,
    lineHeight: 1.3,
    marginBottom: 15,
    fontWeight: 500 as const,
    color: "#f1f5f9"
  } as React.CSSProperties,
  
  reviewIndicator: {
    display: "flex",
    gap: 8,
    justifyContent: "center"
  } as React.CSSProperties,
  
  reviewDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "all 0.3s ease"
  } as React.CSSProperties,
  
  priceContainer: {
    position: "absolute" as const,
    bottom: 300,
    left: 60,
    display: "flex",
    alignItems: "center",
    gap: 30
  } as React.CSSProperties,
  
  originalPrice: {
    fontSize: 36,
    color: "#9ca3af",
    textDecoration: "line-through",
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  salePrice: {
    fontSize: 72,
    fontWeight: 800 as const,
    color: "#10b981",
    textShadow: "0 4px 20px rgba(16, 185, 129, 0.3)"
  } as React.CSSProperties,
  
  discountBadge: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "10px 20px",
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 700 as const,
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  ctaContainer: {
    position: "absolute" as const,
    bottom: 120,
    left: 60,
    right: 60
  } as React.CSSProperties,
  
  ctaButton: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "25px 50px",
    fontSize: 32,
    fontWeight: 700 as const,
    borderRadius: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    margin: "0 auto 15px",
    minWidth: 400,
    transition: "all 0.2s ease"
  } as React.CSSProperties,
  
  ctaIcon: {
    fontSize: 32
  } as React.CSSProperties,
  
  ctaArrow: {
    fontSize: 28,
    opacity: 0.8
  } as React.CSSProperties,
  
  trustText: {
    textAlign: "center" as const,
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: 500 as const
  } as React.CSSProperties,
  
  // Debug timeline (visible only in development)
  timelineDebug: {
    position: "absolute" as const,
    bottom: 40,
    left: 60,
    right: 60,
    opacity: 0.3
  } as React.CSSProperties,
  
  timeline: {
    height: 3,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8
  } as React.CSSProperties,
  
  timelineProgress: {
    height: "100%",
    background: "#3b82f6",
    transition: "width 0.1s linear"
  } as React.CSSProperties,
  
  timelineLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#94a3b8"
  } as React.CSSProperties
};  