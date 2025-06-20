
import { supabase } from '@/integrations/supabase/client';

interface DeploymentFile {
  filename: string;
  content: string;
  path: string;
}

interface DeploymentResult {
  success: boolean;
  deployed: number;
  failed: number;
  errors: string[];
  storageUrls?: string[];
}

export class RealFileSystemDeployment {
  private bucketName: string = 'seo-files';

  setBucketName(bucketName: string): void {
    this.bucketName = bucketName;
    console.log(`📂 Real deployment bucket set to: ${bucketName}`);
  }

  async deployFiles(files: DeploymentFile[], manifest?: any): Promise<DeploymentResult> {
    try {
      console.log('🚀 Starting real file system deployment to Supabase Storage...');
      console.log(`📄 Deploying ${files.length} files to bucket: ${this.bucketName}`);

      // Ensure bucket exists
      await this.ensureBucketExists();

      const results = {
        success: true,
        deployed: 0,
        failed: 0,
        errors: [] as string[],
        storageUrls: [] as string[]
      };

      // Deploy each file to Supabase Storage
      for (const file of files) {
        try {
          const filePath = `seo/${file.filename}`;
          
          // Upload file to Supabase Storage
          const { data, error } = await supabase.storage
            .from(this.bucketName)
            .upload(filePath, file.content, {
              contentType: 'text/html',
              upsert: true // Replace existing files
            });

          if (error) {
            throw error;
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);

          results.storageUrls.push(publicUrlData.publicUrl);
          console.log(`✅ Deployed: ${file.filename} to ${publicUrlData.publicUrl}`);
          results.deployed++;
        } catch (error) {
          const errorMessage = `Failed to deploy ${file.filename}: ${error.message}`;
          console.error(`❌ ${errorMessage}`);
          results.errors.push(errorMessage);
          results.failed++;
          results.success = false;
        }
      }

      // Deploy manifest if provided
      if (manifest) {
        try {
          const manifestPath = 'seo/seo-deployment-manifest.json';
          const { error } = await supabase.storage
            .from(this.bucketName)
            .upload(manifestPath, JSON.stringify(manifest, null, 2), {
              contentType: 'application/json',
              upsert: true
            });

          if (error) throw error;

          const { data: manifestUrl } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(manifestPath);

          console.log(`📋 Deployment manifest uploaded to: ${manifestUrl.publicUrl}`);
        } catch (error) {
          console.error(`❌ Failed to upload manifest: ${error.message}`);
          results.errors.push(`Failed to upload manifest: ${error.message}`);
        }
      }

      console.log('📊 Supabase Storage Deployment Summary:');
      console.log(`   Deployed: ${results.deployed}`);
      console.log(`   Failed: ${results.failed}`);
      console.log(`   Success: ${results.success}`);

      return results;

    } catch (error) {
      console.error('❌ Supabase Storage deployment failed:', error);
      return {
        success: false,
        deployed: 0,
        failed: files.length,
        errors: [error.message]
      };
    }
  }

  async verifyDeployment(expectedFiles: string[]): Promise<boolean> {
    console.log('🔍 Verifying Supabase Storage deployment...');
    
    try {
      // List files in the seo folder
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('seo');

      if (error) {
        console.error('❌ Storage verification failed:', error);
        return false;
      }

      const uploadedFiles = data?.map(file => file.name) || [];
      const missingFiles = expectedFiles.filter(file => !uploadedFiles.includes(file));

      if (missingFiles.length > 0) {
        console.error(`❌ Missing files in storage: ${missingFiles.join(', ')}`);
        return false;
      }

      console.log(`📋 Verified ${uploadedFiles.length} files in storage`);
      console.log('✅ Supabase Storage deployment verification completed');
      return true;
    } catch (error) {
      console.error('❌ Storage deployment verification failed:', error);
      return false;
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('Could not list buckets:', listError);
        return;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        console.log(`📦 Creating bucket: ${this.bucketName}`);
        
        // This will typically fail in the frontend due to permissions
        // The bucket should be created manually or via the dashboard
        console.warn(`⚠️ Bucket '${this.bucketName}' does not exist. Please create it manually in the Supabase dashboard.`);
      } else {
        console.log(`✅ Bucket '${this.bucketName}' already exists`);
      }
    } catch (error) {
      console.warn('Could not verify bucket existence:', error);
    }
  }

  async listDeployedFiles(): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('seo');

      if (error) throw error;

      return data?.map(file => file.name) || [];
    } catch (error) {
      console.error('Failed to list deployed files:', error);
      return [];
    }
  }

  async getFileUrl(filename: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(`seo/${filename}`);

      return data.publicUrl;
    } catch (error) {
      console.error(`Failed to get URL for ${filename}:`, error);
      return null;
    }
  }
}

export const createRealFileSystemDeployment = (): RealFileSystemDeployment => {
  return new RealFileSystemDeployment();
};
