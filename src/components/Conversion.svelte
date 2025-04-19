<script>
    import CtAs from "./CTAs.svelte";
    import { lightMode } from '../store';

</script>
<section class="py-14 md:py-20 flex flex-col gap-8 special {$lightMode ? "light" : "dark"} text-center items-center justify-center">
    <h4 class="text-xl sm:text-2xl md:text-3xl poppins">
        End your <span class="poppins font-bold">Shrinkage Problem</span> Today
    </h4>
    <p class="poppins text-base sm:text-lg md:text-xl">
        Sign Up For the Waitlist!
    </p>
    <CtAs/>
</section>