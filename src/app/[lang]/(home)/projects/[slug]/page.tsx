import { notFound } from "next/navigation";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GitInfoButton } from "@/components/git-info-button";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Github, Globe, Twitter } from "lucide-react";
import { Card, Cards } from "fumadocs-ui/components/card";
import { CalloutMDX } from "@/components/mdx/CalloutMDX";

type ProjectFrontmatter = {
  title: string;
  description: string;
  banner?: string;
  logo?: string;
  discord?: string;
  github?: string;
  website?: string;
  twitter?: string;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
};

const components = {
  Card,
  Cards,
  Callout: CalloutMDX,
};

const DiscordIcon = ({ className }: { className?: string }) => ( // i couldn't find this on lucide react so i just got this svg
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

async function getProjectContent(slug: string) {
  try {
    const projectsPath = join(process.cwd(), "content", "projects");
    const filePath = join(projectsPath, `${slug}.mdx`);
    const source = await readFile(filePath, "utf-8");

    const { data: frontmatter, content } = matter(source);

    return {
      content,
      frontmatter: frontmatter as ProjectFrontmatter,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateStaticParams() {
  const projectsPath = join(process.cwd(), "content", "projects");
  
  try {
    const files = await readdir(projectsPath);
    const projectSlugs = files
      .filter(file => file.endsWith(".mdx"))
      .map(file => file.replace(/\.mdx$/, ""));
    
    const langs = ["en"]; // projects only work in english for now
    
    return langs.flatMap(lang => 
      projectSlugs.map(slug => ({ lang, slug }))
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const project = await getProjectContent(slug);

  if (!project) {
    notFound();
  }

  const socialLinks = [
    { icon: DiscordIcon, url: project.frontmatter.discord, label: "Discord" },
    { icon: Github, url: project.frontmatter.github, label: "GitHub" },
    { icon: Globe, url: project.frontmatter.website, label: "Website" },
    { icon: Twitter, url: project.frontmatter.twitter, label: "Twitter" },
  ].filter(link => link.url);

  const hasBanner = !!project.frontmatter.banner;
  const hasLogo = !!project.frontmatter.logo;
  const author = project.frontmatter.author;

  const authorSocialLinks = author ? [
    { icon: Github, url: author.github, label: "GitHub" },
    { icon: Twitter, url: author.twitter, label: "Twitter" },
    { icon: Globe, url: author.website, label: "Website" },
  ].filter(link => link.url) : [];

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <GitInfoButton />
      <div className="container mx-auto flex flex-1 flex-col px-6 py-8 max-w-4xl">
        <Link href={`/${lang}/projects`}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-8">
          {hasBanner ? (
            <Image
              src={project.frontmatter.banner!}
              alt={`${project.frontmatter.title} banner`}
              fill
              className="w-full h-full object-cover scale-105"
              unoptimized={true}
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-center gap-4">
            {hasLogo && (
              <div className="relative h-16 w-16 shrink-0">
                <Image
                  src={project.frontmatter.logo!}
                  alt={`${project.frontmatter.title} logo`}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-3xl font-bold">
                {project.frontmatter.title}
              </h1>
              <p className="text-white/80 text-sm">
                {project.frontmatter.description}
              </p>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  <Link
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={project.content} components={components} />
        </article>

        {author && (
          <div className="mt-12 pt-8 border-t border-fd-border">
            <h2 className="text-xl font-semibold mb-4">About the Author</h2>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-fd-card border border-fd-border">
              {author.avatar ? (
                <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{author.name}</h3>
                {author.bio && (
                  <p className="text-muted-foreground text-sm mt-1">{author.bio}</p>
                )}
                {authorSocialLinks.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {authorSocialLinks.map(({ icon: Icon, url, label }) => (
                      <Link
                        key={label}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-fd-accent transition-colors"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
