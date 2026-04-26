import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
}

const SEOHead = ({
  title = "VastuVista — AI-Powered Vastu Analysis",
  description = "Upload your floor plan and get instant Vastu Shastra analysis powered by AI. Save thousands compared to traditional consultants.",
  path = "",
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", `${window.location.origin}${path}`, true);
  }, [title, description, path]);

  return null;
};

export default SEOHead;
