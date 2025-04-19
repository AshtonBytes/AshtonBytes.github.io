<script>
    import ReviewCard from "./ReviewCard.svelte";
    import SectionWrapper from "./SectionWrapper.svelte";
    import Stars from "./Stars.svelte";
    import { lightMode } from '../store';

    let lim = true

    let reviewsList = [
        {
            name: "John Doe",
            review: "“Aurivara was talented and professional. They were able to develop code to meet my needs. They also gave me options to increase the overall capabilities of their code which made for complete and powerful solutions to my requests. They have an excellent programmer / engineer that used various languages / code to complete the project on schedule and within budget. I look forward to working again with Aurivara again on futures projects.” <Example Review>",
            features: [
                "“Talented and Professional”"
            ]
        },
        {
            name: "John Doe",
            review: "Aurivara has a very respectful and a wonderful developer. He helped solve a crash on an application we use inbouse. Several other have tried to solve this without success and Aurivara solved it for us.” <Example Review>",
            features: [
                "“Several others have tried […] Aurivara solved it”"
            ]
        },
        {
            name: "John Doe",
            review: "“Aurivara was talented and professional. They were able to develop code to meet my needs. They also gave me options to increase the overall capabilities of their code which made for complete and powerful solutions to my requests. They have an excellent programmer / engineer that used various languages / code to complete the project on schedule and within budget. I look forward to working again with Aurivara again on futures projects.” <Example Review>",
            features: [
                "“Talented and Professional”"
            ]
        },
        {
            name: "John Doe",
            review: "Aurivara has a very respectful and a wonderful developer. He helped solve a crash on an application we use inbouse. Several other have tried to solve this without success and Aurivara solved it for us.” <Example Review>",
            features: [
                "“Several others have tried […] Aurivara solved it”"
            ]
        },
        {
            name: "John Doe",
            review: "“Aurivara was talented and professional. They were able to develop code to meet my needs. They also gave me options to increase the overall capabilities of their code which made for complete and powerful solutions to my requests. They have an excellent programmer / engineer that used various languages / code to complete the project on schedule and within budget. I look forward to working again with Aurivara again on futures projects.” <Example Review>",
            features: [
                "“Talented and Professional”"
            ]
        },
        {
            name: "John Doe",
            review: "Aurivara has a very respectful and a wonderful developer. He helped solve a crash on an application we use inbouse. Several other have tried to solve this without success and Aurivara solved it for us.” <Example Review>",
            features: [
                "“Several others have tried […] Aurivara solved it”"
            ]
        }
    ]
</script>
<SectionWrapper id="reviews">
    <div class="flex flex-col gap-10 sm:gap-14 md:gap-24 py-20 flex-1 items-center justify-center {$lightMode ? "light" : "dark"}">
        <div class="flex flex-col gap-2">
            <p class="opacity-60 text-base sm:text-lg md:text-xl text-center">
                Don't just take our word for it
            </p>
            <h3 class="text-4xl sm:text-5xl md:text-6xl max-w-[1000px] mx-auto w-full font-semibold text-center">
                See What <span class="text-400 red">Others</span> Have To Say
            </h3>
        </div>
        <div class="flex flex-col md:flex-row gap-8 w-fit mx-auto">
            <div class="flex flex-col gap-8">
                {#each lim ? reviewsList.slice(0,4) : reviewsList as reviewItem, index}
                    <ReviewCard {reviewItem} left={true} {index}/>
                {/each}
            </div>
            <div class="w-[1px] bg-slate-950 hidden md:flex"></div>
            <div class="flex flex-col gap-8">
                {#each lim ? reviewsList.slice(0,4) : reviewsList as reviewItem, index}
                    <ReviewCard {reviewItem} left={false} {index}/>
                {/each}
            </div>
        </div>
        <button on:click={() => lim = !lim} class="conversionBtnOne {$lightMode ? "light" : "dark"}">
            <p>{lim ? "Show More" : "Show Less"}</p>
        </button>
        <div class="flex flex-col gap-10">
            <p class="mx-auto text-lg sm:text-xl md:text-2xl font-semibold">
                Trusted by 639 Professionals
            </p>
            <Stars/>
        </div>
    </div>
</SectionWrapper>