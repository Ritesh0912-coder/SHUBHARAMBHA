"use client";
import { useState, useEffect } from "react";
import { FaPlay, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface FarmerVideo {
    id: string;
    title: string;
    videoUrl: string;
    isYouTube: boolean;
    isVisible: boolean;
}

export default function FarmerVideos() {
    const { t } = useLanguage();
    const T: any = t;
    const [videos, setVideos] = useState<FarmerVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/videos")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setVideos(data.filter(v => v.isVisible));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch videos:", err);
                setLoading(false);
            });
    }, []);

    // Extract YouTube video ID from URL
    const getYouTubeId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return (
            <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse">
                        <div className="h-10 bg-stone-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-6 bg-stone-100 rounded w-96 mx-auto mb-12"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                            {[1, 2].map(i => (
                                <div key={i} className="h-80 bg-stone-100 rounded-[3rem]"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (videos.length === 0) {
        return null; // Don't show section if no videos
    }

    return (
        <section id="videos" className="py-24 px-4 bg-stone-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 font-marathi">
                        {T.farmerVideos?.title}
                    </h2>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                        {T.farmerVideos?.subTitle}
                    </p>
                    <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                    {videos.map((video) => {
                        const ytId = video.isYouTube ? getYouTubeId(video.videoUrl) : null;

                        return (
                            <div
                                key={video.id}
                                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm border border-stone-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                            >
                                {video.isYouTube ? (
                                    <div className="relative aspect-video bg-black">
                                        {ytId ? (
                                            <iframe
                                                className="absolute inset-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                                                title={video.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-stone-400">
                                                <FaYoutube size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold">{T.farmerVideos?.noVideo}</p>
                                                <p className="text-xs mt-2">Invalid YouTube URL</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative aspect-video bg-black">
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover"
                                            src={video.videoUrl}
                                            controls
                                            playsInline
                                            preload="metadata"
                                        />
                                    </div>
                                )}
                                <div className="p-8 md:p-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${video.isYouTube ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                                {video.isYouTube ? <FaYoutube size={20} /> : <FaPlay size={16} />}
                                            </div>
                                            <div>
                                                <span className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] block">
                                                    {video.isYouTube ? T.farmerVideos?.ytLabel : T.farmerVideos?.expLabel}
                                                </span>
                                            </div>
                                        </div>
                                        {video.isYouTube && ytId && (
                                            <a
                                                href={video.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-stone-300 hover:text-primary transition-colors p-2"
                                                title="Open in YouTube"
                                            >
                                                <FaExternalLinkAlt size={16} />
                                            </a>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-stone-900 font-marathi leading-tight group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
