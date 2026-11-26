// STORAGE: keeps data in memory. No rules here, just save and find.

const items = new Map(); // id -> item
let nextId = 1;

function save(item) {
  if (!item.id) {
    item.id = nextId++;
  }
  items.set(item.id, item);
  return item;
}

function findById(id) {
  return items.get(id);
}

function findAll() {
  return Array.from(items.values());
}

module.exports = { save, findById, findAll };
