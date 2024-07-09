import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Card,
  Popover,
  ActionIcon,
  Accordion,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTables, useUndoRedo } from "../../../hooks";
import { Action, ObjectType, defaultBlue } from "../../../data/constants";
import ColorPalette from "../../ColorPicker";
import TableField from "./TableField";
import IndexDetails from "./IndexDetails";
import { useTranslation } from "react-i18next";

export default function TableInfo({ data }) {
  const { t } = useTranslation();
  const [indexActiveKey, setIndexActiveKey] = useState(null);
  const { deleteTable, updateTable, updateField, setRelationships } =
    useTables();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState({});
  const [drag, setDrag] = useState({
    draggingElementIndex: null,
    draggingOverIndexList: [],
  });

  return (
    <div>
      <div className="flex items-center mb-2.5">
        <div className="text-md font-semibold break-keep">{t("name")}: </div>
        <TextInput
          variant="filled"
          value={data.name}
          error={data.name.trim() === ""}
          placeholder={t("name")}
          className="ms-2 w-full"
          onChange={(e) => updateTable(data.id, { name: e.target.value })}
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField.name) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: "self",
                tid: data.id,
                undo: editField,
                redo: { name: e.target.value },
                message: t("edit_table", {
                  tableName: e.target.value,
                  extra: "[name]",
                }),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </div>
      {data.fields.map((f, j) => (
        <div
          key={"field_" + j}
          className={`cursor-pointer ${drag.draggingOverIndexList.includes(j) ? "opacity-25" : ""}`}
          draggable
          onDragStart={() => {
            setDrag((prev) => ({ ...prev, draggingElementIndex: j }));
          }}
          onDragLeave={() => {
            setDrag((prev) => ({
              ...prev,
              draggingOverIndexList: prev.draggingOverIndexList.filter(
                (index) => index !== j,
              ),
            }));
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (drag.draggingElementIndex != null) {
              if (j !== drag.draggingElementIndex) {
                setDrag((prev) => {
                  if (prev.draggingOverIndexList.includes(j)) {
                    return prev;
                  }

                  return {
                    ...prev,
                    draggingOverIndexList: prev.draggingOverIndexList.concat(j),
                  };
                });
              }

              return;
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const index = drag.draggingElementIndex;
            setDrag({ draggingElementIndex: null, draggingOverIndexList: [] });
            if (index == null || index === j) {
              return;
            }

            const a = data.fields[index];
            const b = data.fields[j];

            updateField(data.id, index, { ...b, id: index });
            updateField(data.id, j, { ...a, id: j });

            setRelationships((prev) =>
              prev.map((e) => {
                if (e.startTableId === data.id) {
                  if (e.startFieldId === index) {
                    return { ...e, startFieldId: j };
                  }
                  if (e.startFieldId === j) {
                    return { ...e, startFieldId: index };
                  }
                }
                if (e.endTableId === data.id) {
                  if (e.endFieldId === index) {
                    return { ...e, endFieldId: j };
                  }
                  if (e.endFieldId === j) {
                    return { ...e, endFieldId: index };
                  }
                }
                return e;
              }),
            );
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setDrag({ draggingElementIndex: null, draggingOverIndexList: [] });
          }}
        >
          <TableField data={f} tid={data.id} index={j} />
        </div>
      ))}
      <Card padding="0" radius="md" withBorder className="my-4">
        <Accordion>
          <Accordion.Control>{t("comment")}</Accordion.Control>
          <Accordion.Panel>
            <Textarea
              variant="filled"
              field="comment"
              value={data.comment}
              autosize
              placeholder={t("comment")}
              size="md"
              onChange={(e) =>
                updateTable(data.id, { comment: e.target.value }, false)
              }
              onFocus={(e) => setEditField({ comment: e.target.value })}
              onBlur={(e) => {
                if (e.target.value === editField.comment) return;
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TABLE,
                    component: "self",
                    tid: data.id,
                    undo: editField,
                    redo: { comment: e.target.value },
                    message: t("edit_table", {
                      tableName: e.target.value,
                      extra: "[comment]",
                    }),
                  },
                ]);
                setRedoStack([]);
              }}
            />
          </Accordion.Panel>
        </Accordion>
      </Card>

      {data.indices.length > 0 && (
        <Card padding="0" radius="md" withBorder className="my-4">
          <Accordion value={indexActiveKey} onChange={setIndexActiveKey}>
            <Accordion.Item value="1">
              <Accordion.Control>{t("indices")}</Accordion.Control>
              <Accordion.Panel>
                {data.indices.map((idx, k) => (
                  <IndexDetails
                    key={"index_" + k}
                    data={idx}
                    iid={k}
                    tid={data.id}
                    fields={data.fields.map((e) => ({
                      value: e.name,
                      label: e.name,
                    }))}
                  />
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card>
      )}
      <div className="flex justify-between items-center gap-1 mb-2">
        <Popover position="bottom-start" withArrow>
          <Popover.Target>
            <div
              className="h-[32px] w-[32px] rounded"
              style={{ backgroundColor: data.color }}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPalette
              currentColor={data.color}
              onClearColor={() => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TABLE,
                    component: "self",
                    tid: data.id,
                    undo: { color: data.color },
                    redo: { color: defaultBlue },
                    message: t("edit_table", {
                      tableName: data.name,
                      extra: "[color]",
                    }),
                  },
                ]);
                setRedoStack([]);
                updateTable(data.id, { color: defaultBlue });
              }}
              onPickColor={(c) => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TABLE,
                    component: "self",
                    tid: data.id,
                    undo: { color: data.color },
                    redo: { color: c },
                    message: t("edit_table", {
                      tableName: data.name,
                      extra: "[color]",
                    }),
                  },
                ]);
                setRedoStack([]);
                updateTable(data.id, { color: c });
              }}
            />
          </Popover.Dropdown>
        </Popover>
        <div className="flex gap-1">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              setIndexActiveKey("1");
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: "index_add",
                  tid: data.id,
                  message: t("edit_table", {
                    tableName: data.name,
                    extra: "[add index]",
                  }),
                },
              ]);
              setRedoStack([]);
              updateTable(data.id, {
                indices: [
                  ...data.indices,
                  {
                    id: data.indices.length,
                    name: `${data.name}_index_${data.indices.length}`,
                    unique: false,
                    fields: [],
                  },
                ],
              });
            }}
          >
            {t("add_index")}
          </Button>
          <Button
            variant="light"
            onClick={() => {
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: "field_add",
                  tid: data.id,
                  message: t("edit_table", {
                    tableName: data.name,
                    extra: "[add field]",
                  }),
                },
              ]);
              setRedoStack([]);
              updateTable(data.id, {
                fields: [
                  ...data.fields,
                  {
                    name: "",
                    type: "",
                    default: "",
                    check: "",
                    primary: false,
                    unique: false,
                    notNull: false,
                    increment: false,
                    comment: "",
                    id: data.fields.length,
                  },
                ],
              });
            }}
            fullWidth
          >
            {t("add_field")}
          </Button>
          <ActionIcon
            variant="light"
            color="gray"
            size="lg"
            onClick={() => deleteTable(data.id)}
          >
            <IconTrash color="red" />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
}
