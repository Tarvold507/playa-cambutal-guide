
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStaticSEOGeneration } from './useStaticSEOGeneration';
import { createPublicDirectoryDeploymentManager, PublicDeploymentResult } from '@/utils/publicDirectoryDeployment';

export const usePublicDirectoryDeployment = () => {
  const { generateStaticHTML, generateFilename } = useStaticSEOGeneration();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentManager] = useState(() => createPublicDirectoryDeploymentManager());

  const deployToPublicDirectory = async (): Promise<PublicDeploymentResult> => {
    setIsDeploying(true);
    
    try {
      console.log('🚀 Starting public directory SEO deployment...');

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

      const stats = {
        total: seoEntries.length,
        deployed: 0,
        failed: 0,
        fileTypes: {} as Record<string, number>,
        timestamp: new Date().toISOString(),
        errors: [] as string[],
        publicFiles: [] as string[]
      };

      // Prepare files for deployment
      const filesToDeploy = seoEntries.map(entry => {
        const htmlContent = generateStaticHTML(entry);
        const filename = generateFilename(entry);
        
        return {
          filename,
          content: htmlContent,
          path: entry.page_path
        };
      });

      // Generate deployment manifest
      const manifest = {
        deployment: {
          timestamp: stats.timestamp,
          deploymentType: 'public-directory',
          stats: {
            total_files: stats.total,
          },
          generator: 'playa-cambutal-guide-public-directory-seo-deployment',
          version: '1.0.0',
          instructions: 'These files should be placed in the public directory for direct serving'
        }
      };

      // Deploy files to public directory
      const deploymentResult = await deploymentManager.deployFiles(filesToDeploy, manifest);
      
      // Verify deployment
      const verificationPassed = await deploymentManager.verifyDeployment(
        deploymentResult.stats.publicFiles
      );

      console.log('📊 Public Directory Deployment Summary:');
      console.log(`   Total files: ${deploymentResult.stats.total}`);
      console.log(`   Successfully deployed: ${deploymentResult.stats.deployed}`);
      console.log(`   Failed: ${deploymentResult.stats.failed}`);
      console.log(`   Verification: ${verificationPassed ? 'PASSED' : 'FAILED'}`);
      console.log(`   Public files: ${deploymentResult.stats.publicFiles.length} created`);
      
      if (deploymentResult.stats.errors.length > 0) {
        console.log('   Errors:', deploymentResult.stats.errors);
      }

      const result: PublicDeploymentResult = {
        ...deploymentResult,
        success: deploymentResult.success && verificationPassed,
        manifest
      };

      return result;
    } catch (error) {
      console.error('❌ Error during public directory deployment:', error);
      return {
        success: false,
        stats: {
          total: 0,
          deployed: 0,
          failed: 0,
          fileTypes: {},
          timestamp: new Date().toISOString(),
          errors: [error.message],
          publicFiles: []
        }
      };
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deployToPublicDirectory,
    isDeploying,
    deploymentManager
  };
};
