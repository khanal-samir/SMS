export class BatchCreatedEvent {
  constructor(
    public readonly batchId: string,
    public readonly batchYear: number,
  ) {}
}

export const BATCH_CREATED_EVENT = 'batch.created'
