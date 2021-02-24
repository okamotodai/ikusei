//HTMLとJSの基本構造をコンポーネント化することにより、再利用がより簡単になる＆コードメンテのコストダウンになる
//productというキーでコンポーネント化。htmlで<product>を記述することによりコンポーネント部分を表示できる。
Vue.component('product', {
    //propsを使ってコンポーネントが受け取る値を指定する。Boolean型で必須であることを記述している。
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    //コンポーネント化されたJSに伴うhtml部分
    template: `
    <div class="product">
        <!-- 商品の画像 -->
        <div class="product-image">
            <img v-bind:src="image" />
        </div>

        <!-- 商品の情報 -->
        <div class="product-info">
            <h1>{{ product }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>shipping: {{ shipping }}</p>
            <p>User is premium: {{ premium }}</p>

            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
            Add to cart
            </button>
        
        </div>

        <!-- 商品のレビュー -->
        <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
       </div>

       <!-- product-reviewというコンポーネントの内容を表示。submitされたときにaddReview関数を呼ぶ。 -->
        <product-review @review-submitted="addReview"></product-review>

    </div>
    `,
    //コンポーネント化されたJS部分。商品情報を設定。
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            //variants[]に色、画像情報、在庫をvariantIdをキーに管理している。
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue.jpg",
                    variantQuantity: 5
                }
            ],
            //レビューの情報を蓄える配列
            reviews: []
        }
    }, 
    methods: {
        //「カートに追加」ボタンが押される度に呼ばれる。商品のIDをhtml側に渡す。
        //ここでカートをコンポーネント化しない理由は、複数商品間でカートの中身を共有する必要があるため。（商品が選択される度にカート内がリフレッシュされない）
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        } ,
        addReview(productReview) {
            this.reviews.push(productReview)
          }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    }
})

//product-reviewというコンポーネント
//商品に関するレビューに関するコード
Vue.component('product-review', {
    template: `
    <!-- 商品のレビューを記入するためのフォームを提供 -->
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>


    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        //name,review,ratingが入力されたときにproductReviewに設定。各項目を初期化。入力されていない項目についてはエラー情報をerrors[]に追加。
        onSubmit() {
            if(this.name && this.review && this.rating) {
              let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
              }
              this.$emit('review-submitted', productReview)
              this.name = null
              this.review = null
              this.rating = null
            } else {
              if(!this.name) this.errors.push("Name required.")
              if(!this.review) this.errors.push("Review required.")
              if(!this.rating) this.errors.push("Rating required.")
            }
          }
    }
})

//Vueインスタンスを作成。「app」キーによりhtmlとリンクする
var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})
Vue.config.devtools = true;
