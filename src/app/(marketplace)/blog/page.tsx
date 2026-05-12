import type { Metadata } from "next";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog | InfraMitra",
  description:
    "Insights, guides, and news about IT hardware, refurbished equipment, and e-waste management from InfraMitra.",
};

const posts = [
  {
    title: "How to Choose the Right Server for Your Business",
    excerpt:
      "Selecting the right server can make or break your IT infrastructure. Learn about key factors like workload type, scalability needs, and total cost of ownership to make an informed decision.",
    date: "Coming Soon",
    readTime: "8 min read",
    category: "Buying Guide",
  },
  {
    title: "Refurbished vs New: Making the Smart Choice",
    excerpt:
      "Refurbished enterprise hardware can deliver the same performance at a fraction of the cost. We break down the pros, cons, and when refurbished makes more sense than buying new.",
    date: "Coming Soon",
    readTime: "6 min read",
    category: "Industry Insights",
  },
  {
    title: "E-Waste Management: Why It Matters",
    excerpt:
      "India generates millions of tonnes of e-waste annually. Learn why responsible disposal of IT hardware is critical for the environment and how your business can contribute to the solution.",
    date: "Coming Soon",
    readTime: "5 min read",
    category: "Sustainability",
  },
  {
    title: "5 Things to Check Before Buying Used Networking Equipment",
    excerpt:
      "Used switches, routers, and firewalls can be a great value -- but only if you know what to look for. Here are the essential checks every buyer should perform before making a purchase.",
    date: "Coming Soon",
    readTime: "7 min read",
    category: "Buying Guide",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          InfraMitra Blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Insights, guides, and news about enterprise IT hardware,
          refurbished equipment, and sustainable technology practices.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="mx-auto mb-10 max-w-2xl rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-lg font-semibold text-primary">
          Our blog is launching soon!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          We are preparing expert articles on IT hardware buying guides,
          industry insights, and sustainability. Stay tuned for valuable
          content from our infrastructure experts.
        </p>
      </div>

      {/* Blog Post Cards */}
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{post.category}</Badge>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <CardTitle className="text-lg leading-snug">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-primary">
                  Read More
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
