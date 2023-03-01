
function name() {
    console.log("Hello World");
    console.log(process.argv)
  }
  if (process.argv[2] === "name") {
    name();
  }

