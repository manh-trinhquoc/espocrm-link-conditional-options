define('link-condition-options:views/fields/link-condition-options/record/search', ['views/record/search', 'helpers/misc/stored-text-search'], function (Dep, StoredTextSearch) {

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
            Dep.prototype.setup.call(this);
        },
        updateCollection: function () {
            this.collection.abortLastFetch();
            this.collection.reset();
            this.collection.where = this.searchManager.getWhere();
            this.collection.where.push(...this.modelFilterObjects);

            this.collection.offset = 0;

            Espo.Ui.notify(' ... ');

            this.collection.fetch().then(() => {
                Espo.Ui.notify(false);
            });
        },
    });
});
