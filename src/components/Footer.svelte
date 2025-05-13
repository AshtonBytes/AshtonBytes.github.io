<script>
    import { lightMode } from "../store";

    function toggleTheme() {
        lightMode.update(mode => !mode); // Flip the theme state
    }
</script>

<footer class="py-16 sm:py-20 md:py=24 px-4 md:px-8 {$lightMode ? "light" : "dark"}">
    <div class="max-w-[1200] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base">
        <div class="flex flex-col justify-center items-center gap-4 md:-col-span-2">
            <h1 class="font-semibold">
                <img src="assets/AurivaraLogo.png" alt="Aurivara LLC. Logo" style="height: var(--space-3xl); width: auto;"/>
            </h1>
            <p>©2025 Aurivara LLC. All Rights Reserved.</p>
        </div>
        <div class="flex justify-center items-center flex-col gap-4">
            <p class="font-bold poppins text-base sm:text-lg">Support</p>
            <a href="mailto:contact@aurivara.com" target ="_blank" class="hyperLink cursor-pointer hover:text-400 duration-200">
                Contact Us
            </a>
        </div>
        <div class="flex justify-center items-center flex-col gap-4">
            <p class="font-bold poppins text-base sm:text-lg">Business Hours</p>
            <p>Monday - Friday 9:00 AM - 5:00 PM CST</p>
        </div>
        <!-- <div class="flex flex-col gap-4">
            <p class="font-bold poppins text-base sm:text-lg">Follow Us</p>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target ="_blank" class="hyperLink cursor-pointer hover:text-400 duration-200">
                <i class="fa-brands fa-facebook pr-2"></i>
                Facebook (TODO)
            </a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target ="_blank" class="hyperLink cursor-pointer hover:text-400 duration-200">
                <i class="fa-brands fa-instagram pr-2"></i>
                Instagram (TODO)
            </a>
        </div> -->
        <div class="flex justify-center items-center">
            <button
            on:click={toggleTheme}
            class="toggle-button {$lightMode ? "light" : "dark"}"
            aria-label={$lightMode ? "Switch to dark mode" : "Switch to light mode"}>
                <div class="toggle-slider {$lightMode ? "light" : "dark"}" class:active={$lightMode}></div>
            </button>
        </div>
    </div>
</footer>