define(["utils/utils","mvc/form/form-view","mvc/tool/tool-form-base"],function(a,b,c){function d(a){var b=a.model.attributes,c=b.workflow,d=b.node;b.inputs.unshift({type:"text",name:"__annotation",label:"Annotation",fixed:!0,value:d.annotation,area:!0,help:"Add an annotation or notes to this step. Annotations are available when a workflow is viewed."}),b.inputs.unshift({type:"text",name:"__label",label:"Label",value:d.label,help:"Add a step label.",fixed:!0,onchange:function(b){var e=!1;for(var f in c.nodes){var g=c.nodes[f];if(g.label&&g.label==b&&g.id!=d.id){e=!0;break}}var h=a.data.match("__label"),i=a.element_list[h];i.model.set("error_text",e&&"Duplicate label. Please fix this before saving the workflow."),a.trigger("change")}})}function e(a){function b(a,c){c=c||[],c.push(a);for(var d in a.inputs){var e=a.inputs[d],f=e.action;if(f){if(e.name="pja__"+j+"__"+e.action,e.pja_arg&&(e.name+="__"+e.pja_arg),e.payload)for(var g in e.payload){var h=e.payload[g];e.payload[e.name+"__"+g]=h,delete h}var k=i[e.action+j];if(k){for(var l in c)c[l].expanded=!0;e.value=e.pja_arg?k.action_arguments&&k.action_arguments[e.pja_arg]||e.value:"true"}}e.inputs&&b(e,c.slice(0))}}function c(a,c){var d=[],e=[];for(var f in c)d.push({0:c[f],1:c[f]});for(f in g.input_terminals)e.push(g.input_terminals[f].name);d.sort(function(a,b){return a.label>b.label?1:a.label<b.label?-1:0}),d.unshift({0:"Sequences",1:"Sequences"}),d.unshift({0:"Roadmaps",1:"Roadmaps"}),d.unshift({0:"Leave unchanged",1:"__empty__"});var i,j={title:"Configure Output: '"+a+"'",type:"section",flat:!0,inputs:[{label:"Label",type:"text",value:(i=g.getWorkflowOutput(a))&&i.label||"",help:"This will provide a short name to describe the output - this must be unique across workflows.",onchange:function(b){h.attemptUpdateOutputLabel(g,a,b)}},{action:"RenameDatasetAction",pja_arg:"newname",label:"Rename dataset",type:"text",value:"",ignore:"",help:'This action will rename the output dataset. Click <a href="https://galaxyproject.org/learn/advanced-workflow/variables/">here</a> for more information. Valid inputs are: <strong>'+e.join(", ")+"</strong>."},{action:"ChangeDatatypeAction",pja_arg:"newtype",label:"Change datatype",type:"select",ignore:"__empty__",value:"__empty__",options:d,help:"This action will change the datatype of the output to the indicated value."},{action:"TagDatasetAction",pja_arg:"tags",label:"Add Tags",type:"text",value:"",ignore:"",help:"This action will set tags for the dataset."},{action:"RemoveTagDatasetAction",pja_arg:"tags",label:"Remove Tags",type:"text",value:"",ignore:"",help:"This action will remove tags for the dataset."},{title:"Assign columns",type:"section",flat:!0,inputs:[{action:"ColumnSetAction",pja_arg:"chromCol",label:"Chrom column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"startCol",label:"Start column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"endCol",label:"End column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"strandCol",label:"Strand column",type:"integer",value:"",ignore:""},{action:"ColumnSetAction",pja_arg:"nameCol",label:"Name column",type:"integer",value:"",ignore:""}],help:"This action will set column assignments in the output dataset. Blank fields are ignored."}]};return b(j),j}var d=a.model.attributes,e=d.inputs,f=d.datatypes,g=d.node,h=d.workflow,i=g.post_job_actions,j=g.output_terminals&&Object.keys(g.output_terminals)[0];if(j){e.push({name:"pja__"+j+"__EmailAction",label:"Email notification",type:"boolean",value:String(Boolean(i["EmailAction"+j])),ignore:"false",help:"An email notification will be sent when the job has completed.",payload:{host:window.location.host}}),e.push({name:"pja__"+j+"__DeleteIntermediatesAction",label:"Output cleanup",type:"boolean",value:String(Boolean(i["DeleteIntermediatesAction"+j])),ignore:"false",help:"Upon completion of this step, delete non-starred outputs from completed workflow steps if they are no longer required as inputs."});for(var k in g.output_terminals)e.push(c(k,f))}}var f=Backbone.View.extend({initialize:function(c){var e=this,f=c.node;this.form=new b(a.merge(c,{onchange:function(){a.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:{id:f.id,type:f.type,content_id:f.content_id,inputs:e.form.data.create()},success:function(a){f.update_field_data(a)}})}})),d(this.form),this.form.render()}}),g=Backbone.View.extend({initialize:function(b){var d=this,e=b.node;this.form=new c(a.merge(b,{text_enable:"Set in Advance",text_disable:"Set at Runtime",narrow:!0,initial_errors:!0,cls:"ui-portlet-narrow",initialmodel:function(a,b){d._customize(b),a.resolve()},buildmodel:function(a,b){b.model.get("postchange")(a,b)},postchange:function(b,c){var f=c.model.attributes,g={tool_id:f.id,tool_version:f.version,type:"tool",inputs:$.extend(!0,{},c.data.create())};Galaxy.emit.debug("tool-form-workflow::postchange()","Sending current state.",g),a.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:g,success:function(a){c.model.set(a.config_form),d._customize(c),c.update(a.config_form),c.errors(a.config_form),e.update_field_data(a),Galaxy.emit.debug("tool-form-workflow::postchange()","Received new model.",a),b.resolve()},error:function(a){Galaxy.emit.debug("tool-form-workflow::postchange()","Refresh request failed.",a),b.reject()}})}}))},_customize:function(b){var c=b.model.attributes;a.deepeach(c.inputs,function(b){b.type&&(-1!=["data","data_collection"].indexOf(b.type)?(b.type="hidden",b.info="Data input '"+b.name+"' ("+a.textify(b.extensions)+")",b.value={__class__:"RuntimeValue"}):b.fixed||(b.collapsible_value={__class__:"RuntimeValue"},b.is_workflow=b.options&&0==b.options.length||-1!=["integer","float"].indexOf(b.type)))}),a.deepeach(c.inputs,function(a){"conditional"==a.type&&(a.test_param.collapsible_value=void 0)}),e(b),d(b)}});return{Default:f,Tool:g}});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-forms.js.map