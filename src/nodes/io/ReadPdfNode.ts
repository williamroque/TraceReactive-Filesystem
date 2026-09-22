import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import type { TraceReactiveAPI } from '@tracereactive/types';
import pdfParse from 'pdf-parse';

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
            // Read as base64 to preserve binary data since ipcRenderer and fs over ipc might not handle raw Buffer well without specifying encoding
            // Wait, IPC handles Buffer just fine, but traceReactive.fs.readFile requires encoding.
            // Let's request base64 and convert it to a Uint8Array or Buffer
            const dataBase64 = await traceReactive.fs.readFile(p, 'base64' as any);
            
            // Atob to binary string
            const binaryString = atob(dataBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Pass the buffer equivalent to pdf-parse
            const pdfData = await pdfParse(Buffer.from(bytes));
            
            return { 'Content': pdfData.text };
        } catch (err) {
            console.error('ReadPdfNode error', err);
            return { 'Content': '' };
        }
    }
}
