const fs = require('fs')
const path = require('path')
const https = require('https')

const modelsDir = path.join(__dirname, '..', 'public', 'models')
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true })
}

const files = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
]

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/'

function downloadFile(fileName) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(modelsDir, fileName)
    if (fs.existsSync(destPath)) {
      console.log(`[OK] Already exists: ${fileName}`)
      return resolve()
    }

    const file = fs.createWriteStream(destPath)
    https.get(baseUrl + fileName, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (redirectRes) => {
          redirectRes.pipe(file)
          file.on('finish', () => {
            file.close()
            console.log(`[DOWNLOADED] ${fileName}`)
            resolve()
          })
        })
      } else if (res.statusCode === 200) {
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`[DOWNLOADED] ${fileName}`)
          resolve()
        })
      } else {
        reject(new Error(`Failed to download ${fileName}: HTTP ${res.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {})
      reject(err)
    })
  })
}

async function run() {
  console.log('Downloading face-api.js model weights to public/models...')
  for (const f of files) {
    try {
      await downloadFile(f)
    } catch (e) {
      console.error(`Error downloading ${f}:`, e.message)
    }
  }
  console.log('Finished downloading model weights!')
}

run()
