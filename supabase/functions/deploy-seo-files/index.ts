
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
  bucketName?: string;
  manifest: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for storage operations
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
      const bucketName = body.bucketName || 'seo-files'
      
      console.log('🚀 Starting Supabase Storage SEO file deployment...')
      console.log(`📂 Target bucket: ${bucketName}`)
      console.log(`📄 Files to deploy: ${body.files.length}`)

      const results = {
        success: true,
        deployed: 0,
        failed: 0,
        errors: [] as string[],
        storageUrls: [] as string[]
      }

      // Ensure bucket exists (create if it doesn't)
      const { data: buckets } = await supabaseClient.storage.listBuckets()
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName)

      if (!bucketExists) {
        console.log(`📦 Creating bucket: ${bucketName}`)
        const { error: createError } = await supabaseClient.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['text/html', 'application/json'],
          fileSizeLimit: 1024 * 1024 // 1MB limit
        })

        if (createError) {
          console.error(`❌ Failed to create bucket: ${createError.message}`)
          return new Response(JSON.stringify({
            success: false,
            error: `Failed to create bucket: ${createError.message}`
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        console.log(`✅ Created bucket: ${bucketName}`)
      }

      // Deploy each file
      for (const file of body.files) {
        try {
          const filePath = `seo/${file.filename}`
          
          // Upload file to Supabase Storage
          const { data, error } = await supabaseClient.storage
            .from(bucketName)
            .upload(filePath, file.content, {
              contentType: 'text/html',
              upsert: true // Replace existing files
            })

          if (error) {
            throw error
          }

          // Get public URL
          const { data: publicUrlData } = supabaseClient.storage
            .from(bucketName)
            .getPublicUrl(filePath)

          results.storageUrls.push(publicUrlData.publicUrl)
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

      // Deploy manifest
      if (body.manifest) {
        try {
          const manifestPath = 'seo/seo-deployment-manifest.json'
          const { error } = await supabaseClient.storage
            .from(bucketName)
            .upload(manifestPath, JSON.stringify(body.manifest, null, 2), {
              contentType: 'application/json',
              upsert: true
            })

          if (error) throw error
          console.log(`📋 Deployment manifest uploaded`)
        } catch (error) {
          console.error(`❌ Failed to upload manifest: ${error.message}`)
          results.errors.push(`Failed to upload manifest: ${error.message}`)
        }
      }

      console.log('📊 Storage Deployment Summary:')
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
    console.error('❌ Storage deployment function error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
