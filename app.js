const express = require('express');
const app = express();
const ExpressError = require('./expressError');

app.use(express.json());

const cRoutes = require('./routes/companies');
const iRoutes = require('./routes/invoices')

app.use('/companies', cRoutes);
app.use('/invoices', iRoutes);


app.use(function (req, res, next) {
    const err = new ExpressError('Not Found', 404);
    return next(err);
  });
  
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    return res.json({
      error: err.message
    });
  });
  

  modules.export = app;