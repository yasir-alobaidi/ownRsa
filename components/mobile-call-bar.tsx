import { BUSINESS } from "@/lib/services";
import { PhoneIcon } from "./icons";

export function MobileCallBar() {
  return (
    <div className="mobile-call-bar">
      <a href={`tel:${BUSINESS.phoneTel}`}>
        <PhoneIcon />
        Call Now — Available 24/7
      </a>
    </div>
  );
}
