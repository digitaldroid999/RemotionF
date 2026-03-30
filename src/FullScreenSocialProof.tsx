import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, Easing, useVideoConfig } from "remotion";

interface FullScreenSocialProofProps {
  productImage?: string;
  productTitle?: string;
  originalPrice?: string;
  salePrice?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: string[];
}

export const FullScreenSocialProof: React.FC<FullScreenSocialProofProps> = ({
  productImage = "https://m.media-amazon.com/images/I/71bR27GAJBL._AC_SX575_.jpg",
  productTitle = "PREMIUM WIRELESS HEADPHONES",
  originalPrice = "$99.00",
  salePrice = "$59.00",
  rating = 4.8,
  reviewCount = 2341,
  reviews = [
    "🔥 BEST PURCHASE THIS YEAR!",
    "DIDN'T EXPECT THIS QUALITY!",
    "WORTH EVERY DOLLAR.",
    "SOUND QUALITY IS UNREAL.",
    "PERFECT FOR DAILY COMMUTE."
  ]
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // DETECT ORIENTATION
  const isPortrait = height > width; // 1080×1920 = true, 1920×1080 = false
  const isLandscape = !isPortrait;
  
  // Convert seconds to frames
  const secondsToFrames = (sec: number) => Math.floor(sec * fps);
  
  // Timeline
  const sections = {
    productShrink: { start: 0, end: secondsToFrames(2.0) },
    titleAppear: { start: 0, end: secondsToFrames(1.0) },
    socialProof: { start: secondsToFrames(1.5), end: secondsToFrames(3.5) },
    priceImpact: { start: secondsToFrames(3.5), end: secondsToFrames(5.5) },
    ctaMoment: { start: secondsToFrames(5.5), end: secondsToFrames(7) },
    holdEnd: { start: secondsToFrames(7), end: secondsToFrames(8) }
  };

  // Responsive thumbnail size
  const baseThumbnailSize = Math.min(width, height) * (isPortrait ? 0.4 : 0.6 );
  const thumbnailWidth = baseThumbnailSize;
  const thumbnailHeight = baseThumbnailSize;
  
  // SINGLE PRODUCT IMAGE ANIMATION
  const shrinkProgress = interpolate(
    frame,
    [sections.productShrink.start, sections.productShrink.end],
    [0, 1],
    { 
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      extrapolateRight: "clamp"
    }
  );
  
  // RESPONSIVE IMAGE POSITION
  const imageX = interpolate(
    shrinkProgress,
    [0, 1],
    [
      width / 2, 
      isPortrait 
        ? width - thumbnailWidth / 2 - 40  // Right side for portrait
        : width - thumbnailWidth / 2 - 60  // Right side for landscape
    ],
    { easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );
  
  const imageY = interpolate(
    shrinkProgress,
    [0, 1],
    [
      height / 2, 
      isPortrait 
        ? thumbnailHeight / 2 + 40  // Top for portrait
        : thumbnailHeight / 2 + 60  // Top for landscape
    ],
    { easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );
  
  // Container size animation
  const containerWidth = interpolate(
    shrinkProgress,
    [0, 1],
    [width, thumbnailWidth]
  );
  
  const containerHeight = interpolate(
    shrinkProgress,
    [0, 1],
    [height, thumbnailHeight]
  );
  
  // Image effects
  const imageBrightness = interpolate(
    shrinkProgress,
    [0, 0.5, 1],
    [0.7, 0.8, 1.1]
  );
  
  const imageOpacity = 1;
  
  const imageBorderRadius = interpolate(
    shrinkProgress,
    [0.7, 1],
    [0, 15]
  );
  
  const imageBorderOpacity = interpolate(
    shrinkProgress,
    [0.8, 1],
    [0, 1]
  );
  
  const imageShadow = interpolate(
    shrinkProgress,
    [0.5, 1],
    [0, 1]
  );

  // TITLE ANIMATION
  const titleAppearProgress = interpolate(
    frame,
    [sections.titleAppear.start, sections.titleAppear.end],
    [0, 1],
    { 
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      extrapolateRight: "clamp"
    }
  );
  
  const glowPulse = 1 + 0.2 * Math.sin(frame * 0.08);
  
  // Responsive title font size
  const titleFontSize = isPortrait 
    ? "clamp(40px, 6vw, 64px)"
    : "clamp(36px, 4vw, 56px)";
  
  const titlePosition = isPortrait ? 5 : 8;
  const titlePadding = isPortrait ? "0 40px" : "0 80px";

  // SECTION 2: SOCIAL PROOF
  const socialProofProgress = interpolate(
    frame,
    [sections.socialProof.start, sections.socialProof.end],
    [0, 1]
  );
  
  const starsScale = spring({
    frame: frame - sections.socialProof.start,
    fps,
    config: { damping: 15, stiffness: 100 }
  });
  
  // Review carousel
  const reviewIndex = Math.floor(
    (frame - sections.socialProof.start) / (0.8 * fps)
  ) % reviews.length;
  
  const reviewOpacity = spring({
    frame: (frame - sections.socialProof.start) % (0.8 * fps),
    fps,
    config: { damping: 20 },
    durationInFrames: 0.8 * fps / 2
  });

  // SECTION 3: PRICE IMPACT
  const priceImpactProgress = interpolate(
    frame,
    [sections.priceImpact.start, sections.priceImpact.end],
    [0, 1]
  );
  
  const priceBounce = spring({
    frame: frame - sections.priceImpact.start - 5,
    fps,
    config: { damping: 8, stiffness: 120 }
  });
  
  const discountPulse = 1 + Math.sin(frame * 0.15) * 0.08;

  // SECTION 4: CTA
  const ctaProgress = spring({
    frame: Math.max(0, frame - sections.ctaMoment.start),
    fps,
    config: { damping: 12 }
  });
  
  const ctaGlow = 0.6 + 0.4 * Math.sin(frame * 0.12);

  // LANDSCAPE-SPECIFIC ANIMATIONS (wireframe)
  // Review: bottom → top, long (~2s)
  const reviewFromBottomProgress = interpolate(
    frame,
    [sections.socialProof.start, sections.socialProof.end],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" }
  );
  // Price: bottom → top, short (~0.5s)
  const priceFromBottomProgress = interpolate(
    frame,
    [sections.priceImpact.start, sections.priceImpact.start + secondsToFrames(0.5)],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" }
  );
  // CTA: right → left, long (~1.5s)
  const ctaFromRightProgress = interpolate(
    frame,
    [sections.ctaMoment.start, sections.ctaMoment.start + secondsToFrames(1.5)],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" }
  );

  // Background animation
  const bgMoveX = Math.sin(frame * 0.01) * 10;
  const bgMoveY = Math.cos(frame * 0.008) * 10;

  return (
    <AbsoluteFill style={styles.container}>
      {/* STATIC BACKGROUND GRADIENT */}
      <div style={{
        position: "absolute",
        top: -bgMoveY,
        left: -bgMoveX,
        right: bgMoveX,
        bottom: bgMoveY,
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        opacity: 0.9
      }} />
      
      {/* SINGLE PRODUCT IMAGE - WITH FLOATING EFFECT */}
      <div style={{
        position: "absolute",
        top: `${imageY}px`,
        left: `${imageX}px`,
        transform: `
          translate(-50%, -50%)
          translateY(${shrinkProgress > 0.8 ? Math.sin(frame * 0.05) * 15 : 0}px)
        `,
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        opacity: imageOpacity,
        transition: "none",
        zIndex: 20,
        borderRadius: `${imageBorderRadius}px`,
        overflow: "hidden",
        border: `3px solid rgba(255,255,255,${0.2 * imageBorderOpacity})`,
        boxShadow: `
          0 ${15 * imageShadow}px ${50 * imageShadow}px rgba(0,0,0,${0.6 * imageShadow}),
          ${shrinkProgress > 0.8 ? Math.sin(frame * 0.03) * 5 : 0}px 
          ${shrinkProgress > 0.8 ? Math.cos(frame * 0.04) * 8 : 0}px 
          25px rgba(255, 255, 255, ${0.1 * shrinkProgress})
        `,
        filter: `brightness(${imageBrightness}) contrast(1.1)`,
        willChange: "auto"
      }}>
        <Img 
          src={productImage} 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        
        {/* Dark overlay when full-screen (fades out) */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          opacity: frame >= sections.productShrink.end ? 0 : 1 - shrinkProgress
        }} />
        
        {/* HOT BADGE */}
        {shrinkProgress > 0.8 && (
          <div style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            padding: "8px 15px",
            borderRadius: "15px",
            fontSize: `${Math.min(16, thumbnailWidth * 0.03)}px`,
            fontWeight: "bold",
            zIndex: 21,
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.6)",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            opacity: shrinkProgress > 0.8 ? (shrinkProgress - 0.8) * 5 : 0
          }}>
            🔥 HOT
          </div>
        )}
      </div>
      
      {/* TITLE - in landscape kept left of product image so nothing overlaps it */}
      <div style={{
        position: "absolute",
        top: `${titlePosition}%`,
        ...(isLandscape
          ? { left: 0, right: "38%", display: "flex" as const, justifyContent: "center", alignItems: "center" }
          : { left: 0, right: 0 }
        ),
        textAlign: "center" as const,
        fontSize: titleFontSize,
        fontWeight: 900 as const,
        letterSpacing: "1.5px",
        textTransform: "uppercase" as const,
        color: "#FFFFFF",
        textShadow: `
          0 0 ${20 * glowPulse}px rgba(255, 215, 0, 0.8),
          0 0 ${40 * glowPulse}px rgba(255, 215, 0, 0.6),
          0 0 ${60 * glowPulse}px rgba(255, 215, 0, 0.4)
        `,
        padding: titlePadding,
        opacity: titleAppearProgress,
        zIndex: 35,
        willChange: "opacity, text-shadow"
      }}>
        {productTitle}
      </div>
      
      {/* RESPONSIVE LAYOUT */}
      {isPortrait ? (
        // PORTRAIT LAYOUT (1080×1920) - VERTICAL STACK
        <>
          {/* SOCIAL PROOF - TOP CENTER */}
          <div style={{
            ...styles.socialProofSection,
            opacity: socialProofProgress,
            transform: `translateY(${(1 - socialProofProgress) * 50}px)`,
            zIndex: 30,
          }}>
            {/* STAR RATING */}
            <div style={{
              ...styles.starsContainer,
              transform: `scale(${starsScale})`
            }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{
                  ...styles.star,
                  color: i < Math.floor(rating) ? "#FFD700" : "#444",
                  fontSize: width * 0.06,
                  textShadow: "0 4px 20px rgba(255, 215, 0, 0.6)"
                }}>
                  ★
                </span>
              ))}
            </div>
            
            {/* REVIEW COUNT */}
            <div style={styles.reviewCount}>
              {rating.toFixed(1)} • {reviewCount.toLocaleString()} REVIEWS
            </div>
            
            {/* REVIEW CAROUSEL */}
            <div style={styles.reviewCarousel}>
              <div style={{
                opacity: reviewOpacity,
                transform: `translateX(${(1 - reviewOpacity) * 100}px)`
              }}>
                <div style={styles.reviewText}>
                  "{reviews[reviewIndex]}"
                </div>
              </div>
              <div style={styles.reviewDots}>
                {reviews.map((_, idx) => (
                  <div 
                    key={idx}
                    style={{
                      ...styles.reviewDot,
                      backgroundColor: idx === reviewIndex ? "#FFD700" : "#666",
                      width: idx === reviewIndex ? 20 : 10,
                      height: idx === reviewIndex ? 20 : 10
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* PRICE - BELOW SOCIAL PROOF */}
          <div style={{
            ...styles.priceSection,
            opacity: priceImpactProgress,
            transform: `translateY(${(1 - priceImpactProgress) * 100}px) scale(${priceBounce})`,
            zIndex: 30,
          }}>
            <div style={styles.priceComparison}>
              <div style={styles.originalPrice}>
                {originalPrice}
              </div>
              <div style={{
                ...styles.discountBadge,
                transform: `scale(${discountPulse})`
              }}>
                {Math.round((1 - parseFloat((salePrice || '$0').replace('$', '')) / parseFloat((originalPrice || '$0').replace('$', ''))) * 100)}% OFF
              </div>
            </div>
            
            <div style={styles.salePrice}>
              {salePrice}
            </div>
            
            <div style={styles.priceSubtitle}>
              LIMITED TIME OFFER • FREE SHIPPING
            </div>
          </div>
          
          {/* CTA - BOTTOM */}
          <div style={{
            ...styles.ctaSection,
            opacity: ctaProgress,
            transform: `translateY(${(1 - ctaProgress) * 150}px)`,
            zIndex: 30,
          }}>
            <div style={{
              ...styles.ctaButton,
              fontSize: "40px",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              boxShadow: `
                0 0 ${80 * ctaGlow}px rgba(37, 99, 235, 0.6),
                0 4px 20px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Glowing background effect */}
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                opacity: ctaGlow * 0.8
              }} />
              
              {/* Animated shine effect */}
              <div style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
                transform: `translateX(${Math.sin(frame * 0.05) * 100}%)`,
                opacity: 0.3
              }} />
              
              <span style={{
                ...styles.ctaIcon,
                fontSize: "48px",
                background: "linear-gradient(135deg, #FFD700, #FFEC8B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))"
              }}>⚡</span>
              
              <span style={{
                ...styles.ctaText,
                fontSize: "40px",
                background: "linear-gradient(135deg, #ffffff, #e5e7eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "3px",
                fontWeight: 800,
                textShadow: "0 2px 10px rgba(255, 255, 255, 0.2)"
              }}>SHOP NOW</span>
              
              <span style={{
                ...styles.ctaArrow,
                fontSize: "44px",
                background: "linear-gradient(135deg, #FFD700, #FFEC8B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: "15px",
                filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))",
                transform: `translateX(${Math.sin(frame * 0.1) * 5}px)`
              }}>➜</span>
            </div>
            
            <div style={{
              ...styles.trustBadges,
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "20px 40px",
            }}>
              <div style={{
                ...styles.trustItem,
                background: "rgba(255, 255, 255, 0.08)",
                padding: "12px 24px",
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "clamp(16px, 2vw, 20px)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                }}>✓</div>
                30-DAY GUARANTEE
              </div>
              
              <div style={{
                ...styles.trustItem,
                background: "rgba(255, 255, 255, 0.08)",
                padding: "12px 24px",
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "clamp(16px, 2vw, 20px)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                }}>🚀</div>
                FREE EXPRESS SHIPPING
              </div>
              
              <div style={{
                ...styles.trustItem,
                background: "rgba(255, 255, 255, 0.08)",
                padding: "12px 24px",
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "clamp(16px, 2vw, 20px)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
                }}>🔒</div>
                SECURE CHECKOUT
              </div>
            </div>
          </div>
        </>
      ) : (
        // LANDSCAPE LAYOUT (1920×1080) - WIREFRAME: Title | [Review | Price | Product] row | CTA below price+product
        <>
          {/* REVIEW PART: left, ~23% width; content centered in box; animate bottom → top (long) */}
          <div style={{
            position: "absolute" as const,
            top: "24%",
            left: "2%",
            width: "23%",
            height: "37%",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            opacity: socialProofProgress,
            transform: `translateY(${(1 - reviewFromBottomProgress) * 100}px)`,
            zIndex: 30,
          }}>
            <div style={{
              display: "flex",
              gap: "16px",
              marginBottom: "8px",
              transform: `scale(${starsScale})`,
              justifyContent: "center"
            }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{
                  ...styles.star,
                  color: i < Math.floor(rating) ? "#FFD700" : "#444",
                  fontSize: "clamp(36px, 3vw, 48px)",
                  textShadow: "0 4px 20px rgba(255, 215, 0, 0.6)"
                }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{
              fontSize: "clamp(28px, 2.5vw, 36px)",
              fontWeight: 700 as const,
              color: "#FFD700",
              letterSpacing: "1px",
              textShadow: "0 2px 10px rgba(255, 215, 0, 0.4)"
            }}>
              {rating.toFixed(1)} • {reviewCount.toLocaleString()} REVIEWS
            </div>
            <div style={{
              width: "100%",
              textAlign: "center" as const,
              marginTop: "12px"
            }}>
              <div style={{
                opacity: reviewOpacity,
                transform: `translateX(${(1 - reviewOpacity) * 30}px)`
              }}>
                <div style={{
                  fontSize: "clamp(32px, 3vw, 44px)",
                  fontWeight: 800 as const,
                  lineHeight: 1.3,
                  color: "#fff",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  minHeight: "120px"
                }}>
                  "{reviews[reviewIndex]}"
                </div>
              </div>
              <div style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                justifyContent: "center"
              }}>
                {reviews.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: idx === reviewIndex ? 20 : 10,
                      height: idx === reviewIndex ? 20 : 10,
                      borderRadius: "50%",
                      backgroundColor: idx === reviewIndex ? "#FFD700" : "#666",
                      transition: "all 0.3s ease"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PRICE PART: above CTA, left of product image (no overlap); animate bottom → top (short) */}
          <div style={{
            position: "absolute" as const,
            left: "26%",
            right: "38%",
            bottom: "32%",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: priceImpactProgress,
            transform: `translateY(${(1 - priceFromBottomProgress) * 50}px) scale(${priceBounce})`,
            zIndex: 30,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "6px"
            }}>
            </div>
            <div style={{
              fontSize: "clamp(48px, 5vw, 72px)",
              fontWeight: 900 as const,
              color: "#10b981",
              lineHeight: 1,
              textShadow: "0 8px 40px rgba(16, 185, 129, 0.6)",
              margin: "4px 0"
            }}>
              {salePrice}
            </div>
            <div style={{
              fontSize: "clamp(18px, 1.6vw, 24px)",
              color: "#86efac",
              fontWeight: 600 as const,
              letterSpacing: "1px",
              textAlign: "center" as const
            }}>
              LIMITED TIME OFFER • FREE SHIPPING
            </div>
          </div>

          {/* CTA PART: below price + product, spans from price left to product right; animate right → left (long) */}
          <div style={{
            position: "absolute" as const,
            left: "26%",
            right: "3%",
            bottom: "12%",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "16px",
            opacity: ctaProgress,
            transform: `translateX(${(1 - ctaFromRightProgress) * 180}px)`,
            zIndex: 30,
          }}>
            <div style={{
              ...styles.ctaButton,
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              boxShadow: `
                0 0 ${60 * ctaGlow}px rgba(37, 99, 235, 0.6),
                0 4px 20px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%",
              padding: "22px 0",
              fontSize: "32px",
            }}>
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                opacity: ctaGlow * 0.8
              }} />
              <div style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
                transform: `translateX(${Math.sin(frame * 0.05) * 100}%)`,
                opacity: 0.3
              }} />
              <span style={{
                ...styles.ctaIcon,
                background: "linear-gradient(135deg, #FFD700, #FFEC8B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                fontSize: "42px"
              }}>⚡</span>
              <span style={{
                ...styles.ctaText,
                background: "linear-gradient(135deg, #ffffff, #e5e7eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "2px",
                fontWeight: 800,
                textShadow: "0 2px 10px rgba(255, 255, 255, 0.2)",
                fontSize: "32px"
              }}>SHOP NOW</span>
              <span style={{
                ...styles.ctaArrow,
                background: "linear-gradient(135deg, #FFD700, #FFEC8B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: "15px",
                filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))",
                transform: `translateX(${Math.sin(frame * 0.1) * 5}px)`,
                fontSize: "38px"
              }}>➜</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row" as const,
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap" as const,
              fontSize: "18px",
              color: "#cbd5e1",
              fontWeight: 600 as const
            }}>
              <div style={styles.trustItem}>✅ 30-DAY GUARANTEE</div>
              <div style={styles.trustItem}>🚚 FREE EXPRESS SHIPPING</div>
              <div style={styles.trustItem}>🔒 SECURE CHECKOUT</div>
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// Styles remain the same...
const styles = {
  // ... (keep all your existing styles exactly as they were)
  container: {
    backgroundColor: "#000",
    color: "white",
    fontFamily: "'Montserrat', 'Inter', -apple-system, sans-serif",
    overflow: "hidden",
    fontWeight: 800
  } as React.CSSProperties,
  
  socialProofSection: {
    position: "absolute" as const,
    top: "30%",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "20px"
  } as React.CSSProperties,
  
  starsContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "10px"
  } as React.CSSProperties,
  
  star: {
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
  } as React.CSSProperties,
  
  reviewCount: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 700 as const,
    color: "#FFD700",
    letterSpacing: "1px",
    marginBottom: "40px",
    textShadow: "0 2px 10px rgba(255, 215, 0, 0.4)"
  } as React.CSSProperties,
  
  reviewCarousel: {
    width: "90%",
    maxWidth: "800px",
    textAlign: "center" as const,
    margin: "0 auto"
  } as React.CSSProperties,
  
  reviewText: {
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 800 as const,
    lineHeight: 1.2,
    color: "#fff",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    marginBottom: "30px",
    padding: "0 20px",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } as React.CSSProperties,
  
  reviewDots: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px"
  } as React.CSSProperties,
  
  reviewDot: {
    borderRadius: "50%",
    transition: "all 0.3s ease"
  } as React.CSSProperties,
  
  priceSection: {
    position: "absolute" as const,
    top: "55%",
    left: 0,
    right: 0,
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px"
  } as React.CSSProperties,
  
  priceComparison: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "10px"
  } as React.CSSProperties,
  
  originalPrice: {
    fontSize: "clamp(36px, 5vw, 48px)",
    color: "#999",
    textDecoration: "line-through",
    fontWeight: 600 as const
  } as React.CSSProperties,
  
  discountBadge: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "12px 25px",
    borderRadius: "30px",
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 900 as const,
    letterSpacing: "1px",
    boxShadow: "0 8px 30px rgba(239, 68, 68, 0.5)"
  } as React.CSSProperties,
  
  salePrice: {
    fontSize: "clamp(72px, 12vw, 120px)",
    fontWeight: 900 as const,
    color: "#10b981",
    lineHeight: 1,
    textShadow: "0 8px 40px rgba(16, 185, 129, 0.6)",
    margin: "10px 0"
  } as React.CSSProperties,
  
  priceSubtitle: {
    fontSize: "clamp(20px, 3vw, 28px)",
    color: "#86efac",
    fontWeight: 600 as const,
    letterSpacing: "1px",
    marginTop: "10px"
  } as React.CSSProperties,
  
  ctaSection: {
    position: "absolute" as const,
    bottom: "12%",
    left: "5%",
    right: "5%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "20px"
  } as React.CSSProperties,
  
  ctaButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    padding: "30px 0",
    width: "100%",
    maxWidth: "900px",
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 900 as const,
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "25px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    transition: "all 0.2s ease"
  } as React.CSSProperties,
  
  ctaIcon: {
    fontSize: "clamp(40px, 6vw, 56px)"
  } as React.CSSProperties,
  
  ctaText: {
    fontSize: "inherit",
    fontWeight: "inherit"
  } as React.CSSProperties,
  
  ctaArrow: {
    fontSize: "clamp(36px, 5vw, 48px)",
    opacity: 0.9
  } as React.CSSProperties,
  
  trustBadges: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap" as const,
    fontSize: "clamp(16px, 2vw, 22px)",
    color: "#cbd5e1",
    fontWeight: 600 as const,
    letterSpacing: "0.5px"
  } as React.CSSProperties,
  
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  } as React.CSSProperties
  
};