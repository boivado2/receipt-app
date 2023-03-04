import joi, {Root} from "joi"

declare module "joi/lib" {
	export interface Root {
		objectId: () => AnySchema;
	}
}


joi.objectId = require("joi-objectid")(joi);