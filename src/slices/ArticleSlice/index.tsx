import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ArticleSlice`.
 */
export type ArticleSliceProps = SliceComponentProps<Content.ArticleSliceSlice>;

/**
 * Component for "ArticleSlice" Slices.
 */
const ArticleSlice: FC<ArticleSliceProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for article_slice (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ArticleSlice;
