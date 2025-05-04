import "@/app/globals.css";
import dynamic from "next/dynamic";

// 使用noSSR选项禁用服务器端渲染
const Chatbox = dynamic(() => import("@/components/chatbox"), { 
  ssr: false,
  loading: () => <div>Loading chat...</div>
});

const ScriptTable = dynamic(() => import("@/components/table"), { 
  ssr: false,
  loading: () => <div>Loading table...</div>
});

export default function Home() {
  return (
    <main className="flex w-full h-screen p-4">
      <div className="flex-1 mr-4">
        <Chatbox />
      </div>
      <div className="flex-1">
        <ScriptTable />
      </div>
    </main>
  );
}
