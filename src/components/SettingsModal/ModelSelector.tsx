import { inDemoMode } from "@/lib/StateHelpers";
import useSettingsStore, { whitelistedModels } from "@/zustand/SettingsStore";
import { useUIStateStore } from "@/zustand/UIState";
import { Select, SelectItem } from "@nextui-org/react";

export const ModelSelector = () => {
    const {availableModels} = useUIStateStore();
    const {setCurrentModel, currentModel} = useSettingsStore();


    const models = whitelistedModels.map((model) => ({
        key: model,
        label: model
    }));

    const disabledModels = whitelistedModels.filter((model) => !availableModels.includes(model));


  return (
    <Select
      className="max-w-xs min-w-44"
      items={models}
      label="LLM Model"
      placeholder="Select a model"
      selectedKeys={[currentModel]}
      disabledKeys={disabledModels}
      onChange={(e) => setCurrentModel(e.target.value)}
      description={inDemoMode() ? "Add your API key in the settings to unlock all models" : ""}
    >
      {(model) => <SelectItem>{model.label}</SelectItem>}
    </Select>
  );
};
