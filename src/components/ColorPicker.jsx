import { Button, ActionIcon } from "@mantine/core";
import { tableThemes } from "../data/constants";
import { useTranslation } from "react-i18next";
import { IconCheck } from "@tabler/icons-react";

export default function ColorPalette({
  currentColor,
  onClearColor,
  onPickColor,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div className="font-medium">{t("theme")}</div>
        <Button type="danger" size="compact-sm" onClick={onClearColor}>
          {t("clear")}
        </Button>
      </div>
      <hr />
      <div className="py-3 space-y-3">
        <div className="grid grid-cols-4 gap-4">
          {tableThemes.map((c) => (
            <ActionIcon
              key={c}
              size="input-sm"
              variant="filled"
              color={c}
              onClick={() => onPickColor(c)}
            >
              {currentColor === c ? <IconCheck /> : ""}
            </ActionIcon>
          ))}
        </div>
      </div>
    </div>
  );
}
