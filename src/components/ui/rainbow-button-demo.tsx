
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Link } from "react-router-dom";

export function RainbowButtonDemo() {
  return (
    <Link to="/contact">
      <RainbowButton>Darmowa konsultacja</RainbowButton>
    </Link>
  );
}
