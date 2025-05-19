// import { fetchMetadata } from '@/app/actions/fetchMetadata';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { urls }: { urls: string[] } = body;

//   if (urls.length > 0) {
//     const newLinks = await Promise.all(
//       urls.map(async (url, index) => {
//         // Extract domain from URL
//         let domain = '';
//         try {
//           domain = new URL(url).hostname;
//         } catch {
//           domain = url;
//         }

//         // Fetch metadata for the URL
//         let title = `New page from ${domain}`;
//         let thumbnail = '';

//         try {
//           const metadata = await fetchMetadata(url);
//           if (metadata.title) title = metadata.title;
//           if (metadata.image) thumbnail = metadata.image;
//         } catch (error) {
//           console.error('Error fetching metadata:', error);
//         }

//         return {
//           id: `new-${Date.now()}-${index}`,
//           title,
//           url,
//           domain,
//           thumbnail,
//           archived: false,
//         };
//       })
//     );
//     return NextResponse.json({ links: newLinks, success: true, status: 200 });
//   }

//   return NextResponse.json({ success: true, status: 200 });
// }
