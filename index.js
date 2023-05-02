const express = require('express');
const bodyParser = require('body-parser');
const route = require('./src/routes/route');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());//convert the incoming request body parse and to json
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://anik2310:anik123@cluster0.tby9aun.mongodb.net/ttechmical',{
      useNewUrlParser: true,
    }
  )
  .then(() => console.log('MongoDb is connected'))
  .catch((err) => console.log(err));

app.use('/', route);

app.all('/**', (req, res) => {
  res.status(404).send({ status: false, message: 'Page Not Found!' });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000));
});//whenever u access thee data frm env file we use proccess.env
