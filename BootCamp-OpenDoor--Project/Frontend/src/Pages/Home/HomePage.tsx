import { PropertyCard } from "@/components/MyComponents/PropertyUI/PropertyCard";
import { HomeHeroVideoCard } from "@/components/MyComponents/ui/HomeHeroVideoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getAllProperties } from "@/features/properties/properties";
import type { Property } from "@/types/types";
import Autoplay from "embla-carousel-autoplay";
import { HandHeart, House, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const HomePage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchProperties();
    },[])

    const fetchProperties = async() => {
    try{
        const data = await getAllProperties();
        setProperties(data);
        }catch(e){
        console.error("Error fetching properties:", e);
        toast.error("Failed to load properties ");
        }finally{
        setLoading(false);
        }
    }

    const plugin = useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    );

    return (
        <div className="mx-auto max-w-6xl px-6 py-2">
            <HomeHeroVideoCard
                badge="OpenDoor"
                title="Find safe housing faster"
                description="Browse available homes, manage requests, and connect families with hosts through one clear platform."
            />

            <section className="mt-4 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-background p-4 shadow-sm">
                {/* Header */}
                    <div className="mb-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Properties</h2>
                    <p className="text-xs text-muted-foreground">
                        {properties.length} properties available
                    </p>
                    </div>
                {/* Divider */}
                <div className="mb-6 h-px bg-border/60" />
                {/* Content */}
                {loading ? (
                    <div className="flex items-center gap-2 py-8 justify-center text-sm text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                    Loading properties...
                    </div>
                ) : properties.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No properties found.</p>
                ) : (
                    <div className="relative w-full px-4">
                    <Carousel
                        opts={{ align: "start", loop: true }}
                        plugins={[plugin.current]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                        {properties.map((property) => (
                            <CarouselItem
                            key={property.id}
                            style={{ flexBasis: "33.333%" }}
                            className="pl-4 shrink-0"
                            >
                            <PropertyCard property={property} onSuccess={fetchProperties} />
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-8" />
                        <CarouselNext className="-right-8" />
                    </Carousel>
                    </div>
                )}
            </section>

            <section className="mt-10">
                <div className="mb-5">
                    <h2 className="text-2xl font-semibold">How it works</h2>
                    <p className="mt-2 text-muted-foreground">
                        OpenDoor keeps the process simple for both hosts and families.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="m-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <House className="h-5 w-5" />
                            </div>
                            <CardTitle>Hosts share available places</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Property owners can add homes and update availability in one place.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="m-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                <SendHorizontal className="h-5 w-5" />
                            </div>
                            <CardTitle>Families send requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                People who need housing can reach out and request a suitable stay.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="m-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <HandHeart className="h-5 w-5" />
                            </div>
                            <CardTitle>OpenDoor supports the connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                The platform helps make temporary housing more organized and easier to manage.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
