import { content } from "@/lib/content";
import InvitationGate from "@/components/InvitationGate";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import Message from "@/components/Message";
import Venue from "@/components/Venue";
import AddToCalendar from "@/components/AddToCalendar";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
// [HIDDEN] Ninong & Ninang section — hidden per client request (2026-06-14).
// To restore: uncomment this import AND the <Godparents /> line below.
// import Godparents from "@/components/Godparents";
import DressCode from "@/components/DressCode";
import Safety from "@/components/Safety";
import Gifts from "@/components/Gifts";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { PaperGrain } from "@/components/Decor";
import { PhotoModalProvider } from "@/components/PhotoModal";

export default function Home() {
  return (
    <PhotoModalProvider>
      <main className="relative">
        {/* Pressed-paper grain over the whole page */}
        <PaperGrain />
        <MusicPlayer />

        <InvitationGate />

        <Hero />

        <Section label="Counting Down to the Big Day" title="The Celebration Begins In">
          <Reveal>
            <Countdown />
          </Reveal>
        </Section>

        <Message />

        <Section label="Where & When" title="Join Us" className="bg-wash-soft">
          <div className="space-y-16">
            <Venue data={content.ceremony} />
            <Venue data={content.reception} reversed />
          </div>
          <AddToCalendar />
        </Section>

        <Timeline />

        <Gallery />

        {/* [HIDDEN] Ninong & Ninang section — hidden per client request (2026-06-14).
            To restore: uncomment the Godparents import at the top AND the line below.
            Unhide this when Theo (ME) requests it. */}
        {/* <Godparents /> */}

        <DressCode />

        <Safety />

        <Gifts />

        <Footer />
      </main>
    </PhotoModalProvider>
  );
}
