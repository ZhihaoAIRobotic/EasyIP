// import WebSocketChat from "@/components/chat"; 
import "@/app/globals.css";
import Chatbox from "@/components/chatbox";
import ScriptTable from "@/components/table";
// const DefaultChat = dynamic(() => import("@/components/chatbox"), { ssr: false });

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100vh', 
      padding: '16px'
    }}>
      <div style={{ flex: 1, marginRight: '16px' }}>
        <Chatbox />
      </div>
      <div style={{ flex: 1 }}>
        <ScriptTable />
      </div>
    </div>
  );
}
