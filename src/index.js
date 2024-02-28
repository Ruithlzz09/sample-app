const { tom, templateCache } = require("./cache");
const main = async () => {
  try {
    const key = "hype";
    const value = "hypeMan";
    await tom.saveToCache(key,value);
    await tom
      .getFromCache(key)
      .then((data) => console.log(`data found for key ${key} is ${data}`))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

main();
