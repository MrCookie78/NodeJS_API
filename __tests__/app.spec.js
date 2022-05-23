const request = require("supertest");
const app = require("../app");
const { createTache, Tache } = require("../mongo");

let tacheTest = {};

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

	test("POST /tache DATA valid", async () => {
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
		tacheTest = tache;
		// await Tache.findByIdAndDelete(tache._id);
	});

	test("POST /tache DATA invalid", async () => {
		const res = await request(app)
			.post("/tache")
			.send({
				description: "test"
			})
			.expect(400)
			.expect("Content-Type", /json/);
	});

	test("PUT /tache/:id - [OK]", () => {
		return request(app)
			.put("/tache/" + tacheTest._id)
			.send({
				description: "test modifié",
			})
			.expect(200)
			.expect("Content-Type", /json/)
			.then((response) => {
				const data = JSON.parse(response.text);
				expect(data.description).toBe("test modifié");
			});
	});

	test("PUT /tache/:id - Invalid ID", () => {
		return request(app)
			.put("/tache/incorrectTest")
			.send({
				description: "test modifié",
			})
			.expect(404)
			.expect("Content-Type", /json/);
	});

	test("PUT /tache/:id - Invalid DATA", () => {
		return request(app)
			.put("/tache/" + tacheTest._id)
			.send({
				desc: "test modifié",
			})
			.expect(400)
			.expect("Content-Type", /json/);
	});
});