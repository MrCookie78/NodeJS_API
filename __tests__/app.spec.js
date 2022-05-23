const request = require("supertest");
const app = require("../app");
const { Tache } = require("../mongo");

describe("NodeJS API", () => {
	test("GET /taches", async () => {
		const res = await request(app)
			.get("/taches")
			.expect(200)
			.expect("Content-Type", /json/);
		
			const data = JSON.parse(res.text);
			let taches = await Tache.find({});
			taches = JSON.parse(JSON.stringify(taches));
			expect(data).toMatchObject(taches);
	});
});