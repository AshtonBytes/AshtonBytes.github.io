<script>
    import SectionWrapper from "./SectionWrapper.svelte";
    import { lightMode } from '../store';

    let faqs = [
        {
            question:"What would qualify me for this service?",
            answer:"If you represent a small business of 50 people or less, and are looking to expand into software with a Software as a Service application, Website, or Mobile App, you are our ideal client."
        },
        {
            question:"How much will this cost me?",
            answer:"We charge competitive pricing by month. If we for any reason don't fulfill a golden promise in time, \
            you will not be charge for the tardiness. However, if we complete the project ahead of schedule, you will reap the savings."
        },
        {
            question:"What do I get in the end, or if I cancel the project early?",
            answer:"Great question, you'll receive the source code of the project, in addition to a full documentation package \
            to ease the transition back into the project if it is picked back up again."
        }
    ]

</script>
<SectionWrapper id="faqs">
    <div class="flex flex-col gap-10 sm:gap-14 md:gap-24 py-20 flex-1 items-center justify-center {$lightMode ? "light" : "dark"}">
        <div class="flex flex-col gap-2">
            <p class="opacity-60 text-base sm:text-lg md:text-xl text-center">
                For All Questions, Qualms, and Queries
            </p>
            <h3 class="text-4xl sm:text-5xl md:text-6xl max-w-[1000px] mx-auto w-full font-semibold text-center">
                Frequently Asked Questions
            </h3>
        </div>
        <div class="flex flex-col gap-8 sm:gap-10 md:gap-14 w-full">
            {#each faqs as faq}
                <div class="flex flex-col gap-2 text-left max-w-[800px] w-full mx-auto relative p-4 px-6">
                    <div class="absolute top-0 left-0 w-1/3 h-[1px] bg-950 -translate-x-4"></div>
                    <div class="absolute top-0 left-0 h-2/3 w-[1px] bg-950 -translate-y-4"></div>
                    <h4 class="font-semibold text-lg sm:text-xl md:text-2xl pt-2">
                        {faq.question}
                        <div class="h-[2px] grayBackground w-1/4 mr-auto mb-4 mt-2"></div>
                    </h4>
                    <p class="pl-2">{faq.answer}</p>
                </div>
            {/each}
        </div>
    </div>
</SectionWrapper>