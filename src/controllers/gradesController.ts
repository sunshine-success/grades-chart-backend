import { NextFunction, Request, Response } from "express";
import * as gradesDatasource from "../service/gradesData";

export const getGrades = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const grades = await gradesDatasource.getGradesData();
    res.json(grades);
  } catch (error) {
    next(error);
  }
};

export const updateGrades = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const updatedGrades = req.body;
    if (typeof updatedGrades !== 'object' || updatedGrades === null) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    await gradesDatasource.updateGradesData(updatedGrades);
    res.json({ message: 'Grades updated successfully' });
  } catch (error) {
    console.error('Error updating grades:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
