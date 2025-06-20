
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentRequest {
  files: Array<{
    filename: string;
    content: string;
    path: string;
  }>;
  deploymentPath: string;
  manifest: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    if (req.method === 'POST') {
      const body: DeploymentRequest = await req.json()
      
      console.log('🚀 Starting production SEO file deployment...')
      console.log(`📂 Deployment path: ${body.deploymentPath}`)
      console.log(`📄 Files to deploy: ${body.files.length}`)

      const results = {
        success: true,
        deployed: 0,
        failed: 0,
        errors: [] as string[]
      }

      // Create deployment directory structure
      try {
        await Deno.mkdir(body.deploymentPath, { recursive: true })
        console.log(`✅ Created deployment directory: ${body.deploymentPath}`)
      } catch (error) {
        console.log(`📁 Directory already exists or created: ${body.deploymentPath}`)
      }

      // Deploy each file
      for (const file of body.files) {
        try {
          const fullPath = `${body.deploymentPath}/${file.filename}`
          await Deno.writeTextFile(fullPath, file.content)
          
          console.log(`✅ Deployed: ${file.filename}`)
          results.deployed++
        } catch (error) {
          const errorMessage = `Failed to deploy ${file.filename}: ${error.message}`
          console.error(`❌ ${errorMessage}`)
          results.errors.push(errorMessage)
          results.failed++
          results.success = false
        }
      }

      // Write deployment manifest
      if (body.manifest) {
        try {
          const manifestPath = `${body.deploymentPath}/seo-deployment-manifest.json`
          await Deno.writeTextFile(manifestPath, JSON.stringify(body.manifest, null, 2))
          console.log(`📋 Deployment manifest written to: ${manifestPath}`)
        } catch (error) {
          console.error(`❌ Failed to write manifest: ${error.message}`)
          results.errors.push(`Failed to write manifest: ${error.message}`)
        }
      }

      console.log('📊 Deployment Summary:')
      console.log(`   Deployed: ${results.deployed}`)
      console.log(`   Failed: ${results.failed}`)
      console.log(`   Success: ${results.success}`)

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: results.success ? 200 : 207
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('❌ Deployment function error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
