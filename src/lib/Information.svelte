<script>
 export let keyStr;
 export let valueStr;
</script>

<div class='flex space-x-4 mt-2'>
    <div class='text-gray-400'>{keyStr}:</div>
    <div class='prose-p:m-0'>{@html valueStr}</div>
</div>
