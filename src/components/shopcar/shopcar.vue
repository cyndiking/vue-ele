<template>
  <div class="shopcar">
    <div class="content" @click = "toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass"> {{payDesc}}</div>
        <div></div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" tag="div" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!--购物车详情页-->
    <transition name="fold">
      <div class="shopCart-list" v-show="listshow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" @drop="drop"></cartcontrol>
            </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!--背景模糊图-->
    <transition name="fade">
      <div class="list-mask" v-show="listshow" @click="hidelist"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';
  export default {
    props: {
        selectFoods: {
            type: Array,
            default() {
                return [
//                  {
//                      price: 10,
//                      count: 1
//                  }
                ];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
          type: Number,
          default: 0
        }
      },
    data() {
      return {
        balls: [{
          show: false,
          id: 1
        },
          {
            show: false,
            id: 2
          },
          {
            show: false,
            id: 3
          },
          {
            show: false,
            id: 4
          },
          {
            show: false,
            id: 5
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
        totalPrice() {
          let total = 0;
          this.selectFoods.forEach((food) => {
            total += food.price * food.count;
          });
            return total;
        },
        totalCount() {
          let count = 0;
          this.selectFoods.forEach((food) => {
            count += food.count;
          });
          return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
               let diff = this.minPrice - this.totalPrice;
              return `还差￥${diff}元起送`;
            } else {
              return '去结算';
            }
        },
        payClass() {
            if (this.totalPrice < this.minPrice) {
                return 'not-enough';
            } else {
                return 'enough';
            }
        },
        listshow() {
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                   if (!this.scroll) {
                     this.scroll = new BScroll(this.$refs.listContent, {
                       click: true
                     });
                   } else {
                       this.scroll.refresh();
                   }
                });
            }
            return show;
        }
      },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
//            触发浏览器重绘
        this.$nextTick(() => {
          el.style.display = '';
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
          if (!this.totalCount) {
              return;
          }
          this.fold = !this.fold;
      },
      hidelist() {
        this.fold = true;
      },
      empty() {
          this.selectFoods.forEach((food) => {
              food.count = 0;
          });
      },
      pay() {
          if (this.totalPrice < this.minPrice) {
              return;
          }
          window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";
  .shopcar
    position :fixed
    left :0
    bottom :0
    z-index :50
    width :100%
    height :48px
    background :#000
    .content
      display :flex
      background :#141d27
      font-size :0
      .content-left
        flex :1
        .logo-wrapper
          display :inline-block
          vertical-align :top
          position :relative
          top :-10px
          margin :0 12px
          padding :6px
          width :56px
          height :56px
          box-sizing :border-box
          border-radius :50%
          background :#141d27
          .logo
            width :100%
            height :100%
            border-radius :50%
            text-align :center
            background :#2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height :44px
              font-size :24px
              color :#80858a
              &.highlight
                color :#fff
          .num
            position :absolute
            top:0
            right:0
            width :24px
            height :16px
            line-height :16px
            text-align :center
            border-radius :16px
            font-size :9px
            font-weight :700
            color :#fff
            background :rgb(240,20,20)
            box-shadow :0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display :inline-block
          vertical-align :top
          margin-top: 12px
          line-height :24px
          box-sizing :border-box
          padding-right : 12px
          border-right :1px solid rgba(255,255,255,0.1)
          font-size :16px
          font-weight :700
          color :rgba(255,255,255,0.4)
          &.highlight
            color :#fff
        .desc
          display :inline-block
          vertical-align :top
          line-height :24px
          margin :12px 0 0 12px
          font-size :10px
          color :rgba(255,255,255,0.4)
      .content-right
        flex :0 0 105px
        width :105px
        .pay
          line-height :48px
          height :48px
          text-align :center
          font-size :12px
          font-weight :700
          color :rgba(255,255,255,0.4)
          background :#2b333b
          &.not-enough
            background :#2b333b
          &.enough
            background :#00b43c
            color :#fff
    .ball-container
      .ball
        position: fixed
        left:32px
        bottom: 22px
        z-index: 50
        &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.4)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background-color: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopCart-list
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: -1
      transform: translate3d(0, -100%, 0)  //相对于当前自身高度做偏移
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background-color: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px		//超过该高度不再无限增高
        background-color: #fff
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            bottom: 12px
            right: 90px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 5px
      .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -10
        background-color: rgba(7, 17, 27, 0.6)
        backdrop-filter: blur(10px)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.5s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          background-color: rgba(7, 17, 27, 0)


  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -10
    background-color: rgba(7, 17, 27, 0.6)
    backdrop-filter: blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background-color: rgba(7, 17, 27, 0)

</style>
<!--
http://www.cnblogs.com/Zsmile/p/6256651.html
//inner就是小球

http://cubic-bezier.com/#.23,1.1,.57,1.53
贝塞尔曲线的动画


小球这段需要好好看看
.ball-container
    .ball
      position: fixed
      left:32px
      bottom: 22px
      z-index: 50
      &.drop-enter-active
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.4)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background-color: rgb(0, 160, 220)
          transition: all 0.4s linear

           <transition-group name="drop" tag="div" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
-->
