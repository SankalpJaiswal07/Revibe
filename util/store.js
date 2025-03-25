import * as SQLite from "expo-sqlite";

// Global database instance
let database = null;

// Database Initialization Function
export async function initializeDatabase() {
  if (database) {
    return database;
  }

  try {
    // Open database
    database = await SQLite.openDatabaseAsync("revibe.db");

    // Execute database setup
    await database.execAsync(`
      DROP TABLE IF EXISTS items;
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        binCategory TEXT NOT NULL,
        descriptionTitle TEXT NOT NULL,
        description TEXT NOT NULL,
        recycleIdeaOrReuseIdea TEXT NOT NULL,
        imageUri TEXT, 
        createdDate TEXT NOT NULL,
        createdTime TEXT NOT NULL
      );
    `);

    // console.log("Database successfully initialized");
    return database;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

// Database Operations
export async function addItem(item) {
  // Ensure database is initialized before operation
  await initializeDatabase();

  const {
    binCategory,
    descriptionTitle,
    description,
    recycleIdeaOrReuseIdea,
    imageUri,
    createdDate,
    createdTime,
  } = item;

  try {
    const result = await database.runAsync(
      `INSERT INTO items (binCategory, descriptionTitle, description, recycleIdeaOrReuseIdea, imageUri, createdDate, createdTime) 
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        binCategory,
        descriptionTitle,
        description,
        recycleIdeaOrReuseIdea,
        imageUri,
        createdDate,
        createdTime,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
}

// Optional: Call initialization on module import
initializeDatabase().catch(console.error);

// Fetch Items Function
export const fetchItems = async () => {
  try {
    // Fetch items using the global db instance
    const items = await database.getAllAsync("SELECT * FROM items;");
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Fetch Items by Category
export const fetchItemsByCategory = async (category) => {
  try {
    const items = await database.getAllAsync(
      "SELECT * FROM items WHERE binCategory = ? ORDER BY descriptionTitle;",
      [category]
    );
    return items;
  } catch (error) {
    console.error(`Error fetching items in category ${category}:`, error);
    throw error;
  }
};

export const fetchRecentItems = async (limit = 4) => {
  try {
    // Fetch the recent items from the database
    const items = await database.getAllAsync(
      "SELECT * FROM items ORDER BY id DESC LIMIT ?;",
      [limit]
    );

    // Check if items is not already an array and convert it to one
    if (!Array.isArray(items)) {
      return items ? [items] : []; // If it's a single object, return it as an array, else return an empty array
    }

    return items;
  } catch (error) {
    console.log("Error fetching recent items", error);
    return []; // Return an empty array in case of an error
  }
};

// Fetch Item by ID
export const fetchItemById = async (id) => {
  try {
    const item = await database.getFirstAsync(
      "SELECT * FROM items WHERE id = ?;",
      [id]
    );

    if (item) {
      // Parse `recycleIdeaOrReuseIdea` if it's a string
      if (typeof item.recycleIdeaOrReuseIdea === "string") {
        item.recycleIdeaOrReuseIdea = item.recycleIdeaOrReuseIdea
          .split(";")
          .map((idea) => {
            const [title, ...descriptionParts] = idea.split(":");
            return {
              title: title.trim(),
              description: descriptionParts.join(":").trim(),
            };
          });
      }
    }

    return item;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
};

// Update Item
export const updateItem = async (id, updatedItem) => {
  const {
    binCategory,
    descriptionTitle,
    description,
    recycleIdeaOrReuseIdea,
    imageUri,
  } = updatedItem;

  try {
    const result = await database.runAsync(
      `UPDATE items SET 
        binCategory = ?, 
        descriptionTitle = ?, 
        description = ?, 
        recycleIdeaOrReuseIdea = ?, 
        imageUri = ? 
      WHERE id = ?;`,
      [
        binCategory,
        descriptionTitle,
        description,
        recycleIdeaOrReuseIdea,
        imageUri,
        id,
      ]
    );
    return result.changes;
  } catch (error) {
    console.error(`Error updating item with ID ${id}:`, error);
    throw error;
  }
};

// Delete Item
export const deleteItem = async (id) => {
  try {
    const result = await database.runAsync("DELETE FROM items WHERE id = ?;", [
      id,
    ]);
    return result.changes;
  } catch (error) {
    console.error(`Error deleting item with ID ${id}:`, error);
    throw error;
  }
};
