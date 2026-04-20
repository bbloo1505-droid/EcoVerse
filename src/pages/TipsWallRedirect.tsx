import { Navigate } from "react-router-dom";
import { DEFAULT_TIP_WALL_KEY } from "@/lib/tipWallKeys";

/** `/tips` → default dream-role wall */
export default function TipsWallRedirect() {
  return <Navigate to={`/tips/${DEFAULT_TIP_WALL_KEY}`} replace />;
}
