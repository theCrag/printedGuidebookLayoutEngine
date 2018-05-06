import { exec as execAsync, ExecOptions } from 'child_process';
import { readFile as readFileAsync, writeFile as writeFileAsync } from 'fs';
import * as path from 'path';
import { dir as tmpDir, setGracefulCleanup } from 'tmp';
import { Service } from 'typedi';

import { PdfCreationError } from '../errors/PdfCreationError';

@Service()
export class LaTexService {

    public async createPDF(source: string): Promise<any> {
        const tempDir = await this.createTempDirectory();
        console.log('tempPath', tempDir.path);
        await this.writeFile(path.join(tempDir.path, 'texput.tex'), source);
        const result = await this.compile(tempDir.path, {});
        tempDir.cleanupCallback();
        return result;
    }

    // ----------------------------------------------------
    // Utils
    // ----------------------------------------------------

    private createTempDirectory(): Promise<any> {
        setGracefulCleanup();
        return new Promise<any>((resolve, reject) =>
            tmpDir({ unsafeCleanup: true }, (err, tempPath, cleanupCallback) => (err ? reject(err) : resolve({
                path: tempPath,
                cleanupCallback,
            })))
        );
    }

    private async compile(tempPath: string, options: any): Promise<any> {
        try {
        const command = this.createCommand({});
        await this.exec(command, { cwd: tempPath });
        return this.readFile(path.join(tempPath, 'texput.pdf'));
        } catch {
          throw new PdfCreationError(tempPath);
        }
    }

    private createCommand(options: any): string {
        return [
            '/Library/TeX/texbin/pdflatex',
            '-halt-on-error',
            'texput.tex',
        ].join(' ');
    }

    private exec(command: string, options: ExecOptions): any {
        return new Promise<{ stdout: string; stderr: string }>((resolve, reject) =>
            execAsync(
                command,
                options,
                (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr }))
            )
        );
    }

    private readFile(filePath: string): any {
        return new Promise<Buffer>((resolve, reject) =>
            readFileAsync(filePath, (err, data) => (err ? reject(err) : resolve(data)))
        );
    }

    private writeFile(filePath: string, data: string): any {
        return new Promise<void>((resolve, reject) =>
            writeFileAsync(filePath, data, err => (err ? reject(err) : resolve()))
        );
    }

}
