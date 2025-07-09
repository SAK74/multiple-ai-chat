import { dropToast } from "@/src/lib/utils";

export function showOverdraft() {
  dropToast(
    <div className="text-lg">
      You have overdraften trial limit! Log in and/or provide API key.
    </div>,
    "info"
    // {duration:10000}
  );
}
