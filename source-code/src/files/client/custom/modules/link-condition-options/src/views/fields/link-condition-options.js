console.log('link-condition-options:views/fields/link-condition-options');
define('link-condition-options:views/fields/link-condition-options', ['views/fields/link', 'helpers/record-modal'], function (Dep, RecordModal) {


    return Dep.extend({

        /**
         * A list of model attributes use to filter value.
         * To be overriden.
         * TODO: remove this attribute
         *
         * @protected
         * @type {array}
         * {
         *  attribute: string,
         *  targetScopeAttribute: string,
         *  type: string,
         * }
         */

        modelFilterAttributes: [{
            targetScopeAttribute: 'categoryId',
            type: 'equals',
            attribute: 'productCategoryId',
        }],

        /**
         * Get filter object base on condition
         * TODO: re-write this function to get filter object from condition options config. Refer to enum field
         * 
         * @returns {array}
         */
        getModelFilterObjects: function () {
            if (!this.isEditMode() || this.isInEntityConfigView()) {
                return [];
            }
            let modelFilterObjects = this.modelFilterAttributes.map((filter, index) => {
                return {
                    attribute: filter.targetScopeAttribute,
                    type: filter.type,
                    value: this.model.get(filter.attribute),
                };
            });

            return modelFilterObjects;
        },


        /**
         * A select-record view.
         *
         * @protected
         * @type {string}
         */
        selectRecordsView: 'link-condition-options:views/fields/link-condition-options/modals/select-records',

        /**
         * Compose an autocomplete URL. Can be extended.
         *
         * @protected
         * @return {string}
         */
        getAutocompleteUrl: function () {
            let url = Dep.prototype.getAutocompleteUrl.call(this);
            this.getModelFilterObjects().forEach((filter, index) => {
                index = index + 100;
                url += "&where[" + index + "][attribute]=" + filter.attritube;
                url += "&where[" + index + "][type]=" + filter.type;
                url += "&where[" + index + "][value]=" + filter.value;
            });
            return url;
        },

        actionSelect: function () {
            Espo.Ui.notify(' ... ');

            /** @var {Object.<string, *>} */
            let panelDefs = this.getMetadata()
                .get(['clientDefs', this.entityType, 'relationshipPanels', this.name]) || {};

            let viewName = this.selectRecordsView;

            let handler = panelDefs.selectHandler || null;

            let createButton = this.isEditMode() &&
                (!this.createDisabled && !panelDefs.createDisabled || this.forceCreateButton);

            let createAttributesProvider = null;

            if (createButton) {
                createAttributesProvider = () => {
                    let attributes = this.getCreateAttributes() || {};

                    if (!panelDefs.createHandler) {
                        return Promise.resolve(attributes);
                    }

                    return new Promise(resolve => {
                        Espo.loader.requirePromise(panelDefs.createHandler)
                            .then(Handler => new Handler(this.getHelper()))
                            .then(handler => {
                                handler.getAttributes(this.model)
                                    .then(additionalAttributes => {
                                        resolve({
                                            ...attributes,
                                            ...additionalAttributes,
                                        });
                                    });
                            });
                    });
                };
            }

            new Promise(resolve => {
                if (!handler || this.isSearchMode()) {
                    resolve({});

                    return;
                }

                Espo.loader.requirePromise(handler)
                    .then(Handler => new Handler(this.getHelper()))
                    .then(handler => {
                        handler.getFilters(this.model)
                            .then(filters => resolve(filters));
                    });
            }).then(filters => {
                let advanced = {
                    ...(this.getSelectFilters() || {}),
                    ...(filters.advanced || {})
                };
                let boolFilterList = [
                    ...(this.getSelectBoolFilterList() || []),
                    ...(filters.bool || []),
                    ...(panelDefs.selectBoolFilterList || []),
                ];
                let primaryFilter = this.getSelectPrimaryFilterName() ||
                    filters.primary || panelDefs.selectPrimaryFilter;

                this.createView('dialog', viewName, {
                    scope: this.foreignScope,
                    createButton: createButton,
                    filters: advanced,
                    boolFilterList: boolFilterList,
                    primaryFilterName: primaryFilter,
                    mandatorySelectAttributeList: this.mandatorySelectAttributeList,
                    forceSelectAllAttributes: this.forceSelectAllAttributes,
                    filterList: this.getSelectFilterList(),
                    createAttributesProvider: createAttributesProvider,
                    modelFilterObjects: this.getModelFilterObjects(),
                }, view => {
                    view.render();

                    Espo.Ui.notify(false);

                    this.listenToOnce(view, 'select', model => {
                        this.clearView('dialog');

                        this.select(model);
                    });
                });
            });
        },

        actionSelectOneOf: function () {
            Espo.Ui.notify(' ... ');

            console.log('actionSelectOneOf');

            let viewName = this.getMetadata()
                .get(['clientDefs', this.foreignScope, 'modalViews', 'select']) ||
                this.selectRecordsView;

            this.createView('dialog', viewName, {
                scope: this.foreignScope,
                createButton: false,
                filters: this.getSelectFilters(),
                boolFilterList: this.getSelectBoolFilterList(),
                primaryFilterName: this.getSelectPrimaryFilterName(),
                multiple: true,
            }, view => {
                view.render();

                Espo.Ui.notify(false);

                this.listenToOnce(view, 'select', models => {
                    this.clearView('dialog');

                    if (Object.prototype.toString.call(models) !== '[object Array]') {
                        models = [models];
                    }

                    models.forEach(model => {
                        this.addLinkOneOf(model.id, model.get('name'));
                    });
                });
            });
        },



        isInEntityConfigView: function () {
            //in entity config view, recordHelper is null
            return this.recordHelper == null;
        }

    });
});
