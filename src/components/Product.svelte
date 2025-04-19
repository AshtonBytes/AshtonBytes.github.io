<script>
    import ProductCard from "./ProductCard.svelte";
    import SectionWrapper from "./SectionWrapper.svelte";
    import { lightMode } from '../store';
    
    let productFeatures = [
        {
            featureList: [
                "We create a clear, specific, initial report.",
                "You receive a timeline for completion of milestones.",
                "Consistent communication and updates during development.",
                "Ready to revise and make additions on your schedule."
            ],
            description: "Speak to our American team to plan development.",
            imgUrl: "assets/HeroImage.jpg",
        },
        {
            featureList: [
                "Never go without a working version of the software.",
                "Automated Test Generation keeps your software stable.",
                "Always ready to adapt to new requests and reports.",
                "Building software for long term maintainability."
            ],
            description: "Receive an software update every 2 weeks.",
            imgUrl: "assets/HeroImage.jpg",
        },
        {
            featureList: [
                "Desktop, Web, and Mobile Apps",
                "Hardware, APIs, Wireless Communication, Cryptography.",
                "See if your project qualifies for the Learning on the Job Package."
            ],
            description: "While we may know a lot, there is always more to learn.",
            imgUrl: "assets/HeroImage.jpg",
        },
    ];
</script>

<SectionWrapper id="product">
    <div class="flex flex-col gap-10 sm:gap-14 md:gap-24 flex-1 items-center justify-center pb-10 md:pb-14 {$lightMode ? "light" : "dark"}">
        <div class="flex flex-col gap-2">
            <p class="opacity 60 text-base sm:text-lg md:text-xl text-center">
                Unlock the potential of your business...
            </p>
            <h3 class="text-4xl sm:text-5xl md:text-6xl max-w-[1000px] mx-auto w-full font-semibold text-center">
                What We Can Do For You
            </h3>
        </div>
        {#each productFeatures as productFeature, index}
            <ProductCard {productFeature} {index}>
                {#if index === 0}
                    <span class="text-400 font-medium">Enjoy Hassle Free Communication</span>
                {:else if index === 1}
                    <span class="text-400 font-medium">Leverage Agile Development</span>
                {:else}
                    <span class="text-400 font-medium">Utilize Our Expertise</span>
                {/if}
            </ProductCard>
        {/each}
    </div>
</SectionWrapper>

        