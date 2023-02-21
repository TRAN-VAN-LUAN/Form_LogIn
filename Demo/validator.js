

function Validator(options) {
      var selectorRules = {};

      function Parents(inputElemet, selector){
            while(inputElemet.parentElement){
                  if(inputElemet.parentElement.matches(selector)){
                        return inputElemet.parentElement;
                  }
                  inputElemet = inputElemet.parentElement;
            }
      }

      function validate (inputElemet, rule) {
            var errorElemet = Parents(inputElemet,options.formGroup).querySelector(options.error);

            var rules = selectorRules[rule.selector];

            for(var i =0; i < rules.length; i++){
                  errorMessage = rules[i](inputElemet.value);
                  if(errorMessage) break;
            }

            if(errorMessage){
                  errorElemet.innerText=errorMessage;
                  errorElemet.classList.add('invalid');
            }
            else{
                  errorElemet.innerText='';
                  errorElemet.classList.remove('invalid');

            }

            return !errorMessage;
      }
      var formElement= document.querySelector(options.form);
      if(formElement){
            formElement.onsubmit= function(e){
                  e.preventDefault();
                  
                  var isFormValid = true;
                  options.rules.forEach(function( rule){
                  var inputElemet= formElement.querySelector(rule.selector);
                 var isvalid = validate(inputElemet,rule);
                 if(!isvalid){
                  isFormValid = false;
                 }
                       
            });
           
            if(isFormValid){

                 if(typeof options.onSubmit === 'function'){
                  var enableInputs = formElement.querySelectorAll('[name]');
                  var formValues = Array.from(enableInputs).reduce( function (values, input){
                        return ((values[input.name] = input.value) && values)
                  }, {});
                  options.onSubmit(formValues);
                 }
            } else{
                  formElement.onsubmit();
            }


            }

            options.rules.forEach(function( rule){
              if(Array.isArray(selectorRules[rule.selector])){
                  selectorRules[rule.selector].push(rule.test);
              }else{
                  selectorRules[rule.selector] = [rule.test];
              }

               var inputElemet= formElement.querySelector(rule.selector);
               if(inputElemet){
                        inputElemet.onblur = function (){
                        validate(inputElemet,rule);
                        }

                        inputElemet.oninput = function () {
                        var errorElemet = Parents(inputElemet,options.formGroup).querySelector(options.error);
                        errorElemet.innerText='';
                        errorElemet.classList.remove('invalid');
                        }

               }
            });
      }

      let password = document.getElementById('password');
      password.type = password.type == 'text' ? 'password' : 'text';

      password = document.getElementById('password_Confirmation');
      password.type = password.type == 'text' ? 'password' : 'text';
}

Validator.isRequired = function(selector, message) {
      return {
            selector: selector,
            test:  function (value) {
                  return value.trim() ? undefined : message ||'vui lòng nhập trường này'
            }
      }
}

Validator.isMail = function (selector, message) {
      return {
            selector: selector,
            test:  function (value) {
                  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                  return regex.test(value) ? undefined : message || 'vui long nhập lại email';
            }
      }
}

Validator.isPassword = function(selector, min, message){
      return {
            selector: selector,
            test: function (value){
                  return value.length >= min ? undefined : message || `mật khẩu tối thiểu ${min} ký tự`;
            }
      }
}

Validator.isConfirmed = function(selector, confirmationValue, message){
   return {
      selector: selector,
      test: function(value){
           return value ===confirmationValue() ? undefined : message;
   }
   }

}