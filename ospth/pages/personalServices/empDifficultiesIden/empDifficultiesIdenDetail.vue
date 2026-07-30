<template>
    <div class="living-allowance-add">
        <div class="modal-btn">
            <ta-button type="primary" @click="$router.go(-1)">返回</ta-button>
        </div>
        <div class="content-box">
   
        </div>
    </div>
</template>

<script>

    export default {
        name: 'livingAllowanceAdd',
        props: {},
        components: {

        },
        data() {
            return {
                queryForm: {},

            }
        },
        created() {
            this.userInfo = this.$route.params || {}
            this.userInfo.userType = 'UT01'
            this.paramsBankCard = this.userInfo
        },
        mounted() {

        },
        methods: {

        },
    }
</script>

<style scoped>
    .living-allowance-add {
        width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .content-box {
        margin-top: 20px;
    }

    .sub-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        padding: 10px 0;
        background-color: #afd2f0;
        border-bottom: 2px solid #e8e8e8;
        margin-bottom: 20px;
    }

    .form-box {
        margin-bottom: 30px;
    }

    .modal-btn {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
    }

    .modal-btn .ta-button {
        margin-left: 10px;
    }

    .btn-box {
        display: flex;
        justify-content: space-around;

        .btn {
            cursor: pointer;
        }
    }

    .tips {
        color: red;
        font-size: 16px;
        font-weight: bold;
        margin-top: -33px;
    }

    /* 统一输入框和下拉框宽度，确保对齐 */
    .ta-form-item .ta-input,
    .ta-form-item .ta-select {
        width: 180px;
    }

    /* 针对特定长标签的输入框，保持一致的宽度 */
    .ta-form-item[label-width="220px"] .ta-input {
        width: 180px;
    }
</style>