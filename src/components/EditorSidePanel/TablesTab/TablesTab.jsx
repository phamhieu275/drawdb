import { Button, Accordion } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSelect, useTables } from "../../../hooks";
import { ObjectType } from "../../../data/constants";
import SearchBar from "./SearchBar";
import Empty from "../Empty";
import TableInfo from "./TableInfo";
import { useTranslation } from "react-i18next";

export default function TablesTab() {
  const { tables, addTable } = useTables();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2">
        <SearchBar tables={tables} />
        <div>
          <Button
            leftSection={<IconPlus />}
            fullWidth
            onClick={() => addTable()}
          >
            {t("add_table")}
          </Button>
        </div>
      </div>
      {tables.length === 0 ? (
        <Empty title={t("no_tables")} text={t("no_tables_text")} />
      ) : (
        <Accordion
          value={
            selectedElement.open && selectedElement.element === ObjectType.TABLE
              ? `${selectedElement.id}`
              : ""
          }
          onChange={(k) =>
            setSelectedElement((prev) => ({
              ...prev,
              open: true,
              id: parseInt(k),
              element: ObjectType.TABLE,
            }))
          }
        >
          {tables.map((table) => (
            <Accordion.Item
              key={table.key}
              value={`${table.id}`}
              className="relative"
            >
              <Accordion.Control>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {table.name}
                </div>
                <div
                  className="w-1 h-full absolute top-0 left-0 bottom-0"
                  style={{ backgroundColor: table.color }}
                />
              </Accordion.Control>
              <Accordion.Panel>
                <TableInfo data={table} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </>
  );
}
