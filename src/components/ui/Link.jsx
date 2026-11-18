"use client";
import { forwardRef } from "react";
import NextLink from "next/link";

const Link = forwardRef(function Link2({ href, ...rest }, ref) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return <a ref={ref} href={href} {...rest} />;
  return <NextLink ref={ref} href={href} {...rest} />;
});

export { Link };
