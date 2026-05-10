/* eslint-disable no-undef */
import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const responsePost = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmo.case@email.com",
          password: "senha123",
        }),
      });

      expect(responsePost.status).toBe(201);

      const responseGet = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(responseGet.status).toBe(200);

      const responseGetBody = await responseGet.json();

      expect(responseGetBody).toEqual({
        id: responseGetBody.id,
        username: "MesmoCase",
        email: "mesmo.case@email.com",
        password: "senha123",
        created_at: responseGetBody.created_at,
        updated_at: responseGetBody.updated_at,
      });

      expect(uuidVersion(responseGetBody.id)).toBe(4);
      expect(Date.parse(responseGetBody.created_at)).not.toBeNan;
      expect(Date.parse(responseGetBody.updated_at)).not.toBeNan;
    });

    test("With case mismatch", async () => {
      const responsePost = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case.diferente@email.com",
          password: "senha123",
        }),
      });

      expect(responsePost.status).toBe(201);

      const responseGet = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(responseGet.status).toBe(200);

      const responseGetBody = await responseGet.json();

      expect(responseGetBody).toEqual({
        id: responseGetBody.id,
        username: "CaseDiferente",
        email: "case.diferente@email.com",
        password: "senha123",
        created_at: responseGetBody.created_at,
        updated_at: responseGetBody.updated_at,
      });

      expect(uuidVersion(responseGetBody.id)).toBe(4);
      expect(Date.parse(responseGetBody.created_at)).not.toBeNan;
      expect(Date.parse(responseGetBody.updated_at)).not.toBeNan;
    });

    test("With case mismatch", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
    });
  });
});
