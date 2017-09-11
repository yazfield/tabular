# Tabular

A table component for vue with embedded ajax pagination, sorting and filtering based on data type based on vuetify.

All you need to do is give it an endpoint, and configure it. The returned data must be a Laravel Pagination object.

THIS IS STILL IN AN EARLY DEVELOPMENT STAGE.

## Parameters

**color:** table primary color
**endpoint:** api endpoint to get data from, and perform updates and deletes
**headers:** list of table headers objects. each object contains options for filtering, and more.
**query:** object of initial query to add to the pagination request. each entry is a filter.
**selectable:** should the table rows be selectable?
**selectedKey:** the
**searchable:** adds a search capability to the table toolbar
**deletable:** adds delete capability to the table toolbar
**actions:** list of actions to be executable on selected rows
**name:** table name, used for i18n
**flat:** should the table be flat? vuetify only

## TODO
- Refactor code
- Use a functional approach then make a pull request to vuetify
- Decouple the logic from the view and from vuetify
- Decouple from laravel json format
