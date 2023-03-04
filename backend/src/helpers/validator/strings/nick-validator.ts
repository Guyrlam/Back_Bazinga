import { RegexValidator } from './regex-validator';

export class NickValidator extends RegexValidator {
    protected override get regexp() {
        return /^[a-zA-Z0-9]\w*$/gm;
    }
}