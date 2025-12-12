const request = require("supertest");
const app = require("../src/app");

test("GET /health -> ok", async () => {
  const res = await request(app).get("/health");
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("ok");
});

test("CRUD básico de items", async () => {
  const create = await request(app).post("/api/items").send({ title: "Mi tarea" });
  expect(create.statusCode).toBe(201);

  const list = await request(app).get("/api/items");
  expect(list.statusCode).toBe(200);
  expect(Array.isArray(list.body)).toBe(true);

  const id = create.body.id;
  const del = await request(app).delete(`/api/items/${id}`);
  expect(del.statusCode).toBe(200);
});
