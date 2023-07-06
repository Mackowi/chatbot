import openai from './config/open_ai.js'
import readlineSync from 'readline-sync'
import colors from 'colors'

async function main() {
  // intro message
  console.log(colors.bold.green('Welcome to the chatbot!'))
  console.log(colors.bold.green('Type your question'))

  // store the conversation
  const chatHistory = []

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '))

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

main()
