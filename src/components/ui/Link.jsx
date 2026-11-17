import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
const Link = forwardRef(function Link2({ href, ...rest }, ref) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return <a ref={ref} href={href} {...rest} />;
  return <RouterLink ref={ref} to={href} {...rest} />;
});
export {
  Link
};
