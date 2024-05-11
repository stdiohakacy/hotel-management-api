export interface IStorage {
    uploadFile(objectName: string, file: Buffer, options: any);
    // downloadFile();
}
