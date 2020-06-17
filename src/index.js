const app = require('./app');

app.all('*', (req, res) => {
    res.status(404).json();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('App is running on port ' + port);
});