window.onload = async function () {
  let x = document.querySelector("#xml");
  let y = document.querySelector("#json");
  try {
    var res1 = await fetch("http://localhost:3000/data.json", {
      method: "GET",
    });
    if (res1.ok) {
      let json = await res1.json();
      y.textContent = JSON.stringify(json);
      console.log("JSON passed:" + JSON.stringify(json));
    }

    var res2 = await fetch("http://localhost:3000/data.xml", {
      method: "GET",
    });
    if (res2.ok) {
      let xml = await res2.text();
      x.textContent = xml;
      console.log("XML passed:" + xml);
    }
  } catch {
    console.log("Ошибка JSON: " + res1.status);
    console.log("Ошибка XML: " + res2.status);
  }
};
