<script>
 export let keyStr;
</script>

<div class='flex space-x-4 mt-2'>
    <div class='text-gray-400'>{keyStr}:</div>
    <div class='prose-p:m-0'>
        <slot />
    </div>
</div>
