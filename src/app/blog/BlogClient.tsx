"use client";

import { useState } from "react";
import { blogPosts } from "@/data/blog";
import { Calendar, Clock, User, Tag, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/contexts/LocaleContext";

export default function BlogClient() {
    const { t } = useLocale();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = ["all", ...Array.from(new Set(blogPosts.map(post => post.category)))];

    // Map category names to translation keys
    const getCategoryKey = (category: string) => {
        const keyMap: Record<string, string> = {
            "all": "all",
            "Education": "education",
            "Travel": "travel",
            "Food & Wine": "pairing",
            "Storage": "storage",
            "Science": "science"
        };
        return keyMap[category] || category.toLowerCase();
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPosts = blogPosts.filter(post => post.featured);
    const latestPost = blogPosts[0];

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/farm.avif')" }}
                />
                <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6">{t("blog.hero.title")}</h1>
                    <p className="text-xl md:text-2xl font-light opacity-90">
                        {t("blog.hero.subtitle")}
                    </p>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t("blog.searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 text-base"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-background hover:bg-muted text-foreground"
                                    }`}
                            >
                                {t(`blog.filters.${getCategoryKey(cat)}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Latest Post */}
            {latestPost && (
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t("blog.latestPost")}</span>
                            <h2 className="text-3xl md:text-4xl font-serif mt-2">Fresh from the Vineyard</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden shadow-xl">
                            <div className="relative h-[500px] order-2 md:order-1">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${latestPost.image})` }}
                                />
                            </div>
                            <div className="p-8 md:p-12 order-1 md:order-2">
                                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                                    {latestPost.category}
                                </div>
                                <h3 className="text-3xl font-serif mb-4">{latestPost.title}</h3>
                                <p className="text-muted-foreground mb-6 text-lg">{latestPost.excerpt}</p>
                                <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{latestPost.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(latestPost.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{latestPost.readTime} {t("blog.readTime")}</span>
                                    </div>
                                </div>
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    {t("blog.readMore")} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.slice(1).map((post) => (
                            <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer">
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                        style={{ backgroundImage: `url(${post.image})` }}
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors">
                                        Read More
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif mb-4">Never Miss an Article</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Subscribe to our newsletter for the latest wine insights and stories
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white text-gray-900"
                        />
                        <Button size="lg" variant="secondary" className="whitespace-nowrap">
                            Subscribe Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
