import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { dirname } from '../../utils/PathUtils';

export class CurrentDirectoryNode extends BaseNode {
    readonly typeId = 'fs-current-directory';
    readonly displayName = 'Current Directory';
    readonly category = { name: 'Path', accent: 'indigo-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [];

    readonly outputs: OutputDefinition[] = [
        { name: 'Path', outputType: 'core:path' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p = properties['_currentFilePath'];
        return {
            'Path': p ? dirname(String(p)) : ''
        };
    }
}
