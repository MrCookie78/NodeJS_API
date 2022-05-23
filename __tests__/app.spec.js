const request = require("supertest");
const app = require("../app");
const { deleteTache, Tache } = require("../mongo");

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
			.expect(404)
			.expect("Content-Type", /json/);
	});

	test("POST /tache DATA OK", async () => {
		const res = await request(app)
			.post("/tache")
			.send({
				description: "test",
				faite: true
			})
			.expect(201)
			.expect("Content-Type", /json/);
		const data = JSON.parse(res.text);
		let tache = await Tache.findById(data._id);
		tache = JSON.parse(JSON.stringify(tache));
		expect(tache.description).toBe("test");
		deleteTache(tache._id);
	});

	test("POST /tache DATA pas OK", async () => {
		const res = await request(app)
			.post("/tache")
			.send({
				description: "test"
			})
			.expect(400)
			.expect("Content-Type", /json/);
	});
});