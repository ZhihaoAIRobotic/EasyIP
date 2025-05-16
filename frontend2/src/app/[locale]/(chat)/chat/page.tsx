import { FeynmanChat } from './components/FeynmanChat';
import ScriptTable from './components/Table';

export default function Home() {
  return (
    <main className="flex w-full h-screen p-4">
      <div className="flex-1 mr-4">
        <FeynmanChat />
      </div>
      <div className="flex-1">
        <ScriptTable />
      </div>
    </main>
  );
}
