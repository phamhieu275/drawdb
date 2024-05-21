import { Checkbox, Select } from "@douyinfe/semi-ui";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DATABASE_TYPES } from "../../../data/constants";
import { jsonToExcel } from "../../../utils/toDocument";
import { useTables } from "../../../hooks";
import ExportModal from "./ExportModal";

export default function ExportExcel({ title, hideModal }) {
  const { t } = useTranslation();
  const { tables, relationships } = useTables();

  const [options, setOptions] = useState({
    format: DATABASE_TYPES[0],
    hasRelationship: true,
    hasDiagram: true,
  });

  const [exportData, setExportData] = useState({
    data: null,
    filename: `${title}_${new Date().toISOString()}`,
    extension: "xlsx",
  });

  const changeOptions = (options) => {
    setOptions((prev) => ({
      ...prev,
      ...options
    }));
  }

  const getData = useCallback(async (options) => {
    const content = await jsonToExcel({
      tables: tables,
      dbms: options.format.toLowerCase(),
      relationships: options.hasRelationship ? relationships: [],
      hasDiagram: options.hasDiagram,
    });

    return new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }, [tables, relationships]);

  useEffect(() => {
    getData(options).then(
      (data) => setExportData((prev) => ({
        ...prev,
         data: data,
      }))
    )
  }, [options, getData]);

  return (
    <ExportModal
      modalTitle={t("export_excel")}
      onCancel={hideModal}
      exportData={exportData}
      setExportData={setExportData}
    >
      <div className="font-semibold mb-1">{t("format")}:</div>
      <Select
        optionList={DATABASE_TYPES.map((v) => ({
          label: v,
          value: v,
        }))}
        value={options.format}
        className="w-full"
        onChange={(value) => changeOptions({format : value})}
      />
      <Checkbox
        className="w-full mt-3 mb-1"
        aria-label="export relationship checkbox"
        checked={options.hasRelationship}
        defaultChecked
        onChange={(e) => changeOptions({hasRelationship: e.target.checked})}
      >
        {t("add_relationship")}
      </Checkbox>
      <Checkbox
        className="w-full my-1"
        aria-label="export relationship checkbox"
        checked={options.hasDiagram}
        defaultChecked
        onChange={(e) => changeOptions({hasDiagram: e.target.checked})}
      >
        {t("add_diagram")}
      </Checkbox>
    </ExportModal>
  );
}
