export interface TaskTemplate {
    id: number,
    textFieldCount?: number,
    paragraphFieldCount?: number,
    labelFieldCount?: number,
    userFieldCount?: number,
    numberFieldCount?: number,
    dropdownFieldCount?: number,
    checkboxFieldCount?: number,
    dateFieldCount?: number,

    customDescriptionFields: string[],
    customContextFields: string[],
}