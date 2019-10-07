const express = require('express')
const path = require('path');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static( __dirname + '/public/dist/public' ));
require('./server/config/routes')(app);
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});
app.listen(8000), () => console.log('listening on port 8000');
