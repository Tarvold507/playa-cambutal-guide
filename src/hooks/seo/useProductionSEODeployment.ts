
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageSEO } from './types';
import { useStaticSEOGeneration } from './useStaticSEOGeneration';
import { ProductionDeploymentManager, createProductionDeploymentManager } from '@/utils/productionDeployment';

interface DeploymentResult {
  success: boolean;
  stats: {
    total: number;
    generated: number;
    failed: number;
    fileTypes: Record<string, number>;
    deploymentPath?: string;
    timestamp: string;
  };
  manifest?: any;
  verificationPassed?: boolean;
}

export const useProductionSEODeployment = () => {
  const { generateStaticHTML, generateFilename } = useStaticSEOGeneration();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentManager] = useState(() => createProductionDeploymentManager());

  const deployToProduction = async (customPath?: string): Promise<DeploymentResult> => {
    setIsDeploying(true);
    
    try {
      console.log('🚀 Starting production SEO deployment...');
      
      // Set custom deployment path if provided
      if (customPath) {
        deploymentManager.setDeploymentPath(customPath);
      }

      // Fetch all SEO entries
      const { data: seoEntries, error: fetchError } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (fetchError) throw fetchError;

      if (!seoEntries || seoEntries.length === 0) {
        throw new Error('No SEO entries found for deployment');
      }

      // Clean up old files before deployment
      await deploymentManager.cleanupOldFiles();

      // Initialize deployment statistics
      const stats = {
        total: seoEntries.length,
        generated: 0,
        failed: 0,
        fileTypes: {} as Record<string, number>,
        timestamp: new Date().toISOString()
      };

      const generatedFiles: string[] = [];

      // Generate and deploy each SEO file
      for (const entry of seoEntries) {
        const htmlContent = generateStaticHTML(entry);
        const filename = generateFilename(entry);
        
        // Determine file type for statistics
        let fileType = 'static';
        if (entry.page_path.startsWith('/eat/') && entry.page_path !== '/eat') {
          fileType = 'restaurant';
        } else if (entry.page_path.startsWith('/stay/') && entry.page_path !== '/stay') {
          fileType = 'hotel';
        } else if (entry.page_path.startsWith('/do/') && entry.page_path !== '/do') {
          fileType = 'activity';
        } else if (entry.page_path.startsWith('/blog/') && entry.page_path !== '/blog') {
          fileType = 'blog';
        }

        try {
          const writeSuccess = await deploymentManager.writeStaticFile(filename, htmlContent);
          
          if (writeSuccess) {
            stats.generated++;
            stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1;
            generatedFiles.push(filename);
            console.log(`✅ Deployed ${fileType} file: ${filename} for ${entry.page_path}`);
          } else {
            stats.failed++;
            console.error(`❌ Failed to deploy file: ${filename} for ${entry.page_path}`);
          }
        } catch (deployError) {
          stats.failed++;
          console.error(`❌ Deployment error for ${filename}:`, deployError);
        }
      }

      // Generate deployment manifest
      await deploymentManager.generateDeploymentManifest(stats);
      
      // Verify deployment integrity
      const verificationPassed = await deploymentManager.verifyDeployment(generatedFiles);

      // Log deployment summary
      console.log('📊 Production Deployment Summary:');
      console.log(`   Total files: ${stats.total}`);
      console.log(`   Successfully deployed: ${stats.generated}`);
      console.log(`   Failed: ${stats.failed}`);
      console.log(`   Verification: ${verificationPassed ? 'PASSED' : 'FAILED'}`);
      
      Object.entries(stats.fileTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} files`);
      });

      const result: DeploymentResult = {
        success: stats.failed === 0 && verificationPassed,
        stats,
        verificationPassed
      };

      if (result.success) {
        console.log(`✅ Production deployment completed successfully!`);
      } else {
        console.log(`⚠️ Production deployment completed with issues`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error during production deployment:', error);
      return {
        success: false,
        stats: {
          total: 0,
          generated: 0,
          failed: 0,
          fileTypes: {},
          timestamp: new Date().toISOString()
        }
      };
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deployToProduction,
    isDeploying,
    deploymentManager
  };
};
