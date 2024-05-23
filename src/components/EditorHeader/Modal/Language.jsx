import { useTranslation } from "react-i18next";
import { useSettings } from "../../../hooks";
import { languages } from "../../../i18n/i18n";
import BaseModal from "./BaseModal";

export default function Language({ hideModal }) {
  const { settings } = useSettings();
  const { i18n, t } = useTranslation();

  return (
    <BaseModal modalTitle={t("language")} onOk={hideModal} onCancel={hideModal}>
      <div className="grid grid-cols-3 gap-4">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => i18n.changeLanguage(l.code)}
            className={`space-y-1 py-3 px-4 rounded-md border-2 ${
              settings.mode === "dark"
                ? "bg-zinc-700 hover:bg-zinc-600"
                : "bg-zinc-100 hover:bg-zinc-200"
            } ${i18n.language === l.code ? "border-zinc-400" : "border-transparent"}`}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold">{l.native_name}</div>
              <div className="opacity-60">{l.code}</div>
            </div>
            <div className="text-start">{l.name}</div>
          </button>
        ))}
      </div>
    </BaseModal>
  );
}
