<script>
 export let text;
 export let href;
</script>

<a class="button group overflow-hidden px-6 h-12 rounded-btn rounded-full flex space-x-2 items-center" href={href}>
    <span class="text-sm text-white">{text}</span>
    <div class="flex items-center -space-x-3 translate-x-3">
        <div class="w-2.5 h-[1.6px] rounded bg-white origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </div>
</a>
