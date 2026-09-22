import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import type { TraceReactiveAPI } from '@tracereactive/types';
import pdfParse from 'pdf-parse';
import { Buffer } from 'buffer';

declare const traceReactive: TraceReactiveAPI;

export class ReadPdfNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-read-pdf';
    readonly displayName = 'Read PDF Text';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path', acceptsType: 'core:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Content', outputType: 'core:string' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p = inputs['Path'] ? String(inputs['Path']) : '';
        if (!p) return { 'Content': '' };
        
        try {
            const dataBase64 = await traceReactive.fs.readFile(p, 'base64' as any);
            const pdfData = await pdfParse(Buffer.from(dataBase64, 'base64'));
            
            return { 'Content': pdfData.text };
        } catch (err) {
            console.error('ReadPdfNode error', err);
            return { 'Content': '' };
        }
    }
}
