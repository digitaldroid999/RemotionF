import { Img, staticFile } from "remotion";

const WATERMARK_GROUP_OPACITY = 0.5;

/** Dark multi-layer drop shadow on the logo shape so it stays visible on white */
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
      opacity: WATERMARK_GROUP_OPACITY,
      pointerEvents: "none",
    }}
  >
    <Img
      src={staticFile("PromoNexLogo/watermark.png")}
      style={{
        height: 100,
        width: "auto",
        maxWidth: 400,
        objectFit: "contain",
        display: "block",
        filter: LOGO_DROP_SHADOW,
      }}
    />
  </div>
);
