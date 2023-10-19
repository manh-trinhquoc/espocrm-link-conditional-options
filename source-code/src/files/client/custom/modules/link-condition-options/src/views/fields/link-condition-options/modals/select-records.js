define('link-condition-options:views/fields/link-condition-options/modals/select-records', ['views/modals/select-records', 'search-manager'], function (Dep, SearchManager) {


    return Dep.extend({

        /**
         * A list of model attributes use to filter with value.
         *
         * @protected
         * @type {array}
         * {
         *  attribute: string,
         *  type: string,
         *  value: string,
         * }
         */

        modelFilterObjects: null,

        setup: function () {
            this.modelFilterObjects = this.options.modelFilterObjects || this.modelFilterObjects || null;

            this.filters = this.options.filters || {};
            this.boolFilterList = this.options.boolFilterList || [];
            this.primaryFilterName = this.options.primaryFilterName || null;
            this.filterList = this.options.filterList || this.filterList || null;

            if ('multiple' in this.options) {
                this.multiple = this.options.multiple;
            }

            if ('createButton' in this.options) {
                this.createButton = this.options.createButton;
            }

            this.massRelateEnabled = this.options.massRelateEnabled;

            this.buttonList = [{
                name: 'cancel',
                label: 'Cancel',
            }];

            if (this.multiple) {
                this.buttonList.unshift({
                    name: 'select',
                    style: 'danger',
                    label: 'Select',
                    disabled: true,
                    title: 'Ctrl+Enter',
                });
            }

            this.scope = this.entityType = this.options.scope || this.scope;

            let customDefaultOrderBy = this.getMetadata().get(['clientDefs', this.scope, 'selectRecords', 'orderBy']);
            let customDefaultOrder = this.getMetadata().get(['clientDefs', this.scope, 'selectRecords', 'order']);

            if (customDefaultOrderBy) {
                this.defaultOrderBy = customDefaultOrderBy;
                this.defaultOrder = customDefaultOrder || false;
            }

            if (this.noCreateScopeList.indexOf(this.scope) !== -1) {
                this.createButton = false;
            }

            if (this.createButton) {
                if (
                    !this.getAcl().check(this.scope, 'create') ||
                    this.getMetadata().get(['clientDefs', this.scope, 'createDisabled'])
                ) {
                    this.createButton = false;
                }
            }

            if (this.getMetadata().get(['clientDefs', this.scope, 'searchPanelDisabled'])) {
                this.searchPanel = false;
            }

            if (this.getUser().isPortal()) {
                if (this.getMetadata().get(['clientDefs', this.scope, 'searchPanelInPortalDisabled'])) {
                    this.searchPanel = false;
                }
            }

            this.$header = $('<span>');

            this.$header.append(
                $('<span>').text(
                    this.translate('Select') + ' · ' +
                    this.getLanguage().translate(this.scope, 'scopeNamesPlural')
                )
            );

            this.$header.prepend(
                this.getHelper().getScopeColorIconHtml(this.scope)
            );

            this.waitForView('list');

            if (this.searchPanel) {
                this.waitForView('search');
            }

            this.getCollectionFactory().create(this.scope, (collection) => {
                collection.maxSize = this.getConfig().get('recordsPerPageSelect') || 5;

                this.collection = collection;




                if (this.defaultOrderBy) {
                    this.collection.setOrder(this.defaultOrderBy, this.defaultOrder || 'asc', true);
                }

                this.loadSearch();
                this.wait(true);

                this.collection.where = this.modelFilterObjects;

                this.loadList();
            });
        },

        loadSearch: function () {
            var searchManager = this.searchManager =
                new SearchManager(this.collection, 'listSelect', null, this.getDateTime());

            searchManager.emptyOnReset = true;

            if (this.filters) {
                searchManager.setAdvanced(this.filters);
            }

            var boolFilterList = this.boolFilterList ||
                this.getMetadata().get('clientDefs.' + this.scope + '.selectDefaultFilters.boolFilterList');

            if (boolFilterList) {
                var d = {};

                boolFilterList.forEach((item) => {
                    d[item] = true;
                });

                searchManager.setBool(d);
            }

            var primaryFilterName = this.primaryFilterName ||
                this.getMetadata().get('clientDefs.' + this.scope + '.selectDefaultFilters.filter');

            if (primaryFilterName) {
                searchManager.setPrimary(primaryFilterName);
            }
            this.collection.where = searchManager.getWhere();

            if (this.searchPanel) {
                this.createView('search', 'link-condition-options:views/fields/link-condition-options/record/search', {
                    collection: this.collection,
                    el: this.containerSelector + ' .search-container',
                    searchManager: searchManager,
                    disableSavePreset: true,
                    filterList: this.filterList,
                    modelFilterObjects: this.modelFilterObjects,
                }, (view) => {
                    this.listenTo(view, 'reset', () => {});
                });
            }
        },
    });
});
