import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import Editor from "./pages/Editor";
import Survey from "./pages/Survey";
import BugReport from "./pages/BugReport";
import Shortcuts from "./pages/Shortcuts";
import Templates from "./pages/Templates";
import LandingPage from "./pages/LandingPage";
import SettingsContextProvider from "./context/SettingsContext";
import useSettings from "./hooks/useSettings";
import NotFound from "./pages/NotFound";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <SettingsContextProvider>
        <BrowserRouter>
          <RestoreScroll />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/editor"
              element={
                <ThemedPage>
                  <Editor />
                </ThemedPage>
              }
            />
            <Route
              path="/survey"
              element={
                <ThemedPage>
                  <Survey />
                </ThemedPage>
              }
            />
            <Route
              path="/shortcuts"
              element={
                <ThemedPage>
                  <Shortcuts />
                </ThemedPage>
              }
            />
            <Route
              path="/bug-report"
              element={
                <ThemedPage>
                  <BugReport />
                </ThemedPage>
              }
            />
            <Route path="/templates" element={<Templates />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SettingsContextProvider>
    </MantineProvider>
  );
}

function ThemedPage({ children }) {
  const { setSettings } = useSettings();

  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setSettings((prev) => ({ ...prev, mode: "dark" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "dark");
      }
    } else {
      setSettings((prev) => ({ ...prev, mode: "light" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "light");
      }
    }
  }, [setSettings]);

  return children;
}

function RestoreScroll() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scroll(0, 0);
  }, [location.pathname]);
  return null;
}
