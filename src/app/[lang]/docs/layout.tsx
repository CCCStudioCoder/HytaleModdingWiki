import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { DocsBanner, DocsFooter } from "./docs-banner";
import { ViewTransition } from "react";
import { localizePageTree } from "@/lib/tree-localization";
import { localizeHref, getMessages } from "@/lib/locale";

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]/docs">) {
  const { lang } = await params;
  const tree = localizePageTree(source.pageTree[lang], lang);
  const messages = getMessages(lang);

  return (
    <ViewTransition update="none">
      <div className="flex min-h-screen flex-col">
        <DocsLayout
          tree={tree}
          {...baseOptions(lang, true)}
          githubUrl="https://github.com/HytaleModding/site"
          sidebar={{
            banner: <DocsBanner />,
            footer: <DocsFooter />,
          }}
          nav={{
            title: messages.nav.title,
            url: localizeHref("/", lang),
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </ViewTransition>
  );
}
