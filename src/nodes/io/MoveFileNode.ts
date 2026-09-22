import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

import { basename, join } from '../../utils/PathUtils';

export class MoveFileNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-move-file';
    readonly displayName = 'Move File';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Source', acceptsType: 'core:path' },
        { name: 'Destination', acceptsType: 'core:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Success', outputType: 'core:boolean' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const srcInput = inputs['Source'];
        const destInput = inputs['Destination'];
        
        if (!srcInput || !destInput) return { 'Success': false };
        
        const sources: string[] = Array.isArray(srcInput) ? srcInput : [String(srcInput)];
        const isDestArray = Array.isArray(destInput);
        const destinations: string[] = isDestArray ? destInput : [];
        const scalarDestDir = !isDestArray ? String(destInput) : '';

        if (isDestArray && destinations.length !== sources.length) {
            console.error('MoveFile error: Destination array length must match Source array length.');
            return { 'Success': false };
        }

        try {
            for (let i = 0; i < sources.length; i++) {
                const srcPath = String(sources[i]);
                let destPath = '';
                
                if (isDestArray) {
                    destPath = String(destinations[i]);
                } else {
                    let destIsDirectory = false;
                    try {
                        const stat = await traceReactive.fs.stat(scalarDestDir);
                        if (stat.isDirectory) {
                            destIsDirectory = true;
                        }
                    } catch {
                        if (scalarDestDir.endsWith('/') || scalarDestDir.endsWith('\\')) {
                            destIsDirectory = true;
                        }
                    }

                    if (destIsDirectory) {
                        destPath = join(scalarDestDir, basename(srcPath));
                    } else {
                        destPath = scalarDestDir;
                    }
                }

                await traceReactive.fs.move(srcPath, destPath);
            }
            return { 'Success': true };
        } catch (err) {
            console.error('MoveFile error', err);
            return { 'Success': false };
        }
    }
}
