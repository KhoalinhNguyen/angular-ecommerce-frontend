import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    // whitespace validation
    static notOnlyWhiteSpace(formControl: FormControl) : ValidationErrors | null {

        // check if string only have whitespace
        if((formControl.value != null) && (formControl.value.trim().length === 0)) {

            // invalid, return error object (validation error key in '')
            return {'notOnlyWhiteSpace' : true };
        } else {
            // valid, return null
            return null;
        }
    }
}
