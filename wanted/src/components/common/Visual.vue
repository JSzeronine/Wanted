<template>
    <div class="visual" @mouseleave="outListener" @mouseenter="overListener">
        <ul :style="visualStyleOption" 
            @dragstart="dragStart" 
            @mousedown="downListener" 
            @mouseup="endListener" 
            @mousemove="moveListener" 
            @touchstart="touchStartListener" 
            @touchmove="touchMoveListener" 
            @touchend="touchEndListener">
            <li v-for="( item, index ) in setData.listData" ref="items" :key="index">
                <a :href="item.info.url" @click="linkClick">
                    <div class="bx_image" :style="{ backgroundImage : 'url(' + item.info.image + ')' }"></div>
                    <div class="info_container" ref="info">
                        <div class="info_content">
                            <div class="bx_info">
                                <dl>
                                    <dt>{{ item.title }}</dt>
                                    <dd>{{ item.summary }}</dd>
                                </dl>

                                <p><span>바로가기</span></p>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        </ul>

        <div class="control_container">
            <div class="bx_control">
                <a @click="showPrev" href="javascript:;">
                    <i></i>
                </a>
                <a @click="showNext" href="javascript:;">
                    <i></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { TweenMax } from "gsap";

export default {
    data()
    {
        return{
            SIZE_W : 768,
            DRAG_SPEC : 50,
            AUTO_TIME : 5,

            autoTimerFunc : 0,
            isDown : false,
            isLink : true,
            index : 0,
            len : 0,
            wW : 0,
            isShow : false,
            tX : 0,
            mX : 0,
            eW : 0,

            visualStyleOption : { left : "0px" }
        }
    },

    props : {
        setData : Object
    },

    created()
    {
        let list = this.setData.listData;

        let i = 0;
        const len = list.length;

        if( len > 4 ) return;

        let max = 0;

        switch( len )
        {
            case 1 : 
            case 2 : 
            case 4 : max = 4; break;
            case 3 : max = 3; break;
        }

        for( i; i<max; i++ )
        {
            list.push( list[ i % len ]);
        }
    },

    mounted()
    {
        this.resizeListener( null );
        window.addEventListener( "resize", this.resizeListener );

        this.showAutoPlay();
    },

    methods : {

        dragStart( $e )
        {
            this.isLink = false;
            this.closeInfo();
        },

        linkClick( $e )
        {
            if( !this.isLink ) $e.preventDefault();
        },

        showAutoPlay()
        {
            clearInterval( this.autoTimerFunc );
            this.autoTimerFunc = setInterval( this.showNext, this.AUTO_TIME * 1000 );
        },

        showAutoStop()
        {
            clearInterval( this.autoTimerFunc );
        },

        overListener( $e )
        {
            this.showAutoStop();
        },

        outListener( $e )
        {
            this.showAutoPlay();
            if( this.isDown ) this.endListener( null );
        },

        downListener( $e )
        {
            this.tX = $e.clientX;
            this.isDown = true;
        },

        moveListener( $e )
        {
            if( !this.isDown ) return;

            this.mX = $e.clientX - this.tX;
            this.showMove( this.mX );
        },

        endListener( $e )
        {
            this.showSwiperCheck( this.mX );
            this.isDown = false;
        },

        touchStartListener( $e )
        {
            this.tX = $e.touches[ 0 ].clientX;
            this.showAutoStop();
            this.closeInfo();
        },

        touchMoveListener( $e )
        {
            this.mX = $e.touches[ 0 ].clientX - this.tX;
            this.showMove( this.mX );
        },

        touchEndListener( $e )
        {
            this.showSwiperCheck( this.mX );
            this.showAutoPlay();
        },

        showSwiperCheck( $mX )
        {
            if( $mX < this.DRAG_SPEC * ( -1 ) ) this.showNext();
            else if( $mX > this.DRAG_SPEC )     this.showPrev();
            else                                this.showReset();

            this.tX = 0;
            this.mX = 0;
        },

        showMove( $mX )
        {
            this.visualStyleOption.left = $mX + "px";
        },

        resizeListener( $e )
        {
            this.wW = window.innerWidth;
            this.eW = this.$refs.items[ 0 ].clientWidth;
        },

        showPrev( $e )
        {
            this.index = 1;
            this.showSlide();
        },

        showNext( $e )
        {
            this.index = -1;
            this.showSlide();
        },

        showReset()
        {
            const vm = this;
            TweenMax.to( vm.visualStyleOption, 0.35, { left : "0px", ease:Expo.easeOut, onComplete:function(){
                vm.showInfo();
            } });
        },

        showSlide()
        {
            const vm = this;
            if( vm.isShow ) return;

            vm.isShow = true;
            vm.closeInfo();

            let posX = ( vm.index * vm.eW ) + "px";
            TweenMax.to( vm.visualStyleOption, 0.35, { left : posX, ease:Expo.easeOut, onComplete:function(){

                ( vm.index < 0 ) ? vm.setData.listData.push( vm.setData.listData.shift() ) : vm.setData.listData.unshift( vm.setData.listData.pop() );

                vm.visualStyleOption.left = "0px";
                vm.isShow = false;
                vm.isLink = true;

                vm.showInfo();
            }});
        },

        closeInfo()
        {
            if( this.wW <= this.SIZE_W ) return;

            this.$refs.info.forEach(( $item, $index ) => {
                if( $index == 2 ) return;
                TweenMax.killTweensOf( $item );
                TweenMax.set( $item, { y:10, opacity:0 });
            });
        },

        showInfo()
        {
            if( this.wW <= this.SIZE_W ) return;

            this.$refs.info.forEach(( $item ) => {
                TweenMax.killTweensOf( $item );
                TweenMax.set( $item, { y:10, opacity:0 });
                TweenMax.to( $item, .5, { opacity:1, y:0, ease:Expo.easeOut });
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/commons/_common.scss';

    .visual{ overflow: hidden; height: 300px; 
        ul{ position: relative;
            li{ width: 100%; height: 300px; position: absolute; left: 200%;
                a{ text-decoration: none; display: block; width: 100%; height: 100%; position: relative; 
                    .bx_image{ background-position: center; background-size: cover; width: 100%; height: 100%; background-repeat: no-repeat; }
                    .info_container{ position: absolute; left: 0px; top: 0px; width: 100%; margin-top: 132px; opacity: 1;
                        .info_content{ max-width: 1060px; margin: 0 auto; 
                            .bx_info{ width: 340px; background-color: #fff; border-radius: 5px;
                                dl{ border-bottom: 1px solid #eeeeee; padding: 15px 20px; 
                                    dt{ font-size: 26px; color: #333333; margin-bottom: 5px; }
                                    dd{ font-size: 16px; color: #666666; }
                                }

                                > p{ padding: 15px 20px; 
                                    span{ font-size: 18px; color: #258bf7; font-weight: bold; padding-right: 15px; background-image: url( "/static/images/icon_arrow_blue.png" ); background-repeat: no-repeat; background-position: right center; background-size: auto; }
                                }
                            }
                        }
                    }
                }

                $posX : -200%, -100%, 0%, 100%, 200%;
                @for $i from 1 through length( $posX ){
                    &:#{ nth-child( $i )}{
                        left: nth( $posX, $i );
                    }
                }
            }
        }

        .control_container{ position: absolute; left: 0px; top: 0px; width: 100%; height: 0px; 
            .bx_control{ max-width: 1060px; width: 100%; margin: 0 auto; text-align: right; margin-top: 233px; height: 0px; 
                a{ display: inline-block; width: 42px; height: 42px; text-decoration: none; background-color: rgba( 255, 255, 255, 0.5 ); border-radius: 100%;
                    i{ display: inline-block; width: 100%; height: 100%; background-position: center; background-repeat: no-repeat; }
                    &:first-child{ margin-right: 10px; 
                        i{ background-image: url( "/static/images/icon_arrow_black_prev.png" ); }
                    }

                    &:last-child{
                        i{ background-image: url( "/static/images/icon_arrow_black_next.png" ); }
                    }

                    &:hover{ background-color: rgba( 255, 255, 255, 1 ); }
                }
            }
        }
    }

    @media screen and( max-width: 1080px ) {
        .visual{
            ul{
                li{
                    a{
                        .info_container{ padding: 0 20px; }
                    }
                }
            }

            .control_container{ padding: 0 20px; }
        }
    }

    @media screen and( max-width : 768px ){
        .visual{ margin-top: 20px;
            ul{ 
                $mL : 60;
                $wW : 768 - (( $mL * 2 ) / 2 );
                margin-left: pImg( $mL );
                li{ width: pImg( $wW ); background-color: rgba( 0, 0, 0, 0 ); padding: 0 pImg( $mL / 3, $wW ); 
                    a{ border-radius: 5px; overflow: hidden; border: 1px solid #f0f0f0;
                        .bx_image{ height: 160px; }
                        .info_container{ width: 100%; position: relative; left: 0px; top: 0px; margin-top: 0px; padding: 0;
                            .info_content{ 
                                .bx_info{ width: 100%; border-radius: 0; 
                                    dl{ border: none; padding: 18px 20px;
                                        dt{ font-size: 18px; }
                                        dd{ font-size: 14px; }
                                    }

                                    > p{ font-size: 14px; padding: 12px 20px 20px; }
                                }
                            }
                        }
                    }

                    $posX : -$wW * 2, -$wW, 0, $wW, $wW * 2;
                    @for $i from 1 through length( $posX ){
                        &:#{ nth-child( $i )}{
                            left: pImg( nth( $posX, $i ));
                        }
                    }
                }
            }

            .control_container{ display: none; }
        }
    }

</style>


