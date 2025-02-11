import { Metadata } from "next";
import { notFound } from "next/navigation";

import { filter } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client
    .getByUID("articlepage", uid)
    .catch(() => notFound());

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
  console.log(page);

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

  return pages.map((page) => ({ uid: page.uid }));
}

// Ajout de getStaticProps pour définir la revalidation
export async function getStaticProps({ params }: { params: Params }) {
  const { uid } = params;
  const client = createClient();
  const page = await client
    .getByUID("articlepage", uid)
    .catch(() => notFound());

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      pageData: page.data,
    },
    revalidate: 60, // Définit la revalidation ici, chaque 60 secondes
  };
}
