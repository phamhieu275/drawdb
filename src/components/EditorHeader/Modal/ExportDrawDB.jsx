import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAreas,
  useNotes,
  useTables,
  useTypes,
} from "../../../hooks";
import ExportModal from "./ExportModal";

export default function ExportDrawDB({ title, hideModal }) {
  const { t } = useTranslation();
  const { tables, relationships } = useTables();
  const { notes } = useNotes();
  const { areas } = useAreas();
  const { types } = useTypes();

  const rawData = JSON.stringify(
    {
      author: "Unnamed",
      title: title,
      date: new Date().toISOString(),
      tables: tables,
      relationships: relationships,
      notes: notes,
      subjectAreas: areas,
      types: types,
    },
    null,
    2,
  );
  const [exportData, setExportData] = useState({
    data: new Blob(
      [rawData],
      { type: "text/plain;charset=utf-8" }
    ),
    filename: `${title}_${new Date().toISOString()}`,
    extension: "ddb",
  });

  return (
    <ExportModal
      modalTitle={t("export_diagram")}
      onCancel={hideModal}
      exportData={exportData}
      setExportData={setExportData}
    />
  )
}
