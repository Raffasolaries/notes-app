import Ajv, {JSONSchemaType} from "ajv";
const ajv = new Ajv();

export interface Note {
 id: string;
 category: string;
 text: string;
}

const NoteSchema: JSONSchemaType<Note> = {
 type: "object",
 properties: {
  id: {type: "string"},
  category: {type: "string"},
  text: {type: "string", nullable: true}
 },
 required: ["id","category","text"],
 additionalProperties: false
}

export const ValidateNote = ajv.compile(NoteSchema);
