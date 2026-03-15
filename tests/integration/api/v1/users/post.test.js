/* eslint-disable no-undef */
import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import database from "infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const users = await database.query("SELECT * FROM users")
      console.log(users.rows)

      const response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "teste",
            email: "teste@gmail.com",
            password: "senha_segura"
          })
        },
      );
      expect(response.status).toBe(201);

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'teste',
        email: 'teste@gmail.com',
        password: 'senha_segura',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNan
      expect(Date.parse(responseBody.updated_at)).not.toBeNan
    });
  });
});
