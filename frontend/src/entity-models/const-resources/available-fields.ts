import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { TaskFieldType } from 'src/core/models/task/task-field-types';

export const AvailableFields: TaskCustomField[] = [
    { name: 'Text', type: TaskFieldType.Text }, 
    { name: 'Paragraph', type: TaskFieldType.Paragraph }, 
    { name: 'Number', type: TaskFieldType.Number },
    { name: 'Label', type: TaskFieldType.Label }, 
    { name: 'User', type: TaskFieldType.User }, 
    { name: 'Date', type: TaskFieldType.Date },
    { name: 'Dropdown', type: TaskFieldType.Dropown },
    { name: 'Check box', type: TaskFieldType.CheckBox } ];
