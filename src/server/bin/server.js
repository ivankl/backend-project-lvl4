#! /user/bin/env node

import app from '../../index.js';

const port = process.env.PORT || 5000;
const address = '0.0.0.0';

app().listen(port, address, () => {
  console.log(`Server is running on port ${port}`);
});
