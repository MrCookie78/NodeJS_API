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

	test("GET /taches/:id avec id existant", async () => {
		const res = await request(app)
			.get("/tache/628b77f07dd18e03f48f4fcf")
			.expect(200)
			.expect("Content-Type", /json/);
		
			const data = JSON.parse(res.text);
			let tache = await Tache.findById("628b77f07dd18e03f48f4fcf");
			tache = JSON.parse(JSON.stringify(tache));
			expect(data).toMatchObject(tache);
	});

	test("GET /taches/:id avec id non existant", async () => {
		const res = await request(app)
			.get("/tache/test")
			.expect(500)
			.expect("Content-Type", /json/);
	});
});