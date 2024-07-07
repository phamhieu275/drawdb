import {
  IconCaretDownFilled,
  IconCheck,
  IconLayoutList,
} from "@tabler/icons-react";
import { Menu } from "@mantine/core";
import { useLayout } from "../../hooks";
import { enterFullscreen, exitFullscreen } from "../../utils/fullscreen";
import { useTranslation } from "react-i18next";

export default function LayoutDropdown() {
  const { layout, setLayout } = useLayout();
  const { t } = useTranslation();

  const invertLayout = (component) =>
    setLayout((prev) => ({ ...prev, [component]: !prev[component] }));

  return (
    <Menu position="bottom-start" width="180">
      <Menu.Target>
        <div className="py-1 px-2 hover-2 rounded flex items-center justify-center">
          <IconLayoutList />
          <div>
            <IconCaretDownFilled />
          </div>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={layout.header ? <IconCheck /> : <div className="px-2" />}
          onClick={() => invertLayout("header")}
        >
          {t("header")}
        </Menu.Item>
        <Menu.Item
          leftSection={
            layout.sidebar ? <IconCheck /> : <div className="px-2" />
          }
          onClick={() => invertLayout("sidebar")}
        >
          {t("sidebar")}
        </Menu.Item>
        <Menu.Item
          leftSection={layout.issues ? <IconCheck /> : <div className="px-2" />}
          onClick={() => invertLayout("issues")}
        >
          {t("issues")}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<div className="px-2" />}
          onClick={() => {
            if (layout.fullscreen) {
              exitFullscreen();
            } else {
              enterFullscreen();
            }
            invertLayout("fullscreen");
          }}
        >
          {t("fullscreen")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
