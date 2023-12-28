import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { csvFileName } from "../config/datasource";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const csvFilePath = path.join(__dirname, "..", "..", csvFileName);
let originalGrades: Record<string, Record<string, number>>;

const getHeader = async () => {
  return new Promise<string>((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath).pipe(csv());
    stream.on("headers", (headers) => {
      if (headers && headers.length > 0) {
        resolve(headers);
      } else {
        reject(new Error("No header found in the CSV file."));
      }
      stream.destroy();
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

export const getGradesData = async () =>
  new Promise<Record<string, Record<string, number>>>((resolve, reject) => {
    const csvData: Record<string, Record<string, number>> = {};

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        const studentName = row[""];
        if (!studentName) return;
        const subjectGrades: Record<string, number> = {};
        Object.keys(row)
          .filter((key) => key !== "" && key !== "Student Name")
          .forEach((subject) => {
            subjectGrades[subject] = Number(row[subject]);
          });
        csvData[studentName] = subjectGrades;
      })
      .on("end", () => {
        originalGrades = csvData;
        resolve(csvData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });

export const updateGradesData = async (
  param: Record<string, Record<string, number>>
) => {
  try {
     const headers = await getHeader();
    const gradesData = originalGrades;

    for (const studentName in param) {
      const updatedStudentData = param[studentName];
      gradesData[studentName] = {
        ...gradesData[studentName],
        ...updatedStudentData,
      };
    }
    const csvString = [
      headers,
      ...Object.entries(gradesData).map(
        ([studentName, subjectGrades]) =>
          `${studentName},${Object.values(subjectGrades).join(",")}`
      ),
    ].join("\n");

    await writeFileAsync(csvFilePath, csvString);
    console.log("Grades updated successfully");
  } catch (error) {
    console.error("Error updating grades:", error);
    throw error;
  }
};
