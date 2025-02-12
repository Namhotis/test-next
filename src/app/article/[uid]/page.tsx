import { Metadata } from "next";
import { notFound } from "next/navigation";

import { filter } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

export const revalidate = 60;
export const dynamicParams = true; // (ou 'force-dynamic' si tu veux une refetch immédiate)

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client
    .getByUID("articlepage", uid)
    .catch(() => notFound());
  console.log("Page", page);

  // <SliceZone> renders the page's slices.
  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client
    .getByUID("articlepage", uid)
    .catch(() => notFound());
  console.log("generateMetadata", page);

  return {
    title: "test",
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();

  // Get all pages from Prismic, except the homepage.
  const pages = await client.getAllByType("articlepage", {
    filters: [filter.not("my.page.uid", "home")],
  });

  console.log("generateStaticParams", pages);

  return pages.map((page) => ({ uid: page.uid }));
}
