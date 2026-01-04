<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file',
                'fileId' => 'required|string',
                'chunkIndex' => 'required|integer',
                'totalChunks' => 'required|integer',
                'fileName' => 'required|string',
            ]);

            $fileId = $request->fileId;
            $chunkFolder = storage_path("app/chunks/{$fileId}");
            
            if (!file_exists($chunkFolder)) {
                mkdir($chunkFolder, 0755, true);
            }

            // Save chunk
            $chunkFile = $chunkFolder . "/chunk_{$request->chunkIndex}";
            $request->file('file')->storeAs("chunks/{$fileId}", "chunk_{$request->chunkIndex}");

            // Check if all chunks received
            $receivedChunks = count(glob($chunkFolder . "/chunk_*"));
            
            if ($receivedChunks == $request->totalChunks) {
                $photo = $this->processUpload($chunkFolder, $request->fileName, $fileId, $request->totalChunks);
                
                return response()->json([
                    'status' => 'success',
                    'photo' => [
                        'id' => $photo->id,
                        'name' => $photo->name,
                        'url' => $photo->url,
                        'size' => $photo->size,
                    ]
                ]);
            }

            return response()->json([
                'status' => 'chunk_received',
                'received' => $receivedChunks,
                'total' => $request->totalChunks
            ]);

        } catch (\Exception $e) {
            Log::error('Upload error:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    private function processUpload($chunkFolder, $fileName, $fileId, $totalChunks)
    {
        Log::info("Processing upload: {$fileName}, {$totalChunks} chunks");

        // Create unique filename
        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueName = time() . '-' . Str::random(10) . '.' . $ext;
        $tempPath = storage_path("app/temp/{$uniqueName}");
        
        // Ensure temp directory exists
        $tempDir = dirname($tempPath);
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        // Merge chunks
        $output = fopen($tempPath, 'wb');
        $totalSize = 0;
        
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkPath = $chunkFolder . "/chunk_{$i}";
            $chunkData = file_get_contents($chunkPath);
            fwrite($output, $chunkData);
            $totalSize += strlen($chunkData);
            unlink($chunkPath);
        }
        
        fclose($output);
        
        // Clean chunk folder
        rmdir($chunkFolder);
        
        // Get file info
        $fileSize = filesize($tempPath);
        $mimeType = mime_content_type($tempPath);
        
        Log::info("File created: {$fileSize} bytes, {$mimeType}, Expected: {$totalSize}");

        // Upload file
        $url = $this->uploadToR2OrLocal($tempPath, $uniqueName, $mimeType);
        
        // Create record
        $photo = Photo::create([
            'name' => $fileName,
            'url' => $url,
            'size' => $fileSize,
            'file_name' => $uniqueName,
        ]);
        
        // Clean temp file
        unlink($tempPath);
        
        Log::info("Upload completed successfully, Photo ID: {$photo->id}");
        return $photo;
    }

    private function uploadToR2OrLocal($filePath, $fileName, $mimeType)
    {
        // First try R2
        $r2Url = $this->uploadToR2($filePath, $fileName, $mimeType);
        
        if ($r2Url) {
            return $r2Url;
        }
        
        // Fallback to local storage
        return $this->uploadToLocal($filePath, $fileName);
    }

    private function uploadToR2($filePath, $fileName, $mimeType)
    {
        try {
            $key = "photos/{$fileName}";
            $fileContent = file_get_contents($filePath);
            $fileSize = strlen($fileContent);
            
            Log::info("Uploading to R2: {$key} ({$fileSize} bytes)");
            
            // Use the simple put method that worked in debug
            // DO NOT use complex options or writeStream
            $result = Storage::disk('r2')->put($key, $fileContent, 'public');
            
            if (!$result) {
                Log::warning("R2 put() returned false");
                return null;
            }
            
            // Generate URL (don't try to check if exists - it might timeout)
            $url = Storage::disk('r2')->url($key);
            
            Log::info("R2 upload appears successful, URL generated: {$url}");
            
            // Return URL even if we can't verify existence due to timeout issues
            return $url;
            
        } catch (\Exception $e) {
            Log::error("R2 upload failed: " . $e->getMessage());
            return null;
        }
    }

    private function uploadToLocal($filePath, $fileName)
    {
        // Store in public directory
        $publicDir = public_path('uploads');
        if (!file_exists($publicDir)) {
            mkdir($publicDir, 0755, true);
        }
        
        $destination = $publicDir . '/' . $fileName;
        copy($filePath, $destination);
        
        $url = url("uploads/{$fileName}");
        Log::info("Stored locally: {$url}");
        
        return $url;
    }
}