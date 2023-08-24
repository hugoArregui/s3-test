import { Upload } from '@aws-sdk/lib-storage'
import { S3 } from '@aws-sdk/client-s3'
import { randomBytes } from 'crypto'
import { Readable } from 'stream'
import 'dotenv/config'

const totalSamples = 100
const sampleSize = 1024 * 1024

const prefix = 'hugotest'

async function main() {
  const bucket = process.env.S3_BUCKET

  const client = new S3({ region: 'us-east-1' })

  const uploads: Upload[] = []
  const queries: Promise<any>[] = []
  const samples: Readable[] = []

  for (let i = 0; i < totalSamples; i++) {
    samples.push(Readable.from(randomBytes(sampleSize)))
  }

  for (let i = 0; i < totalSamples; i++) {
    const sample = samples[i]
    const key = `${prefix}/test-${i}`
    const upload = new Upload({
      params: {
        Bucket: bucket,
        Key: key,
        Body: sample
      },
      client,
      queueSize: 3
    })
    upload.on('httpUploadProgress', (progress) => {
      console.log(key, progress)
    })
    uploads.push(upload)
  }

  for (let i = 0; i < totalSamples * 2; i++) {
    const j = Math.floor(Math.random() * 100)
    const key = `${prefix}/test-${j}`
    queries.push(client.getObject({ Bucket: bucket, Key: key }))
  }

  console.log('Running')
  try {
    await Promise.all([Promise.all(uploads.map((u) => u.done())), Promise.all(queries)])
    console.log('ok')
  } catch (err) {
    console.log('ERROR', err)
  }
}

main().catch(console.error)
