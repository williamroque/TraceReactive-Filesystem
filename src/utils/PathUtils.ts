// A minimal path polyfill for the sandbox environment
// Supports Windows and POSIX path formats, detecting the likely environment from the paths provided.

export function isWindows(pathStr: string): boolean {
    return /^[a-zA-Z]:[\\/]/.test(pathStr) || pathStr.includes('\\');
}

export function basename(pathStr: string, ext?: string): string {
    const isWin = isWindows(pathStr);
    const separator = isWin ? /[\\/]/ : /\//;
    const parts = pathStr.split(separator).filter(Boolean);
    if (parts.length === 0) return '';
    const lastPart = parts[parts.length - 1];
    if (isWin && /^[a-zA-Z]:$/.test(lastPart)) return ''; // Just a drive letter
    
    if (ext && lastPart.endsWith(ext)) {
        return lastPart.slice(0, -ext.length);
    }
    return lastPart;
}

export function dirname(pathStr: string): string {
    const isWin = isWindows(pathStr);
    const sep = isWin ? '\\' : '/';
    const parts = pathStr.split(/[\\/]/);
    
    if (parts.length <= 1) {
        if (isWin && /^[a-zA-Z]:$/.test(pathStr)) return pathStr + sep;
        return '.';
    }
    
    parts.pop();
    let dir = parts.join(sep);
    
    // Preserve leading slash on POSIX or C:\ on Windows
    if (!dir && pathStr.startsWith('/')) {
        return '/';
    }
    if (isWin && /^[a-zA-Z]:$/.test(dir)) {
        return dir + sep;
    }
    
    return dir || '.';
}

export function extname(pathStr: string): string {
    const base = basename(pathStr);
    const match = base.match(/\.[^.]+$/);
    return match ? match[0] : '';
}

export function join(...paths: string[]): string {
    if (paths.length === 0) return '.';
    
    const isWin = paths.some(isWindows);
    const sep = isWin ? '\\' : '/';
    const allParts: string[] = [];
    
    for (const p of paths) {
        const parts = p.split(/[\\/]/).filter(Boolean);
        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                if (allParts.length > 0 && allParts[allParts.length - 1] !== '..') {
                    allParts.pop();
                } else {
                    allParts.push('..');
                }
            } else {
                allParts.push(part);
            }
        }
    }
    
    let result = allParts.join(sep);
    
    // Preserve root
    const firstPath = paths[0] || '';
    if (firstPath.startsWith('/')) {
        result = '/' + result;
    } else if (isWin && /^[a-zA-Z]:[\\/]/.test(firstPath)) {
        const match = firstPath.match(/^([a-zA-Z]:)[\\/]/);
        if (match) {
            result = match[1] + sep + result;
        }
    }
    
    return result || '.';
}

export function resolve(...paths: string[]): string {
    // In a strict sandbox, we don't have a true 'cwd'.
    // We treat 'resolve' similarly to join but assuming root if a path is absolute.
    const isWin = paths.some(isWindows);
    const sep = isWin ? '\\' : '/';
    
    let resolvedParts: string[] = [];
    let isAbsolute = false;
    let drivePrefix = '';
    
    for (let i = paths.length - 1; i >= 0; i--) {
        const p = paths[i];
        if (!p) continue;
        
        const parts = p.split(/[\\/]/).filter(Boolean);
        
        if (p.startsWith('/')) {
            isAbsolute = true;
            resolvedParts = parts.concat(resolvedParts);
            break;
        } else if (isWin && /^[a-zA-Z]:[\\/]/.test(p)) {
            isAbsolute = true;
            const match = p.match(/^([a-zA-Z]:)[\\/]/);
            if (match) {
                drivePrefix = match[1];
                // Remove the drive letter from parts as it's handled
                if (parts[0] === drivePrefix) {
                    parts.shift();
                }
            }
            resolvedParts = parts.concat(resolvedParts);
            break;
        } else {
            resolvedParts = parts.concat(resolvedParts);
        }
    }
    
    // Normalize
    const finalParts: string[] = [];
    for (const part of resolvedParts) {
        if (part === '.') continue;
        if (part === '..') {
            if (finalParts.length > 0 && finalParts[finalParts.length - 1] !== '..') {
                finalParts.pop();
            } else if (!isAbsolute) {
                finalParts.push('..');
            }
        } else {
            finalParts.push(part);
        }
    }
    
    let result = finalParts.join(sep);
    if (isAbsolute) {
        if (isWin && drivePrefix) {
            result = drivePrefix + sep + result;
        } else {
            result = '/' + result;
        }
    }
    
    return result || '.';
}
