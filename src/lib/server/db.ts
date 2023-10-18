import env from "dotenv";
import { Collection, MongoClient } from "mongodb";

export class DB {
	private static uri = "";
	private static async getCredentials(): Promise<void> {
		env.config();

		this.uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:27017/cts?directConnection=true&serverSelectionTimeoutMS=5000`;
	}

	public static async connect(): Promise<Collection<Document>> {
		await this.getCredentials();
		// get the booking table collection

		const client = new MongoClient(this.uri);
		await client.connect();

		return client.db("cts").collection("bookings");
	}

	public static async close(client: MongoClient): Promise<void> {
		await client.close();
	}

	public static async getAllBookings(collection: Collection<Document>): Promise<any> {
		const cursor = collection.find();
		return await cursor.toArray();
	}

	public static async getBookings(collection: Collection<Document>, params: { key: string; value: string }[]): Promise<any> {
		const query: { [key: string]: string | number } = {};
		params.forEach((param) => {
			if (!isNaN(Number(param.value))) {
				query[param.key] = Number(param.value);
				return;
			}
			query[param.key] = param.value;
		});
		const cursor = collection.find(query);
		return await cursor.toArray();
	}
}
