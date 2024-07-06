import { Tabs } from "@mantine/core";
import { Tab as TabIndex } from "../../data/constants";
import { useLayout, useSelect } from "../../hooks";
import RelationshipsTab from "./RelationshipsTab/RelationshipsTab";
import TypesTab from "./TypesTab/TypesTab";
import Issues from "./Issues";
import AreasTab from "./AreasTab/AreasTab";
import NotesTab from "./NotesTab/NotesTab";
import TablesTab from "./TablesTab/TablesTab";
import { useTranslation } from "react-i18next";

export default function SidePanel({ width, resize, setResize }) {
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const tabList = [
    { label: t("tables"), itemKey: TabIndex.TABLES, component: <TablesTab /> },
    {
      label: t("relationships"),
      itemKey: TabIndex.RELATIONSHIPS,
      component: <RelationshipsTab />,
    },
    {
      label: t("subject_areas"),
      itemKey: TabIndex.AREAS,
      component: <AreasTab />,
    },
    { label: t("notes"), itemKey: TabIndex.NOTES, component: <NotesTab /> },
    { label: t("types"), itemKey: TabIndex.TYPES, component: <TypesTab /> },
  ];

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col h-full relative border-r border-color"
        style={{ width: `${width}px` }}
      >
        <div className="h-full flex-1 overflow-y-auto">
          <Tabs
            // orientation="vertical"
            defaultValue={selectedElement.currentTab || `${TabIndex.TABLES}`}
            onChange={(key) =>
              setSelectedElement((prev) => ({ ...prev, currentTab: key }))
            }
          >
            <Tabs.List>
              {tabList.map((tab, idx) => (
                <Tabs.Tab value={tab.label} key={idx}>
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {tabList.map((tab, idx) => (
              <Tabs.Panel value={tab.label} key={idx}>
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
