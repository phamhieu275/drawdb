import { useTranslation } from "react-i18next";
import { useUndoRedo } from "../../../hooks";
import { Timeline as MantineTimeline, Text } from "@mantine/core";

export default function Timeline() {
  const { undoStack } = useUndoRedo();
  const { t } = useTranslation();

  if (undoStack.length > 0) {
    return (
      <MantineTimeline active={0} lineWidth={2}>
        {[...undoStack].reverse().map((e, i) => (
          <MantineTimeline.Item key={i}>
            <Text c="dimmed" size="sm">
              {e.message}
            </Text>
          </MantineTimeline.Item>
        ))}
      </MantineTimeline>
    );
  } else {
    return <div className="m-5 sidesheet-theme">{t("no_activity")}</div>;
  }
}
