import mongoose from 'mongoose'
import config from './config.js'

mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB without failures");
  })
  .catch((err) => console.log(err.reason));