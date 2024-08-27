import { customAlphabet } from "nanoid";

const generateUniqueString = (length) => {
const nanoid = customAlphabet("123445asfg", length || 10);
return nanoid()
}

export default generateUniqueString