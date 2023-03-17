import * as validators from '../helpers/validator';
import { IPost } from '../interface';

export class PostValidator extends validators.Validator {
    constructor(data: IPost) {
        super(data);
        this.data.content = this.checkContent(
            decodeURIComponent(
                encodeURIComponent(data.content)
                    .replace(/%CC(%[A-Z0-9]{2})+%20/g, ' ')
                    .replace(/%CC(%[A-Z0-9]{2})+(\w)/g, '$2')
            )
        );
    }
    checkContent(content: any) {
        const validator = new validators.ContentValidator(content, {
            max_length: 400,
        });
        if (validator.errors) this.errors += `content:${validator.errors},`;
        return validator.data;
    }
}
