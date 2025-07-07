import { AdminPanel } from "@/components/AdminPanel";

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminPanel onClose={() => window.history.back()} />
    </div>
  );
}