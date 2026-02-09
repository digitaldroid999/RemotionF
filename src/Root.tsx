import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { FullScreenSocialProof } from "./FullScreenSocialProof";

// Wrapper components to map API props to component props
const ProductHeroWrapper: React.FC<any> = (props) => {
  const { product, imageUrl } = props;
  
  return (
    <HelloWorld
      productImage={imageUrl || product?.image}
      productTitle={product?.title || product?.name}
      productPrice={product?.price}
      productRating={product?.rating}
    />
  );
};

const FullScreenSocialProofWrapper: React.FC<any> = (props) => {
  const { product, imageUrl } = props;
  
  return (
    <FullScreenSocialProof
      productImage={imageUrl || product?.image}
      productTitle={product?.title || product?.name}
      originalPrice={product?.originalPrice}
      salePrice={product?.salePrice || product?.price}
      rating={product?.rating}
      reviewCount={product?.reviewCount}
      reviews={product?.reviews}
    />
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Scene 1: Product Hero */}
      <Composition
        id="ProductHero"
        component={ProductHeroWrapper}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          product: {
            title: "Ultra Lightweight Breathable Walking Shoes",
            price: "$90.99",
            rating: 4.8
          },
          imageUrl: "https://m.media-amazon.com/images/I/71dp-iVWrLL._AC_SX575_.jpg"
        }}
      />
      
      {/* Scene 2: Full Screen Social Proof */}
      <Composition
        id="FullScreenSocialProof"
        component={FullScreenSocialProofWrapper}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          product: {
            title: "Premium Wireless Headphones",
            originalPrice: "$99.00",
            salePrice: "$59.00",
            rating: 4.8,
            reviewCount: 2341,
            reviews: [
              "🔥 BEST PURCHASE THIS YEAR!",
              "DIDN'T EXPECT THIS QUALITY!",
              "WORTH EVERY DOLLAR.",
              "SOUND QUALITY IS UNREAL.",
              "PERFECT FOR DAILY COMMUTE."
            ]
          },
          imageUrl: "https://m.media-amazon.com/images/I/71bR27GAJBL._AC_SX575_.jpg"
        }}
      />
    </>
  );
};