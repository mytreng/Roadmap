<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StepController extends Controller
{
    public function store(Request $request, $roadmapId, $sectionId)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
    ]);

    $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

    $section = $roadmap->sections()->findOrFail($sectionId);

    $step = $section->steps()->create($validated);

    return response()->json([
        'message' => 'Step created successfully',
        'step' => $step,
    ], 201);
}
    public function index(Request $request, $roadmapId, $sectionId)
{
    $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

    $section = $roadmap->sections()->findOrFail($sectionId);

    $steps = $section->steps()->get();

    return response()->json([
        'steps' => $steps
    ]);
}
    public function show(Request $request, $roadmapId, $sectionId, $stepId)
{
    $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

    $section = $roadmap->sections()->findOrFail($sectionId);

    $step = $section->steps()->findOrFail($stepId);

    return response()->json([
        'step' => $step
    ]);
}
    public function update(Request $request, $roadmapId, $sectionId, $stepId)
{
    $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'is_completed' => 'sometimes|boolean',
    ]);

    $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

    $section = $roadmap->sections()->findOrFail($sectionId);

    $step = $section->steps()->findOrFail($stepId);

    $step->update($validated);

    return response()->json([
        'message' => 'Step updated successfully',
        'step' => $step
    ]);
}
    public function destroy(Request $request, $roadmapId, $sectionId, $stepId)
{
    $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

    $section = $roadmap->sections()->findOrFail($sectionId);

    $step = $section->steps()->findOrFail($stepId);

    $step->delete();

    return response()->json([
        'message' => 'Step deleted successfully'
    ]);
}
}
