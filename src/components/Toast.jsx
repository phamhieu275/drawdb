import { notifications } from "@mantine/notifications";
import { IconInfoCircleFilled, IconCheck, IconX } from "@tabler/icons-react";

export default {
  info: (message) =>
    notifications.show({
      message: message,
      icon: <IconInfoCircleFilled />,
    }),
  error: (message) =>
    notifications.show({
      message: message,
      color: "red",
      icon: <IconX />,
    }),
  success: (message) =>
    notifications.show({
      message: message,
      color: "teal",
      icon: <IconCheck />,
    }),
};
