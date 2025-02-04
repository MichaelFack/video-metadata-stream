import { createInterface } from 'readline';

export class CLI {
  public awaitExitCommand() {
    const userinput = createInterface({
      input: process.stdin
    });

    userinput.question('To exit program input "e", "exit" or "exit()" into terminal', (answer) => {
      switch (answer.toLowerCase()) {
        case 'e':
        case 'exit':
        case 'exit()':
          return true;
        default:
          return false;
      }
    })
  }
}
