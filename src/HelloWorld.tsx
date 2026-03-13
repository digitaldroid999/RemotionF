import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";

// This interface defines what data your video will receive
interface AmazonProductVideoProps {
  productImage?: string;
  productTitle?: string;
  productPrice?: string;
  productRating?: number;
}

export const HelloWorld: React.FC<AmazonProductVideoProps> = ({
  productImage = "https://m.media-amazon.com/images/I/71mJf0bcBPL._AC_SY575_.jpg",
  productTitle = "Premium Wireless Headphones",
  productPrice = "$199.99",
  productRating = 4.8
}) => {
  const frame = useCurrentFrame();
  
  // Animation 1: Ken Burns zoom (1.0x to 1.2x over 8 seconds)
  const zoom = interpolate(frame, [0, 240], [1, 1.2], {
    extrapolateRight: "clamp",
  });
  
  // Animation 2: Title fade in
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  // Animation 3: Price slide up
  const priceSlide = interpolate(frame, [60, 90], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill 
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden"
      }}
    >
      {/* PRODUCT IMAGE WITH KEN BURNS EFFECT */}
      <div style={{
        transform: `scale(${zoom})`,
        width: "100%",
        height: "100%",
        position: "absolute",
      }}>
        <Img
          src={productImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* DARK OVERLAY FOR TEXT READABILITY */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60%",
        background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)"
      }} />

      {/* PRODUCT TITLE */}
      <div style={{
        position: "absolute",
        bottom: 300,
        left: 60,
        right: 60,
        opacity: titleOpacity,
      }}>
        <h1 style={{
          fontSize: 70,
          margin: 0,
          fontWeight: "bold",
          lineHeight: 1.2,
          textShadow: "0 4px 12px rgba(0,0,0,0.8)"
        }}>
          {productTitle}
        </h1>
      </div>

      {/* PRODUCT PRICE WITH ANIMATION */}
      <div style={{
        position: "absolute",
        bottom: 200,
        left: 60,
        transform: `translateY(${priceSlide}px)`,
        display: "flex",
        alignItems: "center",
        gap: "20px"
      }}>
        <div style={{
          fontSize: 64,
          fontWeight: "bold",
          color: "#3b82f6",
          background: "rgba(255,255,255,0.1)",
          padding: "10px 30px",
          borderRadius: 15,
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(59, 130, 246, 0.3)"
        }}>
          {productPrice}
        </div>
        
        {/* RATING STARS */}
        <div style={{
          fontSize: 36,
          color: "#fbbf24",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          {"★".repeat(5)}
          <span style={{
            fontSize: 32,
            color: "white",
            marginLeft: "10px"
          }}>
            ({productRating}/5)
          </span>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div style={{
        position: "absolute",
        bottom: 100,
        left: 60,
        fontSize: 32,
        opacity: interpolate(frame, [120, 150], [0, 1]),
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        <div style={{
          padding: "12px 35px",
          background: "linear-gradient(135deg,rgba(0, 123, 247, 0.49),rgb(23, 107, 233))",
          borderRadius: 10,
          fontWeight: "bold",
          boxShadow: "0 8px 25px rgba(18, 80, 172, 0.4)"
        }}>
          🛒 BUY NOW
        </div>
        <div style={{ opacity: 0.8 }}>
          Free shipping • 30-day returns
        </div>
      </div>

      {/* BRAND WATERMARK */}
      <div style={{
        position: "absolute",
        top: 50,
        right: 50,
        fontSize: 24,
        opacity: 0.7,
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
      </div>
    </AbsoluteFill>
  );
};