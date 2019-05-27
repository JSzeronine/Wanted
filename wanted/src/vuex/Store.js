import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import axios from "axios";

Vue.use( Vuex );

export default new Vuex.Store({
    state : {
        data : []
    },

    mutations : {
        setData( state, $data )
        {
            state.data = $data
        }
    },

    actions : {
        load({ commit })
        {
            return new Promise(( resolve, reject ) => {
                axios.get( "https://s3.ap-northeast-2.amazonaws.com/static.wanted.co.kr/homework/data.json" ).then(( res ) => {
                    commit( "setData", res.data );
                    resolve();
                });
            });
        }
    },

    getters : {
        getData( state )
        {
            return state.data;
        }
    }
})