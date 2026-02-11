const e = require('express');
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/Books.sqlite');
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS Books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    published_year INTEGER NOT NULL
)`);
app.get('/books', (req, res) => {
    db.all('SELECT * FROM Books', [], (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }else {
            res.json(rows);
        }
        
    });
});

app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM Books WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (row) {
                res.status(404).send("Book not found");
            }else {
                res.json(row);
            }
        }
    });
});

app.post('/books', (req, res) => {
    const { title, author, published_year } = req.body;
    db.run('INSERT INTO Books (title, author, published_year) VALUES (?, ?, ?)',
        [title, author, published_year],
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                book.id = this.lastID;
                res.send(book); 
            }
        });
});

app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE Books SET title = ?, author = ?, published_year = ? WHERE id = ?',
        [book.title, book.author, book.published_year, req.params.id],
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(book);
            }
        });
});

app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM Books WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});