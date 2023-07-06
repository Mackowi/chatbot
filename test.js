import fs from 'fs'
import https from 'https'

const imageUrl =
  'https://oaidalleapiprodscus.blob.core.windows.net/private/org-spnq2I727Io9QrXB6kSr4rdc/user-lfwTuljxxw2sMw2iakfOwHol/img-Od2QuRzkZDfzj2WlLuLTUNY4.png?st=2023-07-06T09%3A29%3A47Z&se=2023-07-06T11%3A29%3A47Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-05T20%3A11%3A26Z&ske=2023-07-06T20%3A11%3A26Z&sks=b&skv=2021-08-06&sig=eWjsuxl0V3y6oCq0efhg2GuCfo7WFBBuEuv9SU2jVgE%3D'
const imageName = 'image.jpg'

const file = fs.createWriteStream(imageName)

https
  .get(imageUrl, (response) => {
    response.pipe(file)

    file.on('finish', () => {
      file.close()
      console.log(`Image downloaded as ${imageName}`)
    })
  })
  .on('error', (err) => {
    fs.unlink(imageName)
    console.error(`Error downloading image: ${err.message}`)
  })
