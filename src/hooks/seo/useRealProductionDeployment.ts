
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStaticSEOGeneration } from './useStaticSEOGeneration';
import { createRealFileSystemDeployment } from '@/utils/realFileSystemDeployment';

interface RealDeploymentResult {
  success: boolean;
  stats: {
    total: number;
    deployed: number;
    failed: number;
    fileTypes: Record<string, number>;
    deploymentPath?: string;
    timestamp: string;
    errors: string[];
  };
  manifest?: any;
  verificationPassed?: boolean;
}

export const useRealProductionDeployment = () => {
  const { generateStaticHTML, generateFilename } = useStaticSEOGeneration();
  const [isDeploying, setIsDeploying] = useState(false);
  const [realDeployment] = useState(() => createRealFileSystemDeployment());

  const deployToRealProduction = async (customPath?: string): Promise<RealDeploymentResult> => {
    setIsDeploying(true);
    
    try {
      console.log('🚀 Starting REAL production SEO deployment...');
      
      if (customPath) {
        realDeployment.setDeploymentPath(customPath);
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

      const stats = {
        total: seoEntries.length,
        deployed: 0,
        failed: 0,
        fileTypes: {} as Record<string, number>,
        timestamp: new Date().toISOString(),
        errors: [] as string[]
      };

      // Prepare files for deployment
      const filesToDeploy = seoEntries.map(entry => {
        const htmlContent = generateStaticHTML(entry);
        const filename = generateFilename(entry);
        
        // Determine file type
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

        stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1;

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
          stats: {
            total_files: stats.total,
            file_types: stats.fileTypes
          },
          generator: 'playa-cambutal-guide-real-seo-deployment',
          version: '1.0.0'
        }
      };

      // Deploy files using real file system
      const deploymentResult = await realDeployment.deployFiles(filesToDeploy, manifest);
      
      // Update stats with real deployment results
      stats.deployed = deploymentResult.deployed;
      stats.failed = deploymentResult.failed;
      stats.errors = deploymentResult.errors;

      // Verify deployment
      const verificationPassed = await realDeployment.verifyDeployment(
        filesToDeploy.map(f => f.filename)
      );

      console.log('📊 REAL Production Deployment Summary:');
      console.log(`   Total files: ${stats.total}`);
      console.log(`   Successfully deployed: ${stats.deployed}`);
      console.log(`   Failed: ${stats.failed}`);
      console.log(`   Verification: ${verificationPassed ? 'PASSED' : 'FAILED'}`);
      
      if (stats.errors.length > 0) {
        console.log('   Errors:', stats.errors);
      }

      const result: RealDeploymentResult = {
        success: deploymentResult.success && verificationPassed,
        stats,
        manifest,
        verificationPassed
      };

      return result;
    } catch (error) {
      console.error('❌ Error during REAL production deployment:', error);
      return {
        success: false,
        stats: {
          total: 0,
          deployed: 0,
          failed: 0,
          fileTypes: {},
          timestamp: new Date().toISOString(),
          errors: [error.message]
        }
      };
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deployToRealProduction,
    isDeploying,
    realDeployment
  };
};
