import openai from './config/open_ai.js'
import readlineSync from 'readline-sync'
import colors from 'colors'
import fs from 'fs'
import https from 'https'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  // intro message
  console.log(colors.bold.green('Welcome to the chatbot!'))
  console.log(
    colors.bold.green("Type your question or 'image' to generate graphics.")
  )

  // store the conversation
  const chatHistory = []

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '))

    if (userInput.toLowerCase() === 'image') {
      console.log(colors.bold.green('Type your image prompt'))
      const imagePrompt = readlineSync.question(colors.yellow('You: '))
      try {
        const response = await openai.createImage({
          prompt: `${imagePrompt}`,
          n: 1,
          size: '1024x1024',
        })
        const imageUrl = response.data.data[0].url
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
        // console.log(
        //   colors.green('Bot: ') +
        //     'your image link:\n' +
        //     colors.magenta(`${image_url}`)
        // )
      } catch (err) {
        console.log(colors.red(err))
      }
    } else {
      try {
        // Construct the messages array by iterating over the history array
        const messages = chatHistory.map(([role, content]) => ({
          role,
          content,
        }))

        // Add the latest user input to the messages array
        messages.push({ role: 'user', content: userInput })
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: messages,
        })

        const completionText = completion.data.choices[0].message.content

        if (userInput.toLowerCase() === 'exit') {
          console.log(colors.green('Bot: ') + completionText)
          return
        }

        console.log(colors.green('Bot: ') + completionText)

        // update the chatHistory with the user input and assistant response
        chatHistory.push(['user', userInput])
        chatHistory.push(['assistant', completionText])
      } catch (err) {
        console.log(colors.red(err))
      }
    }
  }
}

main()
