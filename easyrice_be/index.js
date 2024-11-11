import express from "express";
import pool from "./database.js";
import cors from "cors";

// Create the Express app
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Utility function to convert ISO string to MySQL-compatible datetime
const convertToMySQLDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " "); // Convert to 'YYYY-MM-DD HH:MM:SS' format
};

// Function to build the history query with filters
const buildHistoryQuery = (filters) => {
  let query = "SELECT * FROM inspectiondb.inspections";
  let queryParams = [];

  const { inspectionID, fromDate, toDate } = filters;

  if (inspectionID) {
    query += " WHERE inspection_id = ?";
    queryParams.push(inspectionID);
  }

  if (fromDate || toDate) {
    query += queryParams.length > 0 ? " AND" : " WHERE";
    query += " DATE(create_date) BETWEEN ? AND ?";
    queryParams.push(fromDate || "1900-01-01", toDate || "9999-12-31");
  }

  return { query, queryParams };
};

// Get all standards
app.get("/standard", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM standards");
    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching standards:", error);
    res
      .status(500)
      .json({ message: "Error fetching standards", error: error.message });
  }
});

// Get history by inspection ID
app.get("/history/:inspectionID", async (req, res) => {
  const { inspectionID } = req.params;

  try {
    const [inspection] = await pool.query(
      "SELECT * FROM inspectiondb.inspections WHERE inspection_id = ?",
      [inspectionID]
    );

    if (inspection.length === 0) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.json({ data: inspection });
  } catch (error) {
    console.error("Error fetching inspection history:", error);
    res.status(500).json({
      message: "Error fetching inspection history",
      error: error.message,
    });
  }
});

// Get history with date range and inspection ID
app.get("/history", async (req, res) => {
  const { fromDate, toDate, inspectionID } = req.query;

  try {
    const { query, queryParams } = buildHistoryQuery({
      inspectionID,
      fromDate,
      toDate,
    });
    const [inspections] = await pool.query(query, queryParams);

    if (inspections.length === 0) {
      return res.status(404).json({ message: "No inspection history found" });
    }

    res.json({ data: inspections });
  } catch (error) {
    console.error("Error fetching inspection history:", error);
    res.status(500).json({
      message: "Error fetching inspection history",
      error: error.message,
    });
  }
});

// Create a new inspection history
app.post("/history", async (req, res) => {
  const {
    name,
    createDate,
    imageLink,
    inspectionID,
    standardID,
    note,
    standardName,
    samplingDate,
    samplingPoint,
    price,
    standardData,
  } = req.body;

  try {
    // Convert date fields before inserting
    const formattedCreateDate = convertToMySQLDate(createDate);
    const formattedSamplingDate = convertToMySQLDate(samplingDate);

    // Insert the inspection
    const insertInspectionQuery = `
      INSERT INTO inspections (
        inspection_id, name, create_date, standard_id, note, 
        standard_name, sampling_date, sampling_point, price, image_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertInspectionQuery, [
      inspectionID,
      name,
      formattedCreateDate,
      standardID,
      note,
      standardName,
      formattedSamplingDate,
      JSON.stringify(samplingPoint),
      price,
      imageLink,
    ]);

    // Insert the standard data
    const insertStandardDataQuery = `
      INSERT INTO inspectionstandarddata (
        inspection_id, key_name, min_length, max_length, shape, name, 
        condition_min, condition_max, value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const data of standardData) {
      await pool.query(insertStandardDataQuery, [
        inspectionID,
        data.key,
        data.minLength,
        data.maxLength,
        JSON.stringify(data.shape),
        data.name,
        data.conditionMin,
        data.conditionMax,
        data.value,
      ]);
    }

    res.status(201).json({
      name,
      createDate: formattedCreateDate,
      inspectionID,
      standardID,
      note,
      standardName,
      samplingDate: formattedSamplingDate,
      samplingPoint,
      price,
      imageLink,
      standardData,
    });
  } catch (error) {
    console.error("Error creating inspection history:", error);
    res.status(500).json({
      message: "Error creating inspection history",
      error: error.message,
    });
  }
});

// Delete inspection history
app.delete("/history", async (req, res) => {
  const { inspectionID } = req.body;

  if (
    !inspectionID ||
    !Array.isArray(inspectionID) ||
    inspectionID.length === 0
  ) {
    return res
      .status(400)
      .json({ message: 'Missing or invalid "inspectionID" array' });
  }

  try {
    await pool.query(
      "DELETE FROM inspectionstandarddata WHERE inspection_id IN (?)",
      [inspectionID]
    );
    const [result] = await pool.query(
      "DELETE FROM inspections WHERE inspection_id IN (?)",
      [inspectionID]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No inspections found with the given IDs" });
    }

    res.json({
      message: "Successfully deleted inspection history",
      deletedIDs: inspectionID,
    });
  } catch (error) {
    console.error("Error deleting inspection history:", error);
    res.status(500).json({
      message: "Error deleting inspection history",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
