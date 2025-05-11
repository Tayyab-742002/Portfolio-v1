import { Content, ImageField, LinkField } from "@prismicio/client";

export interface BlogSlice {
  type: "blog";
  primary: {
    heading: any;
    description: any;
  };
  items: {
    post_thumbnail: ImageField;
    post_category: string;
    post_title: string;
    post_excerpt: string;
    post_date: string;
    reading_time: number;
    post_link: LinkField;
    author_name: string;
    author_image: ImageField;
    reading_progress?: number;
  }[];
}
