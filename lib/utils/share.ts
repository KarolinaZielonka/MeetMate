export interface ShareConfig {
  url: string
  eventName: string
  message?: string
}

export function generateWhatsAppUrl({ url, eventName, message }: ShareConfig): string {
  const text = message || `Join "${eventName}" and help find the best date!\n\n${url}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function generateMessengerUrl({ url }: ShareConfig): string {
  return `fb-messenger://share/?link=${encodeURIComponent(url)}`
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator
}

export async function nativeShare({ url, eventName }: ShareConfig): Promise<boolean> {
  if (!canUseNativeShare()) return false

  try {
    await navigator.share({
      title: eventName,
      text: `Join "${eventName}" and help find the best date!`,
      url: url,
    })
    return true
  } catch {
    return false
  }
}
