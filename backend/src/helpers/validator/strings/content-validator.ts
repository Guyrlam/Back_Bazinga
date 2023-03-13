import { RegexValidator } from './regex-validator';

export class ContentValidator extends RegexValidator {
    protected override get regexp() {
        return /\b\w/gim;
    }
}