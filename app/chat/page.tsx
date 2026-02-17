import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">No conversation selected</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select a contact or find a random match to start chatting
        </p>
        <p className="text-xs text-muted-foreground mt-4 lg:hidden">
          Open the sidebar to get started
        </p>
      </div>
    </div>
  );
}
