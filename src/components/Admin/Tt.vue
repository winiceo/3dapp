<template>
    <div class="page ">
    <h1>Vue-validator</h1>

    <table class="form">
        <tr  >
            <td>First name</td>
            <td><input type="text" v-model="form.name" v-valid="required,alpha" value="Rado" lazy/> (lazy)  </td>
        </tr>
        <tr @class="invalidText: !validator.form.age.valid">
            <td>Age</td>
            <td><input type="text" v-model="form.age" v-valid="required,integer,min: 10" number/></td>
        </tr>



        <tr >
            <td></td>
            <td><button @click="onSave">Save</button> <span v-if="isModified">modified</span></td>
        </tr>
    </table>
    <br/>



    <br/>
    form data: <br/>
<pre style="font-size:11px">
{{form | json}}
</pre>
    <br/>
    validator: <br/>
<pre style="font-size:11px">
{{validator | json}}
</pre>
        </div>
</template>
<style>

</style>
<script>

    export default{
        data(){
            return {
                validator: {},
                form: {
                    name: '',
                    age: null


                }
            }
        } ,
        components: {
            test: {
                template: '<input type="text" v-model="text" value="">',
                compiled: function () {
                    this.$watch('text', function (value) {
                        this.$parent.form.text = value;
                    })
                }
            }
        },
        computed: {
            isValid: function () {
                this.validator;

                return Object.keys(this.validator.form).every(function (key) {
                    return this.validator.form[key].valid;
                }.bind(this));
            },
            isModified: function () {
                this.validator;

                return Object.keys(this.validator.form).some(function (key) {
                    return this.validator.form[key].modified;
                }.bind(this));
            }
        },
        methods: {

            onSave: function () {
                alert('form is '+(this.$valid() ? 'VALID' : 'INVALID'));
            }
        }
    }
</script>