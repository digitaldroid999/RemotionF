import { Img } from "remotion";

const WATERMARK_URL =
  "https://hdixvjydwaslnzyrokrd.supabase.co/storage/v1/object/public/generated-content/watermark.png";

const WATERMARK_OPACITY = 0.7;

const LOGO_DROP_SHADOW = `
  drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))
  drop-shadow(0 2px 12px rgba(0, 0, 0, 0.65))
  drop-shadow(0 0 20px rgba(0, 0, 0, 0.45))
`;

export const WatermarkOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 20,
      left: 40,
      zIndex: 1000,
      opacity: WATERMARK_OPACITY,
      pointerEvents: "none",
    }}
  >
    <Img
      src={WATERMARK_URL}
      style={{
        height: 64,
        width: "auto",
        maxWidth: 320,
        objectFit: "contain",
        display: "block",
        filter: LOGO_DROP_SHADOW,
      }}
    />
  </div>
);
