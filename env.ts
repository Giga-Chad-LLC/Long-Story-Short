import env from 'env-var';
import dotenv from 'dotenv';

dotenv.config();

export const OPENAI_API_KEY = env
   .get('OPENAI_API_KEY')
   .required()
   .asString();
