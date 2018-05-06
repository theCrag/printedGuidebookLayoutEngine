import { HttpError } from 'routing-controllers';

export class PdfCreationError extends HttpError {
    constructor(path: string) {
        super(400, `Could not create pdf (${path}).`);
    }
}
