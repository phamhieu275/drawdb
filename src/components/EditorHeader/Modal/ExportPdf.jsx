import { useEffect, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import ExportModal from "./ExportModal";

export default function ExportPdf({ title, hideModal }) {
  const { t } = useTranslation();
  const [exportData, setExportData] = useState({
    data: null,
    filename: `${title}_${new Date().toISOString()}`,
    extension: "pdf",
  });

  const getData = async () => {
    const canvas = document.getElementById("canvas");
    const dataUrl = await toJpeg(canvas);
    const doc = new jsPDF("l", "px", [
      canvas.offsetWidth,
      canvas.offsetHeight,
    ]);
    doc.addImage(
      dataUrl,
      "jpeg",
      0,
      0,
      canvas.offsetWidth,
      canvas.offsetHeight,
    );
    return doc.output('blob');
  }

  useEffect(() => {
    getData().then(
      (data) => setExportData((prev) => ({
        ...prev,
         data: data,
      }))
    )
  }, []);

  return (
    <ExportModal
      modalTitle={t("export_pdf")}
      onCancel={hideModal}
      exportData={exportData}
      setExportData={setExportData}
    />
  )
}
