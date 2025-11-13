import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvents from "@/components/BookEvents";
import {IEvent} from "@/database";
import {getSimilarEventsBySLug} from "@/lib/actions/event.actions";
import EventCards from "@/components/EventCards";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem =({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
    <div className="flex-row-gap-2">
        <Image src={icon} alt={alt} width={24} height={24} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agendas</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-2 flex-wrap">
        {tags.map((tag) => (
            <div key={tag} className="pill">{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async({ params }: { params: Promise<{ slug: string }>}) => {

    'use cache';
    cacheLife('hours');

    const { slug } = await params;

    const request = await fetch(`${BASE_URL}/api/events/${slug}`);
    const { event } = await request.json();

    if(!event) return notFound();

    const bookings = 10;

    const similarEvents: IEvent[] = await getSimilarEventsBySLug(slug);

    return (
        <section id="event">
            <div className='header'>
                <h1> Event Description</h1>
                <p>{event.description}</p>
            </div>

            <div className="details">
                {/*Left Side - Event Content*/}
                <div className="content">
                    <Image src={event.image} alt="Event Banner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{event.overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
                    </section>

                    <EventAgenda agendaItems={event.agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{event.organizer}</p>
                    </section>

                    <EventTags tags={event.tags} />

                </div>
                {/*Right Side - Booking Form*/}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ?
                            (<p className="text-sm">
                                Join {bookings} people who have already booked their spot.
                            </p>)
                            : (<p className="text-sm">
                                Be the first one to book your spot!
                            </p>)
                        }

                        <BookEvents eventId={event._id} slug={slug}/>
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2> Similar Events </h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map(
                        (similarEvent: IEvent) => (
                            <EventCards key={ similarEvent._id } {...similarEvent} />
                        )
                    )}
                </div>
            </div>
        </section>
    )
}
export default EventDetailsPage;
