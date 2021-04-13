!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.tegund=e():t.tegund=e()}(this,(function(){return t={941:(t,e,i)=>{const{isString:n,whatType:r,isFunction:s}=i(449);class a extends Error{constructor({message:t="validate error!",source:e}={}){super(t),n(t)||s(t)||console.error("message expected a string || function"),this.status=400,this.message="function"==typeof t?t(e):t,this.source=e,this.name="ValidateError"}}t.exports={ValidateError:a,ValidateTypeError:class extends a{constructor({type:t,message:e,field:i,...n}={}){super(n),this.type=t,this.name="ValidateTypeError",this.message=`${i?i+"is":""}expected a ${t} type, got a ${r(this.source)}`}}}},802:(t,e,i)=>{const{assert:n,isUndefined:r,isNull:s,isNaN:a,isArray:o,isString:h}=i(449);t.exports={objectOverflow:function(t,e){for(const i in t)if(!(i in e))return i},relateDate:function(t,e){n(t,"Date"),n(e,"Date");const i=t.getTime(),r=e.getTime();return i===r?0:i<r?-1:1},formatDate:function(t){return n(t,"Date"),t.toISOString()},defineUnEnumerableProperty:function(t,e,i){Object.defineProperty(t,e,{value:i,enumerable:!1,writable:!0})},removeEmpty:function(t,{removeUndefined:e=!0,removeNull:i=!0,removeNaN:h=!1,removeEmptyString:c=!1,removeEmptyArray:l=!1,removeFalse:d=!1}={}){n(t,"Object");const u={};for(const n in t){const m=t[n];e&&r(m)||i&&s(m)||h&&a(m)||c&&""===m||l&&o(m)&&0===m.length||d&&!1===m||(u[n]=m)}return u},format2TypeString:function(t){const{T:e}=i(620);return t instanceof e?t._type:h(t)?t:void 0},format2Type:function(...t){const{T:e}=i(620),n=i(183),r=[];for(const i of t)if(i instanceof e)r.push(i);else{if(!h(i)||!(i in n))throw new Error("type is not a valid T || t alias");r.push(n[i]())}return r}}},631:(t,e,i)=>{const n=i(183),r=i(620),s=i(941),{allValidates:a,getValidateByType:o,assert:h}=i(449),{defineUnEnumerableProperty:c,removeEmpty:l}=i(802);t.exports={...n,...r,...s,...a,getValidateByType:o,assert:h,defineUnEnumerableProperty:c,removeEmpty:l}},523:(t,e,i)=>{const{assert:n,isFunction:r,isDate:s}=i(449),{relateDate:a,formatDate:o}=i(802),{ValidateError:h}=i(941),c={length(t,e){return n(t,"Integer","length expected a integer"),n(t,(t=>t>=0),"length expected a integer gte then 0"),this._length=t,this.addValidator({name:"Length",validator:this._validateLength.bind(this),message:e||(t=>`expected a ${this._type}, length at ${this._length}, but got a length: ${t.length}`)}),this},min(t,e){return n(t,"Integer","min expected a integer"),n(t,(t=>t>0),"min expected a integer gte then 0"),this._max&&n(t,(t=>t<=this._max),`min expected a integer lte then max: ${this._max}`),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a ${this._type}, length gte than ${this._min}, but got a length: ${t.length}`)}),this},max(t,e){return n(t,"Integer","max expected a integer"),n(t,(t=>t>0),"max expected a integer gte then 0"),this._min&&n(t,(t=>t>=this._min),`min expected a integer lte then max: ${this._min}`),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a ${this._type}, length lte than ${this._max}, but got a length: ${t.length}`)}),this},_validateLength(t){if(void 0!==this._length&&["String","Array"].includes(this._type))return t.length===this._length},_validateMin(t){if(void 0!==this._min&&["String","Array"].includes(this._type))return t.length>=this._min},_validateMax(t){if(void 0!==this._max&&["String","Array"].includes(this._type))return t.length<=this._max}},l={min(t,e){return n(t,"Integer","min expected a integer"),this._max&&n(t,(t=>t<=this._max),`min expected a integer lte then max: ${this._max}`),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a ${this._type}, value gte than ${this._min}, but got a: ${t}`)}),this},max(t,e){return n(t,"Integer","max expected a integer"),this._min&&n(t,(t=>t>=this._min),`min expected a value integer lte then max: ${this._min}`),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a ${this._type}, value lte than ${this._max}, but got a: ${t}`)}),this},_validateMin(t){if(void 0!==this._min&&["Number","Integer","Float"].includes(this._type))return t>=this._min},_validateMax(t){if(void 0!==this._max&&["Number","Integer","Float"].includes(this._type))return t<=this._max}},d={min(t,e){return n(t,"Date","min expected a date"),this._max&&n(t,(t=>-1===a(t,this._max)),`min scope expected a date before ${o(this._max)}, but got a ${o(t)}`),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a date after ${o(this._min)}, but got a ${o(t)}`)}),this},max(t,e){return n(t,"Date","max expected a date"),this._min&&n(t,(t=>1===a(t,this._min)),`max scope expected a date after ${o(this._min)}, but got a ${o(t)}`),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a date before ${o(this._max)}, but got a ${o(t)}`)}),this},_validateMin(t){if(void 0!==this._min)return-1!==a(t,this._min)},_validateMax(t){if(void 0!==this._max)return 1!==a(t,this._max)}},u={enum(t,e){if(n(t,"Array","enum expected a array"),r(this.check)){const e=this.test(...t);if(e)throw e}return this._enum=t,this.addValidator({name:"Enum",validator:this._validateEnum.bind(this),message:e||(t=>`expected a data value at ${this._enum}, but got a ${t}`)}),this},_validateEnum(t){if(void 0!==this._enum)return this._enum.includes(t)}},m={pattern(t,e){return n(t,"RegExp","regexp expected a pattern"),this._pattern=t,this.addValidator({name:"Pattern",validator:this._validatePattern.bind(this),message:e||`expected a data match pattern: /${this._pattern.source}/${this._pattern.flags}`}),this},_validatePattern(t){if(void 0!==this._pattern&&["String","Number"].includes(this._type))return this._pattern.test(t)}},f={parseInt(){return this.transform(parseInt)},parseFloat(){return this.transform(parseFloat)},convert(){return this.transform((t=>Number(t)))},positive(){return this.addValidator({name:"numberPositive",validator:t=>t>0,message:"the value must be greater than 0"})},negative(){return this.addValidator({name:"numberNegative",validator:t=>t<0,message:"the value must be less than 0"})}},p={convert(){return this.transform((t=>String(t)))},lowerCase(){return this.transform((t=>String(t).toLowerCase()))},upperCase(){return this.transform((t=>String(t).toUpperCase()))},trim(){return this.transform((t=>String(t).trim()))},trimLeft(){return this.transform((t=>String(t).trimLeft()))},trimRight(){return this.transform((t=>String(t).trimRight()))},normalize(){return this.transform((t=>String(t).trim().toLowerCase()))},numeric(){return this.pattern(/^-?[0-9]\d*(\.\d+)?$/,"the value must be an numeric string")},alpha(){return this.pattern(/^[a-zA-Z]+$/,"the value must be an alphabetic string")},alphaNumeric(){return this.pattern(/^[a-zA-Z0-9]+$/,"the value must be an alphanumeric string")},hex(){return this.pattern(/^[0-9a-fA-F]+$/,"the value must be an hex string")},base64(){return this.pattern(/^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?$/,"the value must be an base64 string.")},contain(t,e){return n(t,"String"),n(e,"String"),this.addValidator({name:"stringContain",validator:e=>-1!==e.indexOf(t),message:e||`the value must contain ${t}`})}},g={convert(){return this.transform((t=>!!t))}},_={convert(){return this.transform((t=>{if(s(t))return t;const e=new Date(t);return s(e)?e:new h({message:`date convert error: ${t} can not convert to a valid Date`})}))}};t.exports={rangeMixin:c,enumMixin:u,patternMixin:m,dateRangeMixin:d,numberRangeMixin:l,stringMixin:p,numberMixin:f,dateMixin:_,booleanMixin:g}},620:(t,e,i)=>{const{ValidateTypeError:n,ValidateError:r}=i(941),{rangeMixin:s,enumMixin:a,patternMixin:o,dateRangeMixin:h,numberRangeMixin:c,dateMixin:l,stringMixin:d,numberMixin:u,booleanMixin:m}=i(523),{assert:f,isFunction:p,isString:g,getValidateByType:_,isObject:x}=i(449),{objectOverflow:y,format2TypeString:v,format2Type:b}=i(802);class w{constructor(){this._type=null,this._alias=null,this._validate=[],this._transform=[],this._optional=!1,this._context={},Object.assign(this,a)}type(t){if(this._type&&this._type!==t)throw new Error("type can not modify");const e=v(t);return this._type=e,["Number","Integer","Float"].includes(this._type)&&Object.assign(this,c,o,u),"String"===this._type&&Object.assign(this,o,d,s),"Date"===this._type&&Object.assign(this,h,l),"Array"===this._type&&Object.assign(this,s),"Boolean"===this._type&&Object.assign(this,m),this}alias(t){return f(t,"String","alias expected a string"),this._alias=t,this}forbid(t=!0){return f(t,"Boolean"),this.constructor=t?E:w,this}instance(t){return f(t,"SyncFunction"),this.addValidator({name:"InstanceValidator",validator:e=>e instanceof t,message:`data expected instance of parent: ${t.name}`}),this}or(...t){t=b(...t);const e=new C;return e.or(this,...t),e}transform(...t){if(!p(...t))throw new Error("transform expected one or many function");if(t.length<1)throw new Error("transform expected at least one arg");return this._transform.push(...t),this}setContext(t,e){return f(t,"String","context expected a object"),this._context[t]=e,this}clearContext(t){return t?delete this._context[t]:this._context={},this}addValidator({name:t,validator:e,message:i}){if(f(e,"Function"),i&&!g(i)&&!p(i))throw new Error("message expected a string || function");return t&&f(t,"String"),t&&this.removeValidator(t),this._validate.push({validator:e,message:i,name:t}),this}removeValidator(t){f(t,"String"),f(t,(t=>!!t));const e=this._validate.map((t=>t.name)).indexOf(t);-1!==e&&this._validate.splice(e,1)}test(...t){let e=null;try{e=function(){if(this.constructor===E)return t.length>0?new r({message:"this field is not allow to entered"}):void 0;if(0===t.length)return new r({message:`None is not a ${this._type} type`});for(const e in t){let i=t[e];if(this._transform)for(const t of this._transform)if(i=t(i),i instanceof r)return i;if(void 0===i&&this._optional)continue;let s=!1;if(this._type){const t=_(this._type);p(t)&&t(i)&&(s=!0)}else s=!0;if(!s)return new n({source:i,index:e,type:this._type});for(const t of this._validate){const e=t.validator.call(this,i);if(e instanceof r)return e;if(!1===e)return new r({message:t.message,source:i})}}}.call(this)}catch(t){return t}return e}check(...t){return!(this.test(...t)instanceof r)}assert(...t){const e=this.test(...t);if(e instanceof r)throw e}optional(t=!0){return this._optional=t,this}clone(){const t=new w;return Object.assign(t,this),t}}class C extends w{constructor(...t){super(),this._maybeCondition=[],this.or(...t)}or(...t){return b(...t).map((t=>this._maybeCondition.push(t))),this}test(...t){const e=super.test(...t);if(e)return e;const i=t=>{for(const e of this._maybeCondition)if(!e.test(t))return!0};for(const e of t)if(void 0!==e||!this._optional){if(!(this instanceof $||i(e)))return new r;if(this instanceof $&&i(e))return new r}}clone(){const t=new C;return Object.assign(t,this),t._maybeCondition=this._maybeCondition.map((t=>t.clone())),t}setContext(...t){if(super.setContext(...t),this._maybeCondition)for(const e of this._maybeCondition)e.setContext(...t);return this}clearContext(...t){if(super.clearContext(...t),this._maybeCondition)for(const e of this._maybeCondition)e.clearContext(...t);return this}}class $ extends C{clone(){const t=new $;return Object.assign(t,this),t._maybeCondition=this._maybeCondition.map((t=>t.clone())),t}}class T extends w{constructor(t){super(),this._child=null,this._strict=!1,this.type("Object"),void 0!==t&&this.setChild(t)}setChild(t){if(f(t,"Object"),t instanceof w)return;const e={},n=i(183);for(const i in t){const r=t[i];if(r instanceof w)e[i]=r;else if(g(r))if(r in n)e[i]=n[r]();else{const t=new w;t.type(r),e[i]=t}else Array.isArray(r)?e[i]=new S(r):"object"==typeof r&&(e[i]=new T(r))}this._child=e}testProvided(...t){this.setContext("ignoreUnprovided",!0);const e=this.test(...t);return this.clearContext("ignoreUnprovided"),e}strict(t=!0){return f(t,"Boolean","strict is expected a boolean"),this._strict=t,this}extend(...t){for(let e of t)if(e instanceof T)this._child=Object.assign(this._child||{},e._child);else{if(!x(e))throw new Error(`combine expected a object or a ObjectT, but got a ${e}`);e=new T(e),this._child=Object.assign(this._child||{},e._child)}return this}clone(){const t=new T;Object.assign(t,this);for(const e in this._child)t._child[e]=this._child[e].clone();return t}setContext(...t){if(super.setContext(...t),this._child)for(const e in this._child)this._child[e].setContext(...t);return this}clearContext(...t){if(super.clearContext(...t),this._child)for(const e in this._child)this._child[e].clearContext(...t);return this}test(...t){const e=super.test(...t);if(e)return e;for(const e in t){const i=t[e];if(this._strict){const n=y(i,this._child);if(n)return new r({message:`Cannot set properties other than Shema${t.length>1?", at index:"+e+",":""}, prop: ${n}`})}for(const n in this._child){if(this._context.ignoreUnprovided&&!(n in i))continue;const s=i[n],a=this._child[n];if(!a._optional||i.hasOwnProperty(n)){if(a.constructor===E)return n in i?new r({message:`${t.length>1?"Index:"+e+",":""}field ${n} is not allow to entered`}):void 0;{const i=a.test(s);if(i)return new r({...i,message:`${t.length>1?"Index:"+e+",":""}field ${n} validate error, ${i.message}`})}}}}}}class S extends w{constructor(...t){super(),this._child=null,this._childCate=null,this.type("Array"),t.length>0&&this.setChild(...t)}setChild(...t){if(this._childCate=null,this._child=null,0===t.length)return this;if(1===t.length&&Array.isArray(t[0])){if(0===t[0].length)throw new Error("array struct should not be empty");this._child=[];for(const e in t[0]){const i=t[0][e];if(void 0===i)continue;const n=b(i)[0];if(!(n instanceof w))throw new Error("every item of array should be a T");this._child[e]=n}return this}const e=b(...t);for(const t of e)if(!(t instanceof w))throw new Error("every item of array should be a T");return this._childCate=1===t.length?e[0]:new C(...e),this}test(...t){const e=super.test(...t);if(e)return e;if(this._child)for(const e of t)for(const t in this._child){const i=this._child[t];if(!i)continue;const n=i.test(e[t]);if(n)return n}if(this._childCate)for(const e of t){if(0===e.length)continue;const t=this._childCate.test(...e);if(t)return t}}clone(){const t=new S;Object.assign(t,this);for(const e in this._child)t._child[e]=this._child[e].clone();return Array.isArray(this._childCate)?t._childCate=this._childCate.map((t=>t.clone())):this._childCate instanceof w&&(t._childCate=this._childCate.clone()),t}setContext(...t){return super.setContext(...t),this._childCate?this._childCate.setContext(...t):this._child&&this._child.map((e=>e.setContext(...t))),this}clearContext(...t){return super.clearContext(...t),this._childCate?this._childCate.clearContext(...t):this._child&&this._child.map((e=>e.clearContext(...t))),this}}class E extends w{clone(){const t=new E;return Object.assign(t,this),t}}t.exports={T:w,ObjectT:T,ArrayT:S,NotAtT:$,AtT:C,NeverT:E}},183:(t,e,i)=>{const{allTypes:n}=i(449),{T:r,ObjectT:s,ArrayT:a,NotAtT:o,AtT:h,NeverT:c}=i(620),l={defineType:d,at:(...t)=>new h(...t),notat:(...t)=>new o(...t)};d("any",new r),d("never",new c);for(const t of n)d(t.toLowerCase(),((...e)=>{const i=new("Object"===t?s:"Array"===t?a:r)(...e);return i.type(t),i}));function d(t,e){return l[t]="function"==typeof e?e:()=>e.clone(),l[t]}d("func",l.function),d("undef",l.undefined),d("id",(()=>l.string().clone().convert().addValidator({name:"MongoObjectIdValidator",validator:t=>Boolean(t)&&!Array.isArray(t)&&/^[0-9a-fA-F]{24}$/.test(String(t)),message:"expect a valid mongo object id"}))),t.exports=l},449:t=>{function e(t){return Object.prototype.toString.call(t)}function i(...t){return!(t.length<2)&&t.every((i=>e(i)===e(t[0])))}function n(t,n){if(!i(n,[]))throw new Error(`list expect a ${e([])}`);let r=!1;for(const e in n)if(i(n[e],t)){r=!0;break}return r}function r(...t){return i(...t,[])}function s(...t){return i(...t,"")}function a(...t){return i(...t,1)&&!o(...t)}function o(...t){return t.every((t=>Number.isNaN(t)))}function h(...t){return t.every((t=>n(t,[()=>{},async()=>{}])))}const c=["Boolean","String","Number","Symbol","Promise","NaN","Undefined","RegExp","Function","SyncFunction","AsyncFunction","Date","Set"],l=["Float","Integer","Empty"],d=["Object","Array"],u=[...c,...l,...d],m={isArray:r,isBoolean:function(...t){return i(...t,!0)},isFunction:h,isSyncFunction:function(...t){return t.every((t=>i(t,(()=>{}))))},isAsyncFunction:function(...t){return t.every((t=>i(t,(async()=>{}))))},isNaN:o,isNumber:a,isInteger:function(...t){return a(...t)&&t.every((t=>t%1==0))},isFloat:function(...t){return a(...t)&&t.every((t=>t%1!=0))},isString:s,isSymbol:function(...t){return i(...t,Symbol("Symbol"))},isUndefined:function(...t){return i(...t,void 0)},isObject:function(...t){return i(...t,{})},isNull:function(...t){return i(...t,null)},isPromise:function(...t){return i(...t,Promise.resolve())},isRegExp:function(...t){return i(...t,/d/)},isDate:function(...t){return t.every((t=>i(t,new Date)&&!o(t.getTime())))},isSet:function(...t){return t.every((t=>i(t,new Set)))},isEmpty:function(...t){return t.every((t=>""===t||0===t||null==t||Number.isNaN(t)))}};function f(t){if(!s(t))throw console.error("getValidateByType",t),new Error("type expected a string");return m["is"+t]}t.exports={whatType:e,isType:i,inType:n,allValidates:m,...m,baseTypes:c,sugerTypes:l,stuctTypes:d,allTypes:u,getValidateByType:f,getValidateType:function(t){if(!h(t))throw new Error("validate expected a function");return t.name.replace("is","")},assert:function(t,i,n){if(!h(i)){if(s(i)&&(i=[i]),r(i)){for(const e of i){if(!s(e))throw new Error("assert validator expected a string array | string | function");if(f(e)(t))return}throw new Error(n||`obj expected a ${i.join(" | ")} type, but got a ${e(t)}`)}throw new Error("assert validator expected a string array | string | function")}if(!i(t))throw new Error(n||"validate error")}}}},e={},function i(n){var r=e[n];if(void 0!==r)return r.exports;var s=e[n]={exports:{}};return t[n](s,s.exports,i),s.exports}(631);var t,e}));