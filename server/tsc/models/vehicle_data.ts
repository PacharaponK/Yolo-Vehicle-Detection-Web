import { RowDataPacket } from "mysql2";

export default interface Ivehicle extends RowDataPacket {
	id: number;
	class: string;
	date: string;
	time: string;
}
