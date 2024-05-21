import Excel from "exceljs";
import { getTypeString } from "./toSQL";
import { toPng } from "html-to-image";
import i18n from "../i18n/i18n";

const excelTableTheme = "TableStyleLight9";

export async function jsonToExcel(data) {
  const labels = {
    tables: i18n.t("tables"),
    relationships: i18n.t("relationships"),
    diagram: i18n.t("diagram"),
    fields: i18n.t("fields"),
    indices: i18n.t("indices"),
    name: i18n.t("name"),
    cardinality: i18n.t("cardinality"),
    type: i18n.t("type"),
    not_null: i18n.t("not_null"),
    primary: i18n.t("primary"),
    default_value: i18n.t("default_value"),
    unique: i18n.t("unique"),
    autoincrement: i18n.t("autoincrement"),
    comment: i18n.t("comment"),
    yes: i18n.t("yes"),
    source_table: i18n.t("source_table"),
    source_field: i18n.t("source_field"),
    foreign_table: i18n.t("foreign_table"),
    foreign_field: i18n.t("foreign_field"),
    update_constraint: i18n.t("update_constraint"),
    delete_constraint: i18n.t("delete_constraint"),
  };

  const workbook = new Excel.Workbook();

  // create sheet for list tables and relationships
  const listTableSheet = workbook.addWorksheet(labels.tables);
  listTableSheet.addTable({
    name: "Tables",
    ref: "A1",
    style: {
      theme: excelTableTheme,
      showRowStripes: true,
    },
    columns: [{ name: "#" }, { name: labels.name }, { name: labels.comment }],
    rows: data.tables.map((table, index) => [
      index + 1,
      table.name,
      table.comment,
    ]),
  });

  if (data.relationships.length) {
    const relationSheet = workbook.addWorksheet(labels.relationships);
    relationSheet.addTable({
      name: "Relations",
      ref: "A1",
      style: {
        theme: excelTableTheme,
        showRowStripes: true,
      },
      columns: [
        { name: "#" },
        { name: labels.name },
        { name: labels.cardinality },
        { name: labels.source_table },
        { name: labels.source_field },
        { name: labels.foreign_table },
        { name: labels.foreign_field },
        { name: labels.update_constraint },
        { name: labels.delete_constraint },
      ],
      rows: data.relationships.map((r, index) => [
        index + 1,
        r.name,
        i18n.t(r.cardinality.toLowerCase().replaceAll(" ", "_")),
        data.tables[r.startTableId].name,
        data.tables[r.startTableId].fields[r.startFieldId].name,
        data.tables[r.endTableId].name,
        data.tables[r.endTableId].fields[r.endFieldId].name,
        r.updateConstraint.toUpperCase(),
        r.deleteConstraint.toUpperCase(),
      ]),
    });
  }

  // create ER diagram sheet
  if (data.hasDiagram) {
    const canvasElm = document.getElementById("canvas");
    const canvasBoundary = canvasElm.getBoundingClientRect();
    const diagramImageId = workbook.addImage({
      base64: await toPng(canvasElm),
      extension: 'png',
    });
    workbook.addWorksheet(labels.diagram).addImage(diagramImageId, {
      tl: {
        col: 0,
        row: 0
      },
      ext: {
        width: parseInt(canvasBoundary.width),
        height: parseInt(canvasBoundary.height)
      }
    });
  }
  // create table sheet
  data.tables.map((table, index) => {
    const tableSheet = workbook.addWorksheet(table.name);

    tableSheet.getRow(1).getCell(1).value = labels.fields;
    tableSheet.getRow(1).getCell(1).style = { font: { bold: true } };

    tableSheet.addTable({
      name: `FieldTable${index}`,
      ref: "A2",
      style: {
        theme: excelTableTheme,
        showRowStripes: true,
      },
      columns: [
        { name: "#" },
        { name: labels.name },
        { name: labels.type },
        { name: labels.not_null },
        { name: labels.default_value },
        { name: labels.primary },
        { name: labels.unique },
        { name: labels.autoincrement },
        { name: labels.comment },
      ],
      rows: table.fields.map((field, index) => [
        index + 1,
        field.name,
        getTypeString(field, data.dbms),
        field.notNull ? labels.yes : "",
        field.default,
        field.primary ? labels.yes : "",
        field.unique ? labels.yes : "",
        field.increment ? labels.yes : "",
        field.comment,
      ]),
    });

    if (table.indices.length) {
      // add 1 empty line to separate tables
      const lastRowIdx = tableSheet.rowCount + 1;

      tableSheet.getRow(lastRowIdx + 1).getCell(1).value = labels.indices;
      tableSheet.getRow(lastRowIdx + 1).getCell(1).style = {
        font: { bold: true },
      };

      tableSheet.addTable({
        name: `IndexTable${index}`,
        ref: `A${lastRowIdx + 2}`,
        style: {
          theme: excelTableTheme,
          showRowStripes: true,
        },
        columns: [
          { name: "#" },
          { name: labels.name },
          { name: labels.fields },
          { name: labels.unique },
        ],
        rows: table.indices.map((indexData, index) => [
          index + 1,
          indexData.name,
          indexData.fields.join(", "),
          indexData.unique ? labels.yes : "",
        ]),
      });
    }
  });

  return await workbook.xlsx.writeBuffer();
}
