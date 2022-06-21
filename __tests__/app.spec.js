const request = require("supertest");
const app = require("../app");
const {createTache, createUser, Tache, User} = require("../mongo");

let tacheTest = {};
let userTest = {};
let token = "";

describe("NodeJS API", () => {

	// beforeAll(() => { /* console.log("beforeAll") */ });
	// afterEach(() => { /* console.log("afterAll") */ });
	// beforeEach(() => { /* console.log("beforeEach") */ });
	afterAll(async () => { 
		if(userTest._id){
			await User.findByIdAndDelete(userTest._id);
		}
	});

	describe("Route /signup", () => {

		test("Method GET \t-> Undefined method", async () => {
			const res = await request(app)
				.get("/signup")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method PUT \t-> Undefined method", async () => {
			const res = await request(app)
				.put("/signup")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method DELETE \t-> Undefined method", async () => {
			const res = await request(app)
				.delete("/signup")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method POST \t-> Valid DATA", async () => {
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
	
		test("Method POST \t-> Email already exist", async () => {
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

		test.each([	
			{ email: 123, username: 1, motdepasse: 1 }, 
			{ email: "A1Z2E3R4@A1Z2E3R4.fr", username: "1", motdepasse: "1" },
			{ email: "A1Z2E3R4@A1Z2E3R4.fr" },
			{ username: "1" },
			{ motdepasse: "fauxMotDePasse" },
			{}
		])("Method POST \t-> Invalid DATA : Should refuse %p. ", async (invalidObject) => {
				const result = await request(app)
				.post("/signup")
				.send(invalidObject)
				.expect(400);
			}
		);

	});

	describe("Route /login", () => {

		test("Method GET \t-> Undefined method", async () => {
			const res = await request(app)
				.get("/login")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method PUT \t-> Undefined method", async () => {
			const res = await request(app)
				.put("/login")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method DELETE \t-> Undefined method", async () => {
			const res = await request(app)
				.delete("/login")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method POST \t-> Valid DATA", async () => {
			const res = await request(app)
			.post("/login")
			.send({
				email: "test@test.fr",
				motdepasse: "test"
			})
			.expect(200)
			.expect("Content-Type", /json/);
			const data = JSON.parse(res.text);
				expect(res.header['x-auth-token']);
				expect(data.username).toBe("test");
				token = res.header['x-auth-token'];
			});

		test.each([	
			{ email: "fauxmail@test.fr", motdepasse: "test" }, 
			{ email: "test@test.fr", motdepasse: "fauxMotDePasse" },
			{ email: "test@test.fr" },
			{ motdepasse: "fauxMotDePasse" },
			{}
		])("Method POST \t-> Invalid DATA : Should refuse %p. Invalid DATA", async (invalidObject) => {
			const result = await request(app)
				.post("/login")
				.send(invalidObject)
				.expect(400);
			}
		);
	
	});

	describe("Route /me", () => {
		test("Method GET \t-> Valid token", async () => {
			const res = await request(app)
				.get("/me")
				.set('x-auth-token', token)
				.expect(200)
				.expect("Content-Type", /json/);
			const data = JSON.parse(res.text);
			let user = await User.findById(userTest._id);
			user = JSON.parse(JSON.stringify(user));
			expect(user.username).toBe("test");
		});
	});

	describe("Route /taches", () => {

		test("Method GET\t", async () => {
			const res = await request(app)
				.get("/taches")
				.expect(200)
				.expect("Content-Type", /json/);
			
				const data = JSON.parse(res.text);
				let taches = await Tache.find({});
				taches = JSON.parse(JSON.stringify(taches));
				expect(data).toMatchObject(taches);
		});

		test("Method PUT \t-> Undefined method", async () => {
			const res = await request(app)
				.put("/taches")
				.expect(404)
				.expect("Content-Type", /html/);
		});
		
		test("Method POST \t-> Undefined method", async () => {
			const res = await request(app)
				.post("/taches")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method DELETE \t-> Undefined method", async () => {
			const res = await request(app)
				.delete("/taches")
				.expect(404)
				.expect("Content-Type", /html/);
		});

	});

	describe("Route /tache", () => {

		test("Method GET \t-> Undefined method", async () => {
			const res = await request(app)
				.get("/tache")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method PUT \t-> Undefined method", async () => {
			const res = await request(app)
				.put("/tache")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method DELETE \t-> Undefined method", async () => {
			const res = await request(app)
				.delete("/tache")
				.expect(404)
				.expect("Content-Type", /html/);
		});

		test("Method POST \t-> Valid DATA and Valid token", async () => {
			const res = await request(app)
				.post("/tache")
				.send({
					description: "test",
					faite: true
				})
				.set('x-auth-token', token)
				.expect(201)
				.expect("Content-Type", /json/);
			const data = JSON.parse(res.text);
			let tache = await Tache.findById(data._id);
			tache = JSON.parse(JSON.stringify(tache));
			expect(tache.description).toBe("test");
			tacheTest = tache;
		});

		test("Method POST \t-> Valid DATA and Unvalid token", async () => {
			const res = await request(app)
				.post("/tache")
				.send({
					description: "test",
					faite: true
				})
				.set('x-auth-token', "123")
				.expect(400)
				.expect("Content-Type", /json/);
		});

		test("Method POST \t-> Valid DATA without token", async () => {
			const res = await request(app)
				.post("/tache")
				.send({
					description: "test",
					faite: true
				})
				.expect(401)
				.expect("Content-Type", /json/);
		});
	
		test("Method POST \t-> Invalid DATA", async () => {
			const res = await request(app)
				.post("/tache")
				.send({
					description: "test"
				})
				.set('x-auth-token', token)
				.expect(400)
				.expect("Content-Type", /json/);
		});

	})
	
	describe("Route /tache/:id", () => {

		test("Method GET \t-> Valid ID", async () => {
			const res = await request(app)
				.get("/tache/" + tacheTest._id)
				.expect(200)
				.expect("Content-Type", /json/);
			
				const data = JSON.parse(res.text);
				let tache = await Tache.findById(tacheTest._id);
				tache = JSON.parse(JSON.stringify(tache));
				expect(data).toMatchObject(tache);
		});
	
		test("Method GET \t-> undefined ID", async () => {
			const res = await request(app)
				.get("/tache/dvfdscnjodz")
				.expect(404)
				.expect("Content-Type", /json/);
		});

		test("Method PUT \t-> Valid ID and Valid DATA", async () => {
			const response = await request(app)
				.put("/tache/" + tacheTest._id)
				.send({
					description: "test modifié",
				})
				.expect(200)
				.expect("Content-Type", /json/);
			const data_1 = JSON.parse(response.text);
			expect(data_1.description).toBe("test modifié");
		});
	
		test("Method PUT \t-> Invalid ID", () => {
			return request(app)
				.put("/tache/incorrectTest")
				.send({
					description: "test modifié",
				})
				.expect(404)
				.expect("Content-Type", /json/);
		});
	
		test("Method PUT \t-> Invalid DATA", () => {
			return request(app)
				.put("/tache/" + tacheTest._id)
				.send({
					desc: "test modifié",
				})
				.expect(400)
				.expect("Content-Type", /json/);
		});

		test("Method DELETE \t-> Valid ID and Valid token", () => {
			return request(app)
			.delete("/tache/" + tacheTest._id)
			.set('x-auth-token', token)
			.expect(200)
			.expect("Content-Type", /json/);
		});

		test("Method DELETE \t-> Invalid ID and Valid token", () => {
			return request(app)
			.delete("/tache/hfdjshdsi")
			.set('x-auth-token', token)
			.expect(404)
			.expect("Content-Type", /json/);
		});

		test("Method DELETE \t-> Valid ID and invalid token", () => {
			return request(app)
			.delete("/tache/" + tacheTest._id)
			.set('x-auth-token', "aze")
			.expect(400)
			.expect("Content-Type", /json/);
		});

		test("Method DELETE \t-> Valid ID without token", () => {
			return request(app)
			.delete("/tache/" + tacheTest._id)
			.expect(401)
			.expect("Content-Type", /json/);
		});

		test("Method POST \t-> Undefined method", () => {
			return request(app)
			.post("/tache/hfdis")
			.expect(404)
			.expect("Content-Type", /html/);
		});

	});

});