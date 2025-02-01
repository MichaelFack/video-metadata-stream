export default function helloWorld(console: Console): void {
    const message = 'Hello, World!';
    console.log(message);    
}

// On exe:
if (require.main === module) {
    helloWorld(console)
}
