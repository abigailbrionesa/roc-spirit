import * as WebBrowser from "expo-web-browser";

const CHARACTER_MAP: Record<string, string> = {
  Rocky: "rocky",
  "Ghost Friend": "ghost",
  "Flower Spirit": "flower",
  Teacher: "teacher",
};

const VAPI_WIDGET_URL = "https://vapi-rocspirit.vercel.app/index.html";

export async function startVapiCall(characterName: string) {
  const slug = CHARACTER_MAP[characterName] ?? "rocky";
  const url = `${VAPI_WIDGET_URL}?character=${encodeURIComponent(slug)}`;

  await WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
}
