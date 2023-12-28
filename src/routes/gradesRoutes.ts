import express from 'express';
import { getGrades,updateGrades } from '../controllers/gradesController';

export const gradesRouter = express.Router();

gradesRouter.get('/', getGrades);

gradesRouter.put('/', updateGrades);