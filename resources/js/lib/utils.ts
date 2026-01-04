import axios from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {route} from "ziggy-js";
const CHUNK_SIZE = 2 * 1024 * 1024;
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  export async function uploadFileInChunks(file, onProgress = () => {}) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${file.name}-${file.size}-${Date.now()}`;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("fileId", fileId);
        formData.append("chunkIndex", Number(chunkIndex));
        formData.append("totalChunks", Number(totalChunks));
        formData.append("fileName", file.name);

        await axios.post(route("upload.chunk"), formData, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    ((chunkIndex + progressEvent.loaded / progressEvent.total) / totalChunks) * 100
                );
                onProgress(percentCompleted);
            },
        });
    }
}

export async function uploadMultipleFiles(files, onFileProgress) {
    for (let i = 0; i < files.length; i++) {
        await uploadFileInChunks(files[i], (progress) => {
            onFileProgress(i, progress);
        });
    }
}
