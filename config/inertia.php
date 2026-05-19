<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Initial Page Rendering
    |--------------------------------------------------------------------------
    |
    | When rendering the initial Inertia page, use the script element format
    | compatible with the Vue 3 adapter. This allows the client to read the
    | page payload from a JSON script tag instead of an old data-page div.
    |
    */
    'use_script_element_for_initial_page' => env('INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE', true),
];
