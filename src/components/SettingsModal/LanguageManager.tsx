import useSettingsStore from "@/zustand/SettingsStore";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

export const LanguageManager = () => {
  const [addLangInput, setAddLangInput] = useState("");

  const { availableLanguages, removeLanguage, addLanguage, currentLanguage, setCurrentLanguage } =
    useSettingsStore();

  return (
    <table className="table-auto w-full max-w-md">
      <tbody>
        {availableLanguages.map((lang) => (
          <tr key={lang} className="border-b *:py-2">
            <td onClick={() => setCurrentLanguage(lang)} className={lang === currentLanguage ? "font-bold" : ""}>
              {lang}{" "}
              <span
                className={`ml-10 text-slate-400 font-light text-sm italic ${
                  lang === currentLanguage ? "" : "invisible"
                }`}
              >
                selected
              </span>
            </td>
            <td className="text-center">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => removeLanguage(lang)}
              >
                <FaRegTrashAlt className="text-red-500" />
              </Button>
            </td>
          </tr>
        ))}
        <tr className="*:py-2 text-center">
          <td>
            <Input
              placeholder="Add language"
              value={addLangInput}
              onValueChange={setAddLangInput}
            />
          </td>
          <td>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => {
                addLanguage(addLangInput);
                setAddLangInput("");
              }}
            >
              <IoMdAdd size="25" className="text-slate-600" />
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
