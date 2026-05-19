<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/playground', function () {
    return Inertia::render('Playground');
});

Route::get('/examples', function () {
    return Inertia::render('Examples');
});

Route::get('/quiz', function () {
    return Inertia::render('Quiz');
});

Route::get('/learn', function () {
    return Inertia::render('Learn');
});