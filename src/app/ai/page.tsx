import AIChat from "@/components/AIChat";

export const metadata = {
  title: "AI Assistant - Meg Store",
};

export default function AIPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <AIChat />
    </div>
  );
}
