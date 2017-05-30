const i     = require("bt-cyclejs");
const path  = require("path");

const _path = path.resolve(process.cwd(), "./public222");
console.log(_path);

i.buildWebApp(path.resolve(process.cwd(), "./public222"));