import request from "supertest";
import { test, expect, beforeAll, afterAll, describe, it, beforeEach } from "vitest";
import { app } from "../app";
import { execSync } from "child_process";

beforeAll(async () => {
    await app.ready()
})

beforeEach(() => {
	execSync('npm run knex migrate:rollback --al')
	execSync('npm run knex migrate:latest')
})

afterAll(async () => {
    await app.close()
})

describe('Rotas de transações', () => {

	test("o usuario consegue criar uma transação", async () => {
		await request(app.server).post("/transactions").send({
			title: "Freelance3",
			amount: 2000,
			type: "credit",
		}).expect(201)
	});

	it('listar as transações', async () => {
		const createTransactionResponse = await request(app.server).post("/transactions").send({
			title: "Freelance3",
			amount: 2000,
			type: "credit",
		})

		const cookies = createTransactionResponse.get('Set-Cookie')!

		const listTransactionsRespose = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

		expect(listTransactionsRespose.body.transactions).toEqual([expect.objectContaining({title: "Freelance3",
		amount: 2000,})])
	})

	it('listar transação específica', async () => {
		const createTransactionResponse = await request(app.server).post("/transactions").send({
			title: "Freelance3",
			amount: 2000,
			type: "credit",
		})
		const cookies = createTransactionResponse.get('Set-Cookie')!
		const listTransactionsRespose = await request(app.server).get(`/transactions`).set('Cookie', cookies).expect(200)
		const transactionId = listTransactionsRespose.body.transactions[0].id
		const transactionResponse = await request(app.server).get(`/transactions/${transactionId}`).set('Cookie', cookies).expect(200)

		expect(transactionResponse.body.transaction).toEqual(expect.objectContaining({title: "Freelance3",
		amount: 2000,}))
	})

	test('pegar resumo', async () => {
		const createTransactionResponse = await request(app.server).post("/transactions").send({
			title: "credit transaction",
			amount: 3000,
			type: "credit",
		})

		const cookies = createTransactionResponse.get('Set-Cookie')!

		await request(app.server).post("/transactions").set('Cookie', cookies).send({
			title: "debit transaction",
			amount: 2000,
			type: "debit",
		})
		

		const summaryRespose = await request(app.server).get('/transactions/summary').set('Cookie', cookies).expect(200)

		// expect(summaryRespose.body.summary).toEqual({amount: expect.any(Number)})
		expect(summaryRespose.body.summary).toEqual({amount: 1000})
	})
})

