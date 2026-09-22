import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { basename } from '../../utils/PathUtils';

export class PathBasenameNode extends BaseNode {
    readonly typeId = 'fs-path-basename';
    readonly displayName = 'Path Basename';
    readonly category = { name: 'Path', accent: 'indigo-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path', acceptsType: 'core:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Basename', outputType: 'core:string' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'removeExtension', label: 'Remove Extension', type: 'string' as const, defaultValue: '' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p = inputs['Path'] ? String(inputs['Path']) : '';
        const extension = properties['removeExtension'] as string;
        return { 'Basename': basename(p, extension || undefined) };
    }
}
