// IMPORTS ////////////////////////////////////
import { useVuelidate } from '@vuelidate/core';
import { translate } from './translate';
import { capitalize } from './strings';
//
// CLASS
//
export const validation = {
    validate: async ({ id, model, rules }: { id?: string; model: any; rules: any }) => {
        let finalRules: any = {};
        // Is possible that exixts hidden inputs. Theses inputs are marked with the class no-rule-{name} and not are validated
        // This is because the hidden inputs are not rendered and the validation fails
        // This code remove the hidden inputs from the rules
        Object.keys(rules).forEach(key => {
            const classRule = `no-rule-${key}`.replaceAll('.', '-');
            const element = document.querySelector(`.${classRule}`);

            if (!element) {
                finalRules[key] = rules[key];
            }
        });

        // filter finalRules if key no exists in DOM element data-model
        finalRules = Object.keys(finalRules).reduce((acc: { [key: string]: any }, key) => {
            const element = document.querySelector(`[data-model="${key}"]`);
            if (element) {
                acc[key] = finalRules[key];
            }
            return acc;
        }, {});

        const validation = useVuelidate(finalRules, model);
        const result = await validation.value.$validate();

        // if exists id, remove the errors from the form
        // if not exists, remove all errors
        if (id) {
            const errors = document.querySelectorAll(`#${id} .error-message`);
            errors?.forEach(error => {
                error.remove();
            });
        } else {
            const errors = document.querySelectorAll('.error-message');
            errors?.forEach(error => {
                error.remove();
            });
        }

        // remove all errors from the form
        document.querySelectorAll('.element-with-error').forEach(element => {
            element.classList.remove('element-with-error');
        });

        if (validation.value.$errors.length > 0) {
            const inserts: string[] = [];
            validation.value.$errors.forEach((error: any) => {
                if (inserts.includes(error.$propertyPath)) return;

                if (id) {
                    const element = document.querySelector(`#${id} [data-model="${error.$propertyPath}"]`);
                    const description = capitalize(translate.t(error.$message.toLowerCase()));
                    const span = document.createElement('span');
                    element?.classList.add('element-with-error');
                    span.classList.add('error-message');
                    span.innerText = description;
                    element?.appendChild(span);
                    inserts.push(error.$propertyPath);
                } else {
                    const element = document.querySelector(`[data-model="${error.$propertyPath}"]`);
                    const description = capitalize(translate.t(error.$message.toLowerCase()));
                    const span = document.createElement('span');

                    element?.classList.add('element-with-error');
                    span.classList.add('error-message');
                    span.innerText = description;
                    element?.appendChild(span);
                    inserts.push(error.$propertyPath);
                }
            });
        }

        return result;
    },

    validateElement: async ({ element, model, rules }: { element?: any; model: any; rules: any }) => {
        const finalRules: any = {};
        const elementModelKey = element?.getAttribute('data-model');

        if (!element) return;

        element.querySelectorAll('.element-with-error').forEach((error: { classList: { remove: (arg0: string) => void } }) => {
            error.classList.remove('element-with-error');
        });

        // remove all rules when name != inputModel
        Object.keys(rules).forEach(key => {
            if (key === elementModelKey) {
                finalRules[key] = rules[key];
            }
        });

        const validation = useVuelidate(finalRules, model);
        const result = await validation.value.$validate();

        const errors = element?.querySelectorAll('.error-message');
        errors?.forEach((error: { remove: () => void }) => {
            error.remove();
        });

        if (validation.value.$errors.length > 0) {
            const inserts: string[] = [];
            validation.value.$errors.forEach((error: any) => {
                if (inserts.includes(error.$propertyPath)) return;

                const description = capitalize(translate.t(error.$message));
                const span = document.createElement('span');

                span.classList.add('error-message');
                span.innerText = description;
                element?.appendChild(span);
                inserts.push(error.$propertyPath);
            });
        }

        return result;
    },
};
