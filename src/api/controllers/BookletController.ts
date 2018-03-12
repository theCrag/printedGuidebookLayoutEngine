import { Get, JsonController } from 'routing-controllers';

@JsonController('/booklet')
export class BookletController {

    @Get()
    public ping(): any {
        return 'pong';
    }

}
