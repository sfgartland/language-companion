import useSettingsStore from "@/zustand/SettingsStore";
import { Select, SelectItem } from "@nextui-org/react";

export const LanguageSelector = () => {
    const { currentLanguage, setCurrentLanguage, availableLanguages } =
      useSettingsStore();
    const languages = availableLanguages.map((lang) => ({
      key: lang,
      label: lang,
    }));
  
    return (
      <div className="flex justify-end flex-1">
        <Select
          className="max-w-xs min-w-52"
          items={languages}
          label="Selected language"
          placeholder="Select a language"
          selectedKeys={[currentLanguage]}
          onChange={(selected) => setCurrentLanguage(selected.target.value)}
        >
          {(item) => <SelectItem>{item.label}</SelectItem>}
        </Select>
        {/* <Button isIconOnly variant="light" size="lg">
          <IoMdAdd />
        </Button> */}
      </div>
    );
  };