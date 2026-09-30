<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SectionController extends Controller
{
    // public function store(Request $request){
    //     $validated = $request->validate([
    //         'roadmap_id' => 'required|exists:roadmaps,id',
    //         'title' => 'required|string|max:255',
    //         'order' => 'nullable|integer|min:1',
    //     ]);

    //     $roadmap = $request->user()->roadmaps()->findOrFail($validated['roadmap_id']);
    //     $section = $roadmap->sections()->create([
    //         'title' => $validated['title'],
    //         'order' => $validated['order'] ?? null,
    //     ]);

    //     return response()->json([
    //         'message' => 'Section created successfully',
    //         'section' => $section,
    //     ], 201);
    // }
    public function store(Request $request, $roadmapId){
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer|min:1',
        ]);

        $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);

        $section = $roadmap->sections()->create($validated);

        return response()->json([
            'message' => 'Section created successfully',
            'section' => $section,
        ], 201);
    }
    public function index(Request $request, $roadmapId){
        $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);
        $sections = $roadmap->sections()->with('steps')->get();
        return response()->json([
            'section' => $sections
        ]);
    }
    public function show(Request $request, $roadmapId, $sectionId){
        $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);
        $section = $roadmap->sections()->findOrFail($sectionId);
        return response()->json([
            'section' => $section
        ]);
    }
    public function update(Request $request, $roadmapId, $sectionId){
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'order' => 'sometimes|nullable|integer|min:1',
        ]);

        $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);
        $section = $roadmap->sections()->findOrFail($sectionId);

        $section->update($validated);

        return response()->json([
            'message' => 'Section updated successfully',
            'section' => $section
        ]);
    }
    public function destroy(Request $request, $roadmapId, $sectionId){
        $roadmap = $request->user()->roadmaps()->findOrFail($roadmapId);
        $section = $roadmap->sections()->findOrFail($sectionId);
        $section->delete();
        return response()->json([
            'message' => 'Section deleted successfully'
        ]);
    }
}
