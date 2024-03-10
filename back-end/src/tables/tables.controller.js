const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const VALID_FIELDS = ["table_name", "capacity"];

function validateTable(req, res, next) {
  const table = req.body.data;

  // Check if the request body contains the 'data' property
  if (!table) {
    return next({ status: 400, message: "Must have data property" });
  }

  // Check if all required fields are present in the table object
  for (const field of VALID_FIELDS) {
    if (!table[field]) {
      return next({ status: 400, message: `Must have ${field} property.` });
    }
  }

  // Check if 'capacity' is a number greater than 0
  if (typeof table["capacity"] !== "number" || table["capacity"] <= 0) {
    return next({
      status: 400,
      message: "capacity must be a number greater than 0",
    });
  }

  // Check if 'table_name' is at least two characters long
  if (table["table_name"].length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least two characters long.",
    });
  }
  next();
}


async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res, next) {
  const table = req.body.data;
  const newTable = await service.create(table);
  table.reservation_id = newTable.reservation_id;
  table.table_id = newTable.table_id;
  res.status(201).json({ data: table });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateTable, asyncErrorBoundary(create)],
  validateTable,
};
