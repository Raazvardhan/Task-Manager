const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir('./files', function(err, files){
    if (err) {
      return res.status(500).send('Error reading directory');
    }
    res.render('index', { files: files }); 
  });
});

app.get('/file/:filename', (req, res) => {
  const filePath = `./files/${req.params.filename}`;
  fs.readFile(filePath, 'utf8', function(err, filedata){
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.render('show', { filename: req.params.filename, content: filedata });
  });
});

app.post('/create', (req, res) => {
  const filePath = `./files/${req.body.title.split(' ').join('_')}.txt`;
  fs.writeFile(filePath, req.body.details, function(err) {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
