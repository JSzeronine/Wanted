<template>
    <div class="main">
        <Visual v-if="showVisual" :setData="{ listData }" />
    </div>
</template>

<script>
import Visual from '@/components/common/Visual';
export default {

    data()
    {
        return{
            showVisual : false,
            listData : []
        }
    },

    mounted()
    {
        this.$store.dispatch( "load" ).then(() => {
            this.listData = this.$store.getters.getData;
            this.showVisual = true;
        });
    },

    components : {
        Visual
    },
}

</script>

<style lang="scss" scoped>
    .main{}
</style>


