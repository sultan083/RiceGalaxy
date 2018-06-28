jQuery.ajaxSettings.traditional=!0,define(["utils/utils","mvc/grid/grid-model","mvc/grid/grid-template","mvc/ui/popup-menu"],function(a,b,c,d){return Backbone.View.extend({grid:null,initialize:function(a){this.grid=new b,this.dict_format=a.dict_format,this.title=a.title;var c=this;if(window.add_tag_to_grid_filter=function(a,b){var d=a+(void 0!==b&&""!==b?":"+b:""),e=$("#advanced-search").is(":visible");e||($("#standard-search").slideToggle("fast"),$("#advanced-search").slideToggle("fast")),c.add_filter_condition("tags",d)},this.dict_format)if(this.setElement("<div/>"),a.url_base&&!a.items){var d=a.url_data||{};_.each(a.filters,function(a,b){d["f-"+b]=a}),$.ajax({url:a.url_base+"?"+$.param(d),success:function(b){b.embedded=a.embedded,b.filters=a.filters||{},c.init_grid(b)}})}else this.init_grid(a);else this.setElement("#grid-container"),this.init_grid(a);a.use_panels&&$("#center").css({padding:"10px",overflow:"auto"})},handle_refresh:function(a){a&&$.inArray("history",a)>-1&&top.Galaxy&&top.Galaxy.currHistoryPanel&&top.Galaxy.currHistoryPanel.loadCurrentHistory()},init_grid:function(b){this.grid.set(b);var d=this.grid.attributes;this.allow_title_display&&d.title&&a.setWindowTitle(d.title),this.handle_refresh(d.refresh_frames);var e=this.grid.get("url_base");if(e=e.replace(/^.*\/\/[^\/]+/,""),this.grid.set("url_base",e),this.$el.html(c.grid(d)),this.$el.find("#grid-table-header").html(c.header(d)),this.$el.find("#grid-table-body").html(c.body(d)),this.$el.find("#grid-table-footer").html(c.footer(d)),d.message){this.$el.find("#grid-message").html(c.message(d));var f=this;d.use_hide_message&&setTimeout(function(){f.$el.find("#grid-message").html("")},5e3)}this.init_grid_elements(),this.init_grid_controls(),init_refresh_on_change()},init_grid_controls:function(){var a=this;this.$el.find(".operation-button").each(function(){$(this).off(),$(this).click(function(){return a.submit_operation(this),!1})}),this.$el.find("input[type=text]").each(function(){$(this).off(),$(this).click(function(){$(this).select()}).keyup(function(){$(this).css("font-style","normal")})}),this.$el.find(".sort-link").each(function(){$(this).off(),$(this).click(function(){return a.set_sort_condition($(this).attr("sort_key")),!1})}),this.$el.find(".text-filter-form").each(function(){$(this).off(),$(this).submit(function(){var b=$(this).attr("column_key"),c=$("#input-"+b+"-filter"),d=c.val();return c.val(""),a.add_filter_condition(b,d),!1})}),this.$el.find(".text-filter-val > a").each(function(){$(this).off(),$(this).click(function(){return $(this).parent().remove(),a.remove_filter_condition($(this).attr("filter_key"),$(this).attr("filter_val")),!1})}),this.$el.find(".categorical-filter > a").each(function(){$(this).off(),$(this).click(function(){return a.set_categorical_filter($(this).attr("filter_key"),$(this).attr("filter_val")),!1})}),this.$el.find(".advanced-search-toggle").each(function(){$(this).off(),$(this).click(function(){return a.$el.find("#standard-search").slideToggle("fast"),a.$el.find("#advanced-search").slideToggle("fast"),!1})}),this.$el.find("#check_all").off(),this.$el.find("#check_all").on("click",function(){a.check_all_items()})},init_grid_elements:function(){this.$el.find(".grid").each(function(){var a=$(this).find("input.grid-row-select-checkbox"),b=$(this).find("span.grid-selected-count"),c=function(){b.text($(a).filter(":checked").length)};$(a).each(function(){$(this).change(c)}),c()}),0!==this.$el.find(".community_rating_star").length&&this.$el.find(".community_rating_star").rating({});var a=this.grid.attributes,b=this;this.$el.find(".page-link > a").each(function(){$(this).click(function(){return b.set_page($(this).attr("page_num")),!1})}),this.$el.find(".use-target").each(function(){$(this).click(function(){return b.execute({href:$(this).attr("href"),target:$(this).attr("target")}),!1})});var c=a.items.length;0!=c&&_.each(a.items,function(c,e){var f=b.$("#grid-"+e+"-popup").off(),g=new d(f);_.each(a.operations,function(a){b._add_operation(g,a,c)})})},_add_operation:function(a,b,c){var d=this,e=c.operation_config[b.label];e.allowed&&b.allow_popup&&a.addItem({html:b.label,href:e.url_args,target:e.target,confirmation_text:b.confirm,func:function(a){a.preventDefault();var e=$(a.target).html();b.onclick?b.onclick(c.encode_id):d.execute(this.findItemByHtml(e))}})},add_filter_condition:function(a,b){if(""===b)return!1;this.grid.add_filter(a,b,!0);var d=$(c.filter_element(a,b)),e=this;d.click(function(){$(this).remove(),e.remove_filter_condition(a,b)});var f=this.$el.find("#"+a+"-filtering-criteria");f.append(d),this.go_page_one(),this.execute()},remove_filter_condition:function(a,b){this.grid.remove_filter(a,b),this.go_page_one(),this.execute()},set_sort_condition:function(a){var b=this.grid.get("sort_key"),c=a;-1!==b.indexOf(a)&&"-"!==b.substring(0,1)&&(c="-"+a),this.$el.find(".sort-arrow").remove();var d="-"==c.substring(0,1)?"&uarr;":"&darr;",e=$("<span>"+d+"</span>").addClass("sort-arrow");this.$el.find("#"+a+"-header").append(e),this.grid.set("sort_key",c),this.go_page_one(),this.execute()},set_categorical_filter:function(a,b){var c=this.grid.get("categorical_filters")[a],d=this.grid.get("filters")[a],e=this;this.$el.find("."+a+"-filter").each(function(){var f=$.trim($(this).text()),g=c[f],h=g[a];if(h==b)$(this).empty(),$(this).addClass("current-filter"),$(this).append(f);else if(h==d){$(this).empty();var i=$('<a href="#">'+f+"</a>");i.click(function(){e.set_categorical_filter(a,h)}),$(this).removeClass("current-filter"),$(this).append(i)}}),this.grid.add_filter(a,b),this.go_page_one(),this.execute()},set_page:function(a){var b=this;this.$el.find(".page-link").each(function(){var c,d=$(this).attr("id"),e=parseInt(d.split("-")[2],10),f=b.grid.get("cur_page");if(e===a)c=$(this).children().text(),$(this).empty(),$(this).addClass("inactive-link"),$(this).text(c);else if(e===f){c=$(this).text(),$(this).empty(),$(this).removeClass("inactive-link");var g=$('<a href="#">'+c+"</a>");g.click(function(){b.set_page(e)}),$(this).append(g)}}),"all"===a?this.grid.set("cur_page",a):this.grid.set("cur_page",parseInt(a,10)),this.execute()},submit_operation:function(a,b){var c=$(a).val(),d=this.$el.find('input[name="id"]:checked').length;if(!d>0)return!1;var e=_.findWhere(this.grid.attributes.operations,{label:c});e&&!b&&(b=e.confirm||"");var f=[];this.$el.find("input[name=id]:checked").each(function(){f.push($(this).val())});var g={operation:c,id:f,confirmation_text:b};return"top"==e.target&&(g=_.extend(g,{href:e.href,target:e.target})),this.execute(g),!0},check_all_items:function(){var a=this.$(".grid-row-select-checkbox"),b=this.$("#check_all").prop("checked");_.each(a,function(a){$(a).prop("checked",b)}),this.init_grid_elements()},go_page_one:function(){var a=this.grid.get("cur_page");null!==a&&void 0!==a&&"all"!==a&&this.grid.set("cur_page",1)},execute:function(a){var b=null,c=null,d=null,e=null,f=null;if(a&&(c=a.href,d=a.operation,b=a.id,e=a.confirmation_text,f=a.target,void 0!==c&&-1!=c.indexOf("operation="))){var g=c.split("?");if(g.length>1)for(var h=g[1],i=h.split("&"),j=0;j<i.length;j++)-1!=i[j].indexOf("operation")?(d=i[j].split("=")[1],d=d.replace(/\+/g," ")):-1!=i[j].indexOf("id")&&(b=i[j].split("=")[1])}return d&&b?e&&""!=e&&"None"!=e&&"null"!=e&&!confirm(e)?!1:(d=d.toLowerCase(),this.grid.set({operation:d,item_ids:b}),"top"==f?window.top.location=c+"?"+$.param(this.grid.get_url_data()):this.grid.can_async_op(d)||this.dict_format?this.update_grid():this.go_to(f,c),!1):c?(this.go_to(f,c),!1):(this.grid.get("async")||this.dict_format?this.update_grid():this.go_to(f,c),!1)},go_to:function(a,b){var c=this.grid.get("async");this.grid.set("async",!1);var d=this.$el.find("#advanced-search").is(":visible");switch(this.grid.set("advanced_search",d),b||(b=this.grid.get("url_base")+"?"+$.param(this.grid.get_url_data())),this.grid.set({operation:void 0,item_ids:void 0,async:c}),a){case"inbound":var e=$(".grid-header").closest(".inbound");if(0!==e.length)return void e.load(b);break;case"top":window.top.location=b;break;default:window.location=b}},update_grid:function(){var a=this.grid.get("operation")?"POST":"GET";this.$el.find(".loading-elt-overlay").show();var b=this;$.ajax({type:a,url:b.grid.get("url_base"),data:b.grid.get_url_data(),error:function(){alert("Grid refresh failed")},success:function(a){var c=b.grid.get("embedded"),d=b.grid.get("insert"),e=b.$el.find("#advanced-search").is(":visible"),f=b.dict_format?a:$.parseJSON(a);f.embedded=c,f.insert=d,f.advanced_search=e,b.init_grid(f),b.$el.find(".loading-elt-overlay").hide()},complete:function(){b.grid.set({operation:void 0,item_ids:void 0})}})}})});
//# sourceMappingURL=../../../maps/mvc/grid/grid-view.js.map