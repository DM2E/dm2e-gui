//Filename: js/views/filterView.js

define([
       'jquery', 
       'underscore', 
       'BaseView', 
       'logging', 
       'singletons/UserSession',
       'constants/RDFNS',
       'util/dialogs',
       'util/UriUtils',
], function($, _, BaseView, logging, session, RDFNS, dialogs, UriUtils, theTemplate) {

  var log = logging.getLogger('js/views/file/FileFilterView.js');

  return BaseView.extend({

    // template: theTemplate,
    // initialize : function() {
      // this.buildCategories();
    // },

    applyFiltersToList : function(currentFilters) {
      var list = this.listToFilter;
      this.resetFilters();
      _.each(currentFilters, function(value, property) {
        _.each($("div", list), function(li){
          var td = $("*[data-filter-property='" + property + "']", li);
          if ($(td).attr('data-filter-value') !== value) {
            $(li).addClass('filtered');
          }
        });
      });
    },

    applyFiltersToTable : function(currentFilters) {
      var table = this.tableToFilter;
      // console.log(table);
      // $("tr", table).removeClass('filtered');
      this.resetFilters();
      _.each(currentFilters, function(value, property) {
        _.each($("tbody tr", table), function(tr){
          var td = $("td[data-filter-property='" + property + "']", tr);
          // console.log(tr);
          if ($(td).attr('data-filter-value') !== value) {
            $(tr).addClass('filtered');
          }
        });
      });
    },

    filters : {},

    filterCategories : [
      'omnom:fileOwner',
      'omnom:fileType',
      'dcterms:creator',
      'rdf:type',
      'omnom:status'
    ],

    buildCategories: function() {
      var that = this;
      this.filters = {};
      _.each(this.collection.models, function(model) {
        _.each(that.filterCategories, function(category) {
          if (RDFNS.rdf_attr(category, model.attributes)) {
            if (! that.filters[RDFNS.expand(category)]) {
              that.filters[RDFNS.expand(category)] = {};
            }
            var val = RDFNS.rdf_attr(category, model.attributes);
            if (! val) {
              return;
            } else if (typeof val === 'object') {
              val = val.id;
            }
            that.filters[RDFNS.expand(category)][val] = true;
          }
        });
      });
    },

    render: function() {
      this.renderModel();
      this.buildCategories();
      _.each(this.filterCategories, function(category) {
        // console.log('category ' + category);
        // console.log(this.filters);
        _.each(this.filters[RDFNS.expand(category)], function(dummy, val) {
          // console.log('value ' + val);
          this.$('select[data-filter-property="' + category + '"]')
          .append($('<option></option>')
                  .attr('value', val)
                  .append(UriUtils.last_url_segment(val)));
        }, this);
      }, this);

      var that = this;
      that.$("button.filter-apply").on('click', function() {
        var currentFilters = {};
        _.each(that.$("select[data-filter-property]"), function(select) {
          var val = $(select).val();
          var category = $(select).attr('data-filter-property');
          if (val === 'none') {
            return;
          }
          currentFilters[RDFNS.expand(category)] = val;
        });
        that.applyFilters(currentFilters);
      });
      that.$("button.filter-reset").on('click', function() {
        that.resetFilters();
      });

      return this;
    },

    resetFilters: function() {
        $(".filtered").removeClass("filtered");
    },

    applyFilters: function(currentFilters) {
      console.error(currentFilters);
        if (this.tableToFilter) {
          this.applyFiltersToTable(currentFilters);
        }
        else if (this.listToFilter) {
          this.applyFiltersToList(currentFilters);
        }
        else {
          window.alert("Can filter only tables and lists :(");
        }
        // that.trigger('filter', currentFilters);
    }

  });
});
