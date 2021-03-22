!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.tegund=e():t.tegund=e()}(this,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e){function n(t){return Object.prototype.toString.call(t)}function i(...t){return!(t.length<2)&&t.every(e=>n(e)===n(t[0]))}function r(t,e){if(!i(e,[]))throw new Error("list expect a "+n([]));let r=!1;for(const n in e)if(i(e[n],t)){r=!0;break}return r}function s(...t){return i(...t,[])}function a(...t){return i(...t,"")}function o(...t){return i(...t,1)&&!c(...t)}function c(...t){return t.every(t=>Number.isNaN(t))}function h(...t){return t.every(t=>r(t,[()=>{},async()=>{}]))}const l=["Boolean","String","Number","Symbol","Promise","NaN","Undefined","Pattern","Function","SyncFunction","AsyncFunction","Date","Set"],d=["Float","Integer","Empty"],u=["Object","Array"],f=[...l,...d,...u],p={isArray:s,isBoolean:function(...t){return i(...t,!0)},isFunction:h,isSyncFunction:function(...t){return t.every(t=>i(t,()=>{}))},isAsyncFunction:function(...t){return t.every(t=>i(t,async()=>{}))},isNaN:c,isNumber:o,isInteger:function(...t){return o(...t)&&t.every(t=>t%1==0)},isFloat:function(...t){return o(...t)&&t.every(t=>t%1!=0)},isString:a,isSymbol:function(...t){return i(...t,Symbol("Symbol"))},isUndefined:function(...t){return i(...t,void 0)},isObject:function(...t){return i(...t,{})},isNull:function(...t){return i(...t,null)},isPromise:function(...t){return i(...t,Promise.resolve())},isPattern:function(...t){return i(...t,/d/)},isDate:function(...t){return t.every(t=>i(t,new Date))},isSet:function(...t){return t.every(t=>i(t,new Set))},isEmpty:function(...t){return t.every(t=>""===t||0===t||null==t||Number.isNaN(t))}};function m(t){if(!a(t))throw console.error("getValidateByType",t),new Error("type expected a string");return p["is"+t]}t.exports={whatType:n,isType:i,inType:r,allValidates:p,...p,baseTypes:l,sugerTypes:d,stuctTypes:u,allTypes:f,getValidateByType:m,getValidateType:function(t){if(!h(t))throw new Error("validate expected a function");return t.name.replace("is","")},assert:function(t,e,i){if(!h(e)){if(a(e)&&(e=[e]),s(e)){for(const n of e){if(!a(n))throw new Error("assert validator expected a string array | string | function");if(m(n)(t))return}throw new Error(i||`obj expected a ${e.join(" | ")} type, but got a ${n(t)}`)}throw new Error("assert validator expected a string array | string | function")}if(!e(t))throw new Error(i||"validate error")}}},function(t,e,n){const{allTypes:i}=n(0),{T:r,ObjectT:s,ArrayT:a,NotAtT:o,AtT:c,NeverT:h}=n(3),l={defineType:d,at:(...t)=>new c(...t),notat:(...t)=>new o(...t)};d("any",new r),d("never",new h);for(const t of i){d(t.toLowerCase(),(...e)=>{const n=new("Object"===t?s:"Array"===t?a:r)(...e);return n.type(t),n})}function d(t,e){if(t in l)throw new Error(t+" is defined, please check");return l[t]="function"==typeof e?e:()=>e.clone(),l[t]}l.func=l.function,t.exports=l},function(t,e,n){const{assert:i,isUndefined:r,isNull:s,isNaN:a,isArray:o}=n(0);t.exports={objectOverflow:function(t,e){for(const n in t)if(!(n in e))return n},relateDate:function(t,e){i(t,"Date"),i(e,"Date");const n=t.getTime(),r=e.getTime();return n===r?0:n<r?-1:1},formatDate:function(t){return i(t,"Date"),t.toISOString()},defineUnEnumerableProperty:function(t,e,n){Object.defineProperty(t,e,{value:n,enumerable:!1,writable:!0})},removeEmpty:function(t,{removeUndefined:e=!0,removeNull:n=!0,removeNaN:c=!1,removeEmptyString:h=!1,removeEmptyArray:l=!1,removeFalse:d=!1}={}){i(t,"Object");const u={};for(const i in t){const f=t[i];e&&r(f)||(n&&s(f)||c&&a(f)||h&&""===f||l&&o(f)&&0===f.length||d&&!1===f||(u[i]=f))}return u}}},function(t,e,n){const{ValidateTypeError:i,ValidateError:r}=n(4),{rangeMixin:s,enumMixin:a,patternMixin:o,dateRangeMixin:c,numberRangeMixin:h,useMixin:l}=n(6),{assert:d,isFunction:u,isString:f,getValidateByType:p,isObject:m}=n(0),{objectOverflow:_}=n(2);class g{constructor(){this._type=null,this._alias=null,this._validate=[],this._optional=!1,this._context={},l(this,a)}type(t){const e=this._format2TypeString(t);return this._type=e,["String","Array"].includes(this._type)&&l(this,s),["Number","Integer","Float"].includes(this._type)&&l(this,h),["String","Number","Integer","Float"].includes(this._type)&&l(this,o),"Date"===this._type&&l(this,c),this}alias(t){return d(t,"String","alias expected a string"),this._alias=t,this}forbid(t=!0){return d(t,"Boolean"),this.constructor=t?w:g,this}instance(t){return d(t,"SyncFunction"),this.addValidator({name:"InstanceValidator",validator:e=>e instanceof t,message:"data expected instance of parent: "+t.name}),this}or(...t){t=this._format2Type(...t);const e=new y;return e.or(this,...t),e}setContext(t,e){return d(t,"String","context expected a object"),this._context[t]=e,this}clearContext(t){return t?delete this._context[t]:this._context={},this}addValidator({name:t,validator:e,message:n}){if(d(e,"Function"),n&&!f(n)&&!u(n))throw new Error("message expected a string || function");return t&&d(t,"String"),t&&this.removeValidator(t),this._validate.push({validator:e,message:n,name:t}),this}removeValidator(t){d(t,"String"),d(t,t=>!!t);const e=this._validate.map(t=>t.name).indexOf(t);-1!==e&&this._validate.splice(e,1)}test(...t){let e=null;try{e=function(){if(this.constructor===w)return t.length>0?new r({message:"this field is not allow to entered"}):void 0;if(0===t.length)return new r({message:`None is not a ${this._type} type`});for(const e in t){const n=t[e];if(void 0===n&&this._optional)continue;let s=!1;if(this._type){const t=p(this._type);u(t)&&t(n)&&(s=!0)}else s=!0;if(!s)return new i({source:n,index:e,type:this._type});for(const t of this._validate){const e=t.validator.call(this,n);if(e instanceof r)return e;if(!1===e)return new r({message:t.message,source:n})}}}.call(this)}catch(t){return t}return e}check(...t){return!(this.test(...t)instanceof r)}assert(...t){const e=this.test(...t);if(e instanceof r)throw e}optional(t=!0){return this._optional=t,this}clone(){const t=new g;return Object.assign(t,this),t}_format2TypeString(t){return t instanceof g?t._type:f(t)?t:void 0}_format2Type(...t){const e=n(1),i=[];for(const n of t)if(n instanceof g)i.push(n);else{if(!f(n)||!(n in e))throw new Error("type is not a valid T || t alias");i.push(e[n]())}return i}}class y extends g{constructor(...t){super(),this._maybeCondition=[],this.or(...t)}or(...t){return this._format2Type(...t).map(t=>this._maybeCondition.push(t)),this}test(...t){const e=super.test(...t);if(e)return e;const n=t=>{for(const e of this._maybeCondition){if(!e.test(t))return!0}};for(const e of t)if(void 0!==e||!this._optional){if(!(this instanceof x||n(e)))return new r;if(this instanceof x&&n(e))return new r}}clone(){const t=new y;return Object.assign(t,this),t._maybeCondition=this._maybeCondition.map(t=>t.clone()),t}setContext(...t){if(super.setContext(...t),this._maybeCondition)for(const e of this._maybeCondition)e.setContext(...t);return this}clearContext(...t){if(super.clearContext(...t),this._maybeCondition)for(const e of this._maybeCondition)e.clearContext(...t);return this}}class x extends y{clone(){const t=new x;return Object.assign(t,this),t._maybeCondition=this._maybeCondition.map(t=>t.clone()),t}}class v extends g{constructor(t){super(),this._child=null,this._strict=!1,this.type("Object"),void 0!==t&&this.setChild(t)}setChild(t){if(d(t,"Object"),t instanceof g)return;const e={},i=n(1);for(const n in t){const r=t[n];if(r instanceof g)e[n]=r;else if(f(r))if(r in i)e[n]=i[r]();else{const t=new g;t.type(r),e[n]=t}else Array.isArray(r)?e[n]=new b(r):"object"==typeof r&&(e[n]=new v(r))}this._child=e}testProvided(...t){this.setContext("ignoreUnprovided",!0);const e=this.test(...t);return this.clearContext("ignoreUnprovided"),e}strict(t=!0){return d(t,"Boolean","strict is expected a boolean"),this._strict=t,this}extend(...t){for(let e of t)if(e instanceof v)this._child=Object.assign(this._child||{},e._child);else{if(!m(e))throw new Error("combine expected a object or a ObjectT, but got a "+e);e=new v(e),this._child=Object.assign(this._child||{},e._child)}return this}clone(){const t=new v;Object.assign(t,this);for(const e in this._child)t._child[e]=this._child[e].clone();return t}setContext(...t){if(super.setContext(...t),this._child)for(const e in this._child)this._child[e].setContext(...t);return this}clearContext(...t){if(super.clearContext(...t),this._child)for(const e in this._child)this._child[e].clearContext(...t);return this}test(...t){const e=super.test(...t);if(e)return e;for(const e in t){const n=t[e];if(this._strict){const i=_(n,this._child);if(i)return new r({message:`Cannot set properties other than Shema${t.length>1?", at index:"+e+",":""}, prop: ${i}`})}for(const i in this._child){if(this._context.ignoreUnprovided&&!(i in n))continue;const s=n[i],a=this._child[i];if(!a._optional||n.hasOwnProperty(i)){if(a.constructor===w)return i in n?new r({message:`${t.length>1?"Index:"+e+",":""}field ${i} is not allow to entered`}):void 0;{const n=a.test(s);if(n)return new r({...n,message:`${t.length>1?"Index:"+e+",":""}field ${i} validate error, ${n.message}`})}}}}}}class b extends g{constructor(...t){super(),this._child=null,this._childCate=null,this.type("Array"),t.length>0&&this.setChild(...t)}setChild(...t){if(this._childCate=null,this._child=null,0===t.length)return this;if(1===t.length&&Array.isArray(t[0])){if(0===t[0].length)throw new Error("array struct should not be empty");this._child=[];for(const e in t[0]){const n=t[0][e];if(void 0===n)continue;const i=this._format2Type(n)[0];if(!(i instanceof g))throw new Error("every item of array should be a T");this._child[e]=i}return this}const e=this._format2Type(...t);for(const t of e)if(!(t instanceof g))throw new Error("every item of array should be a T");return this._childCate=1===t.length?e[0]:new y(...e),this}test(...t){const e=super.test(...t);if(e)return e;if(this._child)for(const e of t)for(const t in this._child){const n=this._child[t];if(!n)continue;const i=n.test(e[t]);if(i)return i}if(this._childCate)for(const e of t){if(0===e.length)continue;const t=this._childCate.test(...e);if(t)return t}}clone(){const t=new b;Object.assign(t,this);for(const e in this._child)t._child[e]=this._child[e].clone();return Array.isArray(this._childCate)?t._childCate=this._childCate.map(t=>t.clone()):this._childCate instanceof g&&(t._childCate=this._childCate.clone()),t}setContext(...t){return super.setContext(...t),this._childCate?this._childCate.setContext(...t):this._child&&this._child.map(e=>e.setContext(...t)),this}clearContext(...t){return super.clearContext(...t),this._childCate?this._childCate.clearContext(...t):this._child&&this._child.map(e=>e.clearContext(...t)),this}}class w extends g{clone(){const t=new w;return Object.assign(t,this),t}}t.exports={T:g,ObjectT:v,ArrayT:b,NotAtT:x,AtT:y,NeverT:w}},function(t,e,n){const{isString:i,whatType:r,isFunction:s}=n(0);class a extends Error{constructor({message:t="validate error!",source:e}={}){super(t),i(t)||s(t)||console.error("message expected a string || function"),this.status=400,this.message="function"==typeof t?t(e):t,this.source=e,this.name="ValidateError"}}t.exports={ValidateError:a,ValidateTypeError:class extends a{constructor({type:t,message:e,field:n,...i}={}){super(i),this.type=t,this.name="ValidateTypeError",this.message=`${n?n+"is":""}expected a ${t} type, got a ${r(this.source)}`}}}},function(t,e,n){const i=n(1),r=n(3),s=n(4),{allValidates:a,getValidateByType:o,assert:c}=n(0),{defineUnEnumerableProperty:h,removeEmpty:l}=n(2);t.exports={...i,...r,...s,...a,getValidateByType:o,assert:c,defineUnEnumerableProperty:h,removeEmpty:l}},function(t,e,n){const{assert:i,isFunction:r}=n(0),{relateDate:s,formatDate:a}=n(2),o={length(t,e){return i(t,"Integer","length expected a integer"),i(t,t=>t>=0,"length expected a integer gte then 0"),this._length=t,this.addValidator({name:"Length",validator:this._validateLength.bind(this),message:e||(t=>`expected a ${this._type}, length at ${this._length}, but got a length: ${t.length}`)}),this},min(t,e){return i(t,"Integer","min expected a integer"),i(t,t=>t>0,"min expected a integer gte then 0"),this._max&&i(t,t=>t<=this._max,"min expected a integer lte then max: "+this._max),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a ${this._type}, length gte than ${this._min}, but got a length: ${t.length}`)}),this},max(t,e){return i(t,"Integer","max expected a integer"),i(t,t=>t>0,"max expected a integer gte then 0"),this._min&&i(t,t=>t>=this._min,"min expected a integer lte then max: "+this._min),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a ${this._type}, length lte than ${this._max}, but got a length: ${t.length}`)}),this},_validateLength(t){if(void 0!==this._length&&["String","Array"].includes(this._type))return t.length===this._length},_validateMin(t){if(void 0!==this._min&&["String","Array"].includes(this._type))return t.length>=this._min},_validateMax(t){if(void 0!==this._max&&["String","Array"].includes(this._type))return t.length<=this._max}},c={min(t,e){return i(t,"Integer","min expected a integer"),this._max&&i(t,t=>t<=this._max,"min expected a integer lte then max: "+this._max),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a ${this._type}, value gte than ${this._min}, but got a: ${t}`)}),this},max(t,e){return i(t,"Integer","max expected a integer"),this._min&&i(t,t=>t>=this._min,"min expected a value integer lte then max: "+this._min),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a ${this._type}, value lte than ${this._max}, but got a: ${t}`)}),this},_validateMin(t){if(void 0!==this._min&&["Number","Integer","Float"].includes(this._type))return t>=this._min},_validateMax(t){if(void 0!==this._max&&["Number","Integer","Float"].includes(this._type))return t<=this._max}},h={min(t,e){return i(t,"Date","min expected a date"),this._max&&i(t,t=>-1===s(t,this._max),`min scope expected a date before ${a(this._max)}, but got a ${a(t)}`),this._min=t,this.addValidator({name:"Min",validator:this._validateMin.bind(this),message:e||(t=>`expected a date after ${a(this._min)}, but got a ${a(t)}`)}),this},max(t,e){return i(t,"Date","max expected a date"),this._min&&i(t,t=>1===s(t,this._min),`max scope expected a date after ${a(this._min)}, but got a ${a(t)}`),this._max=t,this.addValidator({name:"Max",validator:this._validateMax.bind(this),message:e||(t=>`expected a date before ${a(this._max)}, but got a ${a(t)}`)}),this},_validateMin(t){if(void 0!==this._min)return-1!==s(t,this._min)},_validateMax(t){if(void 0!==this._max)return 1!==s(t,this._max)}},l={enum(t,e){if(i(t,"Array","enum expected a array"),r(this.check)){const e=this.test(...t);if(e)throw e}return this._enum=t,this.addValidator({name:"Enum",validator:this._validateEnum.bind(this),message:e||(t=>`expected a data value at ${this._enum}, but got a ${t}`)}),this},_validateEnum(t){if(void 0!==this._enum)return this._enum.includes(t)}},d={pattern(t,e){return i(t,"Pattern","pattern expected a reg"),this._pattern=t,this.addValidator({name:"Pattern",validator:this._validatePattern.bind(this),message:e||`expected a data match pattern: /${this._pattern.source}/${this._pattern.flags}`}),this},_validatePattern(t){if(void 0!==this._pattern&&["String","Number"].includes(this._type))return this._pattern.test(t)}};t.exports={rangeMixin:o,enumMixin:l,patternMixin:d,dateRangeMixin:h,numberRangeMixin:c,useMixin:function(t,e){for(const n in e)t[n]=e[n]}}}])}));