async function fetchItems() {
  const res = await fetch("/api/items");
  return res.json();
}

async function addItem(title) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error("No se pudo crear");
  return res.json();
}

async function deleteItem(id) {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo borrar");
}

function render(items) {
  const list = document.getElementById("list");
  list.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.title}</span><button data-id="${item.id}">X</button>`;
    list.appendChild(li);
  }
}

async function refresh() {
  const items = await fetchItems();
  render(items);
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("title");
  await addItem(input.value);
  input.value = "";
  await refresh();
});

document.getElementById("list").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  await deleteItem(e.target.dataset.id);
  await refresh();
});

refresh();
