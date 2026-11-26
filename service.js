// BUSINESS LOGIC: checks the input, applies the rules, uses the store.
// It never touches req/res. When something is wrong, it throws an AppError with a status code.

const store = require('./store');
const logger = require('./logger');

// An error that knows which HTTP status to send back.
class AppError extends  Error {
  constructor(status, message, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function createItem(body) {
  // 1. Check the input  -> 400 Bad Request
  if (!body || typeof body !== 'object') {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  const errors = [];
  if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required');
  }
  if (!Number.isInteger(body.quantity) || body.quantity <= 0) {
    errors.push('quantity must be a whole number greater than 0');
  }
  if (errors.length > 0) {
    throw new AppError(400, 'Invalid input', errors);
  }

  const name = body.name.trim();

  // 2. Business rule  -> 409 Conflict
  // Example rule: no two items with the same name
  const duplicate = store.findAll().find((i) => i.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    throw new AppError(409, `Item '${name}' already exists`);
  }

  // 3. Save and return
  const item = store.save({ name, quantity: body.quantity, createdAt: new Date().toISOString() });
  logger.info('Created item', { id: item.id, name: item.name });
  return item;
}

function getItem(idText) {
  const id = Number(idText);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid id '${idText}'`);
  }

  const item = store.findById(id);
  if (!item) {
    throw new AppError(404, `Item ${id} not found`);
  }
  return item;
}

function getAllItems() {
  return store.findAll();
}

module.exports = { AppError, createItem, getItem, getAllItems };
