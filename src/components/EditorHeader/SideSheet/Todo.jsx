import { useState } from "react";
import {
  Checkbox,
  TextInput,
  Textarea,
  Grid,
  Menu,
  Button,
  // Popover,
  // Tag,
  List,
  // RadioGroup,
  // Radio,
} from "@mantine/core";
import {
  IconPlus,
  // IconMore,
  // IconTrash,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import { State } from "../../../data/constants";
import { useTasks, useSaveState } from "../../../hooks";
import { useTranslation } from "react-i18next";

const Priority = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

const SortOrder = {
  ORIGINAL: "my_order",
  PRIORITY: "priority",
  COMPLETED: "completed",
  ALPHABETICALLY: "alphabetically",
};

export default function Todo() {
  const [activeTask, setActiveTask] = useState(-1);
  const [, setSortOrder] = useState(SortOrder.ORIGINAL);
  const { tasks, setTasks, updateTask } = useTasks();
  const { setSaveState } = useSaveState();
  const { t } = useTranslation();

  // const priorityLabel = (p) => {
  //   switch (p) {
  //     case Priority.NONE:
  //       return t("none");
  //     case Priority.LOW:
  //       return t("low");
  //     case Priority.MEDIUM:
  //       return t("medium");
  //     case Priority.HIGH:
  //       return t("high");
  //     default:
  //       return "";
  //   }
  // };

  // const priorityColor = (p) => {
  //   switch (p) {
  //     case Priority.NONE:
  //       return "blue";
  //     case Priority.LOW:
  //       return "green";
  //     case Priority.MEDIUM:
  //       return "yellow";
  //     case Priority.HIGH:
  //       return "red";
  //     default:
  //       return "";
  //   }
  // };

  const sort = (s) => {
    setActiveTask(-1);
    switch (s) {
      case SortOrder.ORIGINAL:
        setTasks((prev) => prev.sort((a, b) => a.order - b.order));
        return;
      case SortOrder.PRIORITY:
        setTasks((prev) => prev.sort((a, b) => b.priority - a.priority));
        return;
      case SortOrder.COMPLETED:
        setTasks((prev) =>
          prev.sort((a, b) => {
            if (a.complete && !b.complete) {
              return 1;
            } else if (!a.complete && b.complete) {
              return -1;
            } else {
              return 0;
            }
          }),
        );
        break;
      case SortOrder.ALPHABETICALLY:
        setTasks((prev) => prev.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mx-5 mb-2 sidesheet-theme">
        <Menu>
          <Menu.Target>
            <Button
              style={{ marginRight: "10px" }}
              theme="borderless"
              type="tertiary"
            >
              {t("sort_by")} <IconCaretDownFilled />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {Object.values(SortOrder).map((order) => (
              <Menu.Item
                key={order}
                onClick={() => {
                  setSortOrder(order);
                  sort(order);
                }}
              >
                {t(order)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Button
          leftSection={<IconPlus />}
          fullWidth
          onClick={() => {
            setTasks((prev) => [
              {
                complete: false,
                details: "",
                title: "",
                priority: Priority.NONE,
                order: prev.length,
              },
              ...prev,
            ]);
          }}
        >
          {t("add_task")}
        </Button>
      </div>
      {tasks.length > 0 ? (
        <List className="sidesheet-theme">
          {tasks.map((task, i) => (
            <List.Item
              key={i}
              style={{ paddingLeft: "18px", paddingRight: "18px" }}
              className="hover-1"
              onClick={() => setActiveTask(i)}
            >
              <div className="w-full">
                <Grid justify="center" align="center" className="mb-2">
                  <Grid.Col span={2}>
                    <Checkbox
                      checked={task.complete}
                      onChange={(e) => {
                        updateTask(i, { complete: e.target.checked });
                        setSaveState(State.SAVING);
                      }}
                    ></Checkbox>
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <TextInput
                      placeholder={t("title")}
                      onChange={(e) => updateTask(i, { title: e.target.value })}
                      value={task.title}
                      onBlur={() => setSaveState(State.SAVING)}
                    />
                  </Grid.Col>
                  {/* <Grid.Col span={3}>
                    <Popover
                      content={
                        <div className="p-2 popover-theme">
                          <div className="mb-2 font-semibold">
                            {t("priority")}:
                          </div>
                          <RadioGroup
                            onChange={(e) => {
                              updateTask(i, { priority: e.target.value });
                              setSaveState(State.SAVING);
                            }}
                            value={task.priority}
                            direction="vertical"
                          >
                            <Radio value={Priority.NONE}>
                              <Tag color={priorityColor(Priority.NONE)}>
                                {priorityLabel(Priority.NONE)}
                              </Tag>
                            </Radio>
                            <Radio value={Priority.LOW}>
                              <Tag color={priorityColor(Priority.LOW)}>
                                {priorityLabel(Priority.LOW)}
                              </Tag>
                            </Radio>
                            <Radio value={Priority.MEDIUM}>
                              <Tag color={priorityColor(Priority.MEDIUM)}>
                                {priorityLabel(Priority.MEDIUM)}
                              </Tag>
                            </Radio>
                            <Radio value={Priority.HIGH}>
                              <Tag color={priorityColor(Priority.HIGH)}>
                                {priorityLabel(Priority.HIGH)}
                              </Tag>
                            </Radio>
                          </RadioGroup>
                          <Button
                            leftSection={<IconTrash />}
                            variant="danger"
                            fullWidth
                            style={{ marginTop: "12px" }}
                            onClick={() => {
                              setTasks((prev) =>
                                prev.filter((_, j) => i !== j),
                              );
                              setSaveState(State.SAVING);
                            }}
                          >
                            {t("delete")}
                          </Button>
                        </div>
                      }
                      trigger="click"
                      showArrow
                      className="w-[180px]"
                    >
                      <Button icon={<IconMore />} type="tertiary" />
                    </Popover>
                  </Grid.Col> */}
                </Grid>
                {activeTask === i && (
                  <Grid justify="center" align="center" className="mb-2">
                    <Grid.Col offset={2} span={10}>
                      <Textarea
                        placeholder={t("details")}
                        onChange={(e) =>
                          updateTask(i, { details: e.target.value })
                        }
                        value={task.details}
                        onBlur={() => setSaveState(State.SAVING)}
                      ></Textarea>
                    </Grid.Col>
                  </Grid>
                )}
                {/* <Grid>
                  <Grid.Col span={2}></Grid.Col>
                  <Grid.Col span={22}>
                    {t("priority")}:{" "}
                    <Tag color={priorityColor(task.priority)}>
                      {priorityLabel(task.priority)}
                    </Tag>
                  </Grid.Col>
                </Grid> */}
              </div>
            </List.Item>
          ))}
        </List>
      ) : (
        <div className="m-5 sidesheet-theme">{t("no_tasks")}</div>
      )}
    </>
  );
}
