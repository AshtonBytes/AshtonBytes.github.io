<script>
    import CtAs from "./CTAs.svelte";   
    import Header from "./Header.svelte";
    import SectionWrapper from "./SectionWrapper.svelte";
    import Stars from "./Stars.svelte";
    import { lightMode } from '../store';

</script>
<SectionWrapper id="hero">
    <Header/>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-20 relative text-base mt-xl">
        <div class="flex flex-col lg:flex-row items-center justify-between w-full"> <!-- Change flex direction based on screen size -->
            <h2 class="text-3xl sm:text-4xl md:text-5xl text-left {$lightMode ? "light" : "dark"} mr-0 lg:margin-xl">
                Need <span class="!font-bold text-400 aurivara-green">Software</span>?<br/>
                We Make it Fast, Clean,<br/>
                and Easy to Use!<br/>
                Satisfaction Guaranteed!
                <div class = "margin-xl">
                    <p class="text-xl text-left mx-auto w-full">
                        Are you a small business with under 50 employees looking to get a
                        Software as a Service App, Website, or Mobile App? If so, we will deliver that
                        software on the deadlines you need. Our All American Team can't wait to create and fulfill
                        a golden promise with you.
                    </p>
                </div>
                
                <div class = "margin-xl">
                    <CtAs />
                </div>
                <div class="margin-xl">
                    <Stars />
                </div>
            </h2>
        </div>
        <img src="assets/HeroImage.jpg" alt="Programming" class="w-full beveledCorners dropShadow" /> <!-- Adjust image width as needed -->
    </div>
</SectionWrapper>