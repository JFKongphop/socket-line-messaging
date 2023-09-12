export const ConvertShortMessage = (message: string) => {
  if (message.length > 20) {
    return `${message.slice(0, 15).trim()}...`;
  }
  return message;
}