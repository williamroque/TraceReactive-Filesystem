import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

export class ChoosePathNode extends BaseNode {
    readonly typeId = 'fs-choose-path';
    readonly displayName = 'Choose Path';
    readonly category = { name: 'I/O', accent: 'fuchsia-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [];

    readonly outputs: OutputDefinition[] = [
        { name: 'Path', outputType: 'fs:path' }
    ];

    readonly properties: PropertyDefinition[] = [
        { 
            name: 'path', 
            label: 'Path', 
            type: 'filepath' as const, 
            defaultValue: '',
            dialogProperties: ['openFile', 'openDirectory'] 
        }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const path = properties['path'] ? String(properties['path']) : '';
        return {
            'Path': path
        };
    }
}
