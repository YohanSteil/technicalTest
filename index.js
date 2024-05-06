import express from "express";
import sqlite3Package from "sqlite3";
import bodyParser from "body-parser";
import chalk from "chalk";
import cors from "cors";

// import dotenv from 'dotenv';
// dotenv.config();

const { verbose } = sqlite3Package;
const sqlite3 = verbose();

// const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database("./deepsy_test.db", (err) => {
  if (err) return console.error(err.message);
  console.log("✅ The SQlite database is ready for action");
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const TOKEN =
  "OpgIe84krMsrMouJrUdxYPghX5o7DKtTiL1alv6vbgg6zuUpUbt0xDUMiLBgY5bw";
const languages = ["en", "fr"];

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      sub_title TEXT,
      is_active BOOLEAN NOT NULL DEFAULT 1,
      color TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    )`);

  db.run(`CREATE TRIGGER IF NOT EXISTS update_timestamp AFTER UPDATE ON test
    BEGIN
      UPDATE test SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/token", (req, res) => {
  res.json({ token: TOKEN });
});

app.get("/languages", (req, res) => {
  res.json(languages);
});

const randomErrorMiddleware = (req, res, next) => {
  // if (Math.random() < 0.1) return res.status(500).send("Oopsie doopsie, something totally went wrong, no idea what 🥸");

  next();
};

const validateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token !== TOKEN) return res.status(401).send("Unauthorized");

  next();
};

app.use(
  "/api/:lang",
  (req, res, next) => {
    if (!languages.includes(req.params.lang))
      return res.status(404).send("Language not supported");
    req.lang = req.params.lang;
    next();
  },
  validateToken,
  randomErrorMiddleware
);

const parseLanguageFields = (row, lang) => {
  try {
    row.title = JSON.parse(row.title)[lang];
    row.sub_title = JSON.parse(row.sub_title)[lang];
  } catch (error) {
    console.error("Failed to parse language-specific fields:", error);
  }

  return row;
};

app.get("/api/:lang/test/", (req, res) => {
  let { limit = 10, page = 0, sort, active = "true" } = req.query;
  limit = Math.min(limit, 100);
  let orderClause =
    sort === "date" ? "ORDER BY created_at DESC" : "ORDER BY RANDOM()";
  let offset = (page - 1) * limit;
  let isActive = active.toLowerCase() === "true" ? 1 : 0;

  db.all(
    `SELECT * FROM test WHERE is_active = ? ${orderClause} LIMIT ? OFFSET ?`,
    [isActive, limit, offset],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);

      const data = rows.map((row) => parseLanguageFields(row, req.lang));

      db.get(
        "SELECT COUNT(id) AS count FROM test WHERE is_active = ?",
        [isActive],
        (err, row) => {
          if (err) return res.status(500).send(err.message);

          res.json({
            data: data,
            pagination: {
              total: row.count,
              pages: Math.ceil(row.count / limit),
              currentPage: page,
            },
          });
        }
      );
    }
  );
});

app.get("/api/:lang/test/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM test WHERE (id = ? OR ref = ?) AND is_active = 1",
    [id, id],
    (err, row) => {
      if (err) return res.status(500).send(err.message);
      if (!row) return res.status(404).send("Test not found");

      res.json(parseLanguageFields(row, req.lang));
    }
  );
});

app.post("/api/:lang/test/", (req, res) => {
  // One in a three chance of the request failing (Wanted half of these to fail but there's already 1 in a 10 chance of it failing).
  // if (Math.random() < 0.33) return res.status(500).send("Oopsie doopsie, something totally went wrong, no idea what 🥸");

  const { title, sub_title, color, is_active } = req.body;

  // Couldn't bother to use the reduce function's weird syntax, this loop should do the job.
  for (let lang of languages) {
    if (
      !title[lang] ||
      !sub_title[lang] ||
      title[lang] === "" ||
      sub_title[lang] === ""
    ) {
      return res
        .status(400)
        .send(
          `Title and subtitle must exist for all languages and cannot be empty. Missing or empty field for language: ${lang}`
        );
    }
  }

  // Checks for additionnal languages.
  for (let lang in title) {
    if (!languages.includes(lang)) {
      return res.status(400).send(`Invalid language provided: ${lang}`);
    }
  }

  const lang = req?.lang;

  const ref = title[lang].replace(/\s/g, "_");
  const titleJson = JSON.stringify(title);
  const subTitleJson = JSON.stringify(sub_title);

  db.run(
    "INSERT INTO test (ref, title, sub_title, color, is_active) VALUES (?, ?, ?, ?, ?)",
    [ref, titleJson, subTitleJson, color, is_active],
    function (err) {
      if (err) return res.status(500).send(err.message);

      db.get("SELECT * FROM test WHERE id = ?", [this.lastID], (err, row) => {
        if (err) return res.status(500).send(err.message);
        res.status(201).json(parseLanguageFields(row, req.lang));
      });
    }
  );
});

// This is a app.post but it actually app.patch
app.post("/api/:lang/test/:id", (req, res) => {
  const { id } = req.params;
  const { title, sub_title, color, is_active } = req.body;
  const titleJson = JSON.stringify(title);
  const subTitleJson = JSON.stringify(sub_title);

  db.run(
    "UPDATE test SET title = ?, sub_title = ?, color = ?, is_active = ? WHERE id = ?",
    [titleJson, subTitleJson, color, is_active, id],
    (err) => {
      if (err) return res.status(500).send(err.message);

      db.get("SELECT * FROM test WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) return res.status(404).send("Test not found");
        res.json(parseLanguageFields(row, req.lang));
      });
    }
  );
});

app.delete("/api/:lang/test/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM test WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.send("No test found to delete");
    res.send("Test deleted successfully 👍");
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.clear();
  console.log(
    chalk.blue.bold(
      `\n\n👉 Api's first endpoint here: http://localhost:${port}/\n`
    )
  );
  console.log(
    chalk.white(
      `⚠️  If you can't connect, try changing the "PORT" in your .env and`
    )
  );
  console.log(
    chalk.white(
      `verify your Firewall settings, or simply restart your server\n\n`
    )
  );
});
