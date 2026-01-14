export class StudentEnrolledEvent {
  constructor(
    public readonly studentId: string,
    public readonly batchId: string,
  ) {}
}

export const STUDENT_ENROLLED_EVENT = 'student.enrolled'
