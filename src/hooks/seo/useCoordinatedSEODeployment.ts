
import { useState } from 'react';
import { useProductionSEODeployment } from './useProductionSEODeployment';
import { useRealProductionDeployment } from './useRealProductionDeployment';

interface CoordinatedDeploymentResult {
  success: boolean;
  productionResult?: any;
  realResult?: any;
  errors: string[];
  summary: {
    totalFiles: number;
    productionDeployed: number;
    realDeployed: number;
    overallSuccess: boolean;
  };
}

export const useCoordinatedSEODeployment = () => {
  const { deployToProduction, isDeploying: isProductionDeploying } = useProductionSEODeployment();
  const { deployToRealProduction, isDeploying: isRealDeploying } = useRealProductionDeployment();
  const [isCoordinatedDeploying, setIsCoordinatedDeploying] = useState(false);

  const deployToAllEnvironments = async (): Promise<CoordinatedDeploymentResult> => {
    setIsCoordinatedDeploying(true);
    const errors: string[] = [];
    
    try {
      console.log('🚀 Starting coordinated SEO deployment to all environments...');
      
      // Step 1: Deploy to simulated production
      console.log('📦 Deploying to simulated production environment...');
      const productionResult = await deployToProduction();
      
      if (!productionResult.success) {
        errors.push('Simulated production deployment failed');
        console.error('❌ Simulated production deployment failed');
      } else {
        console.log('✅ Simulated production deployment completed successfully');
      }

      // Step 2: Deploy to real file system
      console.log('📂 Deploying to real file system...');
      const realResult = await deployToRealProduction();
      
      if (!realResult.success) {
        errors.push('Real file system deployment failed');
        console.error('❌ Real file system deployment failed');
      } else {
        console.log('✅ Real file system deployment completed successfully');
      }

      // Create summary
      const summary = {
        totalFiles: Math.max(
          productionResult.stats?.total || 0,
          realResult.stats?.total || 0
        ),
        productionDeployed: productionResult.stats?.generated || 0,
        realDeployed: realResult.stats?.deployed || 0,
        overallSuccess: productionResult.success && realResult.success
      };

      console.log('📊 Coordinated Deployment Summary:');
      console.log(`   Total files processed: ${summary.totalFiles}`);
      console.log(`   Simulated production deployed: ${summary.productionDeployed}`);
      console.log(`   Real file system deployed: ${summary.realDeployed}`);
      console.log(`   Overall success: ${summary.overallSuccess}`);

      return {
        success: summary.overallSuccess,
        productionResult,
        realResult,
        errors,
        summary
      };
    } catch (error) {
      console.error('❌ Error during coordinated deployment:', error);
      errors.push(error.message);
      
      return {
        success: false,
        errors,
        summary: {
          totalFiles: 0,
          productionDeployed: 0,
          realDeployed: 0,
          overallSuccess: false
        }
      };
    } finally {
      setIsCoordinatedDeploying(false);
    }
  };

  const isDeploying = isProductionDeploying || isRealDeploying || isCoordinatedDeploying;

  return {
    deployToAllEnvironments,
    isDeploying,
    isCoordinatedDeploying,
    isProductionDeploying,
    isRealDeploying
  };
};
