<script>
 export let keyStr;
 export let inCols=false;

 let flexSet = inCols ? "flex-col sm:flex-row":"";
</script>

<div class='flex {flexSet} space-x-4 mt-2'>
    <div class='text-gray-400'>{keyStr}:</div>
    <div class='prose-p:m-0'>
        <slot />
    </div>
</div>
