const { mainWrapper } = require("./helper");
const main = null;
const payload = null; // Optional payload for method call

const inputs = {
  method: main,
  payload,
  isAsync: true,
  delay: 1000,
};

// Call mainWrapper with provided method, payload, and isAsync flag
mainWrapper(...Object.values(inputs)).then((response) => {
  // Process exit code based on the presence of an error
  console.log(response);
  if (response.error){
    console.log(error)
  }
  process.exit(response.error ? 1 : 0);
});
