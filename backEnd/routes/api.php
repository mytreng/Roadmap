<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\RoadmapsController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StepController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
//user
Route::post('/logout', [\App\Http\Controllers\auth\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [\App\Http\Controllers\auth\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\auth\AuthController::class, 'login']);
//roadmaps
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/roadmaps', [RoadmapsController::class, 'index']);
    Route::post('/roadmaps', [RoadmapsController::class, 'store']);
    Route::get('/roadmaps/{id}', [RoadmapsController::class, 'show']);
    Route::put('/roadmaps/{id}', [RoadmapsController::class, 'update']);
    Route::delete('/roadmaps/{id}', [RoadmapsController::class, 'destroy']);
});
//sections
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/roadmaps/{roadmapId}/sections', [SectionController::class, 'index']);

    Route::post('/roadmaps/{roadmapId}/sections', [SectionController::class, 'store']);

    Route::get('/roadmaps/{roadmapId}/sections/{sectionId}', [SectionController::class, 'show']);
    Route::put('/roadmaps/{roadmapId}/sections/{sectionId}', [SectionController::class, 'update']);
    Route::delete('/roadmaps/{roadmapId}/sections/{sectionId}', [SectionController::class, 'destroy']);

});
// step
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/roadmaps/{roadmapId}/sections/{sectionId}/steps', [StepController::class, 'index']);

    Route::post('/roadmaps/{roadmapId}/sections/{sectionId}/steps', [StepController::class, 'store']);

    Route::get('/roadmaps/{roadmapId}/sections/{sectionId}/steps/{stepId}', [StepController::class, 'show']);

    Route::put('/roadmaps/{roadmapId}/sections/{sectionId}/steps/{stepId}', [StepController::class, 'update']);

    Route::delete('/roadmaps/{roadmapId}/sections/{sectionId}/steps/{stepId}', [StepController::class, 'destroy']);

});
