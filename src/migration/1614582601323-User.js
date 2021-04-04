const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class User1614582601323 {
	name = 'User1614582601323';

	async up(queryRunner) {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL,"firstName" text NOT NULL,"lastName","role" text NOT NULL, text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(`DROP TABLE "user"`);
	}
};
