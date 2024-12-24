
import "./App.css";
import { Providers } from "@/components/providers";
import { CardSide } from "@/components/CardSide";
import { DictionaryComponent } from "@/components/DictionaryComponent";
import { useSelectionDetector } from "@/lib/SelectionDetector";

function App() {

  useSelectionDetector();

  return (
    <Providers className="h-screen w-full flex flex-col">
      <div className="w-full flex flex-col min-h-0 flex-1">
        <div className="flex xl:flex-row flex-col xl:h-full w-full xl:overflow-y-hidden">
          <div className="flex-1 flex flex-col items-stretch xl:overflow-y-auto">
            <CardSide />
          </div>
          <div className="p-10 flex-1 xl:w-[50%] xl:overflow-y-auto">
            <DictionaryComponent />
          </div>
        </div>
      </div>
    </Providers>
  );
}

export default App;
