import AIChat from "@/components/AIChat";

export const metadata = {
  title: "AI Assistant - Meg Store",
};

export default function AIPage() {
  return (
    <main className="w-full">
      <AIChat full />
    </main>
  );
}
