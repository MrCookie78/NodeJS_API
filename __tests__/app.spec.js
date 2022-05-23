const request = require("supertest");
const app = require("../app");
const {createTache, createUser, Tache, User} = require("../mongo");

let tacheTest = {};
let userTest = {};

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

	test("DELETE /tache/:id - Valid ID", () => {
		return request(app)
			.delete("/tache/" + tacheTest._id)
			.expect(200)
			.expect("Content-Type", /json/);
	});

	test("DELETE /tache/:id - Invalid ID", () => {
		return request(app)
			.delete("/tache/InvalidId")
			.expect(404)
			.expect("Content-Type", /json/);
	});

	test("POST /signin Valid DATA", async () => {
		const res = await request(app)
			.post("/signup")
			.send({
				email: "test@test.fr",
				username: "test",
				motdepasse: "test"
			})
			.expect(201)
			.expect("Content-Type", /json/);
		const data = JSON.parse(res.text);
		expect(data.email).toBe("test@test.fr");

		let user = await User.findOne({email: data.email, username: data.username});
		userTest = user;
	});

	test("POST /signin email already exist", async () => {
		const res = await request(app)
			.post("/signup")
			.send({
				email: "test@test.fr",
				username: "test2",
				motdepasse: "test2"
			})
			.expect(400)
			.expect("Content-Type", /html/);
	});

	test("POST /signup Invalid DATA", async () => {
		const res = await request(app)
			.post("/signup")
			.send({
				email: "test@test.fr",
				username: "test"
			})
			.expect(400)
			.expect("Content-Type", /json/);
	});

	test.each([	
							{ email: "fauxmail@test.fr", motdepasse: "test" }, 
							{ email: "test@test.fr", motdepasse: "fauxMotDePasse" },
							{ email: "test@test.fr" },
							{ motdepasse: "fauxMotDePasse" },
							{}
						])(
    "POST /signin Should refuse %p. Invalid DATA",
    async (invalidObject) => {
      const result = await request(app)
        .post("/signin")
        .send(invalidObject)
        .expect(400);
    }
  );

	test("POST /signin Valid DATA", async () => {
		const res = await request(app)
			.post("/signin")
			.send({
				email: "test@test.fr",
				motdepasse: "test"
			})
			.expect(200)
			.expect("Content-Type", /json/);
		const data = JSON.parse(res.text);
		expect(res.header['x-auth-token']);
		expect(data.username).toBe("test");
		await User.findByIdAndDelete(userTest._id);
	});

});