let DB: IDBDatabase | null = null;
const DBHandler = window.indexedDB.open("local", 2);
DBHandler.onerror = function () {
  console.log("数据库打开错误");
}
DBHandler.onsuccess = function () {
  DB = DBHandler.result;
  // console.log(DB);
  const table = DB.createObjectStore("setting", {
    keyPath: "name"
  });
  console.log(table);
}
DBHandler.onupgradeneeded = function (e: IDBVersionChangeEvent) {
  console.log(e.target.result);
  if (!DB) return;

  const table = DB.createObjectStore("setting", {
    keyPath: "name"
  });
  const transaction = DB.transaction("setting", "readwrite").objectStore("setting").add({
    name: "interval",
    value: 3600
  });
  transaction.onsuccess = function () {
    console.log("写入成功");

  }
}