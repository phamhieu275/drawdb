import { Tabs, Tooltip } from "@mantine/core";
import { Tab as TabIndex } from "../../data/constants";
import { useLayout, useSelect } from "../../hooks";
import RelationshipsTab from "./RelationshipsTab/RelationshipsTab";
import TypesTab from "./TypesTab/TypesTab";
import Issues from "./Issues";
import AreasTab from "./AreasTab/AreasTab";
import NotesTab from "./NotesTab/NotesTab";
import TablesTab from "./TablesTab/TablesTab";
import { useTranslation } from "react-i18next";
import {
  IconTableFilled,
  IconJumpRope,
  IconNote,
  IconSquare,
  IconCategoryPlus,
} from "@tabler/icons-react";

export default function SidePanel({ width, resize, setResize }) {
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const tabList = [
    {
      label: t("tables"),
      icon: <IconTableFilled />,
      itemKey: TabIndex.TABLES,
      component: <TablesTab />,
    },
    {
      label: t("relationships"),
      icon: <IconJumpRope />,
      itemKey: TabIndex.RELATIONSHIPS,
      component: <RelationshipsTab />,
    },
    {
      label: t("subject_areas"),
      icon: <IconSquare />,
      itemKey: TabIndex.AREAS,
      component: <AreasTab />,
    },
    {
      label: t("notes"),
      icon: <IconNote />,
      itemKey: TabIndex.NOTES,
      component: <NotesTab />,
    },
    {
      label: t("types"),
      icon: <IconCategoryPlus />,
      itemKey: TabIndex.TYPES,
      component: <TypesTab />,
    },
  ];

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col h-full relative border-r border-color"
        style={{ width: `${width}px` }}
      >
        <div className="h-full flex-1 overflow-y-auto">
          <Tabs
            value={`${selectedElement.currentTab}`}
            defaultValue={`${TabIndex.TABLES}`}
            onChange={(key) =>
              setSelectedElement((prev) => ({ ...prev, currentTab: key }))
            }
          >
            <Tabs.List>
              {tabList.map((tab, idx) => (
                <Tabs.Tab value={`${tab.itemKey}`} key={idx}>
                  <Tooltip label={tab.label}>{tab.icon}</Tooltip>
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {tabList.map((tab, idx) => (
              <Tabs.Panel value={`${tab.itemKey}`} key={`panel_${idx}`}>
                <div className="p-2">{tab.component}</div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
        {layout.issues && (
          <div className="mt-auto border-t-2 border-color shadow-inner">
            <Issues />
          </div>
        )}
      </div>
      <div
        className={`flex justify-center items-center p-1 h-auto hover-2 cursor-col-resize ${
          resize && "bg-semi-grey-2"
        }`}
        onMouseDown={() => setResize(true)}
      >
        <div className="w-1 border-x border-color h-1/6" />
      </div>
    </div>
  );
}
