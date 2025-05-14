// app/actions/fetchMetadata.ts
'use server';

export async function fetchMetadata(url: string): Promise<{
  title?: string;
  image?: string;
}> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Metadata Fetcher)',
      },
    });

    const html = await res.text();

    // 簡易的に正規表現で OGP タグをパース
    const titleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["'][^>]*>/i
    );
    const imageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["'][^>]*>/i
    );

    const fallbackTitle = html.match(/<title>(.*?)<\/title>/i);

    return {
      title: titleMatch?.[1] || fallbackTitle?.[1],
      image: imageMatch?.[1],
    };
  } catch (error) {
    console.error('fetchMetadata error:', error);
    return {};
  }
}
