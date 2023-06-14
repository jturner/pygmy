export interface Url {
  url: string;
  expiry: Date;
  shortUrl: string;
}

const kv = await Deno.openKv();

export async function getAllUrls(): Promise<Url[]> {
  const urls: Url[] = [];
  for await (const res of kv.list({ prefix: ["url"] })) {
    urls.push(res.value as Url);
  }
  return urls;
}

export async function getUrlByShort(shortUrl: string): Promise<Url> {
  const key = ["url", shortUrl];
  return (await kv.get<Url>(key)).value!;
}

export async function upsertUrl(url: Url): Promise<Url> {
  const arr = new Uint8Array(8 / 2);
  crypto.getRandomValues(arr);
  const toHex = (d: number) => d.toString(16).padStart(2, "0");
  url.shortUrl = Array.from(arr, toHex).join("");

  const key = ["url", url.shortUrl];
  const oldUrl = await kv.get<Url>(key);

  const ok = await kv.atomic()
    .check(oldUrl)
    .set(key, url)
    .commit();
  if (!ok) throw new Error("Somthing went wrong.");

  return url;
}

export async function deleteUrlByShort(shortUrl: string) {
  const key = ["url", shortUrl];
  const res = await kv.get<Url>(key);
  if (!res.value) return;

  await kv.atomic()
    .check(res)
    .delete(key)
    .commit();
}
